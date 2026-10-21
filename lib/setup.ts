// Creates the table and loads the two dossiers from the claude.ai pilot. Runs once when a
// server instance starts (instrumentation.ts), so a fresh database needs no manual setup.

import { db } from "./db";
import pljevlja from "../db/seed/pljevlja-winter-air.json";
import ukraine from "../db/seed/russia-aggression-ukraine.json";

// One row per citizen report. The row carries the report through research, verification
// and publication; the dossier JSON is what the site renders.
export const SCHEMA = `
create table if not exists reports (
  key           text primary key,
  title         text not null,
  country       text not null,
  place         text not null,
  category      text not null,
  text          text not null,
  since         text not null default '',
  created_at    timestamptz not null default now(),
  ip_hash       text not null default '',

  -- received → researching → verifying → published | review | rejected | failed
  stage         text not null default 'received',
  updated_at    timestamptz not null default now(),
  locked_until  timestamptz,
  attempts      int not null default 0,
  error         text,
  reason        text,

  research      jsonb,  -- step 1: claims, sources, findings
  votes         jsonb,  -- step 2: three verifiers' verdicts
  dossier       jsonb,  -- step 3: the page
  published_at  timestamptz
);
create index if not exists reports_stage_idx on reports (stage, updated_at);
create index if not exists reports_published_idx on reports (published_at desc) where stage = 'published';
create index if not exists reports_ip_idx on reports (ip_hash, created_at);`;

const SEEDS: Record<string, any> = { "pljevlja-winter-air": pljevlja, "russia-aggression-ukraine": ukraine };

export async function ensureDatabase() {
  const sql = db();
  await sql.unsafe(SCHEMA);
  for (const [key, d] of Object.entries(SEEDS)) {
    await sql`
      insert into reports (key, title, country, place, category, text, created_at, stage, dossier, published_at)
      values (${key}, ${d.title}, ${d.country}, ${d.place}, ${d.category}, ${d.citizenText},
              ${d.submittedAt}, 'published', ${sql.json({ ...d, key })}, ${d.publishedAt})
      on conflict (key) do nothing`;
  }
}
