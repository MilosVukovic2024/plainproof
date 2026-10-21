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
- `lib/setup.ts` — the single `reports` table, created on first start together with the two pilot dossiers in `db/seed/`

- `lib/files.ts` — citizen attachments (PDF, images, CSV, Excel → CSV), stored privately in Vercel Blob and read only by the research step
- `lib/subdomain.ts` — own addresses (`name.plainproof.me`): name rules, Paddle webhook signature, assignment

Safeguards: only URLs that web search actually returned can be cited; highlighted phrases must occur in the citizen's text; 3 reports per IP per day and `MAX_REPORTS_PER_DAY` overall.

## Setup

1. **Vercel** → Add New → Project → import this repo → Deploy.
2. **Database**: Project → Storage → Create Database → **Neon** → connect to the project. This sets `DATABASE_URL`; the table is created on the next start.
3. **Environment Variables** (Project → Settings): `ANTHROPIC_API_KEY` (platform.claude.com → API keys) and `CRON_SECRET` (a long random password; it is also your key for `/review`). Then Deployments → Redeploy.
4. **Domain**: remove any GoDaddy forwarding; Vercel → Settings → Domains → add `plainproof.me` and `www.plainproof.me`, then enter the DNS records Vercel shows in GoDaddy → DNS.

5. **Attachments**: Storage → Create → **Blob** (private) → connect to the project (sets `BLOB_READ_WRITE_TOKEN`).
6. **Own addresses**: move the domain's nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) and add `*.plainproof.me` under Domains — wildcard domains need Vercel DNS.
7. **Payments (Paddle)**: create a product with a one-time price; Developer tools → Authentication → client-side token; Notifications → new destination `https://www.plainproof.me/api/paddle` for `transaction.completed`. Set `PADDLE_CLIENT_TOKEN`, `PADDLE_PRICE_ID`, `PADDLE_WEBHOOK_SECRET`. Use the sandbox account first (token starts with `test_`). The editor can assign an address without payment from the dossier page.

## Development

```
npm install
cp .env.example .env.local   # fill in
npm run dev
TEST_DATABASE_URL=postgres://… npm test
```

## Cost

Each report makes about 8 Claude calls and up to 30 web searches ($10 per 1,000 searches). Set `CLAUDE_MODEL=claude-sonnet-5-5` to halve token cost.
