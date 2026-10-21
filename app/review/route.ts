import { HOME_META, html } from "@/lib/page";

export const dynamic = "force-static";

export function GET() {
  return html({ ...HOME_META, title: "Review desk — Plainproof", path: "/review", noindex: true });
}
