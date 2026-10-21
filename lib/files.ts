// Files a citizen attaches to a report. They are evidence for the research step only:
// stored privately (Vercel Blob, access: private) and never published on the dossier page.

import { randomBytes } from "node:crypto";
import { get, put } from "@vercel/blob";
import ExcelJS from "exceljs";

export type Attachment = { name: string; type: string; size: number; pathname: string };
export type FileStore = {
  save(name: string, type: string, bytes: Buffer): Promise<Attachment>;
  read(a: Attachment): Promise<Buffer>;
};

export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is 4.5 MB

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
/** What Claude can read directly; spreadsheets are converted to CSV on the way in. */
export const ACCEPTED: Record<string, string> = {
  "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "text/csv": "csv", "text/plain": "txt", [XLSX]: "xlsx",
};

const BY_EXTENSION: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", csv: "text/csv", txt: "text/plain", xlsx: XLSX };
/** Browsers disagree on file types (Windows calls a .csv "application/vnd.ms-excel"), so trust the extension. */
export function detectType(name: string, type: string): string | null {
  const byExt = BY_EXTENSION[name.split(".").pop()?.toLowerCase() ?? ""];
  return byExt ?? (ACCEPTED[type] ? type : null);
}

/** First sheet(s) of an .xlsx as CSV text. */
async function xlsxToCsv(bytes: Buffer): Promise<string> {
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(bytes as any);
  const cell = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? String((v as any).result ?? (v as any).text ?? "") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return book.worksheets.slice(0, 5).map(ws => {
    const rows: string[] = [];
    ws.eachRow(row => rows.push((row.values as unknown[]).slice(1).map(cell).join(",")));
    return `# Sheet: ${ws.name}\n${rows.join("\n")}`;
  }).join("\n\n");
}

/** Normalises an upload: spreadsheets become CSV so the research step can read them. */
export async function prepare(name: string, type: string, bytes: Buffer): Promise<{ name: string; type: string; bytes: Buffer }> {
  if (type === XLSX) return { name: name.replace(/\.xlsx$/i, "") + ".csv", type: "text/csv", bytes: Buffer.from(await xlsxToCsv(bytes)) };
  return { name, type, bytes };
}

export const blobStore: FileStore = {
  async save(name, type, bytes) {
    const safe = name.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-80) || "file";
    const pathname = `reports/${randomBytes(12).toString("hex")}/${safe}`;
    await put(pathname, bytes, { access: "private", contentType: type, addRandomSuffix: false });
    return { name, type, size: bytes.length, pathname };
  },
  async read(a) {
    const res = await get(a.pathname, { access: "private" });
    if (!res || res.statusCode !== 200 || !res.stream) throw new Error(`attachment not found: ${a.name}`);
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  },
};
