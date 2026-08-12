"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown } from "lucide-react";
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
/* Take B — "Deep navy editorial". Full-bleed navy hero band with a    */
/* radial gold glow, numbered editorial sections, gold rules, quote-   */
/* style lens. Structurally the most different from the live site.     */
/* ------------------------------------------------------------------ */

export function TakeBShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TakeBHeader />
      <main className="flex-1">{children}</main>
      <TakeBFooter />
    </>
  );
}

function TakeBHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-gold-500/40 bg-linear-to-b from-navy-950 via-navy-900 to-navy-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span
            aria-hidden
            className="size-2.5 rotate-45 bg-linear-to-br from-gold-300 to-gold-600"
          />
          {site.name}
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
                className={`group relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-gold-300"
                    : "text-navy-100/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  aria-hidden
                  className={`size-4 transition-colors ${
                    active
                      ? "text-gold-400"
                      : "text-navy-200/60 group-hover:text-gold-300"
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

function TakeBFooter() {
  return (
    <footer className="border-t border-gold-500/30 bg-navy-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-xs text-navy-100/70">
        <p>
          Internal reference only — not client-facing. Data from public sources.
        </p>
        <DataAsOfMarker />
      </div>
    </footer>
  );
}

export function TakeBHome() {
  return (
    <div className="bg-white dark:bg-navy-950">
      {/* Hero — full-bleed navy band with a radial gold glow. */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_78%_-10%,rgba(220,171,69,0.22),transparent_62%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            Internal intelligence
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-tight text-white">
            {site.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-navy-100/85">
            {site.tagline}
          </p>
          <p className="mt-6 flex items-center gap-1.5 text-sm text-gold-200/90">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            Data-as-of: <DataAsOfMarker />
          </p>
          <a
            href="#analysis"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-linear-to-r from-gold-400 to-gold-600 px-4 py-2 text-sm font-medium text-navy-950 transition-opacity hover:opacity-90"
          >
            Read the analysis
            <ArrowDown aria-hidden className="size-4" />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <TakeBAnalysis />

        <section aria-label="Sections" className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400">
            04 — Explore
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {navLinks.map((link) => {
              const Icon = navIcons[link.path];
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="group border-t-2 border-navy-100 pt-3 transition-colors hover:border-gold-400 dark:border-navy-800 dark:hover:border-gold-500"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-md bg-navy-50 text-navy-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700 dark:bg-navy-900 dark:text-navy-200 dark:group-hover:bg-gold-900/40 dark:group-hover:text-gold-300">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <h2 className="mt-2 font-medium text-navy-900 dark:text-navy-50">
                    {link.name}
                  </h2>
                  <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">
                    Opens the {link.name.toLowerCase()} section.
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export function TakeBBenchmarking({
  activeMetric,
}: {
  activeMetric: MetricId | null;
}) {
  const [firmFilter, setFirmFilter] = useState("");

  return (
    <div className="bg-white dark:bg-navy-950">
      <section className="relative overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_80%_-20%,rgba(220,171,69,0.2),transparent_60%)]"
        />
        <header className="relative mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            Peer comparisons
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Benchmarking
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-navy-100/85">
            Each headline metric compared against the peer set over the 5 years
            — with membership rules and the ownership caveat displayed
            alongside every comparison.
          </p>
          <p className="mt-5 flex items-center gap-1.5 text-sm text-gold-200/90">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </header>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <TakeBPeerSet />

        <TakeBExplorer
          activeMetric={activeMetric}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
        />
      </div>
    </div>
  );
}

/* Shared pieces ------------------------------------------------------- */

function TakeBAnalysis() {
  return (
    <>
      <section aria-label="How Vanguard is faring" id="analysis">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400">
          01 — Narrative
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          {analysisNarrative.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-navy-600 dark:text-navy-200">
          {analysisNarrative.intro}
        </p>

        <div className="mt-8 space-y-8">
          {analysisNarrative.reads.map((read, index) => (
            <article
              key={read.heading}
              className="border-l-2 border-gold-400 pl-5 dark:border-gold-500"
            >
              <p className="font-mono text-xs text-gold-600 dark:text-gold-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-navy-900 dark:text-navy-50">
                {read.heading}
              </h3>
              <p className="mt-2 text-sm leading-7 text-navy-600 dark:text-navy-200">
                {read.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm italic text-navy-500 dark:text-navy-300">
          {analysisNarrative.caveat}
        </p>
      </section>

      <section className="mt-16" aria-label="Improvement opportunities">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400">
          02 — Opportunities
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          Improvement opportunities
        </h2>
        <div className="mt-6 space-y-4">
          {analysisOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900"
            >
              <h3 className="font-semibold text-navy-900 dark:text-navy-50">
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

      <section className="mt-16" aria-label="Improvement lens">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400">
          03 — Lens
        </p>
        <blockquote className="mt-3 border-l-4 border-gold-400 pl-5 dark:border-gold-500">
          <p className="text-xl leading-9 text-navy-800 dark:text-navy-100">
            {improvementLens}
          </p>
        </blockquote>
      </section>
    </>
  );
}

function TakeBPeerSet() {
  return (
    <section
      data-testid="peer-set-panel"
      className="mt-8 rounded-lg bg-navy-950 p-6 text-white shadow-lg dark:bg-navy-900"
    >
      <h2 className="text-lg font-semibold text-white">
        Peer set
        <span
          aria-hidden
          className="mt-1 block h-0.5 w-10 rounded-full bg-linear-to-r from-gold-300 to-gold-500"
        />
      </h2>
      <p className="mt-2 text-sm leading-6 text-navy-100/80">
        The five peers benchmarked against Vanguard, defined by the membership
        rules below:
      </p>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {allFirms.slice(1).map((firm) => (
          <li
            key={firm}
            className="rounded-md border border-navy-700 bg-navy-900 p-3 dark:bg-navy-950"
          >
            <span className="font-medium text-white">{firmMeta[firm].name}</span>{" "}
            <span className="block text-xs text-navy-200/70">
              {ownershipLabel[firmMeta[firm].ownership]}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        Membership rules
      </h3>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-navy-100/85">
        {peerSetMembershipRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        Basis of comparison
      </h3>
      <p className="mt-2 text-sm leading-6 text-navy-100/85">
        {peerSetBasisOfComparison}
      </p>
      <p className="mt-2 text-sm leading-6 text-navy-100/85">
        {peerSetAvailabilityNote}
      </p>

      <p
        data-testid="ownership-caveat"
        className="mt-4 rounded-md border-l-4 border-gold-400 bg-navy-900/70 p-3 text-sm leading-6 text-navy-50"
      >
        {ownershipCaveat}
      </p>
    </section>
  );
}

function TakeBExplorer({
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
          className={tabClassB(activeMetric === null)}
        >
          All metrics
        </Link>
        {headlineMetrics.map((metric) => (
          <Link
            key={metric}
            href={`/benchmarking?metric=${metric}`}
            aria-current={activeMetric === metric ? "page" : undefined}
            className={tabClassB(activeMetric === metric)}
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

function tabClassB(active: boolean): string {
  return `border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-gold-500 text-navy-900 dark:border-gold-400 dark:text-navy-50"
      : "border-transparent text-navy-500 hover:border-navy-300 hover:text-navy-800 dark:text-navy-300 dark:hover:border-navy-600 dark:hover:text-navy-100"
  }`;
}
