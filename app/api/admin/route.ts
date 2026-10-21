import { after } from "next/server";
import { db } from "@/lib/db";
import { isEditor, json, kick } from "@/lib/http";
import { assignSubdomain, nameProblem } from "@/lib/subdomain";

export const dynamic = "force-dynamic";

// GET /api/admin — everything the review desk shows.
export async function GET(req: Request) {
  if (!isEditor(req)) return json({ error: "unauthorized" }, 401);
  const rows = await db()`
    select key, title, country, place, category, stage, reason, error, created_at, published_at, subdomain,
      dossier->>'headline' as headline, dossier->'verdict' as verdict,
      jsonb_array_length(coalesce(dossier->'claims', '[]')) as "claimCount",
      jsonb_array_length(coalesce(dossier->'sources', '[]')) as "sourceCount"
    from reports order by created_at desc limit 500`;
  return json(rows);
}

// POST /api/admin {act, key} — publish, reject, unpublish, or retry a report.
export async function POST(req: Request) {
  if (!isEditor(req)) return json({ error: "unauthorized" }, 401);
  const { act, key, name } = await req.json().catch(() => ({}));
  const sql = db();
  if (act === "subdomain") { // the editor gives a dossier its address without payment
    const problem = typeof key !== "string" ? "bad request" : typeof name === "string" ? nameProblem(name) : "Give a name.";
    if (problem) return json({ error: problem }, 400);
    const given = await assignSubdomain(key, name, null);
    return given ? json({ ok: true, subdomain: given }) : json({ error: "Only published dossiers can have an address." }, 409);
  }
  const updates: Record<string, () => PromiseLike<readonly unknown[]>> = {
    publish: () => sql`update reports set stage = 'published', published_at = now(), updated_at = now() where key = ${key} and dossier is not null returning key`,
    reject: () => sql`update reports set stage = 'rejected', published_at = null, updated_at = now() where key = ${key} returning key`,
    unpublish: () => sql`update reports set stage = 'review', published_at = null, reason = 'unpublished by the editor', updated_at = now() where key = ${key} and stage = 'published' returning key`,
    retry: () => sql`update reports set stage = case when research is null then 'received' else 'verifying' end,
      attempts = 0, error = null, locked_until = null, updated_at = now() where key = ${key} and stage in ('failed', 'rejected') returning key`,
  };
  if (!updates[act] || typeof key !== "string") return json({ error: "bad request" }, 400);
  const done = await updates[act]();
  if (!done.length) return json({ error: "nothing to change" }, 409);
  if (act === "retry") after(() => kick(new URL(req.url).origin, key));
  return json({ ok: true });
}
