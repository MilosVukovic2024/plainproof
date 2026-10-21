import { createHash, timingSafeEqual } from "node:crypto";

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers });

function bearerMatches(req: Request, secret: string | undefined) {
  if (!secret) return false;
  const got = Buffer.from((req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, ""));
  const want = Buffer.from(secret);
  return got.length === want.length && timingSafeEqual(got, want);
}
// One secret, CRON_SECRET, serves three callers: Vercel Cron (which sends it automatically),
// the pipeline calling itself, and the editor, who types it on /review.
export const isEditor = (req: Request) => bearerMatches(req, process.env.CRON_SECRET);
export const isInternal = isEditor;

/** A salted hash of the client IP, for rate limits; the IP itself is never stored. */
export function ipHash(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  return createHash("sha256").update(ip + (process.env.CRON_SECRET ?? "")).digest("hex").slice(0, 24);
}

/** Starts the next pipeline step in its own invocation (own time limit). */
export async function kick(origin: string, key: string) {
  try {
    await fetch(`${origin}/api/pipeline?key=${encodeURIComponent(key)}`, {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` }, cache: "no-store",
    });
  } catch (e) {
    console.error("kick failed; the daily run will pick it up", key, e);
  }
}
