import { db } from "@/lib/db";
import { isEditor, json } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/dossiers/:key — one dossier. Drafts held for review are visible to the editor only.
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const [r] = await db()`select stage, reason, dossier, published_at, subdomain from reports where key = ${key} and dossier is not null`;
  if (!r || (r.stage !== "published" && !isEditor(req))) return json({ error: "not found" }, 404);
  return json({ ...r.dossier, key, stage: r.stage, reason: r.stage === "published" ? undefined : r.reason, publishedAt: r.published_at, subdomain: r.subdomain });
}
