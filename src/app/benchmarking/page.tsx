import { TakeABenchmarking } from "@/components/prototype/take-a";
import { TakeBBenchmarking } from "@/components/prototype/take-b";
import { TakeCBenchmarking } from "@/components/prototype/take-c";
import { parseVariant } from "@/components/prototype/variants";
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
 * Ticket 21 — design tokens & shell (HITL gate): the benchmarking view gets
 * the same three prototype takes as home, switchable via `?variant=`.
 * Dev-only; production always renders the live page.
 */
export default async function BenchmarkingPage({
  searchParams,
}: PageProps<"/benchmarking">) {
  const { metric, variant } = await searchParams;
  const activeMetric = parseMetric(metric);
  const take = process.env.NODE_ENV === "production" ? null : parseVariant(variant);

  if (take === "A") return <TakeABenchmarking activeMetric={activeMetric} />;
  if (take === "B") return <TakeBBenchmarking activeMetric={activeMetric} />;
  if (take === "C") return <TakeCBenchmarking activeMetric={activeMetric} />;
  return <TakeBBenchmarking activeMetric={activeMetric} />;
}
