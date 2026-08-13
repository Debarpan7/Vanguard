import model from "./fact-base-read-model.json";
import type {
  FirmId,
  MetricId,
  MetricSeries,
  Ownership,
  SeriesPoint,
} from "./fact-base";

export type {
  FirmId,
  MetricId,
  MetricSeries,
  Ownership,
  SeriesPoint,
  VerificationTag,
} from "./fact-base";

interface ReadModel {
  headlineMetrics: MetricId[];
  auditedMetrics: MetricId[];
  trendYears: number[];
  peerFirms: Exclude<FirmId, "vanguard">[];
  allFirms: FirmId[];
  metricMeta: Record<MetricId, { name: string; unit: string; definition: string }>;
  firmMeta: Record<FirmId, { name: string; ownership: Ownership; note: string }>;
  series: MetricSeries[];
  primarySources: Record<Exclude<FirmId, "vanguard">, string>;
}

const readModel = model as ReadModel;

export const headlineMetrics: readonly MetricId[] = readModel.headlineMetrics;
export const auditedMetrics: readonly MetricId[] = readModel.auditedMetrics;
export const trendYears: readonly number[] = readModel.trendYears;
export const peerFirms: readonly Exclude<FirmId, "vanguard">[] = readModel.peerFirms;
export const allFirms: readonly FirmId[] = readModel.allFirms;
export const metricMeta = readModel.metricMeta;
export const firmMeta = readModel.firmMeta;

export function isAuditedMetric(metric: MetricId): boolean {
  return auditedMetrics.includes(metric);
}

export function seriesFor(metric: MetricId, firm: FirmId): MetricSeries {
  const series = readModel.series.find(
    (candidate) => candidate.metric === metric && candidate.firm === firm,
  );
  if (!series) {
    throw new Error(`No series for metric "${metric}", firm "${firm}"`);
  }
  return series;
}

export function latestPublishedPoint(
  metric: MetricId,
  firm: FirmId,
): SeriesPoint | undefined {
  return [...seriesFor(metric, firm).points]
    .reverse()
    .find((point) => point.value !== null);
}

export function primarySourceFor(
  firm: Exclude<FirmId, "vanguard">,
): string {
  return readModel.primarySources[firm];
}