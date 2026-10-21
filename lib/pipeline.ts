// A report moves through three steps, one per serverless invocation:
//   1. research  — find the checkable claims and the record on each (web search)
//   2. verify    — three verifiers check every claim independently (web search, in parallel)
//   3. publish   — write the dossier, score it, and publish it (or hold it for the editor)
// Each step stores its output on the row, so a step that fails or times out is retried
// without repeating the steps before it.

import { claude, type AI, type Found } from "./claude";
import { db, type ReportRow } from "./db";
import { evidenceScore, finalVerdict, sanitize, scoreLabel, VERDICTS, type Dossier, type Vote } from "./dossier";

export const MAX_ATTEMPTS = 3;
const ACTIVE = ["received", "researching", "verifying"];
const AGENTS = ["A", "B", "C"] as const;

/* ------------------------------------------------------------------ schemas */

const str = { type: "string" };
const nullableNum = { anyOf: [{ type: "number" }, { type: "null" }] };
const obj = (properties: Record<string, object>) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const arr = (items: object) => ({ type: "array", items });

const RESEARCH_SCHEMA = obj({
  checkable: { type: "boolean" }, rejectReason: str,
  language: str, citizenTextEn: str, lat: nullableNum, lon: nullableNum,
  claims: arr(obj({ id: str, claim: str, phrase: str })),
  sources: arr(obj({ id: str, url: str, title: str, outlet: str, type: { type: "string", enum: ["official", "news", "tv", "portal", "ngo"] }, date: str })),
  findings: str,
  figures: arr(obj({ id: str, kind: { type: "string", enum: ["bar", "line"] }, title: str, unit: str, note: str, sourceId: str,
    points: arr(obj({ label: str, value: { type: "number" } })),
    reference: { anyOf: [obj({ label: str, value: { type: "number" } }), { type: "null" }] } })),
  timeline: arr(obj({ date: str, event: str, sourceId: str })),
  responsible: arr(obj({ name: str, role: str })),
});
type Research = {
  checkable: boolean; rejectReason: string; language: string; citizenTextEn: string; lat: number | null; lon: number | null;
  claims: { id: string; claim: string; phrase: string }[];
  sources: Dossier["sources"]; findings: string; figures: Dossier["figures"]; timeline: Dossier["timeline"]; responsible: Dossier["responsible"];
  researchedAt: string;
};

const VERIFY_SCHEMA = obj({ verdicts: arr(obj({ claimId: str, verdict: { type: "string", enum: VERDICTS }, note: str })) });

const COMPOSE_SCHEMA = obj({
  headline: str, summary: str, methodNotes: str,
  claims: arr(obj({ id: str, explanation: str, sourceIds: arr(str) })),
  namesWrongdoing: { type: "boolean" }, namedParty: str,
});

/* ------------------------------------------------------------------ prompts */

const reportBlock = (r: ReportRow) => `<report>
Title: ${r.title}
Where: ${r.place}, ${r.country}
Topic: ${r.category}
Since: ${r.since || "not stated"}
Text, exactly as the citizen wrote it:
${r.text}
</report>`;

const RESEARCHER = `You are the researcher for Plainproof, a public site that checks citizens' reports about local problems against the record. Be exact and neutral. You never invent a fact, a number, a date or a URL: everything you state comes from a page you found in this session.`;

function researchPrompt(r: ReportRow) {
  return `${reportBlock(r)}

Research this report.

1. Break the citizen's text into the separate factual claims it makes (usually 3 to 7). Opinions and feelings are not claims; a claim is something the record can confirm or contradict.
2. For each claim, search for evidence both for and against it: official statistics and monitoring data, budgets, audit and court records, regulators, local and national newspapers, TV and news portals, NGOs and international bodies. Search in ${r.country}'s official language(s) and in English.
3. Look for numbers that show the scale of the problem over time (at least 3 data points if they exist), and any official limit or target to compare them with.
4. Note the dated events that explain how the situation came about, and which institutions are legally responsible for fixing it.

Write your notes claim by claim. After every fact, give the URL of the page it came from. Say plainly when you found nothing on a claim.`;
}

function structureResearchPrompt(r: ReportRow, notes: string, urls: Found[]) {
  return `${reportBlock(r)}

<research_notes>
${notes}
</research_notes>

<pages_found>
${urls.map(u => `${u.url} | ${u.title}${u.date ? " | " + u.date : ""}`).join("\n")}
</pages_found>

Turn the research notes into structured data.

- checkable: false only if the report is not a real-world issue that sources could confirm or contradict (spam, abuse, a private dispute about named private individuals, or text with no factual content). Then explain why in rejectReason and leave the lists empty. Otherwise true and rejectReason "".
- language: the language the citizen wrote in, in English (e.g. "Montenegrin"). citizenTextEn: an English translation of the text, or "" if it is already English.
- lat/lon: coordinates of the place named in the report, or null if you are not sure.
- claims: ids C1, C2, … Each has the claim in one neutral English sentence, and phrase: the exact words from the citizen's text that make the claim, copied character for character (a short span, not the whole text).
- sources: ids S1, S2, … Use only URLs listed in pages_found. type is official (government, agencies, courts, statistics), news (newspapers), tv (broadcasters), portal (online-only outlets), or ngo (NGOs and international bodies). date as shown on the page, or "".
- findings: the evidence for and against each claim, by claim id, citing source ids.
- figures: 0 to 3 data series, only with numbers taken from the sources. Bar for comparisons, line for time series. reference is an official limit or target, or null. sourceId must be one of your source ids.
- timeline: dated events, oldest first, each with a sourceId.
- responsible: institutions with legal responsibility, as named in the sources. Never private individuals.`;
}

