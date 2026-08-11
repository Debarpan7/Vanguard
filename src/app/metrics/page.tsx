import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { MetricCard } from "@/components/metric-card";
import { headlineMetrics } from "@/data/fact-base";

export default function MetricsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Metrics
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Vanguard&apos;s five headline metrics — each with its latest
          published value, definition, unit, source, and 5-year trend from the
          fact base.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Where a metric is not published by Vanguard (revenue, RoE), the gap
          is shown explicitly — nothing on this site is estimated silently.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {headlineMetrics.map((metric) => (
          <MetricCard key={metric} metric={metric} />
        ))}
      </div>
    </div>
  );
}
