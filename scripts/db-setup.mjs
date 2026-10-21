// Creates the table and loads the two dossiers carried over from the claude.ai pilot.
// Usage: DATABASE_URL=... npm run db:setup   (safe to run more than once)
import { readFileSync, readdirSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL first."); process.exit(1); }
const sql = postgres(url, { prepare: false, onnotice: () => {} });
const dir = new URL("../db/", import.meta.url);

await sql.unsafe(readFileSync(new URL("schema.sql", dir), "utf8"));

for (const file of readdirSync(new URL("seed/", dir))) {
  const key = file.replace(/\.json$/, "");
  const d = JSON.parse(readFileSync(new URL("seed/" + file, dir), "utf8"));
  const dossier = { ...d, key };
  await sql`
    insert into reports (key, title, country, place, category, text, created_at, stage, dossier, published_at)
    values (${key}, ${d.title}, ${d.country}, ${d.place}, ${d.category}, ${d.citizenText},
            ${d.submittedAt}, 'published', ${sql.json(dossier)}, ${d.publishedAt})
    on conflict (key) do nothing`;
  console.log("seeded", key);
}
await sql.end();
console.log("Database ready.");
