-- Plainproof: one row per citizen report. The row carries the report through
-- research, verification and publication; the dossier JSON is what the site renders.

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

  research      jsonb,  -- step 1 output: claims, sources, findings
  votes         jsonb,  -- step 2 output: three verifiers' verdicts
  dossier       jsonb,  -- step 3 output: the page
  published_at  timestamptz
);

create index if not exists reports_stage_idx on reports (stage, updated_at);
create index if not exists reports_published_idx on reports (published_at desc) where stage = 'published';
create index if not exists reports_ip_idx on reports (ip_hash, created_at);
