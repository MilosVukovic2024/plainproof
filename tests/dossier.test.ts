import { describe, expect, it } from "vitest";
import { evidenceScore, finalVerdict, sanitize, scoreLabel, type Dossier, type Verdict } from "../lib/dossier";

const votes = (...v: Verdict[]) => v.map((verdict, i) => ({ agent: "ABC"[i], verdict, note: "" }));

describe("finalVerdict", () => {
  it("follows the majority", () => {
    expect(finalVerdict(votes("supported", "supported", "unsupported"))).toBe("supported");
    expect(finalVerdict(votes("unverifiable", "unverifiable", "partly"))).toBe("unverifiable");
  });
  it("is 'partly' when all three verifiers differ", () => {
    expect(finalVerdict(votes("supported", "partly", "unsupported"))).toBe("partly");
  });
});

describe("evidenceScore", () => {
  it("is 100 for unanimous support and 0 for unanimous contradiction", () => {
    expect(evidenceScore([{ verdict: "supported", votes: votes("supported", "supported", "supported") }])).toBe(100);
    expect(evidenceScore([{ verdict: "unsupported", votes: votes("unsupported", "unsupported", "unsupported") }])).toBe(0);
  });
  it("pulls a split verdict toward the middle", () => {
    // 2 of 3 agree on supported: 50 + 50 * 2/3
    expect(evidenceScore([{ verdict: "supported", votes: votes("supported", "supported", "unsupported") }])).toBe(83);
  });
  it("ignores unverifiable claims, and returns -1 when nothing is verifiable", () => {
    expect(evidenceScore([
      { verdict: "supported", votes: votes("supported", "supported", "supported") },
      { verdict: "unverifiable", votes: votes("unverifiable", "unverifiable", "unverifiable") },
    ])).toBe(100);
    expect(evidenceScore([{ verdict: "unverifiable", votes: votes("unverifiable", "unverifiable", "unverifiable") }])).toBe(-1);
  });
});

describe("scoreLabel", () => {
  it("maps scores to labels", () => {
    expect(scoreLabel(-1)).toBe("Can't verify");
    expect(scoreLabel(90)).toBe("Supported");
    expect(scoreLabel(83)).toBe("Largely supported");
    expect(scoreLabel(62)).toBe("Partly supported");
    expect(scoreLabel(5)).toBe("Not supported");
  });
});

describe("sanitize", () => {
  const base: Dossier = {
    key: "k", title: "t", headline: "h", summary: "s", category: "Other", country: "Montenegro", place: "Bar",
    lat: null, lon: null, language: "English", citizenText: "The river smells every summer.",
    phrases: [{ text: "river smells", claimId: "C1" }, { text: "invented words", claimId: "C1" }],
    claims: [{ id: "C1", claim: "c", explanation: "e", sourceIds: ["S1", "S9"], verdict: "supported", votes: [] }],
    sources: [{ id: "S1", url: "https://a.me/x", title: "a", outlet: "A", type: "news" }, { id: "S2", url: "javascript:alert(1)", title: "b", outlet: "B", type: "news" }],
    figures: [{ id: "F1", kind: "bar", title: "f", unit: "u", note: "", sourceId: "S2",
      points: [{ label: "2024", value: 3 }, { label: "2025", value: "1,200" as unknown as number }, { label: "x", value: "n/a" as unknown as number }] }],
    timeline: [{ date: "2020", event: "e", sourceId: "S1" }, { date: "2021", event: "e", sourceId: "S7" }],
    responsible: [], verdict: { score: 0, label: "" }, method: { agents: 3, notes: "", researchedAt: "" },
    submittedAt: "", researchedAt: "",
  };
  const { dossier, removed } = sanitize(base);

  it("keeps only phrases that occur in the citizen's text", () => {
    expect(dossier.phrases).toEqual([{ text: "river smells", claimId: "C1" }]);
  });
  it("drops sources without an http(s) URL and citations to unknown sources", () => {
    expect(dossier.sources.map(s => s.id)).toEqual(["S1"]);
    expect(dossier.claims[0].sourceIds).toEqual(["S1"]);
    expect(dossier.timeline[1].sourceId).toBeUndefined();
    expect(dossier.figures[0].sourceId).toBeUndefined();
  });
  it("coerces numeric strings and drops non-numeric chart points", () => {
    expect(dossier.figures[0].points).toEqual([{ label: "2024", value: 3 }, { label: "2025", value: 1200 }]);
  });
  it("reports what it removed", () => {
    expect(removed.length).toBeGreaterThanOrEqual(4);
  });
});
