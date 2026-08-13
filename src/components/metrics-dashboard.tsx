"use client";

import { useState } from "react";
import { headlineMetrics, metricMeta, type MetricId } from "@/lib/fact-base";
import { MetricCard } from "@/components/metric-card";
import { SurfaceCard } from "@/components/surface";

/** Case-insensitive match on name, unit, and definition. */
function matchesQuery(metric: MetricId, query: string): boolean {
  if (!query) return true;
  const meta = metricMeta[metric];
  const haystack = `${meta.name} ${meta.unit} ${meta.definition}`.toLowerCase();
  return haystack.includes(query);
}

/**
 * The metrics dashboard (ticket 19): a search box that filters the metric
 * cards across name, unit, and definition. Rendering is derived purely from
 * the fact base — the search narrows, never invents.
 */
export function MetricsDashboard() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = headlineMetrics.filter((metric) =>
    matchesQuery(metric, normalized),
  );

  return (
    <>
      <SurfaceCard className="mt-6 max-w-md p-4">
        <label htmlFor="metrics-search" className="sr-only">
          Search metrics
        </label>
        <input
          id="metrics-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search metrics — e.g., revenue, return on equity"
          data-testid="metrics-search"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </SurfaceCard>

      {visible.length === 0 ? (
        <p
          data-testid="metrics-empty"
          className="mt-10 text-sm text-zinc-500 dark:text-zinc-400"
        >
          No metrics match “{query}”.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {visible.map((metric) => (
            <MetricCard key={metric} metric={metric} />
          ))}
        </div>
      )}
    </>
  );
}
