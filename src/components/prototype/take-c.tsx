"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { BenchmarkTable } from "@/components/benchmark-table";
import { navIcons } from "@/components/prototype/nav-icons";
import {
  analysisNarrative,
  analysisOpportunities,
  improvementLens,
} from "@/data/analysis";
import {
  allFirms,
  firmMeta,
  headlineMetrics,
  metricMeta,
  type MetricId,
} from "@/data/fact-base";
import {
  ownershipCaveat,
  ownershipLabel,
  peerSetAvailabilityNote,
  peerSetBasisOfComparison,
  peerSetMembershipRules,
} from "@/lib/peer-set";
import { navLinks, site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Take C — "Gold-forward split". Split hero panel (navy + gold), gold */
/* gradient pill for the active nav, gradient-ribbon cards, gradient   */
/* text. The most colour-forward of the three takes.                   */
/* ------------------------------------------------------------------ */

const [brandFirst, ...brandRest] = site.name.split(" ");

export function TakeCShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TakeCHeader />
      <main className="flex-1">{children}</main>
      <TakeCFooter />
    </>
  );
}

function TakeCHeader() {
  const pathname = usePathname();
  return (
    <header className="bg-white dark:bg-navy-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link
          href="/"
          className="flex items-baseline gap-1 text-lg font-semibold tracking-tight text-navy-900 dark:text-navy-50"
        >
          {brandFirst}
          {/* Light mode: gold-700/800 stops keep AA ≥ 4.5 on white; the
              bright gold gradient is reserved for dark mode where the
              navy-950 ground gives it ample contrast. */}
          <span className="bg-linear-to-r from-gold-700 to-gold-800 bg-clip-text text-transparent dark:from-gold-300 dark:via-gold-400 dark:to-gold-300">
            {brandRest.join(" ")}
          </span>
        </Link>
        <nav aria-label="Sections" className="flex flex-wrap items-center gap-1">
          {navLinks.map((link) => {
            const active =
              pathname === link.path || pathname.startsWith(`${link.path}/`);
            const Icon = navIcons[link.path];
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-linear-to-r from-gold-300 to-gold-500 text-navy-950 shadow-sm"
                    : "text-navy-600 hover:bg-gold-100 hover:text-navy-900 dark:text-navy-200 dark:hover:bg-navy-800 dark:hover:text-navy-50"
                }`}
              >
                <Icon
                  aria-hidden
                  className={`size-4 ${
                    active
                      ? "text-navy-900"
                      : "text-gold-600 dark:text-gold-400"
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div
        aria-hidden
        className="h-0.5 bg-linear-to-r from-gold-300 via-gold-500 to-gold-300"
      />
    </header>
  );
}

function TakeCFooter() {
  return (
    <footer className="border-t border-gold-400 bg-white dark:bg-navy-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-xs text-navy-500 dark:text-navy-300">
        <p>
          Internal reference only — not client-facing. Data from public sources.
        </p>
        <DataAsOfMarker />
      </div>
    </footer>
  );
}

export function TakeCHome() {
  return (
    <div className="bg-white dark:bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero — one rounded card split into navy and gold panels. */}
        <section className="overflow-hidden rounded-2xl shadow-lg lg:grid lg:grid-cols-5">
          <div className="relative bg-linear-to-br from-navy-900 via-navy-950 to-navy-900 p-10 lg:col-span-3">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_85%_0%,rgba(220,171,69,0.18),transparent_60%)]"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                Internal reference
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                {site.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-navy-100/85">
                {site.tagline}
              </p>
              <p className="mt-5 flex items-center gap-1.5 text-sm text-gold-200">
                <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
                Data-as-of: <DataAsOfMarker />
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 bg-linear-to-br from-gold-200 via-gold-300 to-gold-400 p-10 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-800">
              Why it matters
            </p>
            <p className="text-2xl font-semibold leading-snug text-navy-900">
              Client-owned — no shareholders, no listed equity.
            </p>
            <p className="text-sm leading-6 text-navy-800">
              The peer set is listed (BlackRock, State Street, Invesco, Amundi)
              or private (Fidelity). Ownership shapes capital structure, cost
              of capital, and profitability — compare with care.
            </p>
          </div>
        </section>

        <TakeCAnalysis />

        <section aria-label="Sections" className="mt-12">
          <span
            aria-hidden
            className="block h-0.5 w-10 rounded-full bg-linear-to-r from-gold-400 to-gold-600"
          />
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
            Explore the sections
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {navLinks.map((link, index) => {
              const Icon = navIcons[link.path];
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="group flex items-center gap-4 rounded-lg border border-navy-100 bg-white p-4 transition-all hover:border-gold-300 hover:shadow-md dark:border-navy-800 dark:bg-navy-900 dark:hover:border-gold-600"
                >
                  <span className="font-mono text-2xl text-gold-500/70 transition-colors group-hover:text-gold-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-navy-50 text-navy-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700 dark:bg-navy-950 dark:text-navy-200 dark:group-hover:bg-gold-900/40 dark:group-hover:text-gold-300">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span>
                    <span className="block font-medium text-navy-900 dark:text-navy-50">
                      {link.name}
                    </span>
                    <span className="block text-sm text-navy-500 dark:text-navy-300">
                      Opens the {link.name.toLowerCase()} section.
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export function TakeCBenchmarking({
  activeMetric,
}: {
  activeMetric: MetricId | null;
}) {
  const [firmFilter, setFirmFilter] = useState("");

  return (
    <div className="bg-white dark:bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
            Peer comparisons
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
            Benchmarking
          </h1>
          <span
            aria-hidden
            className="mt-3 block h-1 w-24 rounded-full bg-linear-to-r from-gold-300 via-gold-400 to-gold-500"
          />
          <p className="mt-4 text-lg leading-8 text-navy-600 dark:text-navy-200">
            Each headline metric compared against the peer set over the 5 years
            — with membership rules and the ownership caveat displayed
            alongside every comparison.
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-500 dark:text-navy-300">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </header>

        <TakeCPeerSet />

        <TakeCExplorer
          activeMetric={activeMetric}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
        />
      </div>
    </div>
  );
}

/* Shared pieces ------------------------------------------------------- */

function SectionHeadingC({
  title,
  chip,
}: {
  title: string;
  chip: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center rounded-full bg-linear-to-r from-gold-300 to-gold-500 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-navy-950">
        {chip}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
        {title}
      </h2>
    </div>
  );
}

function RibbonCardC({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
      <div
        aria-hidden
        className="h-1 bg-linear-to-r from-gold-300 via-gold-400 to-gold-500"
      />
      <div className="p-4">{children}</div>
    </div>
  );
}

function TakeCAnalysis() {
  return (
    <div className="mt-12 max-w-3xl">
      <section aria-label="How Vanguard is faring">
        <SectionHeadingC
          chip="01"
          title={analysisNarrative.title}
        />
        <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-200">
          {analysisNarrative.intro}
        </p>

        <div className="mt-6 space-y-4">
          {analysisNarrative.reads.map((read) => (
            <RibbonCardC key={read.heading}>
              <h3 className="font-medium text-navy-900 dark:text-navy-50">
                {read.heading}
              </h3>
              <p className="mt-1 text-sm leading-6 text-navy-600 dark:text-navy-200">
                {read.body}
              </p>
            </RibbonCardC>
          ))}
        </div>

        <p className="mt-4 text-sm italic text-navy-500 dark:text-navy-300">
          {analysisNarrative.caveat}
        </p>
      </section>

      <section className="mt-10" aria-label="Improvement opportunities">
        <SectionHeadingC chip="02" title="Improvement opportunities" />
        <div className="mt-6 space-y-4">
          {analysisOpportunities.map((opportunity) => (
            <RibbonCardC key={opportunity.id}>
              <h3 className="font-medium text-navy-900 dark:text-navy-50">
                {opportunity.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-navy-600 dark:text-navy-200">
                {opportunity.claim}
              </p>
              <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-200">
                <span className="font-medium text-gold-700 dark:text-gold-400">
                  Evidence:
                </span>{" "}
                {opportunity.evidence
                  .map((metric) => metricMeta[metric].name)
                  .join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-200">
                <span className="font-medium text-gold-700 dark:text-gold-400">
                  Read:
                </span>{" "}
                {opportunity.read}
              </p>
            </RibbonCardC>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-label="Improvement lens">
        <SectionHeadingC chip="03" title="Improvement lens" />
        <p className="mt-3 rounded-lg border border-navy-100 bg-navy-50 p-4 text-base leading-7 text-navy-700 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-100">
          {improvementLens}
        </p>
      </section>
    </div>
  );
}

function TakeCPeerSet() {
  return (
    <section
      data-testid="peer-set-panel"
      className="mt-8 overflow-hidden rounded-lg border border-navy-100 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900"
    >
      <div
        aria-hidden
        className="h-1 bg-linear-to-r from-gold-300 via-gold-400 to-gold-500"
      />
      <div className="p-5">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">
          Peer set
        </h2>
        <p className="mt-1 text-sm leading-6 text-navy-500 dark:text-navy-300">
          The five peers benchmarked against Vanguard, defined by the
          membership rules below:
        </p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {allFirms.slice(1).map((firm) => (
            <li
              key={firm}
              className="rounded-md border border-navy-100 p-3 dark:border-navy-800"
            >
              <span className="font-medium text-navy-900 dark:text-navy-50">
                {firmMeta[firm].name}
              </span>{" "}
              <span className="block text-xs text-navy-400 dark:text-navy-300">
                {ownershipLabel[firmMeta[firm].ownership]}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-300">
          Membership rules
        </h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-navy-600 dark:text-navy-200">
          {peerSetMembershipRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-300">
          Basis of comparison
        </h3>
        <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-200">
          {peerSetBasisOfComparison}
        </p>
        <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-200">
          {peerSetAvailabilityNote}
        </p>

        <p
          data-testid="ownership-caveat"
          className="mt-4 rounded-md border-l-4 border-gold-400 bg-navy-50 p-3 text-sm leading-6 text-navy-700 dark:border-gold-500 dark:bg-navy-950 dark:text-navy-200"
        >
          {ownershipCaveat}
        </p>
      </div>
    </section>
  );
}

function TakeCExplorer({
  activeMetric,
  firmFilter,
  onFirmFilterChange,
}: {
  activeMetric: MetricId | null;
  firmFilter: string;
  onFirmFilterChange: (value: string) => void;
}) {
  const metrics: MetricId[] = activeMetric
    ? [activeMetric]
    : [...headlineMetrics];

  return (
    <div className="mt-10">
      <nav
        aria-label="Metric filter"
        className="flex flex-wrap gap-1 border-b border-navy-100 dark:border-navy-800"
      >
        <Link
          href="/benchmarking"
          aria-current={activeMetric === null ? "page" : undefined}
          className={tabClassC(activeMetric === null)}
        >
          All metrics
        </Link>
        {headlineMetrics.map((metric) => (
          <Link
            key={metric}
            href={`/benchmarking?metric=${metric}`}
            aria-current={activeMetric === metric ? "page" : undefined}
            className={tabClassC(activeMetric === metric)}
          >
            {metricMeta[metric].name}
          </Link>
        ))}
      </nav>

      <div className="mt-6 max-w-md">
        <label htmlFor="benchmarking-firm-search" className="sr-only">
          Filter firms
        </label>
        <input
          id="benchmarking-firm-search"
          type="search"
          value={firmFilter}
          onChange={(event) => onFirmFilterChange(event.target.value)}
          placeholder="Filter firms — e.g., BlackRock"
          data-testid="benchmarking-firm-search"
          className="w-full rounded-md border border-gold-300 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:placeholder:text-navy-400"
        />
      </div>

      {metrics.map((metric) => (
        <BenchmarkTable key={metric} metric={metric} firmFilter={firmFilter} />
      ))}
    </div>
  );
}

function tabClassC(active: boolean): string {
  return `border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-gold-500 text-gold-700 dark:border-gold-400 dark:text-gold-300"
      : "border-transparent text-navy-500 hover:border-gold-300 hover:text-navy-800 dark:text-navy-300 dark:hover:border-gold-600 dark:hover:text-navy-100"
  }`;
}
