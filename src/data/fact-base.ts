/**
 * The fact base — the structured dataset the site renders from. Every series
 * carries per-point provenance (source, URL, verification tag, year coverage)
 * per the spec's Seam 2 contract. Values are literal facts from the disclosure
 * research (`.scratch/vanguard-intelligence/assets/`); gaps are recorded as
 * `not-published` or `pending-collection` — never invented.
 */

export type FirmId =
  | "vanguard"
  | "blackrock"
  | "fidelity"
  | "state-street"
  | "invesco"
  | "amundi";

export type MetricId = "aum" | "clients" | "cost-ratio" | "revenue" | "roe";

/** Same legend as the research assets. `not-published`/`pending-collection`
 * mark gaps in the dataset rather than verification failures. */
export type VerificationTag =
  | "verified-from-url"
  | "unverified"
  | "pdf-not-read"
  | "blocked-unavailable"
  | "voluntary"
  | "not-published"
  | "pending-collection";

export interface SeriesPoint {
  /** Fiscal year label (2021 = FY2021). */
  year: number;
  /** Numeric value, or null when the point is a gap (not published / not collected). */
  value: number | null;
  /** Period-end as-of date for period-end metrics (ISO date). */
  asOf?: string;
  /** Human-readable source name. */
  source: string;
  sourceUrl: string;
  verification: VerificationTag;
  /** Free-form note: methodology breaks, definition caveats, gap reasons. */
  note?: string;
}

export interface MetricSeries {
  metric: MetricId;
  firm: FirmId;
  unit: string;
  definition: string;
  /** Points in fiscal-year order. */
  points: SeriesPoint[];
}

/** The five headline metrics (decision: ticket 03), in display order. */
export const headlineMetrics: readonly MetricId[] = [
  "aum",
  "clients",
  "cost-ratio",
  "revenue",
  "roe",
];

/** Metrics whose values come from audited statements (ticket 04). Peer firms
 * without audited statements (Fidelity) are excluded from these comparisons
 * and shown as voluntary side data instead. */
export const auditedMetrics: readonly MetricId[] = ["revenue", "roe"];

/** True for audited-statement metrics — Fidelity is excluded from these
 * comparisons per the ticket-04 peer-set rule. */
export function isAuditedMetric(metric: MetricId): boolean {
  return auditedMetrics.includes(metric);
}

/** The 5-year window — latest fiscal year as the primary view. */
export const trendYears: readonly number[] = [2021, 2022, 2023, 2024, 2025];

/**
 * The core peer set (decision: ticket 04), in display order. Vanguard is
 * benchmarked against exactly these firms — membership is decided, not derived.
 */
export const peerFirms: readonly Exclude<FirmId, "vanguard">[] = [
  "blackrock",
  "fidelity",
  "state-street",
  "invesco",
  "amundi",
];

/** Display order for comparisons: Vanguard first, then the peer set. */
export const allFirms: readonly FirmId[] = ["vanguard", ...peerFirms];

export const metricMeta: Record<
  MetricId,
  { name: string; unit: string; definition: string }
> = {
  aum: {
    name: "Assets under management",
    unit: "USD trillions",
    definition:
      "Assets under management, period-end. Vanguard's published points are quarter-end as-of dates.",
  },
  clients: {
    name: "Number of clients",
    unit: "Millions of investors",
    definition:
      "Number of investors (not accounts), period-end. Vanguard publishes rounded figures.",
  },
  "cost-ratio": {
    name: "Cost ratio",
    unit: "% of average net assets",
    definition:
      "Asset-weighted average US fund expenses as a share of prior-year average net US assets (Vanguard's published definition).",
  },
  revenue: {
    name: "Revenue",
    unit: "USD billions",
    definition:
      "Total firm revenue as reported in audited statements (management/advisory fees + other).",
  },
  roe: {
    name: "Return on equity",
    unit: "%",
    definition:
      "Net income ÷ average equity, per audited statements. Vanguard: labeled proxy only (no net income or equity published).",
  },
};

/** Ownership class of a firm — shapes the comparability caveats (ticket 04). */
export type Ownership = "mutual" | "listed" | "private";

/**
 * Per-firm display metadata. Notes carry the ticket-04 availability caveats
 * so every comparison surface renders them consistently.
 */
export const firmMeta: Record<
  FirmId,
  { name: string; ownership: Ownership; note: string }
