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

export const historicalTargets = [
  { firm: "vanguard", requestedName: "Vanguard Advisers", crd: "106715" },
  { firm: "vanguard", requestedName: "Vanguard Global Advisers", crd: "164593" },
  { firm: "vanguard", requestedName: "Vanguard Group", crd: "105958" },
  { firm: "vanguard", requestedName: "Vanguard Capital Management", crd: "338002" },
  { firm: "vanguard", requestedName: "Vanguard Portfolio Management", crd: "338003" },
  { firm: "blackrock", requestedName: "BlackRock Advisors", crd: "106614" },
  { firm: "fidelity", requestedName: "Fidelity Institutional Wealth Adviser", crd: "301896" },
  { firm: "state-street", requestedName: "State Street Global Advisors", crd: "112861" },
  { firm: "invesco", requestedName: "Invesco Advisers", crd: "105360" },
  { firm: "amundi", requestedName: "Amundi US", crd: "334151" },
];

export function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(number) ? number : null;
}

function rawValue(row, key) {
  return row[key] ?? null;
}

function submittedAt(value) {
  const match = String(value ?? "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[3]), Number(match[1]) - 1, Number(match[2])));
}

export function submittedAtIso(value) {
  return submittedAt(value)?.toISOString() ?? null;
}

export function normalizeHistoricalRow(row, target, source) {
  const submitted = submittedAt(row.DateSubmitted);
  const year = submitted ? String(submitted.getUTCFullYear()) : null;
  const clientInformation = clientTypes.map(([code, label]) => ({
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
    filedAtIso: submittedAtIso(row.DateSubmitted),
    filingYear: year,
    filingPeriod: year,
    source: {
      ...source,
      form: "Form ADV Part 1A",
    },
    adviser: {
      legalName: row["1A"] ?? null,
      businessName: row["1B1"] ?? null,
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
    clientInformation,
    aumInformation: {
      discretionaryAmountUsd: numberOrNull(rawValue(row, "5F2a")),
      nonDiscretionaryAmountUsd: numberOrNull(rawValue(row, "5F2b")),
      totalAmountUsd: numberOrNull(rawValue(row, "5F2c")),
      discretionaryAccounts: numberOrNull(rawValue(row, "5F2d")),
      nonDiscretionaryAccounts: numberOrNull(rawValue(row, "5F2e")),
      totalAccounts: numberOrNull(rawValue(row, "5F2f")),
    },
    rawFields: Object.fromEntries([
      ...["5A", "5B1", "5B2", "5B3", "5B4", "5B5", "5B6"].map((key) => [key, rawValue(row, key)]),
      ...clientTypes.flatMap(([code]) => [
        [`5D1${code}`, rawValue(row, `5D1${code}`)],
        [`5D3${code}`, rawValue(row, `5D3${code}`)],
      ]),
      ...["5F2a", "5F2b", "5F2c", "5F2d", "5F2e", "5F2f"].map((key) => [key, rawValue(row, key)]),
    ]),
  };
}

export function selectAnnualLatest(records) {
  const latest = new Map();
  for (const record of records) {
    if (!record.filingYear) continue;
    const key = `${record.crd}:${record.filingYear}`;
    const current = latest.get(key);
    if (!current || record.filedAtIso >= current.filedAtIso) {
      latest.set(key, record);
    }
  }
  return [...latest.values()].sort((left, right) =>
    `${left.requestedName}:${left.filingYear}`.localeCompare(`${right.requestedName}:${right.filingYear}`),
  );
}