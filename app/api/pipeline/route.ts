import { after } from "next/server";
import { isInternal, json, kick } from "@/lib/http";
import { advance, due } from "@/lib/pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// GET /api/pipeline?key=…  runs the next step for one report, then starts the step after it.
// GET /api/pipeline        (Vercel Cron) starts every report that is waiting and not locked.
export async function GET(req: Request) {
  if (!isInternal(req)) return json({ error: "unauthorized" }, 401);
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key) {
    const keys = await due();
    after(() => Promise.all(keys.map(k => kick(url.origin, k))));
    return json({ started: keys });
  }
  after(async () => { if (await advance(key)) await kick(url.origin, key); });
  return json({ accepted: key }, 202);
}