const VERIFIER_FOCUS: Record<(typeof AGENTS)[number], string> = {
  A: "Open the cited sources and check that each one says what the claim needs: the right place, period, numbers and wording.",
  B: "Search for evidence that contradicts each claim or puts it in a different light: newer data, official denials, corrections, other measurements.",
  C: "Check the numbers, dates and comparisons in each claim (superlatives such as 'the worst', counts, 'every year', 'since 2019') against the most authoritative source you can find.",
};

function verifyPrompt(r: ReportRow, research: Research, agent: (typeof AGENTS)[number]) {
  return `${reportBlock(r)}

<claims>
${research.claims.map(c => `${c.id}: ${c.claim}`).join("\n")}
</claims>

<sources_the_researcher_found>
${research.sources.map(s => `${s.id}: ${s.title} (${s.outlet}) ${s.url}`).join("\n")}
</sources_the_researcher_found>

You are verifier ${agent}, one of three who work separately. ${VERIFIER_FOCUS[agent]}

For every claim, give a verdict:
- supported: reliable sources confirm it
- partly: sources confirm part of it, or the scale, place or period differs
- unsupported: reliable sources contradict it
- unverifiable: no reliable source addresses it

Write one short paragraph per claim with your verdict and the reason, citing URLs.`;
}

const structureVotesPrompt = (claimIds: string[], notes: string) => `<verifier_notes>
${notes}
</verifier_notes>

Record this verifier's verdict for each of these claims: ${claimIds.join(", ")}. note is one sentence with the reason. If the notes give no verdict for a claim, use unverifiable.`;

function composePrompt(r: ReportRow, research: Research, verdicts: { id: string; claim: string; verdict: string; votes: Vote[] }[]) {
  return `${reportBlock(r)}

<findings>
${research.findings}
</findings>

<sources>
${research.sources.map(s => `${s.id}: ${s.title} (${s.outlet}, ${s.date || "undated"})`).join("\n")}
</sources>

<final_verdicts>
${verdicts.map(c => `${c.id} [${c.verdict}] ${c.claim}\n${c.votes.map(v => `  verifier ${v.agent}: ${v.verdict} — ${v.note}`).join("\n")}`).join("\n")}
</final_verdicts>

Write the public dossier text in English.
- headline: under 70 characters, states what the record shows (not a question, no clickbait).
- summary: 2 to 4 sentences: what the citizen reported, what the record confirms, what it does not.
- claims: for each claim id, a 1 to 3 sentence explanation of its final verdict with the key numbers and dates, and sourceIds (only ids from the list) that support the explanation. State only facts that the findings attribute to a listed source.
- methodNotes: 1 to 3 sentences: what kinds of sources were searched and in which languages, how the verifiers agreed, and any gaps.
- namesWrongdoing: true if the dossier states as fact that a named public official or a named company committed corruption, a crime or an abuse of office; namedParty says who. Otherwise false and "".`;
}

/* ------------------------------------------------------------------ steps */

