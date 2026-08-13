"use client";

import {
  allFirms,
  firmMeta,
  isAuditedMetric,
  metricMeta,
  seriesFor,
  trendYears,
  type MetricId,
  type SeriesPoint,
} from "@/lib/fact-base";
import { formatValue, qualificationText } from "@/lib/format";
import {
  ownershipCaveat,
  ownershipLabel,
  voluntarySideDataNote,
} from "@/lib/peer-set";
import { CsvExportButton } from "@/components/csv-export-button";
import { CopyLinkButton } from "@/components/copy-link-button";
import { SurfaceCard, TablePanel } from "@/components/surface";

interface BenchmarkTableProps {
  metric: MetricId;
  /** Case-insensitive firm filter from the explorer's search box. */
  firmFilter: string;
  /** Shareable href for the copy-link button — defaults to the benchmarking
   * view; other surfaces (e.g., the RoE comparison page) pass their own. */
  copyHref?: string;
}

/** Cell text distinguishes the two gap kinds: peers are pending collection
 * (ticket 17 pipeline), Vanguard gaps are not published. Never invented. */
function cellText(metric: MetricId, point: SeriesPoint, unit: string): string {
  if (point.value === null && point.verification === "pending-collection") {
    return "Pending collection";
  }
  return formatValue(metric, point.value, unit);
}

/**
 * One metric compared against the peer set over the 5 years (ticket 14).
 * Rows are firms (Vanguard first, then the core peer set); columns are
 * fiscal years; every cell is a literal fact or an explicit gap label from
 * the fact base. The ownership caveat and a CSV export travel with the table.
 */
export function BenchmarkTable({
  metric,
  firmFilter,
  copyHref,
}: BenchmarkTableProps) {
  const meta = metricMeta[metric];
  const query = firmFilter.trim().toLowerCase();
  const firms = allFirms.filter(
    (firm) =>
      // Fidelity publishes voluntary statistics only — excluded from
      // audited-metric comparisons (ticket 04), shown as side data instead.
      (firm !== "fidelity" || !isAuditedMetric(metric)) &&
      firmMeta[firm].name.toLowerCase().includes(query),
  );

  const csvHeaders = [
    "Firm",
    "Ownership",
    "Qualification",
    "Scope",
    "Unit",
    ...trendYears.map((y) => `FY${y}`),
  ];
  const csvRows = firms.map((firm) => {
    const series = seriesFor(metric, firm);
    const representativePoint =
      series.points.find((point) => point.value !== null) ?? series.points[0];
    // Key by year rather than index — points stay aligned however the fact
    // base is reordered (review note: index coupling).
    const cellByYear = new Map(
      series.points.map((point) => [point.year, cellText(metric, point, series.unit)]),
    );
    return [
      firmMeta[firm].name,
      ownershipLabel[firmMeta[firm].ownership],
      qualificationText(representativePoint),
      representativePoint.issuerScope ?? "",
      series.unit,
      ...trendYears.map((year) => cellByYear.get(year) ?? ""),
    ];
  });

  return (
    <SurfaceCard
      data-testid={`benchmark-table-${metric}`}
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
            filename={`benchmark-${metric}-2021-2025.csv`}
            headers={csvHeaders}
            rows={csvRows}
            testId={`export-benchmark-${metric}`}
          />
          <CopyLinkButton
            href={copyHref ?? `/benchmarking?metric=${metric}`}
            testId={`copy-benchmark-${metric}`}
          />
        </div>
      </div>
      <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {seriesFor(metric, "vanguard").definition}
      </p>

      <TablePanel className="mt-4 border-0 bg-transparent p-0 shadow-none dark:bg-transparent">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {meta.name} compared against the peer set, FY2021–FY2025
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th scope="col" className="py-2 pr-4 font-medium">
                Firm
              </th>
              {trendYears.map((year) => (
                <th
                  key={year}
                  scope="col"
                  className="py-2 pr-4 text-right font-medium"
                >
                  FY{year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {firms.map((firm) => {
              const series = seriesFor(metric, firm);
              return (
                <tr
                  key={firm}
                  data-testid={`benchmark-row-${firm}`}
                  className="border-b border-zinc-100 align-top dark:border-zinc-900"
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    {firmMeta[firm].name}{" "}
                    <span className="block text-xs font-normal leading-5 text-zinc-400 dark:text-zinc-500">
                      {ownershipLabel[firmMeta[firm].ownership]} —{" "}
                      {firmMeta[firm].note}
                    </span>
                    <span className="block text-xs font-medium leading-5 text-amber-700 dark:text-amber-300">
                      {qualificationText(
                        series.points.find((point) => point.value !== null) ??
                          series.points[0],
                      )}
                      {series.points[0].issuerScope
                        ? ` — ${series.points[0].issuerScope}`
                        : ""}
                    </span>
                  </th>
                  {series.points.map((point) => (
                    <td
                      key={point.year}
                      data-testid={`benchmark-cell-${firm}-${point.year}`}
                      className={`py-2 pr-4 text-right ${
                        point.value === null
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "font-medium text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                        {cellText(metric, point, series.unit)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TablePanel>

      {isAuditedMetric(metric) && (
        <p
          data-testid={`voluntary-note-${metric}`}
          className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
        >
          {voluntarySideDataNote}.
        </p>
      )}

      <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {ownershipCaveat}
      </p>
    </SurfaceCard>
  );
}
