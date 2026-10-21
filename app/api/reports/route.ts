import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { db } from "@/lib/db";
import { ipHash, json, kick } from "@/lib/http";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Environment", "Water & sewage", "Roads & transport", "Health care", "Education",
  "Public spending", "Construction & planning", "Public services", "Other"];
const PER_IP_PER_DAY = 3;
const PER_DAY = Number(process.env.MAX_REPORTS_PER_DAY || 30);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
function slug(s: string) {
  const full = s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cut = full.length > 48 ? full.slice(0, 48).replace(/-[^-]*$/, "") : full; // don't end mid-word
  return cut || "report";
}

// POST /api/reports — a citizen submits a report; research starts right away.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (clean(body.website, 200)) return json({ key: "ok" }, 201); // honeypot: bots fill every field

  const r = {
    title: clean(body.title, 90), country: clean(body.country, 60), place: clean(body.place, 80),
    category: CATEGORIES.includes(body.category) ? body.category : "Other",
    text: clean(body.text, 1200), since: clean(body.since, 60),
  };
  if (r.title.length < 6) return json({ error: "Add a one-line title of at least a few words." }, 400);
  if (!r.country) return json({ error: "Choose the country where this is happening." }, 400);
  if (r.place.length < 2) return json({ error: "Name the town, city or area so the research can find local sources." }, 400);
  if (r.text.length < 40) return json({ error: "Describe the problem in at least two sentences (40 characters or more), so there is something to check." }, 400);

  const sql = db();
  const ip = ipHash(req);
  const [{ mine, all }] = await sql`
    select count(*) filter (where ip_hash = ${ip})::int as mine, count(*)::int as all
    from reports where created_at > now() - interval '1 day' and ip_hash <> ''`;
  if (mine >= PER_IP_PER_DAY) return json({ error: `You can send ${PER_IP_PER_DAY} reports a day. Please try again tomorrow.` }, 429);
  if (all >= PER_DAY) return json({ error: "Today's research capacity is full. Please send your report tomorrow." }, 429);

  const key = `${slug(r.title)}-${randomBytes(3).toString("hex")}`;
  const [row] = await sql`
    insert into reports (key, title, country, place, category, text, since, ip_hash)
    values (${key}, ${r.title}, ${r.country}, ${r.place}, ${r.category}, ${r.text}, ${r.since}, ${ip})
    returning key, title, country, place, created_at`;

  after(() => kick(new URL(req.url).origin, key));
  return json({ key: row.key, title: row.title, country: row.country, place: row.place, createdAt: row.created_at }, 201);
}
