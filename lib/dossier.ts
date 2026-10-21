// Pure rules for turning three verifiers' votes into verdicts, and for checking a
// dossier before it is shown. No I/O here, so every rule is unit-tested.

export type Verdict = "supported" | "partly" | "unsupported" | "unverifiable";
export const VERDICTS: Verdict[] = ["supported", "partly", "unsupported", "unverifiable"];

export type Vote = { agent: string; verdict: Verdict; note: string };
export type Source = { id: string; url: string; title: string; outlet: string; type: string; date?: string };
export type Claim = { id: string; claim: string; explanation: string; sourceIds: string[]; verdict: Verdict; votes: Vote[] };
export type Figure = { id: string; kind: "bar" | "line"; title: string; unit: string; note: string; sourceId?: string;
  points: { label: string; value: number }[]; reference?: { label: string; value: number } | null };
export type Dossier = {
  key: string; title: string; headline: string; summary: string; category: string;
  country: string; place: string; lat: number | null; lon: number | null;
  language: string; citizenText: string; citizenTextEn?: string;
  phrases: { text: string; claimId: string }[];
  claims: Claim[]; sources: Source[]; figures: Figure[];
  timeline: { date: string; event: string; sourceId?: string }[];
  responsible: { name: string; role: string }[];
  verdict: { score: number; label: string };
  method: { agents: number; notes: string; researchedAt: string };
  submittedAt: string; researchedAt: string; publishedAt?: string;
};

const VALUE: Record<Verdict, number | null> = { supported: 100, partly: 50, unsupported: 0, unverifiable: null };

/** The verdict at least two of three verifiers gave; when all three differ, "partly". */
export function finalVerdict(votes: Vote[]): Verdict {
  const counts = new Map<Verdict, number>();
  for (const v of votes) counts.set(v.verdict, (counts.get(v.verdict) ?? 0) + 1);
  for (const [verdict, n] of counts) if (n * 2 > votes.length) return verdict;
  return votes.length ? "partly" : "unverifiable";
}

/**
 * Evidence score 0–100. Each verifiable claim scores its verdict's value, pulled toward
 * the uncertain middle (50) by however many verifiers disagreed with the final verdict.
 * Returns -1 when no claim could be verified.
 */
export function evidenceScore(claims: Pick<Claim, "verdict" | "votes">[]): number {
  const scores = claims.flatMap(c => {
    const value = VALUE[c.verdict];
    if (value === null) return [];
    const agree = c.votes.length ? c.votes.filter(v => v.verdict === c.verdict).length / c.votes.length : 1;
    return [50 + (value - 50) * agree];
  });
  if (!scores.length) return -1;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function scoreLabel(score: number): string {
  if (score < 0) return "Can't verify";
  if (score >= 85) return "Supported";
  if (score >= 70) return "Largely supported";
  if (score >= 40) return "Partly supported";
  if (score >= 15) return "Mostly not supported";
  return "Not supported";
}

const isHttp = (u: unknown) => typeof u === "string" && /^https?:\/\/[^\s]+$/i.test(u);
const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/[\s,]/g, "")) : NaN);

/**
 * Removes anything the page could not show truthfully: highlighted phrases that are not in
 * the citizen's text, citations to sources that are not listed, chart values that are not
 * numbers. Returns the cleaned dossier and a note for each removal.
 */
export function sanitize(d: Dossier): { dossier: Dossier; removed: string[] } {
  const removed: string[] = [];
  const sources = d.sources.filter(s => {
    if (isHttp(s.url) && s.id) return true;
    removed.push(`source ${s.id || "?"}: no valid URL`); return false;
  });
  const ids = new Set(sources.map(s => s.id));
  const known = (id?: string) => !!id && ids.has(id);

  const claims = d.claims.map(c => {
    const kept = c.sourceIds.filter(known);
    if (kept.length !== c.sourceIds.length) removed.push(`claim ${c.id}: dropped unknown source ids`);
    return { ...c, sourceIds: kept };
  });
  const claimIds = new Set(claims.map(c => c.id));
  const lower = d.citizenText.toLowerCase();
  const phrases = d.phrases.filter(p => {
    if (p.text && lower.includes(p.text.toLowerCase()) && claimIds.has(p.claimId)) return true;
    removed.push(`phrase "${p.text}": not in the report text`); return false;
  });

  const figures = d.figures.flatMap(f => {
    const points = f.points.map(p => ({ label: String(p.label), value: num(p.value) })).filter(p => Number.isFinite(p.value));
    if (points.length !== f.points.length) removed.push(`figure ${f.id}: dropped non-numeric points`);
    if (!points.length) return [];
    const refValue = f.reference ? num(f.reference.value) : NaN;
    return [{ ...f, points, sourceId: known(f.sourceId) ? f.sourceId : undefined,
      reference: f.reference && Number.isFinite(refValue) ? { label: f.reference.label, value: refValue } : null }];
  });
  const timeline = d.timeline.map(e => ({ ...e, sourceId: known(e.sourceId) ? e.sourceId : undefined }));

  return { dossier: { ...d, sources, claims, phrases, figures, timeline }, removed };
}
