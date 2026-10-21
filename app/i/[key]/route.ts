import { db } from "@/lib/db";
import { HOME_META, html } from "@/lib/page";

export const dynamic = "force-dynamic";

// A dossier's own address. The page is the same document as the home page; the head
// carries the dossier's headline and summary so a shared link previews correctly.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const [r] = await db()`
    select dossier->>'headline' as headline, dossier->>'summary' as summary, dossier->>'place' as place, dossier->>'country' as country
    from reports where key = ${key} and stage = 'published'`;
  if (!r) return html({ ...HOME_META, title: "Dossier not found — Plainproof", path: `/i/${key}`, noindex: true }, 404);
  return html({ title: `${r.headline} — Plainproof`, description: `${r.place}, ${r.country}. ${r.summary}`, path: `/i/${key}` });
}
