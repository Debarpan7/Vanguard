import { allFirms, firmMeta } from "@/data/fact-base";
import {
  ownershipCaveat,
  ownershipLabel,
  peerSetAvailabilityNote,
  peerSetBasisOfComparison,
  peerSetMembershipRules,
} from "@/lib/peer-set";
import { SurfaceCard } from "@/components/surface";

/**
 * The peer set panel — who Vanguard is benchmarked against, the membership
 * rules that define the set (decision: ticket 04), and the caveats that
 * travel with every comparison. Server-rendered, alongside the tables.
 */
export function PeerSetPanel() {
  return (
    <SurfaceCard
      data-testid="peer-set-panel"
      className="mt-8"
    >
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Peer set
      </h2>
      <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        The five peers benchmarked against Vanguard, defined by the membership
        rules below:
      </p>
      <ul className="mt-3 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {allFirms.slice(1).map((firm) => (
          <li
            key={firm}
            className="border-l-2 border-vanguard-red-300 py-2 pl-3 dark:border-vanguard-red-700"
          >
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {firmMeta[firm].name}
            </span>{" "}
            <span className="block text-xs text-zinc-400 dark:text-zinc-500">
              {ownershipLabel[firmMeta[firm].ownership]}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Membership rules
      </h3>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {peerSetMembershipRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>

      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Basis of comparison
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {peerSetBasisOfComparison}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {peerSetAvailabilityNote}
      </p>

      <p
        data-testid="ownership-caveat"
        className="mt-4 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
      >
        {ownershipCaveat}
      </p>
    </SurfaceCard>
  );
}
