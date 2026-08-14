import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import XLSX from "xlsx";

const dataDirectory = path.resolve("data/adviserinfo");

// Seam 2 — the advisory-section raw snapshot (effort: key-metrics, ticket 50).
// Generated from the SEC March-2026 Form ADV bulk archive
// (ADV_Filing_Data_20260301_20260331.zip) with the parameterized raw pipeline.
// Expected values are literal facts read from that primary archive — never
// recomputed from the code under test. Item 5 is a fiscal-year-2025 snapshot
// (annual updating amendments). Vanguard Group's annual-amendment figure
// ($11,092,665,107,962) is independently verified in research 44; research
// 45's Vanguard literals ($10,246,596,045,633 / $300,434,933,763) are the
// Dec-2025 filing values that the March-2026 annual amendments supersede —
// the archive holds both filings, and selectBestRawFiling picks the annual
// amendment (the other-than-annual rows carry the prior snapshot).

interface CollectedRecord {
  requestedName: string;
  status: string;
  fiscalYearAsOf: string | null;
  aumInformation: { totalAmountUsd: number };
}

interface Adv2026Dataset {
  records: CollectedRecord[];
}

function readAdv2026(): Adv2026Dataset {
  return JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2026.json"), "utf8"),
  ) as Adv2026Dataset;
}

test("SEC Form ADV 2026 export collects every advisory-section peer with its verified RAUM", () => {
  const dataset = readAdv2026();
  const byName = new Map(
    dataset.records
      .filter((record) => record.status === "collected")
      .map((record) => [record.requestedName, record] as const),
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
    expect(record!.aumInformation.totalAmountUsd).toBe(totalAmountUsd);
  }
});

test("annual updating amendments carry the covered fiscal year as the as-of date", () => {
  const dataset = readAdv2026();
  const annualAmendments = dataset.records.filter(
    (record) => record.status === "collected" && record.fiscalYearAsOf,
  );
  expect(annualAmendments.length).toBeGreaterThanOrEqual(8);
  expect(
    annualAmendments.every((record) => record.fiscalYearAsOf === "2025"),
  ).toBe(true);
});

test("targets with no March-2026 filing stay explicit collection gaps", () => {
  const dataset = readAdv2026();
  const pending = dataset.records.filter(
    (record) => record.status === "pending-collection",
  );
  expect(
    pending.map((record) => record.requestedName).sort(),
  ).toEqual(["Amundi US", "State Street Global Advisors", "Vanguard Capital"]);
  expect(pending.every((record) => (record as { reason?: string }).reason)).toBe(true);
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
