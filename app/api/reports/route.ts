import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { db } from "@/lib/db";
import { detectType, MAX_FILES, MAX_TOTAL_BYTES, blobStore, prepare, type Attachment } from "@/lib/files";
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

// POST /api/reports (multipart form) — a citizen submits a report, optionally with files;
// research starts right away.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return json({ error: "The report could not be read. Please try again." }, 400);
  const body: Record<string, string> = Object.fromEntries([...form.entries()].filter((e): e is [string, string] => typeof e[1] === "string"));
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

  const uploads = form.getAll("files").filter((f): f is File => typeof f !== "string" && f.size > 0);
  if (uploads.length > MAX_FILES) return json({ error: `Attach at most ${MAX_FILES} files.` }, 400);
  if (uploads.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) return json({ error: "Attachments can be 4 MB in total. Leave out a file or send a smaller one." }, 400);
  const bad = uploads.find(f => !detectType(f.name, f.type));
  if (bad) return json({ error: `"${bad.name}" is not a supported file. Attach PDF, images (JPG, PNG), CSV or Excel files.` }, 400);

  const sql = db();
  const ip = ipHash(req);
  const [{ mine, all }] = await sql`
    select count(*) filter (where ip_hash = ${ip})::int as mine, count(*)::int as all
    from reports where created_at > now() - interval '1 day' and ip_hash <> ''`;
  if (mine >= PER_IP_PER_DAY) return json({ error: `You can send ${PER_IP_PER_DAY} reports a day. Please try again tomorrow.` }, 429);
  if (all >= PER_DAY) return json({ error: "Today's research capacity is full. Please send your report tomorrow." }, 429);

  const files: Attachment[] = [];
  for (const f of uploads) {
    const p = await prepare(f.name, detectType(f.name, f.type)!, Buffer.from(await f.arrayBuffer())).catch(() => null);
    if (!p) return json({ error: `"${f.name}" could not be opened. Check that the file is not damaged.` }, 400);
    try { files.push(await blobStore.save(p.name, p.type, p.bytes)); }
    catch (e) { console.error("attachment storage", e); return json({ error: "Attachments can't be stored right now. Send the report without files, or try again later." }, 503); }
  }

  const key = `${slug(r.title)}-${randomBytes(3).toString("hex")}`;
  const [row] = await sql`
    insert into reports (key, title, country, place, category, text, since, ip_hash, files)
    values (${key}, ${r.title}, ${r.country}, ${r.place}, ${r.category}, ${r.text}, ${r.since}, ${ip}, ${sql.json(files as any)})
    returning key, title, country, place, created_at`;

  after(() => kick(new URL(req.url).origin, key));
  return json({ key: row.key, title: row.title, country: row.country, place: row.place, createdAt: row.created_at }, 201);
}
