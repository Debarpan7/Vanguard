"use client";

import {
  latestPublishedPoint,
  metricMeta,
  seriesFor,
  type MetricId,
} from "@/lib/fact-base";
import { formatAsOf, formatValue } from "@/lib/format";
import { CsvExportButton } from "@/components/csv-export-button";
import { CopyLinkButton } from "@/components/copy-link-button";
import { SurfaceCard, TablePanel } from "@/components/surface";

/**
 * A headline metric card: latest published value (with as-of), the metric
 * definition, and the 5-year trend — every row traceable to its source.
 * Data comes from the fact base (src/data/fact-base.ts), never hardcoded here.
 * The card is a client component so it can offer CSV export and a stable
 * shareable link (ticket 19); the section id doubles as the anchor target.
 */
export function MetricCard({ metric }: { metric: MetricId }) {
  const meta = metricMeta[metric];
  const series = seriesFor(metric, "vanguard");
  const latest = latestPublishedPoint(metric, "vanguard");

  const csvHeaders = ["Fiscal year", "Value", "Unit", "Source", "Note"];
  const csvRows = series.points.map((point) => [
    point.year,
    formatValue(metric, point.value),
    series.unit,
    point.source,
    point.note ?? "",
  ]);

  return (
    <SurfaceCard
      id={metric}
      data-testid={`metric-card-${metric}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {meta.name}
          <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {meta.unit}
          </span>
        </h2>
        <div className="flex gap-2">
          <CsvExportButton
            filename={`vanguard-${metric}-trend-2021-2025.csv`}
            headers={csvHeaders}
            rows={csvRows}
            testId={`export-metric-${metric}`}
          />
          <CopyLinkButton
            href={`/metrics#${metric}`}
            testId={`copy-metric-${metric}`}
          />
        </div>
      </div>
      <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {series.definition}
      </p>

      <div className="mt-4">
        {latest ? (
          <>
            <span
              data-testid="metric-value"
              className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              {formatValue(metric, latest.value)}
            </span>
            <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
              {latest.asOf
                ? `As of ${formatAsOf(latest.asOf)}`
                : `Fiscal year ${latest.year}`}
            </span>
          </>
        ) : (
          <span
            data-testid="metric-value"
            className="text-2xl font-semibold tracking-tight text-zinc-400 dark:text-zinc-500"
          >
            Not published
          </span>
        )}
      </div>

      <TablePanel className="mt-4 border-0 bg-transparent p-0 shadow-none dark:bg-transparent">
        <table className="w-full text-left text-sm">
        <caption className="sr-only">
          {meta.name} 5-year trend with sources
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th scope="col" className="py-2 pr-4 font-medium">
              Fiscal year
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Value
            </th>
            <th scope="col" className="py-2 font-medium">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {series.points.map((point) => (
            <tr
              key={point.year}
              data-testid={`trend-${point.year}`}
              className="border-b border-zinc-100 align-top dark:border-zinc-900"
            >
              <td className="py-2 pr-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                FY{point.year}
              </td>
              <td className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                {formatValue(metric, point.value)}
              </td>
              <td className="py-2 text-zinc-500 dark:text-zinc-400">
                <a
                  href={point.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-800 dark:decoration-zinc-700 dark:hover:text-zinc-200"
                >
                  {point.source}
                </a>
                {point.note ? (
                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                    {point.note}
                  </p>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </TablePanel>
    </SurfaceCard>
  );
}
