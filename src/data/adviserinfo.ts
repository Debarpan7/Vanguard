import historicalData from "../../data/adviserinfo/adv-timeseries.json" with { type: "json" };
import type { SeriesPoint } from "./fact-base";

const vanguardHistoricalSource = historicalData.source;

const vanguardHistoricalRecords = historicalData.annualSeries.filter(
  (record) =>
    record.crd === "105958" &&
    ["2023", "2024"].includes(record.filingYear) &&
    record.aumInformation.totalAmountUsd !== null,
);

export const vanguardHistoricalRegulatoryAum: SeriesPoint[] =
  vanguardHistoricalRecords.map((record) => ({
    year: Number(record.filingYear),
    value: Number(record.aumInformation.totalAmountUsd) / 1_000_000_000_000,
    asOf: record.filedAtIso.slice(0, 10),
    source: vanguardHistoricalSource.name,
    sourceUrl: vanguardHistoricalSource.archiveUrl,
    verification: "verified-from-url",
    sourceCurrency: "USD",
    issuerScope: "The Vanguard Group, Inc. SEC-registered investment adviser (CRD 105958)",
    comparabilityClassification: "display-only-regulatory-aum",
    note: `Total regulatory assets under management reported in Form ADV Item 5.F.2.c; filing date ${record.filedAtIso.slice(0, 10)} is used as the observation date because the historical archive does not expose a separate AUM valuation date. Regulatory adviser AUM is not a corporate financial-statement measure and is excluded from audited financial comparisons.`,
  }));