"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, ChevronRight, Quote, Search } from "lucide-react";
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
  latestPublishedPoint,
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
/* Take B — "Deep navy editorial". Full-bleed navy hero band with      */
/* blueprint texture and radial gold glows, a serif display face       */
/* (--font-display) for editorial headlines, ghost serif numerals,     */
/* numbered sections with gold rules, a glass "At a glance" stat card  */
/* built from the real fact base, and hover-lift cards.                */
/* ------------------------------------------------------------------ */

const [brandFirst, ...brandRest] = site.name.split(" ");

/** Format an ISO as-of date like "Mar 31, 2022" (UTC, no shifting). */
function formatAsOf(asOf: string): string {
  return new Date(`${asOf}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Real Vanguard headline figures for the hero "At a glance" card. */
const glanceStats: ReadonlyArray<{
  metric: MetricId;
  label: string;
  suffix: string;
}> = [
  { metric: "aum", label: "Assets under management", suffix: "T" },
  { metric: "cost-ratio", label: "Cost ratio", suffix: "%" },
  { metric: "clients", label: "Investors", suffix: "M+" },
];

/** Serif brand lockup: "Vanguard" heavy, "Intelligence" light gold. */
function BrandB() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="size-2.5 rotate-45 bg-linear-to-br from-gold-300 to-gold-600 shadow-sm shadow-gold-900/40"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        {brandFirst}{" "}
        <span className="font-light text-gold-200/90">
          {brandRest.join(" ")}
        </span>
      </span>
    </Link>
  );
}

/** Editorial section kicker: ghost serif numeral + gold rule + label. */
function BKicker({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden
        className="font-display text-5xl font-semibold leading-none tracking-tight text-navy-900/[0.08] dark:text-white/[0.07]"
      >
        {index}
      </span>
      <span
        aria-hidden
        className="h-px w-10 bg-linear-to-r from-gold-400 to-transparent"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-400">
        {label}
      </p>
    </div>
  );
}

/** Thin gold rule with a diamond, used between editorial sections. */
function BSectionDivider() {
  return (
    <div aria-hidden className="my-16 flex items-center gap-3">
      <span className="h-px flex-1 bg-linear-to-r from-transparent via-navy-200 to-navy-300/60 dark:via-navy-700 dark:to-navy-600" />
      <span className="size-1.5 rotate-45 bg-gold-500/70" />
      <span className="h-px flex-1 bg-linear-to-r from-navy-300/60 via-navy-200 to-transparent dark:from-navy-600 dark:via-navy-700" />
    </div>
  );
}

/** Faint blueprint grid used over the navy hero bands. */
function BGridTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]"
    />
  );
}

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
    <header className="relative border-b border-white/10 bg-linear-to-b from-navy-950 via-navy-900 to-navy-950 shadow-lg shadow-navy-950/30">
      <div
        aria-hidden
        className="h-px bg-linear-to-r from-transparent via-gold-400/70 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3.5">
        <BrandB />
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
    <footer className="relative border-t border-white/10 bg-navy-950">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-400/60 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8">
          <div className="max-w-sm">
            <BrandB />
            <p className="mt-3 text-sm leading-6 text-navy-100/70">
              Internal reference only — not client-facing. Data from public
              sources.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-navy-100/70 transition-colors hover:text-gold-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Data as of
            </p>
            <p className="mt-2 text-sm text-navy-100/80">
              <DataAsOfMarker />
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-navy-200/60">
          <p>EST. 1975 — Client-owned, no shareholders.</p>
          <p className="font-mono uppercase tracking-[0.2em]">
            Vanguard Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}

export function TakeBHome() {
  return (
    <div className="bg-white dark:bg-navy-950">
      {/* Hero — layered navy band: blueprint texture, gold glows, ghost
          serif wordmark, copy column + "At a glance" stat card. */}
      <section className="relative overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-800">
        <BGridTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_78%_-10%,rgba(220,171,69,0.22),transparent_62%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(220,171,69,0.09),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        >
          <p className="whitespace-nowrap text-center font-display text-[clamp(6rem,18vw,16rem)] font-semibold leading-none tracking-tight text-white/[0.04]">
            {site.name}
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-1.5 rotate-45 bg-gold-400 shadow-sm shadow-gold-900/50"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                  Internal intelligence
                </p>
              </div>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {site.name}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-navy-100/85">
                {site.tagline}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-3.5 py-1.5 text-sm text-gold-100 backdrop-blur-sm">
                <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
                Data-as-of: <DataAsOfMarker />
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#analysis"
                  className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-900/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-900/40"
                >
                  Read the analysis
                  <ArrowDown aria-hidden className="size-4" />
                </a>
                <a
                  href="#explore"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-navy-50 transition-colors hover:border-gold-400/60 hover:text-gold-200"
                >
                  Explore sections
                </a>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-navy-950/50 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-white/10">
                {glanceStats.map((stat) => {
                  const point = latestPublishedPoint(stat.metric, "vanguard");
                  if (!point || point.value === null) return null;
                  return (
                    <div key={stat.metric} className="py-4 first:pt-0 last:pb-0">
                      <dt className="text-xs text-navy-100/70">{stat.label}</dt>
                      <dd className="mt-1 font-mono text-3xl font-medium tracking-tight text-gold-300">
                        {point.value.toLocaleString("en-US")}
                        {stat.suffix}
                      </dd>
                      <p className="mt-0.5 text-[11px] text-navy-200/60">
                        {point.asOf
                          ? `As of ${formatAsOf(point.asOf)}`
                          : `Latest: ${point.year}`}
                      </p>
                    </div>
                  );
                })}
              </dl>
            </aside>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold-400/60 to-transparent"
        />
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <TakeBAnalysis />

        <section aria-label="Sections" id="explore" className="mt-16 scroll-mt-24">
          <BKicker index="04" label="Explore" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {navLinks.map((link) => {
              const Icon = navIcons[link.path];
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-lg hover:shadow-navy-950/10 dark:border-navy-800 dark:bg-navy-900 dark:hover:border-gold-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700 dark:bg-navy-800 dark:text-navy-200 dark:group-hover:bg-gold-900/40 dark:group-hover:text-gold-300">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <ChevronRight
                      aria-hidden
                      className="size-4 text-navy-300 transition-all group-hover:translate-x-0.5 group-hover:text-gold-500 dark:text-navy-500"
                    />
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold tracking-tight text-navy-900 dark:text-navy-50">
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
        <BGridTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_80%_-20%,rgba(220,171,69,0.2),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        >
          <p className="whitespace-nowrap text-center font-display text-[clamp(4rem,12vw,10rem)] font-semibold leading-none tracking-tight text-white/[0.04]">
            Benchmarking
          </p>
        </div>
        <header className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-1.5 rotate-45 bg-gold-400 shadow-sm shadow-gold-900/50"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              Peer comparisons
            </p>
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-white lg:text-6xl">
            Benchmarking
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-navy-100/85">
            Each headline metric compared against the peer set over the 5 years
            — with membership rules and the ownership caveat displayed
            alongside every comparison.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-3.5 py-1.5 text-sm text-gold-100 backdrop-blur-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-400" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </header>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold-400/60 to-transparent"
        />
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
      <section aria-label="How Vanguard is faring" id="analysis" className="scroll-mt-24">
        <BKicker index="01" label="Narrative" />
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          {analysisNarrative.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-navy-600 dark:text-navy-200">
          {analysisNarrative.intro}
        </p>

        <div className="mt-10 space-y-10">
          {analysisNarrative.reads.map((read, index) => (
            <article
              key={read.heading}
              className="relative border-l-2 border-gold-400 pl-6 dark:border-gold-500"
            >
              <span
                aria-hidden
                className="absolute -left-[5px] top-0 size-2 rotate-45 rounded-[1px] bg-gold-500"
              />
              <p className="font-mono text-xs tracking-widest text-gold-600 dark:text-gold-400">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
                {read.heading}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-navy-600 dark:text-navy-200">
                {read.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-2xl border-l border-navy-200 pl-5 text-sm italic leading-7 text-navy-500 dark:border-navy-700 dark:text-navy-300">
          {analysisNarrative.caveat}
        </p>
      </section>

      <BSectionDivider />

      <section className="scroll-mt-24" aria-label="Improvement opportunities">
        <BKicker index="02" label="Opportunities" />
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          Improvement opportunities
        </h2>
        <div className="mt-8 space-y-5">
          {analysisOpportunities.map((opportunity) => (
            <article
              key={opportunity.id}
              className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,24,48,0.04),0_12px_32px_-16px_rgba(13,24,48,0.25)] transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_2px_4px_rgba(13,24,48,0.05),0_20px_48px_-20px_rgba(198,142,45,0.35)] dark:border-navy-800 dark:bg-navy-900 dark:shadow-none dark:hover:border-gold-600"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold-300 via-gold-400 to-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
                {opportunity.name}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-navy-600 dark:text-navy-200">
                {opportunity.claim}
              </p>
              <p className="mt-3 text-sm leading-6 text-navy-600 dark:text-navy-200">
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
            </article>
          ))}
        </div>
      </section>

      <BSectionDivider />

      <section className="scroll-mt-24" aria-label="Improvement lens">
        <BKicker index="03" label="Lens" />
        <blockquote className="relative mt-8 overflow-hidden rounded-xl border border-gold-500/20 bg-linear-to-br from-gold-500/[0.07] to-transparent p-8">
          <Quote
            aria-hidden
            className="absolute -top-3 left-6 size-8 text-gold-400/70"
          />
          <p className="relative font-display text-2xl font-light italic leading-relaxed text-navy-800 dark:text-navy-100">
            {improvementLens}
          </p>
          <span
            aria-hidden
            className="mt-6 block h-px w-16 bg-linear-to-r from-gold-400 to-transparent"
          />
        </blockquote>
      </section>
    </>
  );
}

function TakeBPeerSet() {
  return (
    <section
      data-testid="peer-set-panel"
      className="relative mt-8 overflow-hidden rounded-2xl bg-navy-950 p-7 text-white shadow-2xl shadow-navy-950/30 ring-1 ring-navy-800 dark:bg-navy-900 dark:ring-navy-700"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-gold-300 via-gold-500 to-transparent"
      />
      <p
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-10 select-none font-display text-8xl font-semibold leading-none text-white/[0.04]"
      >
        Peers
      </p>
      <h2 className="relative font-display text-2xl font-semibold tracking-tight text-white">
        Peer set
        <span
          aria-hidden
          className="mt-2 block h-0.5 w-12 rounded-full bg-linear-to-r from-gold-300 to-gold-500"
        />
      </h2>
      <p className="relative mt-3 max-w-2xl text-sm leading-6 text-navy-100/80">
        The five peers benchmarked against Vanguard, defined by the membership
        rules below:
      </p>
      <ul className="relative mt-5 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {allFirms.slice(1).map((firm) => (
          <li
            key={firm}
            className="rounded-md border border-navy-700 bg-navy-900 p-3 transition-colors hover:border-gold-500/50 dark:bg-navy-950"
          >
            <span className="font-medium text-white">{firmMeta[firm].name}</span>{" "}
            <span className="block text-xs text-navy-200/70">
              {ownershipLabel[firmMeta[firm].ownership]}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="relative mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        Membership rules
      </h3>
      <ol className="relative mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-navy-100/85">
        {peerSetMembershipRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>

      <h3 className="relative mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
        Basis of comparison
      </h3>
      <p className="relative mt-2 text-sm leading-6 text-navy-100/85">
        {peerSetBasisOfComparison}
      </p>
      <p className="relative mt-2 text-sm leading-6 text-navy-100/85">
        {peerSetAvailabilityNote}
      </p>

      <p
        data-testid="ownership-caveat"
        className="relative mt-5 rounded-md border-l-4 border-gold-400 bg-navy-900/70 p-3 text-sm leading-6 text-navy-50"
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
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-400 dark:text-navy-500"
          />
          <input
            id="benchmarking-firm-search"
            type="search"
            value={firmFilter}
            onChange={(event) => onFirmFilterChange(event.target.value)}
            placeholder="Filter firms — e.g., BlackRock"
            data-testid="benchmarking-firm-search"
            className="w-full rounded-md border border-navy-200 bg-white py-2 pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-400 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:placeholder:text-navy-400"
          />
        </div>
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
