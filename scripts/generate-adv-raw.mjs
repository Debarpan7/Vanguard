import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const sourceDirectory = process.env.ADV_SOURCE_DIR;
if (!sourceDirectory) {
  throw new Error("ADV_SOURCE_DIR must point to an extracted SEC Form ADV archive");
}

const archiveName = "ADV_Filing_Data_20251201_20251231.zip";
const archiveUrl = `https://reports.adviserinfo.sec.gov/reports/foia/advFilingData/2025/${archiveName}`;
const filingPeriod = "2025-12-01/2025-12-31";
const baseFile = path.join(
  sourceDirectory,
  "IA_ADV_Base_A_20251201_20251231.csv",
);

const targets = [
  { firm: "vanguard", requestedName: "Vanguard Advisers", sourceName: "VANGUARD ADVISERS, INC." },
  { firm: "vanguard", requestedName: "Vanguard Global Advisers", sourceName: "VANGUARD GLOBAL ADVISERS, LLC" },
  { firm: "vanguard", requestedName: "Vanguard Group", sourceName: "THE VANGUARD GROUP, INC." },
  { firm: "vanguard", requestedName: "Vanguard Capital", sourceName: "VANGUARD CAPITAL" },
  { firm: "vanguard", requestedName: "Vanguard Capital Management", sourceName: "VANGUARD CAPITAL MANAGEMENT, LLC" },
  { firm: "vanguard", requestedName: "Vanguard Portfolio Management", sourceName: "VANGUARD PORTFOLIO MANAGEMENT, LLC" },
  { firm: "blackrock", requestedName: "BlackRock Advisors", sourceName: "BLACKROCK ADVISORS, LLC" },
  { firm: "fidelity", requestedName: "Fidelity Institutional Wealth Adviser", sourceName: "FIDELITY INSTITUTIONAL WEALTH ADVISER LLC" },
  { firm: "state-street", requestedName: "State Street Global Advisors", sourceName: "STATE STREET GLOBAL ADVISORS, INC." },
  { firm: "invesco", requestedName: "Invesco Advisers", sourceName: "INVESCO ADVISERS, INC." },
  { firm: "amundi", requestedName: "Amundi US", sourceName: "AMUNDI US" },
];

const clientTypes = [
  ["a", "Individuals (other than high net worth individuals)"],
  ["b", "High net worth individuals"],
  ["c", "Banking or thrift institutions"],
  ["d", "Investment companies"],
  ["e", "Business development companies"],
  ["f", "Pooled investment vehicles"],
  ["g", "Pension and profit sharing plans"],
  ["h", "Charitable organizations"],
  ["i", "State or municipal government entities"],
  ["j", "Other investment advisers"],
  ["k", "Insurance companies"],
  ["l", "Sovereign wealth funds and foreign official institutions"],
  ["m", "Corporations or other businesses"],
  ["n", "Other"],
];

function readCsv(filePath) {
  const workbook = XLSX.read(fs.readFileSync(filePath, "utf8"), {
    type: "string",
    raw: false,
  });
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    defval: null,
  });
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(number) ? number : null;
}

function rawValue(row, key) {
  return row[key] ?? null;
}

const rows = readCsv(baseFile);
const outputRecords = targets.map((target) => {
  const row = rows.find((candidate) => candidate["1A"] === target.sourceName);
  if (!row) {
    return {
      ...target,
      status: "pending-collection",
      filingPeriod,
      source: {
        name: "SEC Investment Adviser Public Disclosure — Form ADV filing data",
        archiveUrl,
      },
      adviser: null,
      clientInformation: null,
      aumInformation: null,
      reason: "No matching legal adviser name in the December 2025 SEC filing archive; do not infer from the peer brand or a different adviser entity.",
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
      "A pending-collection record means the target was not matched in this bounded archive; it is not a zero value.",
    ],
  },
  records: outputRecords,
};

const outputDirectory = path.resolve("data/adviserinfo");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "adv-2025.json"),
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
XLSX.writeFile(workbook, path.join(outputDirectory, "adv-2025.xlsx"));

console.log(`Wrote ${outputRecords.length} adviser records to ${outputDirectory}`);