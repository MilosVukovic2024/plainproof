import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { detectType, prepare } from "../lib/files";

describe("attachments", () => {
  it("trusts the extension over the browser's file type", () => {
    expect(detectType("data.csv", "application/vnd.ms-excel")).toBe("text/csv");
    expect(detectType("scan.PDF", "")).toBe("application/pdf");
    expect(detectType("virus.exe", "application/octet-stream")).toBeNull();
  });

  it("turns an Excel file into CSV the research step can read", async () => {
    const book = new ExcelJS.Workbook();
    const ws = book.addWorksheet("Mjerenja");
    ws.addRow(["Godina", "Dani, preko limita"]);
    ws.addRow([2024, 95]);
    const bytes = Buffer.from(await book.xlsx.writeBuffer());
    const out = await prepare("pm10.xlsx", detectType("pm10.xlsx", "")!, bytes);
    expect(out.name).toBe("pm10.csv");
    expect(out.type).toBe("text/csv");
    expect(out.bytes.toString()).toBe('# Sheet: Mjerenja\nGodina,"Dani, preko limita"\n2024,95');
  });
});
