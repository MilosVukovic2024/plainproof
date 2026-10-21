import { json } from "@/lib/http";
import { assignSubdomain, paddleSignatureValid } from "@/lib/subdomain";

export const dynamic = "force-dynamic";

// GET /api/paddle — the public settings the browser needs to open Paddle checkout.
// Absent settings mean payments are not set up yet; the site then hides the offer.
export function GET() {
  const token = process.env.PADDLE_CLIENT_TOKEN, priceId = process.env.PADDLE_PRICE_ID;
  if (!token || !priceId) return json({ enabled: false });
  return json({ enabled: true, token, priceId, sandbox: token.startsWith("test_") });
}

// POST /api/paddle — Paddle's webhook. On a completed payment, the dossier gets its address.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!paddleSignatureValid(req.headers.get("paddle-signature"), raw, process.env.PADDLE_WEBHOOK_SECRET)) {
    return json({ error: "invalid signature" }, 401);
  }
  const event = JSON.parse(raw);
  if (event.event_type !== "transaction.completed") return json({ ignored: event.event_type });
  const { key, subdomain } = event.data?.custom_data ?? {};
  if (typeof key !== "string" || typeof subdomain !== "string") return json({ ignored: "no dossier in custom_data" });
  const name = await assignSubdomain(key, subdomain, event.data.id);
  if (!name) console.error("paid for a dossier that is not published", key, event.data.id);
  return json({ ok: true, subdomain: name });
}
