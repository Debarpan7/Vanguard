import { BenchmarkingView } from "@/components/site-shell";
import { headlineMetrics, type MetricId } from "@/data/fact-base";

/** Resolves ?metric= from the URL to a headline metric, or null for all. */
function parseMetric(
  value: string | string[] | undefined,
): MetricId | null {
  if (typeof value !== "string") return null;
  return (headlineMetrics as readonly string[]).includes(value)
    ? (value as MetricId)
    : null;
}

/**
 * The benchmarking view: a peer-set panel plus the metric-tabbed comparison
 * explorer, driven by the shareable `?metric=` URL.
 */
export default async function BenchmarkingPage({
  searchParams,
}: PageProps<"/benchmarking">) {
  const { metric } = await searchParams;
  const activeMetric = parseMetric(metric);
  return <BenchmarkingView activeMetric={activeMetric} />;
}