> = {
  vanguard: {
    name: "Vanguard",
    ownership: "mutual",
    note: "Client-owned (mutual). RoE is a labeled proxy — no net income or equity published.",
  },
  blackrock: {
    name: "BlackRock",
    ownership: "listed",
    note: "Revenue includes Aladdin technology fees — revenue-model caveat.",
  },
  fidelity: {
    name: "Fidelity",
    ownership: "private",
    note: "Voluntary data only — no audited statements; excluded from audited-metric comparisons (e.g., RoE).",
  },
  "state-street": {
    name: "State Street (SSGA)",
    ownership: "listed",
    note: "SSGA asset-management segment isolated from parent custody and net-interest income.",
  },
  invesco: {
    name: "Invesco",
    ownership: "listed",
    note: "Listed, Dec-31 FYE.",
  },
  amundi: {
    name: "Amundi",
    ownership: "listed",
    note: "IFRS, EUR-reported — converted at period FX (date noted); bancassurance revenue model.",
  },
};

/**
 * Returns the series for a metric and firm. The dataset guarantees every
 * (metric, firm) pair has a full 5-point series, so this never returns
 * undefined for a valid pair.
 */
export function seriesFor(metric: MetricId, firm: FirmId): MetricSeries {
  const series = allSeries.find(
    (s) => s.metric === metric && s.firm === firm,
  );
  if (!series) {
    throw new Error(`No series for metric "${metric}", firm "${firm}"`);
  }
  return series;
}

/** The most recent point with a non-null value, or undefined if the whole
 * series is a gap (e.g., Vanguard revenue). */
export function latestPublishedPoint(
  metric: MetricId,
  firm: FirmId,
): SeriesPoint | undefined {
  const series = seriesFor(metric, firm);
  return [...series.points].reverse().find((p) => p.value !== null);
}

const notPublished = (year: number, note: string): SeriesPoint => ({
  year,
  value: null,
  source: "No publication found (research asset 01)",
  sourceUrl:
    "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html",
  verification: "not-published",
  note,
});

const pendingCollection = (
  year: number,
  firm: FirmId,
  primarySource: string,
): SeriesPoint => ({
  year,
  value: null,
  source: `Pending collection — ${primarySource}`,
  sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany",
  verification: "pending-collection",
  note: `Series for ${firm} not yet collected from primary source (ticket 17 — analysis pipeline).`,
});

/* ------------------------------------------------------------------ *
 * Vanguard series — values verified in asset 01 (public disclosures). *
 * ------------------------------------------------------------------ */

const vanguardAum: MetricSeries = {
  metric: "aum",
  firm: "vanguard",
  unit: metricMeta.aum.unit,
  definition: metricMeta.aum.definition,
  points: [
    {
      year: 2021,
      value: 8.0,
      asOf: "2021-09-30",
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20220117222753/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "$8.0T as of Sep 30, 2021. Earlier snapshot: ~$7.2T as of Jan 31, 2021 (about.vanguard.com fast-facts).",
    },
    {
      year: 2022,
      value: 8.1,
      asOf: "2022-03-31",
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20220504030848/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "$8.1T as of Mar 31, 2022 — last firm AUM published on vanguard.com.",
    },
    notPublished(
      2023,
      "Firm AUM unpublished on vanguard.com after Mar 31, 2022; regulatory AUM in Form ADV (PDF not read — asset 01).",
    ),
    notPublished(
      2024,
      "Firm AUM unpublished on vanguard.com; regulatory AUM in Form ADV (PDF not read — asset 01).",
    ),
    notPublished(
      2025,
      "Firm AUM unpublished on vanguard.com; regulatory AUM in Form ADV (PDF not read — asset 01).",
    ),
  ],
};

const vanguardClients: MetricSeries = {
  metric: "clients",
  firm: "vanguard",
  unit: metricMeta.clients.unit,
  definition: metricMeta.clients.definition,
  points: [
    {
      year: 2021,
      value: 30,
      asOf: "2021-01-31",
      source: "Vanguard — Fast facts (about.vanguard.com, Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20210902071520/https://about.vanguard.com/who-we-are/fast-facts/",
      verification: "verified-from-url",
      note: "30M+ investors in ~170 countries, as of Jan 31, 2021.",
    },
    {
      year: 2022,
      value: 30,
      asOf: "2022-11-30",
      source: "Vanguard corporate — Facts and figures (Wayback captures)",
      sourceUrl:
        "https://web.archive.org/web/20221225104159/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "30M+ as of Nov 30, 2022; persisted through early 2023 captures.",
    },
    {
      year: 2023,
      value: 50,
      asOf: "2022-12-31",
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20231020161441/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "50M+ as of Dec 31, 2022 (Oct 2023 page). Methodology break: 30M+ → 50M+ (2023) reflects a counting change, not organic growth (asset 01).",
    },
    {
      year: 2024,
      value: 50,
      asOf: "2023-12-31",
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20241213021319/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "50M+ as of Dec 31, 2023 (Dec 2024 page).",
    },
    {
      year: 2025,
      value: 50,
      asOf: "2025-12-31",
      source: "Vanguard corporate — Facts and figures (current page)",
      sourceUrl:
        "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html",
      verification: "verified-from-url",
      note: "50M+ investors, as of Dec 31, 2025.",
    },
  ],
};

