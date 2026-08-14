import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import XLSX from "xlsx";

const dataDirectory = path.resolve("data/adviserinfo");

// Seam 2 — the advisory-section raw snapshot (effort: key-metrics, ticket 50).
// Generated from the SEC March-2026 Form ADV bulk archive
// (ADV_Filing_Data_20260301_20260331.zip) with the parameterized raw pipeline.
// Expected values are literal facts verified in research 45 from the same
// archive and the IAPD search API — never recomputed from the code under test.
// Item 5 is a fiscal-year-2025 snapshot (annual updating amendments).

test("SEC Form ADV 2026 export collects every advisory-section peer with its verified RAUM", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2026.json"), "utf8"),
  );
  const byName = new Map(
    dataset.records
      .filter((record: { status: string }) => record.status === "collected")
      .map((record: { requestedName: string }) => [record.requestedName, record]),
  );

  const expected: Record<string, number> = {
    "Vanguard Advisers": 344619578214,
    "Vanguard Group": 11092665107962,
    "PIMCO": 3666935101247,
    "J.P. Morgan Investment Management": 3519414511755,
    "Goldman Sachs Asset Management": 2648902942827,
    "Fidelity Management & Research": 5685041930529,
    "Morgan Stanley Investment Management": 702248681596,
    "T. Rowe Price": 2196452587469,
    "Capital Research and Management": 3753542800892,
  };
  for (const [adviser, totalAmountUsd] of Object.entries(expected)) {
    const record = byName.get(adviser);
    expect(record, `missing collected record for ${adviser}`).toBeTruthy();
    expect(record.aumInformation.totalAmountUsd).toBe(totalAmountUsd);
  }
});

test("annual updating amendments carry the covered fiscal year as the as-of date", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2026.json"), "utf8"),
  );
  const annualAmendments = dataset.records.filter(
    (record: { status: string; fiscalYearAsOf: string }) =>
      record.status === "collected" && record.fiscalYearAsOf,
  );
  expect(annualAmendments.length).toBeGreaterThanOrEqual(8);
  expect(
    annualAmendments.every(
      (record: { fiscalYearAsOf: string }) => record.fiscalYearAsOf === "2025",
    ),
  ).toBe(true);
});

test("targets with no March-2026 filing stay explicit collection gaps", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2026.json"), "utf8"),
  );
  const pending = dataset.records.filter(
    (record: { status: string }) => record.status === "pending-collection",
  );
  expect(
    pending.map((record: { requestedName: string }) => record.requestedName).sort(),
  ).toEqual(["Amundi US", "State Street Global Advisors", "Vanguard Capital"]);
  expect(pending.every((record: { reason?: string }) => record.reason)).toBe(true);
});

test("SEC Form ADV 2026 Excel export contains the four requested sheets", () => {
  const workbook = XLSX.read(
    fs.readFileSync(path.join(dataDirectory, "adv-2026.xlsx")),
  );
  expect(workbook.SheetNames).toEqual([
    "Advisers",
    "Client information",
    "AUM information",
    "Employees",
  ]);
});
