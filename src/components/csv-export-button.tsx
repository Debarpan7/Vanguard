"use client";

interface CsvExportButtonProps {
  /** Download filename, e.g. "vanguard-aum-trend-2021-2025.csv". */
  filename: string;
  headers: readonly string[];
  rows: readonly (readonly (string | number | null)[])[];
  testId: string;
  label?: string;
}

/** Escapes a cell for RFC-4180-style CSV. */
function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Client button that downloads `rows` as a CSV file (ticket 19, story 26).
 * Used by the metric cards and the benchmarking comparison tables so every
 * table can be exported without a server round-trip.
 */
export function CsvExportButton({
  filename,
  headers,
  rows,
  testId,
  label = "Export CSV",
}: CsvExportButtonProps) {
  const handleClick = () => {
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Revoke well after the download starts — revoking too early can cancel
    // an in-flight download (observed in Chromium under parallel E2E load).
    // The blobs are tiny (KB-scale CSVs), so 30s retention is negligible.
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={handleClick}
      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
    >
      {label}
    </button>
  );
}
