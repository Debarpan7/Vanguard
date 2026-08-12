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
/* Take A — "Classic institutional". Closest to the current structure: */
/* white content on a navy gradient header/footer, flat gold accents.  */
/* ------------------------------------------------------------------ */

export function TakeAShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TakeAHeader />
      <main className="flex-1">{children}</main>
      <TakeAFooter />
    </>
  );
}

function TakeAHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-navy-700/60 bg-linear-to-b from-navy-800 via-navy-900 to-navy-950 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span
            aria-hidden
            className="size-2.5 rounded-sm bg-linear-to-br from-gold-300 to-gold-600"
          />
          {site.name}
        </Link>
        <nav aria-label="Sections" className="flex flex-wrap items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.path || pathname.startsWith(`${link.path}/`);
            const Icon = navIcons[link.path];
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? "page" : undefined}
                className={`group relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-navy-100/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  aria-hidden
                  className={`size-4 transition-colors ${
                    active
                      ? "text-gold-300"
                      : "text-navy-200/70 group-hover:text-gold-300"
                  }`}
                />
                {link.name}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-linear-to-r from-gold-300 via-gold-400 to-gold-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function TakeAFooter() {
  return (
    <footer className="border-t border-gold-500/30 bg-linear-to-b from-navy-900 to-navy-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-xs text-navy-100/70">
        <p>
          Internal reference only — not client-facing. Data from public sources.
        </p>
        <DataAsOfMarker />
      </div>
    </footer>
  );
}

export function TakeAHome() {
  return (
    <div className="bg-white dark:bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
            Internal reference
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
            {site.name}
          </h1>
          <p className="mt-3 text-lg leading-8 text-navy-600 dark:text-navy-200">
            {site.tagline}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-500 dark:text-navy-300">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </section>

        <TakeAAnalysis />

        <section
          aria-label="Sections"
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {navLinks.map((link) => {
            const Icon = navIcons[link.path];
            return (
              <Link
                key={link.path}
                href={link.path}
                className="group rounded-lg border border-navy-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-md dark:border-navy-800 dark:bg-navy-900 dark:hover:border-gold-600"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-md bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300">
                  <Icon aria-hidden className="size-4" />
                </span>
                <h2 className="mt-3 font-medium text-navy-900 dark:text-navy-50">
                  {link.name}
                </h2>
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">
                  Opens the {link.name.toLowerCase()} section.
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export function TakeABenchmarking({
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
          <p className="mt-3 text-lg leading-8 text-navy-600 dark:text-navy-200">
            Each headline metric compared against the peer set over the 5 years
            — with membership rules and the ownership caveat displayed
            alongside every comparison.
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-500 dark:text-navy-300">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-500" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </header>

        <TakeAPeerSet />

        <TakeAExplorer
          activeMetric={activeMetric}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
        />
      </div>
    </div>
  );
}

/* Shared pieces ------------------------------------------------------- */

function TakeAAnalysis() {
  return (
    <div className="mt-10 max-w-3xl">
      <section aria-label="How Vanguard is faring">
        <span
          aria-hidden
          className="block h-0.5 w-10 rounded-full bg-linear-to-r from-gold-400 to-gold-600"
        />
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          {analysisNarrative.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-navy-600 dark:text-navy-200">
          {analysisNarrative.intro}
        </p>

        <div className="mt-6 space-y-4">
          {analysisNarrative.reads.map((read) => (
            <div
              key={read.heading}
              className="rounded-lg border border-navy-100 bg-white p-4 shadow-sm dark:border-navy-800 dark:bg-navy-900"
            >
              <h3 className="font-medium text-navy-900 dark:text-navy-50">
                {read.heading}
              </h3>
              <p className="mt-1 text-sm leading-6 text-navy-600 dark:text-navy-200">
                {read.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm italic text-navy-500 dark:text-navy-300">
          {analysisNarrative.caveat}
        </p>
      </section>

      <section className="mt-10" aria-label="Improvement opportunities">
        <span
          aria-hidden
          className="block h-0.5 w-10 rounded-full bg-linear-to-r from-gold-400 to-gold-600"
        />
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          Improvement opportunities
        </h2>
        <div className="mt-6 space-y-4">
          {analysisOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-lg border border-navy-100 border-l-4 border-l-gold-400 bg-white p-4 shadow-sm dark:border-navy-800 dark:border-l-gold-500 dark:bg-navy-900"
            >
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
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-label="Improvement lens">
        <span
          aria-hidden
          className="block h-0.5 w-10 rounded-full bg-linear-to-r from-gold-400 to-gold-600"
        />
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          Improvement lens
        </h2>
        <p className="mt-3 rounded-lg border border-navy-100 bg-navy-50 p-4 text-base leading-7 text-navy-700 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-100">
          {improvementLens}
        </p>
      </section>
    </div>
  );
}

function TakeAPeerSet() {
  return (
    <section
      data-testid="peer-set-panel"
      className="mt-8 rounded-lg border border-navy-100 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900"
    >
      <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-50">
        Peer set
      </h2>
      <p className="mt-1 text-sm leading-6 text-navy-500 dark:text-navy-300">
        The five peers benchmarked against Vanguard, defined by the membership
        rules below:
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
    </section>
  );
}

function TakeAExplorer({
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
          className={tabClassA(activeMetric === null)}
        >
          All metrics
        </Link>
        {headlineMetrics.map((metric) => (
          <Link
            key={metric}
            href={`/benchmarking?metric=${metric}`}
            aria-current={activeMetric === metric ? "page" : undefined}
            className={tabClassA(activeMetric === metric)}
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
          className="w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:placeholder:text-navy-400"
        />
      </div>

      {metrics.map((metric) => (
        <BenchmarkTable key={metric} metric={metric} firmFilter={firmFilter} />
      ))}
    </div>
  );
}

function tabClassA(active: boolean): string {
  return `border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-gold-500 text-navy-900 dark:border-gold-400 dark:text-navy-50"
      : "border-transparent text-navy-500 hover:border-navy-300 hover:text-navy-800 dark:text-navy-300 dark:hover:border-navy-600 dark:hover:text-navy-100"
  }`;
}