const vanguardCostRatio: MetricSeries = {
  metric: "cost-ratio",
  firm: "vanguard",
  unit: metricMeta["cost-ratio"].unit,
  definition: metricMeta["cost-ratio"].definition,
  points: [
    {
      year: 2021,
      value: 0.09,
      source: "Vanguard — Fast facts (about.vanguard.com, Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20210902071520/https://about.vanguard.com/who-we-are/fast-facts/",
      verification: "verified-from-url",
      note: "0.09% asset-weighted avg US fund expenses, share of 2020 avg net assets.",
    },
    {
      year: 2022,
      value: 0.08,
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20231020161441/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "0.08% — share of 2022 average net US assets (Oct 2023 page).",
    },
    {
      year: 2023,
      value: 0.08,
      source: "Vanguard corporate — Facts and figures (Wayback capture)",
      sourceUrl:
        "https://web.archive.org/web/20241213021319/https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/sets-us-apart/facts-and-figures.html",
      verification: "verified-from-url",
      note: "0.08% — share of 2023 average net US assets (Dec 2024 page).",
    },
    {
      year: 2024,
      value: 0.07,
      source: "Vanguard corporate — Facts and figures (current page)",
      sourceUrl:
        "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html",
      verification: "unverified",
      note: "0.07% per asset 01 (0.07% for 2024–25). No capture documents the 2024 measure directly — cited page states the 2025 measure (share of 2025 average net US assets).",
    },
    {
      year: 2025,
      value: 0.07,
      source: "Vanguard corporate — Facts and figures (current page)",
      sourceUrl:
        "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html",
      verification: "verified-from-url",
      note: "0.07% — share of 2025 average net US assets (page wording: 'combined mutual fund and ETF expenses'). 2026 press materials cite 0.06% for the fund lineup — a different measure (asset 01).",
    },
  ],
};

const vanguardRevenue: MetricSeries = {
  metric: "revenue",
  firm: "vanguard",
  unit: metricMeta.revenue.unit,
  definition: metricMeta.revenue.definition,
  points: trendYears.map((year) =>
    notPublished(
      year,
      "No firm revenue published. Bottom-up proxy possible from fund N-CSR advisory fees, but excluded (ticket 03 exclusion 3).",
    ),
  ),
};

const vanguardRoe: MetricSeries = {
  metric: "roe",
  firm: "vanguard",
  unit: metricMeta.roe.unit,
  definition: metricMeta.roe.definition,
  points: trendYears.map((year) =>
    notPublished(
      year,
      "RoE not computable from published data (no net income or equity published — asset 01). Proxy design pending tickets 05/06.",
    ),
  ),
};

/* ------------------------------------------------------------------ *
 * Peer series — structure with pending-collection markers. Filled in  *
 * as primary-source data is collected (ticket 17 — analysis pipeline).*
 * ------------------------------------------------------------------ */

const peerPrimarySource: Record<Exclude<FirmId, "vanguard">, string> = {
  blackrock: "BlackRock 10-K (EDGAR CIK 0001364742, FYE Dec 31)",
  fidelity:
    "Fidelity voluntary stats only — no audited statements (ticket 04: voluntary-data core member)",
  "state-street":
    "State Street 10-K (EDGAR CIK 0000093751, FYE Dec 31) — SSGA segment isolated",
  invesco: "Invesco 10-K (EDGAR CIK 0000914208, FYE Dec 31)",
  amundi: "Amundi Universal Registration Document (IFRS, EUR — FYE to confirm at collection)",
};

/** The primary source a peer series is collected from (ticket 17 pipeline). */
export function primarySourceFor(firm: Exclude<FirmId, "vanguard">): string {
  return peerPrimarySource[firm];
}

const peerSeries = (
  metric: MetricId,
  firm: Exclude<FirmId, "vanguard">,
): MetricSeries => ({
  metric,
  firm,
  unit: metricMeta[metric].unit,
  definition: metricMeta[metric].definition,
  points: trendYears.map((year) =>
    pendingCollection(year, firm, peerPrimarySource[firm]),
  ),
});

const allSeries: MetricSeries[] = [
  vanguardAum,
  vanguardClients,
  vanguardCostRatio,
  vanguardRevenue,
  vanguardRoe,
  ...peerFirms.flatMap((firm) =>
    headlineMetrics.map((metric) => peerSeries(metric, firm)),
  ),
];
