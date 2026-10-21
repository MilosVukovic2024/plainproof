import { db } from "@/lib/db";
import { json } from "@/lib/http";
import { nameProblem, ROOT } from "@/lib/subdomain";

export const dynamic = "force-dynamic";

// GET /api/subdomains?name=… — can this address still be taken?
export async function GET(req: Request) {
  const name = (new URL(req.url).searchParams.get("name") ?? "").trim().toLowerCase();
  const problem = nameProblem(name);
  if (problem) return json({ name, available: false, problem });
  const [taken] = await db()`select 1 from reports where subdomain = ${name}`;
  return json({ name, host: `${name}.${ROOT}`, available: !taken, problem: taken ? "That address is already taken." : null });
}
