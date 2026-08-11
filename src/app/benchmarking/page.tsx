import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { PeerSetPanel } from "@/components/peer-set-panel";
import { BenchmarkingExplorer } from "@/components/benchmarking-explorer";
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

export default async function BenchmarkingPage({
  searchParams,
}: PageProps<"/benchmarking">) {
  const { metric } = await searchParams;
  const activeMetric = parseMetric(metric);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Benchmarking
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Each headline metric compared against the peer set over the 5 years
          — with membership rules and the ownership caveat displayed
          alongside every comparison.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
      </header>

      <PeerSetPanel />
      <BenchmarkingExplorer activeMetric={activeMetric} />
    </div>
  );
}
