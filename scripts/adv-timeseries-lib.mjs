/** The 14 Form ADV client-type categories (Item 5.D), codes a–n. Shared by
 * the raw single-month generator and the historical series generator. */
export const clientTypes = [
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
  // NOTE: CRD 112861 resolves to State Street Global Advisors LIMITED (UK,
  // inactive) in SEC data — this existing target tracks that UK entity, not a
  // US SSGA adviser. SSGA is excluded from the advisory-section peer set
  // (research 45); the overall table's SSGA data comes from 10-K segment
  // disclosures, not Form ADV.
  { firm: "state-street", requestedName: "State Street Global Advisors", crd: "112861" },
  { firm: "invesco", requestedName: "Invesco Advisers", crd: "105360" },
  { firm: "amundi", requestedName: "Amundi US", crd: "334151" },
  // Advisory-section peer set (effort: key-metrics, ticket 50; CRDs verified
  // in research 45 against the IAPD search API and the SEC bulk archives).
  { firm: "pimco", requestedName: "PIMCO", crd: "104559" },
  { firm: "jpmorgan", requestedName: "J.P. Morgan Investment Management", crd: "107038" },
  { firm: "goldman-sachs", requestedName: "Goldman Sachs Asset Management", crd: "107738" },
  { firm: "fidelity", requestedName: "Fidelity Management & Research", crd: "108281" },
  { firm: "morgan-stanley", requestedName: "Morgan Stanley Investment Management", crd: "110353" },
  { firm: "t-rowe-price", requestedName: "T. Rowe Price", crd: "105496" },
  { firm: "capital-group", requestedName: "Capital Research and Management", crd: "110885" },
];

/** Single-month (raw) generator targets. Same registry as
 * `historicalTargets`, plus the fuzzy "Vanguard Capital" name probe and
 * `sourceName` (the exact Item 1.A legal name used as the name-match
 * fallback). Targets with a `crd` are matched by CRD first (1E1 is the
 * durable key); name-only targets keep the legacy exact-name match. */
export const rawTargets = [
  { firm: "vanguard", requestedName: "Vanguard Advisers", sourceName: "VANGUARD ADVISERS, INC.", crd: "106715" },
  { firm: "vanguard", requestedName: "Vanguard Global Advisers", sourceName: "VANGUARD GLOBAL ADVISERS, LLC", crd: "164593" },
  { firm: "vanguard", requestedName: "Vanguard Group", sourceName: "THE VANGUARD GROUP, INC.", crd: "105958" },
  { firm: "vanguard", requestedName: "Vanguard Capital", sourceName: "VANGUARD CAPITAL" },
  { firm: "vanguard", requestedName: "Vanguard Capital Management", sourceName: "VANGUARD CAPITAL MANAGEMENT, LLC", crd: "338002" },
  { firm: "vanguard", requestedName: "Vanguard Portfolio Management", sourceName: "VANGUARD PORTFOLIO MANAGEMENT, LLC", crd: "338003" },
  { firm: "blackrock", requestedName: "BlackRock Advisors", sourceName: "BLACKROCK ADVISORS, LLC", crd: "106614" },
  { firm: "fidelity", requestedName: "Fidelity Institutional Wealth Adviser", sourceName: "FIDELITY INSTITUTIONAL WEALTH ADVISER LLC", crd: "301896" },
  { firm: "fidelity", requestedName: "Fidelity Management & Research", sourceName: "FIDELITY MANAGEMENT & RESEARCH COMPANY LLC", crd: "108281" },
  // Name-only on purpose: CRD 112861 is the UK SSGA Limited entity (research 45).
  { firm: "state-street", requestedName: "State Street Global Advisors", sourceName: "STATE STREET GLOBAL ADVISORS, INC." },
  { firm: "invesco", requestedName: "Invesco Advisers", sourceName: "INVESCO ADVISERS, INC.", crd: "105360" },
  { firm: "amundi", requestedName: "Amundi US", sourceName: "AMUNDI US" },
  { firm: "pimco", requestedName: "PIMCO", sourceName: "PACIFIC INVESTMENT MANAGEMENT COMPANY LLC", crd: "104559" },
  { firm: "jpmorgan", requestedName: "J.P. Morgan Investment Management", sourceName: "J.P. MORGAN INVESTMENT MANAGEMENT INC.", crd: "107038" },
  { firm: "goldman-sachs", requestedName: "Goldman Sachs Asset Management", sourceName: "GOLDMAN SACHS ASSET MANAGEMENT, L.P.", crd: "107738" },
  { firm: "morgan-stanley", requestedName: "Morgan Stanley Investment Management", sourceName: "MORGAN STANLEY INVESTMENT MANAGEMENT INC.", crd: "110353" },
  { firm: "t-rowe-price", requestedName: "T. Rowe Price", sourceName: "T. ROWE PRICE ASSOCIATES, INC.", crd: "105496" },
  { firm: "capital-group", requestedName: "Capital Research and Management", sourceName: "CAPITAL RESEARCH AND MANAGEMENT COMPANY", crd: "110885" },
];

/**
 * Matches one bulk-CSV row (an adviser filing) to a raw target. CRD (1E1) is
 * authoritative when a target carries one — the durable key per SEC/IAPD
 * practice; otherwise falls back to the exact Item 1.A legal name. Returns the
 * matched target, or null when the row belongs to no target.
 */
export function matchRawTarget(row, targets) {
  const rowCrd = String(row["1E1"] ?? "");
  const crdMatch = targets.find((target) => target.crd && String(target.crd) === rowCrd);
  if (crdMatch) return crdMatch;
  const legalName = String(row["1A"] ?? "");
  return targets.find((target) => String(target.sourceName ?? "") === legalName) ?? null;
}

/**
 * Selects the best single filing for a raw snapshot among the rows matching a
 * target. Prefers the annual updating amendment — the authoritative
 * fiscal-year-end snapshot — over other-than-annual amendments filed in the
 * same month (Vanguard Group, for example, files an other-than-annual
 * amendment carrying the prior snapshot and its annual amendment with the
 * updated Item 5 figures in the same month). Rows without a filing type fall
 * back to the latest submission date. `filingTypes` maps FilingID to
 * "annual" | "other" (from the archive's ADV_Filing_Types table); an empty map
 * means no type information.
 */
export function selectBestRawFiling(rows, filingTypes = new Map()) {
  if (rows.length === 0) return null;
  const preferred = rows.filter(
    (row) => filingTypes.get(String(row.FilingID)) === "annual",
  );
  const pool = preferred.length > 0 ? preferred : rows;
  return pool.reduce((best, row) => {
    const bestDate = submittedAt(best.DateSubmitted);
    const rowDate = submittedAt(row.DateSubmitted);
    return rowDate && (!bestDate || rowDate > bestDate) ? row : best;
  }, pool[0]);
}

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