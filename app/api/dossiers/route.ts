import { db } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/dossiers — every published dossier, trimmed to what the front page needs.
export async function GET() {
  const rows = await db()`
    select key, published_at,
      dossier->>'headline' as headline, dossier->>'title' as title, dossier->>'summary' as summary,
      dossier->>'category' as category, dossier->>'country' as country, dossier->>'place' as place,
      (dossier->>'lat')::float as lat, (dossier->>'lon')::float as lon, dossier->'verdict' as verdict,
      jsonb_array_length(coalesce(dossier->'claims', '[]')) as "claimCount",
      jsonb_array_length(coalesce(dossier->'sources', '[]')) as "sourceCount"
    from reports where stage = 'published' order by published_at desc limit 300`;
  return json(rows.map(({ published_at, ...r }) => ({ ...r, publishedAt: published_at })),
    200, { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" });
}