const norm = (u: string) => u.trim().replace(/[#?].*$/, "").replace(/\/+$/, "").toLowerCase();

async function research(r: ReportRow, ai: AI): Promise<Research> {
  const found = await ai.search(RESEARCHER, researchPrompt(r), 12);
  const data = await ai.json<Research>(RESEARCHER, structureResearchPrompt(r, found.text, found.urls), RESEARCH_SCHEMA);
  // A source counts only if search actually returned that page.
  const real = new Set(found.urls.map(u => norm(u.url)));
  data.sources = data.sources.filter(s => real.has(norm(s.url)));
  return { ...data, researchedAt: new Date().toISOString() };
}

async function verify(r: ReportRow, res: Research, ai: AI): Promise<Vote[][]> {
  const ids = res.claims.map(c => c.id);
  const byAgent = await Promise.all(AGENTS.map(async agent => {
    const notes = await ai.search(`You are an independent fact-check verifier for Plainproof. You never invent sources.`, verifyPrompt(r, res, agent), 6);
    const { verdicts } = await ai.json<{ verdicts: { claimId: string; verdict: Vote["verdict"]; note: string }[] }>(
      "You record a fact-check verifier's verdicts exactly as written.", structureVotesPrompt(ids, notes.text), VERIFY_SCHEMA);
    return ids.map(id => {
      const v = verdicts.find(x => x.claimId === id);
      return { agent, verdict: v?.verdict ?? "unverifiable", note: v?.note ?? "" } as Vote;
    });
  }));
  // votes[claimIndex] = the three verifiers' votes on that claim
  return ids.map((_, i) => byAgent.map(agentVotes => agentVotes[i]));
}

async function compose(r: ReportRow, res: Research, votes: Vote[][], ai: AI) {
  const verdicts = res.claims.map((c, i) => ({ id: c.id, claim: c.claim, votes: votes[i], verdict: finalVerdict(votes[i]) }));
  const text = await ai.json<{ headline: string; summary: string; methodNotes: string; claims: { id: string; explanation: string; sourceIds: string[] }[]; namesWrongdoing: boolean; namedParty: string }>(
    RESEARCHER, composePrompt(r, res, verdicts), COMPOSE_SCHEMA);

  const claims = verdicts.map(v => {
    const t = text.claims.find(x => x.id === v.id);
    return { id: v.id, claim: v.claim, verdict: v.verdict, votes: v.votes, explanation: t?.explanation ?? "", sourceIds: t?.sourceIds ?? [] };
  });
  const score = evidenceScore(claims);
  const draft: Dossier = {
    key: r.key, title: r.title, headline: text.headline, summary: text.summary, category: r.category,
    country: r.country, place: r.place, lat: res.lat, lon: res.lon,
    language: res.language, citizenText: r.text, citizenTextEn: res.citizenTextEn || undefined,
    phrases: res.claims.map(c => ({ text: c.phrase, claimId: c.id })),
    claims, sources: res.sources, figures: res.figures, timeline: res.timeline, responsible: res.responsible,
    verdict: { score, label: scoreLabel(score) },
    method: { agents: AGENTS.length, notes: text.methodNotes, researchedAt: res.researchedAt },
    submittedAt: r.created_at.toISOString(), researchedAt: res.researchedAt,
  };
  return { dossier: sanitize(draft).dossier, hold: text.namesWrongdoing ? `names ${text.namedParty || "a party"} in a wrongdoing claim` : null };
}

/* ------------------------------------------------------------------ runner */

/** Takes the row for one step, unless another invocation holds it. */
async function lock(key: string): Promise<ReportRow | null> {
  const sql = db();
  const [row] = await sql<ReportRow[]>`
    update reports set locked_until = now() + interval '6 minutes', attempts = attempts + 1, updated_at = now(),
      stage = case when research is null then 'researching' else 'verifying' end
    where key = ${key} and stage in ${sql(ACTIVE)} and (locked_until is null or locked_until < now())
    returning *`;
  if (row && row.attempts > MAX_ATTEMPTS) {
    await sql`update reports set stage = 'failed', locked_until = null, updated_at = now() where key = ${key}`;
    return null;
  }
  return row ?? null;
}

/** Runs the next step for one report. Returns true if another step is still to come. */
export async function advance(key: string, ai: AI = claude): Promise<boolean> {
  const sql = db();
  const r = await lock(key);
  if (!r) return false;
  const done = sql`attempts = 0, locked_until = null, error = null, updated_at = now()`;
  try {
    if (!r.research) {
      const res = await research(r, ai);
      if (!res.checkable || !res.claims.length) {
        await sql`update reports set research = ${sql.json(res as any)}, stage = 'rejected', reason = ${res.rejectReason || "No checkable claims"}, ${done} where key = ${key}`;
        return false;
      }
      if (!res.sources.length) throw new Error("research found no usable sources");
      await sql`update reports set research = ${sql.json(res as any)}, stage = 'verifying', ${done} where key = ${key}`;
      return true;
    }
    if (!r.votes) {
      const votes = await verify(r, r.research, ai);
      await sql`update reports set votes = ${sql.json(votes as any)}, ${done} where key = ${key}`;
      return true;
    }
    const { dossier, hold } = await compose(r, r.research, r.votes, ai);
    if (hold) {
      await sql`update reports set dossier = ${sql.json(dossier as any)}, stage = 'review', reason = ${hold}, ${done} where key = ${key}`;
    } else {
      await sql`update reports set dossier = ${sql.json(dossier as any)}, stage = 'published', published_at = now(), ${done} where key = ${key}`;
    }
    return false;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("pipeline", key, msg);
    await sql`update reports set error = ${msg.slice(0, 500)}, locked_until = null,
      stage = case when attempts >= ${MAX_ATTEMPTS} then 'failed' else stage end where key = ${key}`;
    return r.attempts < MAX_ATTEMPTS; // retry straight away while attempts remain
  }
}

/** Reports that are waiting for a step and not locked. */
export async function due(limit = 5): Promise<string[]> {
  const sql = db();
  const rows = await sql<{ key: string }[]>`
    select key from reports where stage in ${sql(ACTIVE)} and (locked_until is null or locked_until < now())
    order by created_at limit ${limit}`;
  return rows.map(r => r.key);
}
