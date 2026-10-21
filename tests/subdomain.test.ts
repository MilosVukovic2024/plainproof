import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { nameProblem, paddleSignatureValid, subdomainOf, suggestName } from "../lib/subdomain";

describe("subdomain names", () => {
  it("accepts plain names and rejects the rest", () => {
    expect(nameProblem("pljevlja-air")).toBeNull();
    expect(nameProblem("ab")).not.toBeNull();
    expect(nameProblem("-bad")).not.toBeNull();
    expect(nameProblem("Upper")).not.toBeNull();
    expect(nameProblem("a--b")).not.toBeNull();
    expect(nameProblem("www")).toBe("That name is reserved.");
  });

  it("reads the dossier name from the host", () => {
    expect(subdomainOf("pljevlja-air.plainproof.me")).toBe("pljevlja-air");
    expect(subdomainOf("PLJEVLJA-AIR.plainproof.me:443")).toBe("pljevlja-air");
    expect(subdomainOf("www.plainproof.me")).toBeNull();
    expect(subdomainOf("plainproof.me")).toBeNull();
    expect(subdomainOf("a.b.plainproof.me")).toBeNull();
    expect(subdomainOf("evil-plainproof.me")).toBeNull();
    expect(subdomainOf("plainproof.vercel.app")).toBeNull();
  });

  it("suggests the key without its random suffix", () => {
    expect(suggestName("sewage-in-the-river-at-bar-adcbca")).toBe("sewage-in-the-river-at-bar");
    expect(suggestName("pljevlja-winter-air")).toBe("pljevlja-winter-air");
  });
});

describe("Paddle webhook signature", () => {
  const secret = "pdl_ntfset_test", body = '{"event_type":"transaction.completed"}', now = 1_800_000_000_000;
  const sign = (ts: number, b = body) => `ts=${ts};h1=${createHmac("sha256", secret).update(`${ts}:${b}`).digest("hex")}`;

  it("accepts a correct, fresh signature", () => {
    expect(paddleSignatureValid(sign(now / 1000), body, secret, now)).toBe(true);
  });
  it("rejects a changed body, a wrong secret, an old timestamp, or no header", () => {
    expect(paddleSignatureValid(sign(now / 1000), body + " ", secret, now)).toBe(false);
    expect(paddleSignatureValid(sign(now / 1000), body, "other", now)).toBe(false);
    expect(paddleSignatureValid(sign(now / 1000 - 600), body, secret, now)).toBe(false);
    expect(paddleSignatureValid(null, body, secret, now)).toBe(false);
  });
});

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)("assignSubdomain", async () => {
  if (url) process.env.DATABASE_URL = url;
  const { db } = await import("../lib/db");
  const { ensureDatabase } = await import("../lib/setup");
  const { assignSubdomain } = await import("../lib/subdomain");
  const add = (key: string, stage = "published") => db()`insert into reports (key, title, country, place, category, text, stage)
    values (${key}, 't', 'Montenegro', 'Bar', 'Other', 'x', ${stage})`;

  it("assigns the name once, survives a repeated webhook, and numbers a taken name", async () => {
    await ensureDatabase();
    await db()`delete from reports where key like 'sub-%'`;
    await add("sub-a"); await add("sub-b"); await add("sub-draft", "review");

    expect(await assignSubdomain("sub-a", "river-bar", "txn_1")).toBe("river-bar");
    expect(await assignSubdomain("sub-a", "river-bar", "txn_1")).toBe("river-bar");   // webhook retried
    expect(await assignSubdomain("sub-b", "river-bar", "txn_2")).toBe("river-bar-2"); // name taken
    expect(await assignSubdomain("sub-b", "other", "txn_3")).toBe("river-bar-2");     // already has one
    expect(await assignSubdomain("sub-draft", "draft", "txn_4")).toBeNull();          // not published
    expect(await assignSubdomain("sub-missing", "x-y-z", "txn_5")).toBeNull();

    await db()`delete from reports where key like 'sub-%'`;
  });
});
