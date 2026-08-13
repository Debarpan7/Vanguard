"use client";

import { useState } from "react";
import Link from "next/link";
import {
  headlineMetrics,
  metricMeta,
  type MetricId,
} from "@/data/fact-base";
import { BenchmarkTable } from "@/components/benchmark-table";
import { SurfaceCard } from "@/components/surface";

interface BenchmarkingExplorerProps {
  /** Metric selected via ?metric= (stable URL state), or null for all. */
  activeMetric: MetricId | null;
}

function tabClass(active: boolean): string {
  return `border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-zinc-900 text-zinc-950 dark:border-zinc-100 dark:text-zinc-50"
      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
  }`;
}

/**
 * The interactive benchmarking view: metric tabs (URL-driven, shareable),
 * a firm search box, and one comparison table per visible metric (ticket 14).
 */
export function BenchmarkingExplorer({
  activeMetric,
}: BenchmarkingExplorerProps) {
  const [firmFilter, setFirmFilter] = useState("");
  const metrics: MetricId[] = activeMetric
    ? [activeMetric]
    : [...headlineMetrics];

  return (
    <div className="mt-10">
      <nav
        aria-label="Metric filter"
        className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800"
      >
        <Link
          href="/benchmarking"
          aria-current={activeMetric === null ? "page" : undefined}
          className={tabClass(activeMetric === null)}
        >
          All metrics
        </Link>
        {headlineMetrics.map((metric) => (
          <Link
            key={metric}
            href={`/benchmarking?metric=${metric}`}
            aria-current={activeMetric === metric ? "page" : undefined}
            className={tabClass(activeMetric === metric)}
          >
            {metricMeta[metric].name}
          </Link>
        ))}
      </nav>

      <SurfaceCard className="mt-6 max-w-md p-4">
        <label htmlFor="benchmarking-firm-search" className="sr-only">
          Filter firms
        </label>
        <input
          id="benchmarking-firm-search"
          type="search"
          value={firmFilter}
          onChange={(event) => setFirmFilter(event.target.value)}
          placeholder="Filter firms — e.g., BlackRock"
          data-testid="benchmarking-firm-search"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </SurfaceCard>

      {metrics.map((metric) => (
        <BenchmarkTable
          key={metric}
          metric={metric}
          firmFilter={firmFilter}
        />
      ))}
    </div>
  );
}
