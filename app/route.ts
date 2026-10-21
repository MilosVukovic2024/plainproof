import { db } from "@/lib/db";
import { HOME_META, html } from "@/lib/page";
import { ROOT, subdomainOf } from "@/lib/subdomain";

export const dynamic = "force-dynamic";

// "/" is the home page on www.plainproof.me, and a dossier's own page on name.plainproof.me.
export async function GET(req: Request) {
  const sub = subdomainOf(req.headers.get("host"));
  if (!sub) return html(HOME_META);
  const [r] = await db()`
    select key, dossier->>'headline' as headline, dossier->>'summary' as summary,
      dossier->>'place' as place, dossier->>'country' as country
    from reports where subdomain = ${sub} and stage = 'published'`;
  if (!r) return Response.redirect(`https://www.${ROOT}/`, 302); // no such address: go to the main site
  return html({ title: `${r.headline} — Plainproof`, description: `${r.place}, ${r.country}. ${r.summary}`,
    path: `/i/${r.key}`, dossierKey: r.key });
}
