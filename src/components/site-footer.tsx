import { DataAsOfMarker } from "@/components/data-as-of-marker";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
        <p>
          Internal reference only — not client-facing. Data from public sources.
        </p>
        <DataAsOfMarker />
      </div>
    </footer>
  );
}
