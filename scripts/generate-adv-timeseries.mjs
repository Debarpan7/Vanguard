import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import XLSX from "xlsx";
import {
  historicalTargets,
  normalizeHistoricalRow,
  selectAnnualLatest,
} from "./adv-timeseries-lib.mjs";

const sourceDirectory = process.env.ADV_SOURCE_DIR;
if (!sourceDirectory) {
  throw new Error("ADV_SOURCE_DIR must point to an extracted SEC Form ADV archive");
}

const baseFile = path.join(
  sourceDirectory,
  "adv-filing-data-20111105-20241231-part1",
  "IA_ADV_Base_A_20111105_20241231.csv",
);
if (!fs.existsSync(baseFile)) {
  throw new Error(`Historical Form ADV base table not found: ${baseFile}`);
}

const source = {
  name: "SEC Investment Adviser Public Disclosure — historical Form ADV filing data",
  archiveUrl: "https://www.sec.gov/files/adv-filing-data-20111105-20241231-part1.zip",
  sourceFile: path.basename(baseFile),
};
const targetsByCrd = new Map(historicalTargets.map((target) => [target.crd, target]));
const requiredHeaders = ["FilingID", "DateSubmitted", "1A", "1B1", "1E1", "5A", "5D1a", "5D3a", "5F2c"];
function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

async function collectFilings() {
  const input = readline.createInterface({
    input: fs.createReadStream(baseFile),
    crlfDelay: Infinity,
  });
  let headers;
  const matched = [];
  for await (const line of input) {
    const values = parseCsvLine(line);
    if (!headers) {
      headers = values;
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
      if (missingHeaders.length > 0) {
        throw new Error(`Historical Form ADV table is missing expected headers: ${missingHeaders.join(", ")}`);
      }
      continue;
    }
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? null]));
    const target = targetsByCrd.get(String(row["1E1"] ?? ""));
    if (target) matched.push(normalizeHistoricalRow(row, target, source));
  }
  return matched;
}

const filings = await collectFilings();
const annualSeries = selectAnnualLatest(filings);
const collectedCrds = new Set(filings.map((record) => record.crd));
const filingCountsByCrd = new Map();
for (const record of filings) {
  filingCountsByCrd.set(record.crd, (filingCountsByCrd.get(record.crd) ?? 0) + 1);
}
const targetCoverage = historicalTargets.map((target) => ({
  ...target,
  status: collectedCrds.has(target.crd) ? "collected" : "not-available-in-archive",
  filingCount: filingCountsByCrd.get(target.crd) ?? 0,
}));

const output = {
  dataset: "sec-form-adv-timeseries",
  generatedAt: new Date().toISOString(),
  coverage: "2011-11-05/2024-12-31",
  source: {
    ...source,
    officialSite: "https://adviserinfo.sec.gov/",
    notes: [
      "Historical records are matched by SEC/IAPD CRD number, not by brand name.",
      "Filings contains every matched Form ADV Part 1A filing; annualSeries selects the latest filing submitted in each calendar year.",
      "This is adviser-level regulatory disclosure, not audited corporate financial-statement data.",
      "Missing years and null fields remain gaps; no historical values are inferred.",
    ],
  },
  targets: historicalTargets,
  targetCoverage,
  filings,
  annualSeries,
};

const outputDirectory = path.resolve("data/adviserinfo");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "adv-timeseries.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);

const adviserRows = annualSeries.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  crd: record.crd,
  filingYear: record.filingYear,
  filingId: record.filingId,
  filedAt: record.filedAt,
  filedAtIso: record.filedAtIso,
  legalName: record.adviser.legalName,
  businessName: record.adviser.businessName,
  status: record.status,
}));
const clientRows = annualSeries.flatMap((record) => record.clientInformation.map((client) => ({
  firm: record.firm,
  adviser: record.requestedName,
  crd: record.crd,
  filingYear: record.filingYear,
  clientTypeCode: client.code,
  clientType: client.label,
  clients: client.clients ?? "",
  raumUsd: client.raumUsd ?? "",
})));
const aumRows = annualSeries.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  crd: record.crd,
  filingYear: record.filingYear,
  totalAmountUsd: record.aumInformation.totalAmountUsd ?? "",
  discretionaryAmountUsd: record.aumInformation.discretionaryAmountUsd ?? "",
  nonDiscretionaryAmountUsd: record.aumInformation.nonDiscretionaryAmountUsd ?? "",
  totalAccounts: record.aumInformation.totalAccounts ?? "",
  discretionaryAccounts: record.aumInformation.discretionaryAccounts ?? "",
  nonDiscretionaryAccounts: record.aumInformation.nonDiscretionaryAccounts ?? "",
}));
const employeeRows = annualSeries.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  crd: record.crd,
  filingYear: record.filingYear,
  employees: record.adviser.employees ?? "",
  ...record.adviser.employeeFunctions,
}));
const filingRows = filings.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  crd: record.crd,
  filingYear: record.filingYear,
  filingId: record.filingId,
  filedAt: record.filedAt,
  legalName: record.adviser.legalName,
  totalAmountUsd: record.aumInformation.totalAmountUsd ?? "",
  employees: record.adviser.employees ?? "",
}));
const coverageRows = targetCoverage.map((target) => ({
  firm: target.firm,
  adviser: target.requestedName,
  crd: target.crd,
  status: target.status,
  filingCount: target.filingCount,
}));

const exportWorkbook = XLSX.utils.book_new();
for (const [name, sheetRows] of [
  ["Target coverage", coverageRows],
  ["Annual series", adviserRows],
  ["Filing history", filingRows],
  ["Client information", clientRows],
  ["AUM information", aumRows],
  ["Employees", employeeRows],
]) {
  XLSX.utils.book_append_sheet(exportWorkbook, XLSX.utils.json_to_sheet(sheetRows), name);
}
XLSX.writeFile(exportWorkbook, path.join(outputDirectory, "adv-timeseries.xlsx"));

console.log(`Wrote ${filings.length} historical filings and ${annualSeries.length} annual records to ${outputDirectory}`);