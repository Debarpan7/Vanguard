import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { PeerSetPanel } from "@/components/peer-set-panel";
import { BenchmarkingExplorer } from "@/components/benchmarking-explorer";
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

/** The live benchmarking page (no ?variant=). */
function LiveBenchmarking({ activeMetric }: { activeMetric: MetricId | null }) {
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
  return <LiveBenchmarking activeMetric={activeMetric} />;
}
