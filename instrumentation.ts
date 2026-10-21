// Runs once when a server instance starts.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.DATABASE_URL) return;
  const { ensureDatabase } = await import("./lib/setup");
  try {
    await ensureDatabase();
  } catch (e) {
    console.error("database setup failed; the site will retry on the next start", e);
  }
}
