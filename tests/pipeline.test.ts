// Runs the whole pipeline against a real Postgres with a fake Claude.
// TEST_DATABASE_URL=postgres://... npm test   (skipped when not set)
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { AI } from "../lib/claude";

const url = process.env.TEST_DATABASE_URL;
if (url) process.env.DATABASE_URL = url;
const { db } = await import("../lib/db");
const { advance, due } = await import("../lib/pipeline");
const { ensureDatabase } = await import("../lib/setup");

const TEXT = "The river below the bridge smells of sewage every summer. The plant was promised in 2019.";

function fakeAI(opts: { checkable?: boolean; wrongdoing?: boolean; failSearch?: boolean } = {}): AI & { calls: string[]; prompts: unknown[] } {
  const calls: string[] = [], prompts: unknown[] = [];
  return {
    calls, prompts,
    async search(_s, input) {
      prompts.push(input);
      const prompt = typeof input === "string" ? input : JSON.stringify(input);
      calls.push(prompt.includes("You are verifier") ? "verify" : "research");
      if (opts.failSearch) throw new Error("search down");
      return { text: "notes", urls: [{ url: "https://vijesti.me/a/", title: "A" }, { url: "https://gov.me/b", title: "B" }] };
    },
    async json(_s, prompt) {
      if (prompt.includes("<research_notes>")) {
        calls.push("structure");
        return {
          checkable: opts.checkable ?? true, rejectReason: opts.checkable === false ? "spam" : "",
          language: "English", citizenTextEn: "", lat: 42.1, lon: 19.1,
          claims: [{ id: "C1", claim: "Sewage smell in summer", phrase: "smells of sewage every summer" },
                   { id: "C2", claim: "Plant promised in 2019", phrase: "promised in 2019" }],
          sources: [{ id: "S1", url: "https://vijesti.me/a", title: "A", outlet: "Vijesti", type: "news", date: "" },
                    { id: "S2", url: "https://gov.me/b", title: "B", outlet: "Gov", type: "official", date: "" },
                    { id: "S3", url: "https://invented.example/x", title: "X", outlet: "X", type: "news", date: "" }],
          findings: "…",
          figures: [{ id: "F1", kind: "bar", title: "Days", unit: "days", note: "", sourceId: "S3", points: [{ label: "2024", value: 40 }], reference: null }],
          timeline: [{ date: "2019", event: "Promise", sourceId: "S2" }], responsible: [{ name: "Municipality", role: "Sewage" }],
        } as any;
      }
      if (prompt.includes("<verifier_notes>")) {
        calls.push("votes");
        return { verdicts: [{ claimId: "C1", verdict: "supported", note: "ok" }, { claimId: "C2", verdict: "partly", note: "2018" }] } as any;
      }
      calls.push("compose");
      return { headline: "Summer sewage smell confirmed", summary: "s", methodNotes: "m",
        claims: [{ id: "C1", explanation: "e1", sourceIds: ["S1", "S3"] }, { id: "C2", explanation: "e2", sourceIds: ["S2"] }],
        namesWrongdoing: !!opts.wrongdoing, namedParty: opts.wrongdoing ? "Mayor X" : "" } as any;
    },
  };
}

const row = async (key: string) => (await db()`select * from reports where key = ${key}`)[0];
const insert = (key: string) => db()`insert into reports (key, title, country, place, category, text) values (${key}, 'River smell', 'Montenegro', 'Bar', 'Environment', ${TEXT})`;
async function runAll(key: string, ai: AI) { for (let i = 0; i < 10 && await advance(key, ai); i++); }

describe.skipIf(!url)("pipeline", () => {
  beforeAll(async () => { await ensureDatabase(); });
  beforeEach(async () => { await db()`delete from reports where key like 'test-%'`; });
  afterAll(async () => { await db()`delete from reports where key like 'test-%'`; await db().end(); });

  it("researches, verifies with three agents, and publishes", async () => {
    await insert("test-happy");
    const ai = fakeAI();
    await runAll("test-happy", ai);
    expect(ai.calls.filter(c => c === "verify")).toHaveLength(3);
    const r = await row("test-happy");
    expect(r.stage).toBe("published");
    expect(r.published_at).not.toBeNull();
    const d = r.dossier;
    expect(d.sources.map((s: any) => s.id)).toEqual(["S1", "S2"]);         // invented URL dropped
    expect(d.claims[0].sourceIds).toEqual(["S1"]);                         // citation to it dropped
    expect(d.claims.map((c: any) => c.verdict)).toEqual(["supported", "partly"]);
    expect(d.claims[0].votes).toHaveLength(3);
    expect(d.verdict).toEqual({ score: 75, label: "Largely supported" });  // (100 + 50) / 2
    expect(d.phrases).toHaveLength(2);
  });

  it("gives the researcher the citizen's attachments, and says so on the dossier", async () => {
    await insert("test-files");
    const files = [{ name: "report.pdf", type: "application/pdf", size: 4, pathname: "p/report.pdf" },
                   { name: "data.csv", type: "text/csv", size: 9, pathname: "p/data.csv" }];
    await db()`update reports set files = ${db().json(files)} where key = 'test-files'`;
    const store = { save: async () => { throw new Error("unused"); }, read: async (a: { name: string }) => Buffer.from(a.name === "data.csv" ? "year,days\n2024,40" : "%PDF") };
    const ai = fakeAI();
    for (let i = 0; i < 10 && await advance("test-files", ai, store); i++);
    const research = ai.prompts[0] as any[];
    expect(research.map(b => b.type)).toEqual(["document", "document", "text"]);
    expect(research[0].source).toMatchObject({ type: "base64", media_type: "application/pdf" });
    expect(research[1].source).toMatchObject({ type: "text", data: "year,days\n2024,40" });
    expect(research[2].text).toContain("not independent sources");
    expect(typeof ai.prompts[1]).toBe("string");                 // verifiers don't get the files
    expect((await row("test-files")).dossier.method.attachments).toBe(2);
  });

  it("holds a dossier that names someone in a wrongdoing claim", async () => {
    await insert("test-hold");
    await runAll("test-hold", fakeAI({ wrongdoing: true }));
    const r = await row("test-hold");
    expect(r.stage).toBe("review");
    expect(r.reason).toContain("Mayor X");
  });

  it("rejects a report with nothing to check", async () => {
    await insert("test-reject");
    await runAll("test-reject", fakeAI({ checkable: false }));
    expect((await row("test-reject")).stage).toBe("rejected");
  });

  it("retries a failing step, then marks the report failed", async () => {
    await insert("test-fail");
    const ai = fakeAI({ failSearch: true });
    await runAll("test-fail", ai);
    const r = await row("test-fail");
    expect(ai.calls).toHaveLength(3);
    expect(r.stage).toBe("failed");
    expect(r.error).toBe("search down");
  });

  it("does not run a report another invocation has locked", async () => {
    await insert("test-locked");
    await db()`update reports set locked_until = now() + interval '1 minute' where key = 'test-locked'`;
    const ai = fakeAI();
    expect(await advance("test-locked", ai)).toBe(false);
    expect(ai.calls).toHaveLength(0);
    expect(await due(50)).not.toContain("test-locked");
  });
});
