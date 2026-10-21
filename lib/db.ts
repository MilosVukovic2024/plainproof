import postgres from "postgres";

// One small pool per server instance. `prepare: false` keeps it compatible with the
// Supabase transaction pooler (port 6543), which is the right URL for serverless.
const g = globalThis as { __pp_sql?: postgres.Sql };

export function db(): postgres.Sql {
  if (!g.__pp_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    g.__pp_sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 3, onnotice: () => {} });
  }
  return g.__pp_sql;
}

export type ReportRow = {
  key: string; title: string; country: string; place: string; category: string; text: string; since: string;
  created_at: Date; stage: string; updated_at: Date; attempts: number; error: string | null; reason: string | null;
  research: any; votes: any; dossier: any; published_at: Date | null;
  files: import("./files").Attachment[]; subdomain: string | null;
};
