import Link from "next/link";
import {
  roeNodeFor,
  roeYearDelta,
  type RoeNode,
  type RoeNodeId,
} from "@/data/roe-tree";
import { seriesFor, trendYears } from "@/lib/fact-base";
import { formatAsOf } from "@/lib/format";
import { SurfaceCard, TablePanel } from "@/components/surface";

interface RoeTreeViewProps {
  /** Fiscal year selected via ?year= (stable URL state), latest by default. */
  activeYear: number;
  /** Node opened via ?node= (stable URL state), root by default. */
  activeNode: RoeNodeId;
}

/** Formats a node value per its unit — null is always the explicit gap
 * label, mirroring formatValue in the fact base (never an invented number). */
function formatNodeValue(node: RoeNode, value: number | null): string {
  if (value === null) return "Not published";
  return node.unit === "%" ? `${value.toFixed(1)}%` : `$${value.toFixed(1)}B`;
}

/** The signed year-over-year change, or an em dash when a gap — the tree
 * never fabricates a change for an unpublished point. */
function formatDelta(node: RoeNode, year: number): string {
  const delta = roeYearDelta(node, year);
  if (delta === null) return "—";
  return delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
}

/** One node of the decomposition, rendered recursively (root first) with its
 * value and change for the selected year, plus any labeled published context. */
function RoeNodeCard({
  node,
  activeYear,
  depth,
}: {
  node: RoeNode;
  activeYear: number;
  depth: number;
}) {
  const point =
    node.points.find((p) => p.year === activeYear) ??
    node.points[node.points.length - 1];

  return (
    <li data-testid={`roe-node-${node.id}`}>
      <SurfaceCard
        className={depth === 0 ? "border-navy-300 dark:border-navy-700" : ""}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Link
            href={`/roe-tree?year=${activeYear}&node=${node.id}`}
            className="text-sm font-medium text-zinc-950 hover:underline dark:text-zinc-50"
          >
            {node.name}
          </Link>
          <div className="flex items-baseline gap-2 text-sm">
            <span
              data-testid={`roe-node-${node.id}-value`}
              className="font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {formatNodeValue(node, point.value)}
            </span>
            <span
              data-testid={`roe-node-${node.id}-delta`}
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              {formatDelta(node, activeYear)}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              vs prior year
            </span>
          </div>
        </div>
        {node.contextNote ? (
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {node.contextNote}
          </p>
        ) : null}
      </SurfaceCard>
      {node.children && node.children.length > 0 ? (
        <ul className="ml-4 mt-4 space-y-4 border-l border-zinc-200 pl-4 dark:border-zinc-800">
          {node.children.map((childId) => (
            <RoeNodeCard
              key={childId}
              node={roeNodeFor(childId)}
              activeYear={activeYear}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** The Vanguard RoE tree (decision: ticket 05 — income-statement drilldown):
 * the decomposition rendered across the 5 years with a year selector, the
 * labeled AUM context attached (never a node), and a drilldown detail panel
 * for the opened node with its definition, source, gap reason, and series. */
export function RoeTreeView({ activeYear, activeNode }: RoeTreeViewProps) {
  const root = roeNodeFor("roe");
  const detail = roeNodeFor(activeNode);
  const aumPoints = seriesFor("aum", "vanguard").points.filter(
    (p) => p.value !== null,
  );

  return (
    <div className="mt-10">
      <nav
        aria-label="Fiscal year"
        className="flex flex-wrap items-center gap-1 border-b border-zinc-200 dark:border-zinc-800"
      >
        <span className="mr-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Fiscal year:
        </span>
        {trendYears.map((year) => (
          <Link
            key={year}
            href={`/roe-tree?year=${year}`}
            data-testid={`roe-tree-year-${year}`}
            aria-current={year === activeYear ? "true" : undefined}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              year === activeYear
                ? "border-zinc-900 text-zinc-950 dark:border-zinc-100 dark:text-zinc-50"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {year}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <ul className="space-y-4">
            <RoeNodeCard node={root} activeYear={activeYear} depth={0} />
          </ul>

          <p
            data-testid="roe-tree-aum-context"
            className="mt-6 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            Attached as context (AUM is not a node of the decomposition):
            Vanguard&apos;s published AUM —{" "}
            {aumPoints
              .map(
                (p) =>
                  `$${p.value?.toFixed(1)}T as of ${
                    p.asOf ? formatAsOf(p.asOf) : p.year
                  }`,
              )
              .join("; ")}{" "}
            — the last firm AUM published on vanguard.com.
          </p>
        </div>

        <SurfaceCard
          data-testid={`roe-node-detail-${detail.id}`}
          aria-label={`${detail.name} — detail`}
          className="h-fit"
        >
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {detail.name}
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Definition
              </dt>
              <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
                {detail.definition}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Unit
              </dt>
              <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
                {detail.unit}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Derives from
              </dt>
              <dd className="mt-1">
                <a
                  data-testid={`roe-node-detail-${detail.id}-source`}
                  href={detail.points[0].sourceUrl}
                  className="text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600"
                >
                  {detail.points[0].source}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                Gap reason
              </dt>
              <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
                {detail.points[0].note}
              </dd>
            </div>
          </dl>

          <TablePanel className="mt-5 border-0 bg-transparent p-0 shadow-none dark:bg-transparent">
          <table
            data-testid={`roe-series-${detail.id}`}
            className="w-full border-collapse text-left text-sm"
          >
            <caption className="sr-only">
              {detail.name} by fiscal year
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                  Fiscal year
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                  Value
                </th>
                <th scope="col" className="py-2 font-medium text-zinc-500 dark:text-zinc-400">
                  Provenance
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.points.map((p) => (
                <tr
                  key={p.year}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    {p.year}
                  </th>
                  <td
                    data-testid={`roe-series-${detail.id}-value-${p.year}`}
                    className="py-2 pr-4 text-zinc-900 dark:text-zinc-100"
                  >
                    {formatNodeValue(detail, p.value)}
                  </td>
                  <td className="py-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {p.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </TablePanel>
        </SurfaceCard>
      </div>
    </div>
  );
}
