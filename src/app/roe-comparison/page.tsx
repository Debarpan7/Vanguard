import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { RoeComparisonView } from "@/components/roe-comparison";

export default function RoeComparisonPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          RoE comparisons
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Vanguard&apos;s return on equity against the peer set over the 5
          years, and line-of-business RoE against the industries each line
          competes in — with the ownership caveat and the line-of-business
          derivation disclosure.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Seeded from the fact base: Vanguard publishes no firm-level
          statements, so its RoE renders as an explicit not-published gap —
          figures are never invented. Peer RoE and industry-representative
          cells arrive with the peer-set expansion (ticket 17).
        </p>
      </header>

      <RoeComparisonView />
    </div>
  );
}
