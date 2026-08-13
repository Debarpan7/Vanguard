import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { RoeTreeView } from "@/components/roe-tree";
import { trendYears } from "@/lib/fact-base";
import {
  roeTreeIds,
  roeTreeRoot,
  type RoeNodeId,
} from "@/data/roe-tree";

/** Resolves ?year= from the URL to a year inside the 5-year window, or null
 * (the page falls back to the latest fiscal year). */
function parseYear(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") return null;
  const year = Number(value);
  return trendYears.includes(year) ? year : null;
}

/** Resolves ?node= from the URL to a tree node, or null (the page falls
 * back to the root). */
function parseNode(value: string | string[] | undefined): RoeNodeId | null {
  if (typeof value !== "string") return null;
  return (roeTreeIds as readonly string[]).includes(value)
    ? (value as RoeNodeId)
    : null;
}

export default async function RoeTreePage({
  searchParams,
}: PageProps<"/roe-tree">) {
  const { year, node } = await searchParams;
  const activeYear = parseYear(year) ?? trendYears[trendYears.length - 1];
  const activeNode = parseNode(node) ?? roeTreeRoot;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          RoE tree
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Return on equity decomposed into its income-statement drivers across
          the 5 years — net income ÷ average equity — with drilldown into
          every driver node and each node traceable to the published number it
          derives from.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          This tree is Vanguard&apos;s, seeded from the fact base: Vanguard
          publishes no firm-level statements, so every node renders an explicit
          not-published gap with its source — figures are never invented.
          Peer-set trees arrive with the peer-set expansion (ticket 17).
        </p>
      </header>

      <RoeTreeView activeYear={activeYear} activeNode={activeNode} />
    </div>
  );
}
