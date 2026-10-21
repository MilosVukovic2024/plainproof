# Plainproof

Citizens describe a local problem in their own words; Claude researches it on the web, three independent verifiers check every claim, and the result is published as its own page at `plainproof.me/i/<key>`.

## How it works

```
POST /api/reports ─► row in Postgres (stage: received)
        │
        └─► /api/pipeline?key=…   one step per invocation, each with its own 5-minute limit
              1. research   Claude + web search → claims, sources, figures, timeline
              2. verify     three verifiers in parallel (cited sources / contrary evidence / numbers)
              3. publish    dossier text, verdicts and score → published
                            (held on /review if it names someone in a wrongdoing claim)
```

Each step saves its output, so a failed step is retried (3 attempts) without repeating earlier ones. Vercel Cron calls `/api/pipeline` once a day to restart anything left waiting.

- `lib/pipeline.ts` — the three steps and their prompts
- `lib/dossier.ts` — verdict rules (majority of three; evidence score) and the pre-publication check
- `lib/page.ts` + `public/app.js` + `public/app.css` — the site (one HTML document)
- `db/schema.sql` — the single `reports` table; `db/seed/` — the two dossiers from the pilot

Safeguards: only URLs that web search actually returned can be cited; highlighted phrases must occur in the citizen's text; 3 reports per IP per day and `MAX_REPORTS_PER_DAY` overall.

## Setup

1. **Supabase** → new project (region: Frankfurt). Project Settings → Database → Connection string → *Transaction pooler* (port 6543). That is `DATABASE_URL`.
2. Create the table and load the pilot dossiers, once, from your computer:
   `DATABASE_URL=… npm install && npm run db:setup`
   (or paste `db/schema.sql` into Supabase → SQL Editor; that creates the table without the two pilot dossiers).
3. **Claude API key** at platform.claude.com → API keys.
4. **Vercel** → Add New Project → import this repo → Environment Variables from `.env.example` → Deploy.
5. **Domain**: Vercel → Project → Settings → Domains → add `plainproof.me` and `www.plainproof.me`. Vercel shows the DNS records; add them in GoDaddy → Domain → DNS (usually an `A` record for `@` and a `CNAME` for `www`). Remove any GoDaddy forwarding first.

## Development

```
npm install
cp .env.example .env.local   # fill in
npm run dev
TEST_DATABASE_URL=postgres://… npm test
```

## Cost

Each report makes about 8 Claude calls and up to 30 web searches ($10 per 1,000 searches). Set `CLAUDE_MODEL=claude-sonnet-5-5` to halve token cost.
