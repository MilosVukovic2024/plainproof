import { db } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/reports/status?keys=a,b — progress of the reports this browser submitted.
export async function GET(req: Request) {
  const keys = (new URL(req.url).searchParams.get("keys") ?? "").split(",").filter(Boolean).slice(0, 20);
  if (!keys.length) return json([]);
  const sql = db();
  const rows = await sql`select key, stage from reports where key in ${sql(keys)}`;
  return json(rows.map(r => ({ key: r.key, stage: r.stage })));
}
