// A published dossier can have its own address, e.g. pljevlja-air.plainproof.me.
// The address is bought through Paddle (or assigned by the editor); this file holds the rules.

import { createHmac, timingSafeEqual } from "node:crypto";

export const ROOT = (process.env.ROOT_DOMAIN || "plainproof.me").toLowerCase();

const RESERVED = new Set(["www", "api", "app", "admin", "review", "mail", "smtp", "imap", "pop", "ftp", "i", "static",
  "cdn", "assets", "blog", "docs", "help", "support", "status", "dev", "test", "staging", "preview", "ns1", "ns2", "plainproof"]);

/** Why a name can't be used, or null if it can. */
export function nameProblem(name: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(name)) return "Use 3 to 40 lowercase letters, digits or hyphens, starting and ending with a letter or digit.";
  if (name.includes("--")) return "Use single hyphens only.";
  if (RESERVED.has(name)) return "That name is reserved.";
  return null;
}

/** "pljevlja-air" for pljevlja-air.plainproof.me; null for the main site, www, or any other host. */
export function subdomainOf(host: string | null): string | null {
  const h = (host ?? "").toLowerCase().replace(/:\d+$/, "");
  if (!h.endsWith("." + ROOT)) return null;
  const sub = h.slice(0, -ROOT.length - 1);
  return sub && sub !== "www" && !sub.includes(".") ? sub : null;
}

/** A default name for a dossier: its key without the random suffix. */
export const suggestName = (key: string) =>
  key.replace(/-[0-9a-f]{6}$/, "").slice(0, 40).replace(/-+$/, "") || "dossier";

/**
 * Paddle signs each webhook: header `Paddle-Signature: ts=<unix>;h1=<hex>`, where h1 is
 * HMAC-SHA256 of `${ts}:${rawBody}` with the notification destination's secret.
 * https://developer.paddle.com/webhooks/about/signature-verification
 */
export function paddleSignatureValid(header: string | null, rawBody: string, secret: string | undefined, now = Date.now()) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(";").map(p => p.split("=") as [string, string]));
  const ts = Number(parts.ts);
  if (!parts.h1 || !Number.isFinite(ts) || Math.abs(now / 1000 - ts) > 300) return false; // 5 min replay window
  const want = Buffer.from(createHmac("sha256", secret).update(`${parts.ts}:${rawBody}`).digest("hex"));
  const got = Buffer.from(parts.h1);
  return got.length === want.length && timingSafeEqual(got, want);
}

/**
 * Gives a published dossier its address. Safe to call twice for the same payment (Paddle
 * retries webhooks). If the wanted name was taken meanwhile, a numbered variant is used.
 * Returns the address name, or null if the dossier is not published.
 */
export async function assignSubdomain(key: string, wanted: string, txn: string | null): Promise<string | null> {
  const { db } = await import("./db");
  const sql = db();
  if (txn) {
    const [paid] = await sql`select subdomain from reports where subdomain_txn = ${txn}`;
    if (paid) return paid.subdomain;
  }
  const [row] = await sql`select subdomain, stage from reports where key = ${key}`;
  if (!row || row.stage !== "published") return null;
  if (row.subdomain) return row.subdomain;
  const base = nameProblem(wanted) ? suggestName(key) : wanted;
  for (let i = 1; i <= 20; i++) {
    const name = i === 1 ? base : `${base.slice(0, 36)}-${i}`;
    const [done] = await sql`
      update reports set subdomain = ${name}, subdomain_txn = ${txn}, subdomain_at = now()
      where key = ${key} and subdomain is null and not exists (select 1 from reports where subdomain = ${name})
      returning subdomain`;
    if (done) return done.subdomain;
  }
  throw new Error(`no free subdomain for ${key}`);
}
