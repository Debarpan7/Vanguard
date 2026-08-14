import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";
import {
  clientTypes,
  matchRawTarget,
  numberOrNull,
  rawTargets,
  selectBestRawFiling,
} from "./adv-timeseries-lib.mjs";

const sourceDirectory = process.env.ADV_SOURCE_DIR;
if (!sourceDirectory) {
  throw new Error("ADV_SOURCE_DIR must point to an extracted SEC Form ADV archive");
}

// Bounded monthly snapshot. The archive period is parameterized so the
// generator can target the month a firm actually filed: most Dec-31-fiscal-year
// advisers file their annual updating amendments in Q1 (e.g., March), so a
// fixed December archive misses PIMCO, J.P. Morgan, Morgan Stanley, etc.
// (ticket 50 — advisory-section peer set).
const archiveStart = process.env.ADV_ARCHIVE_START ?? "20251201";
const archiveEnd = process.env.ADV_ARCHIVE_END ?? "20251231";
const archiveYear = archiveStart.slice(0, 4);
const archiveName = `ADV_Filing_Data_${archiveStart}_${archiveEnd}.zip`;
const archiveUrl = `https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/${archiveYear}/${archiveName}`;
const formatPeriod = (ymd) => `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
const filingPeriod = `${formatPeriod(archiveStart)}/${formatPeriod(archiveEnd)}`;
const baseFile = path.join(sourceDirectory, `IA_ADV_Base_A_${archiveStart}_${archiveEnd}.csv`);

function readCsv(filePath) {
  const workbook = XLSX.read(fs.readFileSync(filePath, "utf8"), {
    type: "string",
    raw: false,
  });
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    defval: null,
  });
}

function rawValue(row, key) {
  return row[key] ?? null;
}

// Optional join with the archive's filing-types table so each record carries
// its filing type (annual vs. other-than-annual) and, for annual updating
// amendments, the fiscal year the filing covers. Item 5 is a snapshot as of
// the adviser's fiscal year end; DateSubmitted is the submission date, not the
// as-of date — and a firm can file an other-than-annual amendment and its
// annual amendment in the same month, with only the annual amendment carrying
// the authoritative fiscal-year figures (research 44/45).
let filingTypeByFilingId = new Map();
let fiscalYearByFilingId = new Map();
const filingTypesFile = path.join(
  sourceDirectory,
  `ADV_Filing_Types_${archiveStart}_${archiveEnd}.csv`,
);
if (fs.existsSync(filingTypesFile)) {
  for (const typeRow of readCsv(filingTypesFile)) {
    const filingId = String(typeRow["FilingID"] ?? "");
    if (!filingId) continue;
    filingTypeByFilingId.set(
      filingId,
      typeRow["Annual Updating Amendment for Registered Adviser"] === "Y"
        ? "annual"
        : "other",
    );
    const fiscalYear = typeRow["Annual Updating Amendment Fiscal Year"];
    if (fiscalYear !== null && fiscalYear !== undefined && String(fiscalYear).trim() !== "") {
      fiscalYearByFilingId.set(filingId, String(fiscalYear));
    }
  }
}

// Match each filing row to a raw target (CRD-first, name fallback), keeping
// every match: a firm can file multiple times in a month, and the annual
// updating amendment must win over an earlier other-than-annual filing.
const matchedRowsByTarget = new Map();
const rows = readCsv(baseFile);
for (const row of rows) {
  const target = matchRawTarget(row, rawTargets);
  if (!target) continue;
  if (!matchedRowsByTarget.has(target)) matchedRowsByTarget.set(target, []);
  matchedRowsByTarget.get(target).push(row);
}

const outputRecords = rawTargets.map((target) => {
  const row = selectBestRawFiling(
    matchedRowsByTarget.get(target) ?? [],
    filingTypeByFilingId,
  );
  if (!row) {
    return {
      ...target,
      status: "pending-collection",
      filingPeriod,
      fiscalYearAsOf: null,
      source: {
        name: "SEC Investment Adviser Public Disclosure — Form ADV filing data",
        archiveUrl,
      },
      adviser: null,
      clientInformation: null,
      aumInformation: null,
      reason: "No matching adviser filing in this bounded SEC archive period; do not infer from the peer brand or a different adviser entity.",
    };
  }

  const clientRows = clientTypes.map(([code, label]) => ({
    code,
    label,
    clients: numberOrNull(rawValue(row, `5D1${code}`)),
    raumUsd: numberOrNull(rawValue(row, `5D3${code}`)),
  }));

  return {
    ...target,
    status: "collected",
    filingId: String(row.FilingID),
    filedAt: row.DateSubmitted,
    filingPeriod,
    fiscalYearAsOf: fiscalYearByFilingId.get(String(row.FilingID)) ?? null,
    source: {
      name: "SEC Investment Adviser Public Disclosure — Form ADV filing data",
      archiveUrl,
      sourceFile: path.basename(baseFile),
      form: "Form ADV Part 1A",
    },
    adviser: {
      legalName: row["1A"],
      businessName: row["1B1"],
      employees: numberOrNull(rawValue(row, "5A")),
      employeeFunctions: {
        investmentAdvisoryFunctions: numberOrNull(rawValue(row, "5B1")),
        registeredRepresentatives: numberOrNull(rawValue(row, "5B2")),
        stateInvestmentAdviserRepresentatives: numberOrNull(rawValue(row, "5B3")),
        representativesForAnotherAdviser: numberOrNull(rawValue(row, "5B4")),
        licensedInsuranceAgents: numberOrNull(rawValue(row, "5B5")),
        solicitors: numberOrNull(rawValue(row, "5B6")),
      },
    },
    clientInformation: clientRows,
    aumInformation: {
      discretionaryAmountUsd: numberOrNull(rawValue(row, "5F2a")),
      nonDiscretionaryAmountUsd: numberOrNull(rawValue(row, "5F2b")),
      totalAmountUsd: numberOrNull(rawValue(row, "5F2c")),
      discretionaryAccounts: numberOrNull(rawValue(row, "5F2d")),
      nonDiscretionaryAccounts: numberOrNull(rawValue(row, "5F2e")),
      totalAccounts: numberOrNull(rawValue(row, "5F2f")),
    },
    rawFields: {
      "5A": rawValue(row, "5A"),
      "5B1": rawValue(row, "5B1"),
      "5B2": rawValue(row, "5B2"),
      "5B3": rawValue(row, "5B3"),
      "5B4": rawValue(row, "5B4"),
      "5B5": rawValue(row, "5B5"),
      "5B6": rawValue(row, "5B6"),
      ...Object.fromEntries(
        clientTypes.flatMap(([code]) => [
          [`5D1${code}`, rawValue(row, `5D1${code}`)],
          [`5D3${code}`, rawValue(row, `5D3${code}`)],
        ]),
      ),
      "5F2a": rawValue(row, "5F2a"),
      "5F2b": rawValue(row, "5F2b"),
      "5F2c": rawValue(row, "5F2c"),
      "5F2d": rawValue(row, "5F2d"),
      "5F2e": rawValue(row, "5F2e"),
      "5F2f": rawValue(row, "5F2f"),
    },
  };
});

const output = {
  dataset: "sec-form-adv-raw",
  generatedAt: new Date().toISOString(),
  filingPeriod,
  source: {
    name: "SEC Investment Adviser Public Disclosure — Form ADV filing data",
    archiveUrl,
    officialSite: "https://adviserinfo.sec.gov/",
    notes: [
      "This is adviser-level regulatory disclosure, not audited corporate financial-statement data.",
      "Values are retained in USD as reported by the Form ADV archive.",
      "Filings are matched by SEC/IAPD CRD number (1E1) when a target carries one, else by exact Item 1.A legal name.",
      "Item 5 figures are snapshots as of the adviser's most recently completed fiscal year end; DateSubmitted is the submission date, not the value's as-of date. Where the archive's ADV_Filing_Types table is present, the annual-updating-amendment fiscal year is recorded as fiscalYearAsOf.",
      "A pending-collection record means the target was not matched in this bounded archive; it is not a zero value.",
    ],
  },
  records: outputRecords,
};

const outputDirectory = path.resolve("data/adviserinfo");
fs.mkdirSync(outputDirectory, { recursive: true });
const outputBaseName = `adv-${archiveYear}`;
fs.writeFileSync(
  path.join(outputDirectory, `${outputBaseName}.json`),
  `${JSON.stringify(output, null, 2)}\n`,
);

const adviserRows = outputRecords.map((record) => ({
  firm: record.firm,
  requestedName: record.requestedName,
  status: record.status,
  filingId: record.filingId ?? "",
  legalName: record.adviser?.legalName ?? "",
  businessName: record.adviser?.businessName ?? "",
  filedAt: record.filedAt ?? "",
  fiscalYearAsOf: record.fiscalYearAsOf ?? "",
  sourceFile: record.source?.sourceFile ?? "",
}));
const clientRows = outputRecords.flatMap((record) =>
  (record.clientInformation ?? []).map((client) => ({
    firm: record.firm,
    adviser: record.requestedName,
    status: record.status,
    clientTypeCode: client.code,
    clientType: client.label,
    clients: client.clients ?? "",
    raumUsd: client.raumUsd ?? "",
  })),
);
const aumRows = outputRecords.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  status: record.status,
  discretionaryAmountUsd: record.aumInformation?.discretionaryAmountUsd ?? "",
  nonDiscretionaryAmountUsd: record.aumInformation?.nonDiscretionaryAmountUsd ?? "",
  totalAmountUsd: record.aumInformation?.totalAmountUsd ?? "",
  discretionaryAccounts: record.aumInformation?.discretionaryAccounts ?? "",
  nonDiscretionaryAccounts: record.aumInformation?.nonDiscretionaryAccounts ?? "",
  totalAccounts: record.aumInformation?.totalAccounts ?? "",
}));
const employeeRows = outputRecords.map((record) => ({
  firm: record.firm,
  adviser: record.requestedName,
  status: record.status,
  employees: record.adviser?.employees ?? "",
  ...record.adviser?.employeeFunctions,
}));

const workbook = XLSX.utils.book_new();
for (const [name, rowsForSheet] of [
  ["Advisers", adviserRows],
  ["Client information", clientRows],
  ["AUM information", aumRows],
  ["Employees", employeeRows],
]) {
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rowsForSheet), name);
}
XLSX.writeFile(workbook, path.join(outputDirectory, `${outputBaseName}.xlsx`));

console.log(`Wrote ${outputRecords.length} adviser records to ${outputDirectory}`);
