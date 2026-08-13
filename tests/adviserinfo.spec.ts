import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import XLSX from "xlsx";

const dataDirectory = path.resolve("data/adviserinfo");

test("SEC Form ADV export preserves Vanguard client, AUM, and employee fields", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2025.json"), "utf8"),
  );
  const advisers = dataset.records.filter((record: { firm: string }) =>
    record.firm === "vanguard",
  );
  const vanguardAdvisers = advisers.find(
    (record: { requestedName: string }) =>
      record.requestedName === "Vanguard Advisers",
  );

  expect(advisers).toHaveLength(6);
  expect(vanguardAdvisers.status).toBe("collected");
  expect(vanguardAdvisers.adviser.employees).toBe(2225);
  expect(vanguardAdvisers.adviser.employeeFunctions).toEqual({
    investmentAdvisoryFunctions: 1567,
    registeredRepresentatives: 2050,
    stateInvestmentAdviserRepresentatives: 1775,
    representativesForAnotherAdviser: 0,
    licensedInsuranceAgents: 0,
    solicitors: 12,
  });
  expect(vanguardAdvisers.clientInformation[0]).toEqual({
    code: "a",
    label: "Individuals (other than high net worth individuals)",
    clients: 743587,
    raumUsd: 159758802854,
  });
  expect(vanguardAdvisers.aumInformation).toEqual({
    discretionaryAmountUsd: 107739320953,
    nonDiscretionaryAmountUsd: 192695612810,
    totalAmountUsd: 300434933763,
    discretionaryAccounts: 496767,
    nonDiscretionaryAccounts: 202076,
    totalAccounts: 698843,
  });
});

test("SEC Form ADV export keeps unmatched targets as collection gaps", () => {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "adv-2025.json"), "utf8"),
  );
  const pending = dataset.records.filter(
    (record: { status: string }) => record.status === "pending-collection",
  );

  expect(pending.map((record: { requestedName: string }) => record.requestedName)).toEqual([
    "Vanguard Capital",
    "State Street Global Advisors",
    "Amundi US",
  ]);
  expect(pending.every((record: { reason?: string }) => record.reason)).toBe(true);
});

test("SEC Form ADV Excel export contains the four requested sheets", () => {
  const workbook = XLSX.read(
    fs.readFileSync(path.join(dataDirectory, "adv-2025.xlsx")),
  );

  expect(workbook.SheetNames).toEqual([
    "Advisers",
    "Client information",
    "AUM information",
    "Employees",
  ]);
});