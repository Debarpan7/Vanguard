import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import XLSX from "xlsx";
import { normalizeHistoricalRow, selectAnnualLatest } from "../scripts/adv-timeseries-lib.mjs";

const dataDirectory = path.resolve("data/adviserinfo");

test("SEC historical export contains CRD-matched peer history", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-timeseries.json"), "utf8"),
  );

  expect(dataset.filings.length).toBeGreaterThan(400);
  expect(dataset.annualSeries.length).toBeGreaterThan(80);
  expect(dataset.annualSeries.every((record: { crd: string }) => record.crd)).toBe(true);
  expect(dataset.annualSeries.some((record: { requestedName: string; filingYear: string }) =>
    record.requestedName === "BlackRock Advisors" && record.filingYear === "2024",
  )).toBe(true);
  expect(dataset.source.notes).toContain(
    "Historical records are matched by SEC/IAPD CRD number, not by brand name.",
  );
});

test("SEC historical export preserves explicit unavailable adviser coverage", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-timeseries.json"), "utf8"),
  );
  const missing = dataset.targetCoverage.filter(
    (target: { status: string }) => target.status === "not-available-in-archive",
  );

  expect(missing.map((target: { requestedName: string }) => target.requestedName)).toEqual([
    "Vanguard Capital Management",
    "Vanguard Portfolio Management",
  ]);
  expect(missing.every((target: { filingCount: number }) => target.filingCount === 0)).toBe(true);
});

test("SEC historical Excel export includes coverage and time-series sheets", () => {
  const workbook = XLSX.read(
    fs.readFileSync(path.join(dataDirectory, "adv-timeseries.xlsx")),
  );

  expect(workbook.SheetNames).toEqual([
    "Target coverage",
    "Annual series",
    "Filing history",
    "Client information",
    "AUM information",
    "Employees",
  ]);
});

test("annual selection uses normalized filing dates and preserves null metrics", () => {
  const target = { firm: "test", requestedName: "Test Adviser", crd: "123" };
  const source = {
    name: "SEC",
    archiveUrl: "https://www.sec.gov/files/test.zip",
    sourceFile: "test.csv",
  };
  const older = normalizeHistoricalRow(
    { FilingID: "1", DateSubmitted: "12/31/2023 11:59:59 PM", "1E1": "123", "5A": "4", "5F2c": "" },
    target,
    source,
  );
  const newer = normalizeHistoricalRow(
    { FilingID: "2", DateSubmitted: "01/01/2023 12:00:00 AM", "1E1": "123", "5A": "5", "5F2c": "100" },
    target,
    source,
  );

  expect(older.filedAtIso).toBe("2023-12-31T00:00:00.000Z");
  expect(older.aumInformation.totalAmountUsd).toBeNull();
  expect(selectAnnualLatest([older, newer])[0].filingId).toBe("1");
});