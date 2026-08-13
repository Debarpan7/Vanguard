import { BenchmarkTable } from "@/components/benchmark-table";
import { firmMeta } from "@/lib/fact-base";
import type { LobRepresentative } from "@/data/roe-comparison";
import {
  lobComparisonDerivationDisclosure,
  lobComparisons,
} from "@/data/roe-comparison";
import { TablePanel } from "@/components/surface";

/** One representative's display text: firm name, "(voluntary)" for Fidelity.
 * RoE availability is a literal pending-collection gap until ticket 17 —
 * never an invented figure (ticket 06 answers 3B and 4). */
function repLabel(rep: LobRepresentative): string {
  const firm = firmMeta[rep.firm].name;
  const voluntary = rep.voluntary ? " (voluntary)" : "";
  return `${firm}${voluntary} — Pending collection`;
}

/**
 * The RoE comparison views (decision: ticket 06 — two sections, no year
 * selector; the RoE tree owns year drilldown). Section 1 reuses the
 * benchmark-table pattern for roe: rows Vanguard-first, columns FY2021–25,
 * every cell a literal fact or an explicit gap label ("Pending collection"
 * vs "Not published"), with the ownership caveat and Fidelity voluntary-side-
 * data note alongside. Section 2 compares Vanguard's line-of-business RoE
 * against the industries each line competes in, using the canonical 4-line
 * model (investment management / retirement / brokerage / advice — ticket 07)
 * with peer-set representatives and the derivation disclosure. All Vanguard LoB
 * cells are explicit not-published gaps — never invented (ticket 03).
 */
export function RoeComparisonView() {
  return (
    <div className="mt-10 space-y-12">
      <section
        id="peer-set"
        data-testid="peer-set-roe-section"
        className="scroll-mt-24"
        aria-label="Peer set RoE comparison"
      >
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Peer set
        </h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Vanguard&apos;s RoE against the peer set over the 5 years — same
          definitions, same fiscal-year labels (ticket 04).
        </p>
        <div className="mt-4">
          <BenchmarkTable
            metric="roe"
            firmFilter=""
            copyHref="/roe-comparison#peer-set"
          />
        </div>
      </section>

      <section
        id="lob-comparison"
        data-testid="lob-comparison-panel"
        className="scroll-mt-24"
        aria-label="Line-of-business RoE comparison by industry"
      >
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          By line of business
        </h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Vanguard&apos;s line-of-business RoE against the industry each line
          competes in (canonical 4-line model, ticket 07).
        </p>

        <aside
          data-testid="lob-derivation-disclosure"
          className="mt-4 rounded-[var(--radius-card)] border border-navy-200 bg-white p-4 text-xs leading-5 text-zinc-500 shadow-[var(--shadow-card)] dark:border-navy-800 dark:bg-navy-900 dark:text-zinc-400"
        >
          {lobComparisonDerivationDisclosure}
        </aside>

        <TablePanel className="mt-4">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Line-of-business RoE compared against each line&apos;s industry
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Line of business
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Industry
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Vanguard RoE
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Industry representatives
                </th>
              </tr>
            </thead>
            <tbody>
              {lobComparisons.map((lob) => (
                <tr
                  key={lob.id}
                  data-testid={`lob-row-${lob.id}`}
                  className="border-b border-zinc-100 align-top dark:border-zinc-900"
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    {lob.name}
                    <span className="block text-xs font-normal leading-5 text-zinc-400 dark:text-zinc-500">
                      {lob.definition}
                    </span>
                  </th>
                  <td
                    data-testid={`lob-row-${lob.id}-industry`}
                    className="py-2 pr-4 text-zinc-900 dark:text-zinc-100"
                  >
                    {lob.industry.name}
                  </td>
                  <td
                    data-testid={`lob-row-${lob.id}-vanguard`}
                    className="py-2 pr-4 text-zinc-400 dark:text-zinc-500"
                  >
                    Not published
                  </td>
                  <td
                    data-testid={`lob-row-${lob.id}-reps`}
                    className="py-2 pr-4 text-zinc-900 dark:text-zinc-100"
                  >
                    {lob.representatives.map(repLabel).join(", ")}
                    {lob.representatives.some((r) => r.deferredNote) ? (
                      <span className="block text-xs leading-5 text-zinc-400 dark:text-zinc-500">
                        {lob.representatives
                          .map((r) => r.deferredNote)
                          .filter(Boolean)
                          .join("; ")}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablePanel>
      </section>
    </div>
  );
}
