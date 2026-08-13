"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, ChevronRight, Moon, Quote, Search, Sun } from "lucide-react";
import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { BenchmarkTable } from "@/components/benchmark-table";
import { navIcons } from "@/components/nav-icons";
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
} from "@/lib/fact-base";
import {
  ownershipCaveat,
  ownershipLabel,
  peerSetAvailabilityNote,
  peerSetBasisOfComparison,
  peerSetMembershipRules,
} from "@/lib/peer-set";
import { navLinks, site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Production site shell — deep navy editorial. Full-bleed navy hero   */
/* bands with blueprint texture and red accents, a serif display face  */
/* (--font-display) for editorial headlines, ghost serif numerals,     */
/* numbered sections with red rules, a glass "At a glance" stat card   */
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

type SiteTheme = "dark" | "light";

/** Serif brand lockup: "Vanguard" heavy, "Intelligence" light red. */
function Brand({ theme = "dark" }: { theme?: SiteTheme }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="size-2.5 rotate-45 bg-linear-to-br from-vanguard-red-300 to-vanguard-red-600 shadow-sm shadow-vanguard-red-900/40"
      />
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          theme === "dark" ? "text-white" : "text-navy-950"
        }`}
      >
        {brandFirst}{" "}
        <span className={`font-light ${theme === "dark" ? "text-vanguard-red-200/90" : "text-vanguard-red-700"}`}>
          {brandRest.join(" ")}
        </span>
      </span>
    </Link>
  );
}

/** Editorial section kicker: ghost serif numeral + red rule + label. */
function SectionKicker({ index, label }: { index: string; label: string }) {
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
        className="h-px w-10 bg-linear-to-r from-vanguard-red-400 to-transparent"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vanguard-red-600 dark:text-vanguard-red-400">
        {label}
      </p>
    </div>
  );
}

/** Thin red rule with a diamond, used between editorial sections. */
function SectionDivider() {
  return (
    <div aria-hidden className="my-16 flex items-center gap-3">
      <span className="h-px flex-1 bg-linear-to-r from-transparent via-navy-200 to-navy-300/60 dark:via-navy-700 dark:to-navy-600" />
      <span className="size-1.5 rotate-45 bg-vanguard-red-500/70" />
      <span className="h-px flex-1 bg-linear-to-r from-navy-300/60 via-navy-200 to-transparent dark:from-navy-600 dark:via-navy-700" />
    </div>
  );
}

/** Faint blueprint grid used over editorial bands and light surfaces. */
function GridTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(13,24,48,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(13,24,48,0.055)_1px,transparent_1px)] bg-[size:52px_52px] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]"
    />
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("vanguard-theme");
    queueMicrotask(() => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function changeTheme(nextTheme: SiteTheme) {
    setTheme(nextTheme);
    window.localStorage.setItem("vanguard-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <div className="md:grid md:grid-cols-[248px_minmax(0,1fr)]" data-layout="rail" data-theme={theme}>
      <SiteHeader theme={theme} onThemeChange={changeTheme} />
      <div className="min-w-0">
        <main className="flex-1">{children}</main>
        <SiteFooter theme={theme} />
      </div>
    </div>
  );
}

function SiteHeader({
  theme,
  onThemeChange,
}: {
  theme: SiteTheme;
  onThemeChange: (theme: SiteTheme) => void;
}) {
  const pathname = usePathname();
  return (
    <header
      className={`relative border-b shadow-lg shadow-navy-950/30 ${
        theme === "dark"
          ? "border-white/10 bg-linear-to-b from-navy-950 via-navy-900 to-navy-950"
          : "border-navy-800 bg-navy-950"
      } md:sticky md:top-0 md:z-40 md:h-screen md:border-b-0 md:border-r`}
    >
      <div
        aria-hidden
        className="h-px bg-linear-to-r from-transparent via-vanguard-red-400/70 to-transparent"
      />
      <div
        className="mx-auto flex max-w-6xl flex-wrap gap-y-4 px-4 py-3.5 md:h-[calc(100vh-1px)] md:flex-col md:items-stretch md:px-5 md:py-6"
      >
        <Brand theme="dark" />
        <nav
          aria-label="Sections"
          className="flex flex-wrap gap-1 md:flex-col md:items-stretch"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.path || pathname.startsWith(`${link.path}/`);
            const Icon = navIcons[link.path];
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? "page" : undefined}
                className={`group relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-vanguard-red-300"
                    : "text-navy-100/75 hover:bg-white/5 hover:text-white"
                } md:w-full md:justify-start`}
              >
                <Icon
                  aria-hidden
                  className={`size-4 transition-colors ${
                    active
                      ? "text-vanguard-red-400"
                      : "text-navy-200/60 group-hover:text-vanguard-red-300"
                  }`}
                />
                <span className="min-w-0 break-words">{link.name}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-y-2 right-0 w-0.5 rounded-full bg-linear-to-b from-vanguard-red-300 via-vanguard-red-400 to-vanguard-red-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto mb-20 flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            className={`inline-flex size-8 items-center justify-center rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-vanguard-red-400 ${
              "border-white/10 bg-white/5 text-vanguard-red-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {theme === "dark" ? <Sun aria-hidden className="size-4" /> : <Moon aria-hidden className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter({ theme }: { theme: SiteTheme }) {
  return (
    <footer
      className={`relative overflow-hidden border-t ${
        theme === "dark"
          ? "border-white/10 bg-linear-to-br from-navy-950 via-navy-900 to-navy-950"
          : "border-navy-200 bg-linear-to-br from-white via-vanguard-red-50/40 to-navy-50"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-vanguard-red-500 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_100%_at_100%_0%,rgba(200,16,46,0.12),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 lg:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div className="max-w-sm">
            <Brand theme={theme} />
            <p className={`mt-5 max-w-xs text-sm leading-7 ${theme === "dark" ? "text-navy-100/70" : "text-navy-700"}`}>
              A research layer for understanding Vanguard&apos;s model, metrics,
              and strategic choices.
            </p>
            <p className={`mt-7 border-l-2 border-vanguard-red-500 pl-3 font-mono text-[10px] uppercase tracking-[0.2em] ${theme === "dark" ? "text-navy-200/60" : "text-navy-500"}`}>
              Internal reference only
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-vanguard-red-300">
              Navigate
            </p>
            <nav
              aria-label="Footer"
              className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`transition-colors ${theme === "dark" ? "text-navy-100/70 hover:text-white" : "text-navy-700 hover:text-vanguard-red-700"}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className={`rounded-xl border p-5 shadow-xl ${theme === "dark" ? "border-white/10 bg-white/[0.04] shadow-navy-950/30" : "border-navy-200 bg-white/75 shadow-navy-900/10"}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-vanguard-red-300">
              Data status
            </p>
            <p className={`mt-4 text-2xl font-display font-semibold ${theme === "dark" ? "text-white" : "text-navy-950"}`}>
              Current through
            </p>
            <p className={`mt-1 text-sm ${theme === "dark" ? "text-navy-100/70" : "text-navy-600"}`}>
              <DataAsOfMarker />
            </p>
            <div className="mt-5 h-px bg-linear-to-r from-vanguard-red-500/70 to-transparent" />
            <p className={`mt-4 text-xs leading-5 ${theme === "dark" ? "text-navy-200/60" : "text-navy-500"}`}>
              Public-source evidence, clearly labeled where coverage is limited.
            </p>
          </div>
        </div>
        <div className={`mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs ${theme === "dark" ? "border-white/10 text-navy-200/60" : "border-navy-200 text-navy-500"}`}>
          <p>EST. 1975 — Client-owned, no shareholders.</p>
          <p className="font-mono uppercase tracking-[0.2em]">
            Vanguard Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}

export function HomeView() {
  return (
    <div className="bg-white dark:bg-navy-950">
      {/* Hero — layered navy band: blueprint texture, red glows, ghost
          serif wordmark, copy column + "At a glance" stat card. */}
      <section className="relative overflow-hidden bg-linear-to-br from-white via-navy-50 to-vanguard-red-50/60 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
        <GridTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_78%_-10%,rgba(200,16,46,0.22),transparent_62%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(200,16,46,0.09),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        >
          <p className="whitespace-nowrap text-center font-display text-[clamp(6rem,18vw,16rem)] font-semibold leading-none tracking-tight text-navy-900/[0.045] dark:text-white/[0.04]">
            {site.name}
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-1.5 rotate-45 bg-vanguard-red-400 shadow-sm shadow-vanguard-red-900/50"
                />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vanguard-red-700 dark:text-vanguard-red-300">
                  Internal intelligence
                </p>
              </div>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-navy-950 sm:text-6xl lg:text-7xl dark:text-white">
                {site.name}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-navy-700 dark:text-navy-100/85">
                {site.tagline}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-vanguard-red-300 bg-white/80 px-3.5 py-1.5 text-sm text-vanguard-red-800 shadow-sm backdrop-blur-sm dark:border-vanguard-red-400/30 dark:bg-white/5 dark:text-vanguard-red-100">
                <span aria-hidden className="size-1.5 rounded-full bg-vanguard-red-400" />
                Data-as-of: <DataAsOfMarker />
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#analysis"
                  className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-vanguard-red-400 to-vanguard-red-600 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-vanguard-red-900/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-vanguard-red-900/40"
                >
                  Read the analysis
                  <ArrowDown aria-hidden className="size-4" />
                </a>
                <a
                  href="#explore"
                  className="inline-flex items-center gap-2 rounded-md border border-navy-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-vanguard-red-400/60 hover:text-vanguard-red-700 dark:border-white/15 dark:bg-transparent dark:text-navy-50 dark:hover:text-vanguard-red-200"
                >
                  Explore sections
                </a>
              </div>
            </div>

            <aside className="rounded-2xl border border-navy-200 bg-white/90 p-6 shadow-xl shadow-navy-900/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-2xl dark:shadow-navy-950/50">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vanguard-red-700 dark:text-vanguard-red-300">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-navy-200 dark:divide-white/10">
                {glanceStats.map((stat) => {
                  const point = latestPublishedPoint(stat.metric, "vanguard");
                  if (!point || point.value === null) return null;
                  return (
                    <div key={stat.metric} className="py-4 first:pt-0 last:pb-0">
                      <dt className="text-xs text-navy-600 dark:text-navy-100/70">{stat.label}</dt>
                      <dd className="mt-1 font-mono text-3xl font-medium tracking-tight text-vanguard-red-700 dark:text-vanguard-red-300">
                        {point.value.toLocaleString("en-US")}
                        {stat.suffix}
                      </dd>
                      <p className="mt-0.5 text-[11px] text-navy-500 dark:text-navy-200/60">
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
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-vanguard-red-400/60 to-transparent"
        />
      </section>

      <div className="relative overflow-hidden bg-linear-to-b from-navy-50 via-white to-vanguard-red-50/40 dark:from-navy-950 dark:via-navy-950 dark:to-navy-900">
        <GridTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-[720px] w-[42%] bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.08),transparent_68%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[190px_minmax(0,3fr)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-8 border-l-2 border-vanguard-red-500/30 pl-5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-vanguard-red-600 dark:text-vanguard-red-300">
                  Field note
                </p>
                <p className="mt-3 font-display text-2xl font-semibold leading-tight text-navy-900 dark:text-white">
                  The read
                  <br />
                  below
                </p>
                <nav aria-label="Analysis outline" className="mt-8 space-y-4">
                  {[
                    ["01", "Narrative", "#analysis"],
                    ["02", "Opportunities", "#opportunities"],
                    ["03", "Lens", "#lens"],
                    ["04", "Explore", "#explore"],
                  ].map(([index, label, href]) => (
                    <a
                      key={index}
                      href={href}
                      className="group flex items-center gap-2 text-xs text-navy-500 transition-colors hover:text-vanguard-red-600 dark:text-navy-300 dark:hover:text-vanguard-red-300"
                    >
                      <span className="font-mono text-[10px] text-vanguard-red-500/70">
                        {index}
                      </span>
                      <span>{label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="min-w-0">
              <AnalysisView />
            </div>
          </div>

          <section aria-label="Sections" id="explore" className="mt-20 scroll-mt-24 border-t border-navy-200/80 pt-12 dark:border-navy-700">
            <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
              <SectionKicker index="04" label="Explore" />
              <p className="max-w-sm rounded-lg border border-vanguard-red-200 bg-white/80 p-4 text-sm leading-6 text-navy-600 shadow-sm dark:border-vanguard-red-800/50 dark:bg-navy-900/70 dark:text-navy-300">
                Move from the narrative into the evidence, products, and operating model behind it.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {navLinks.map((link) => {
                const Icon = navIcons[link.path];
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="group relative overflow-hidden rounded-xl border border-navy-200/80 bg-white/90 p-5 shadow-[0_8px_28px_-18px_rgba(13,24,48,0.6)] transition-all hover:-translate-y-1 hover:border-vanguard-red-300 hover:shadow-[0_18px_40px_-20px_rgba(200,16,46,0.35)] dark:border-navy-700 dark:bg-navy-900/80 dark:hover:border-vanguard-red-600"
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-vanguard-red-400 via-vanguard-red-500 to-vanguard-red-700 opacity-70 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-vanguard-red-50 text-vanguard-red-700 transition-colors group-hover:bg-vanguard-red-500 group-hover:text-white dark:bg-vanguard-red-900/30 dark:text-vanguard-red-300 dark:group-hover:bg-vanguard-red-500">
                        <Icon aria-hidden className="size-4" />
                      </span>
                      <ChevronRight
                        aria-hidden
                        className="size-4 text-navy-300 transition-all group-hover:translate-x-0.5 group-hover:text-vanguard-red-500 dark:text-navy-500"
                      />
                    </div>
                    <h2 className="mt-5 font-display text-lg font-semibold tracking-tight text-navy-900 dark:text-navy-50">
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
    </div>
  );
}

export function BenchmarkingView({
  activeMetric,
}: {
  activeMetric: MetricId | null;
}) {
  const [firmFilter, setFirmFilter] = useState("");

  return (
    <div className="bg-white dark:bg-navy-950">
      <section className="relative overflow-hidden bg-linear-to-br from-white via-navy-50 to-vanguard-red-50/60 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
        <GridTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_80%_-20%,rgba(200,16,46,0.2),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        >
          <p className="whitespace-nowrap text-center font-display text-[clamp(4rem,12vw,10rem)] font-semibold leading-none tracking-tight text-navy-900/[0.045] dark:text-white/[0.04]">
            Benchmarking
          </p>
        </div>
        <header className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-1.5 rotate-45 bg-vanguard-red-400 shadow-sm shadow-vanguard-red-900/50"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vanguard-red-700 dark:text-vanguard-red-300">
              Peer comparisons
            </p>
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-navy-950 lg:text-6xl dark:text-white">
            Benchmarking
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-navy-700 dark:text-navy-100/85">
            Each headline metric compared against the peer set over the 5 years
            — with membership rules and the ownership caveat displayed
            alongside every comparison.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-vanguard-red-300 bg-white/80 px-3.5 py-1.5 text-sm text-vanguard-red-800 shadow-sm backdrop-blur-sm dark:border-vanguard-red-400/30 dark:bg-white/5 dark:text-vanguard-red-100">
            <span aria-hidden className="size-1.5 rounded-full bg-vanguard-red-400" />
            Data-as-of: <DataAsOfMarker />
          </p>
        </header>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-vanguard-red-400/60 to-transparent"
        />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <PeerSetPanel />

        <BenchmarkingExplorer
          activeMetric={activeMetric}
          firmFilter={firmFilter}
          onFirmFilterChange={setFirmFilter}
        />
      </div>
    </div>
  );
}

/* Shared pieces ------------------------------------------------------- */

function AnalysisView() {
  return (
    <>
      <section aria-label="How Vanguard is faring" id="analysis" className="scroll-mt-24">
        <SectionKicker index="01" label="Narrative" />
        <div className="mt-5 rounded-xl border border-navy-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(13,24,48,0.55)] dark:border-navy-800 dark:bg-navy-900">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
            {analysisNarrative.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-navy-600 dark:text-navy-200">
            {analysisNarrative.intro}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {analysisNarrative.reads.map((read, index) => (
            <article
              key={read.heading}
              className="group relative overflow-hidden rounded-xl border border-navy-200 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(13,24,48,0.55)] transition-all hover:-translate-y-0.5 hover:border-vanguard-red-300 hover:shadow-[0_16px_32px_-20px_rgba(200,16,46,0.3)] dark:border-navy-800 dark:bg-navy-900 dark:hover:border-vanguard-red-700"
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-vanguard-red-400 to-vanguard-red-700" />
              <span
                aria-hidden
                className="absolute right-5 top-5 size-2 rotate-45 rounded-[1px] bg-vanguard-red-500"
              />
              <p className="font-mono text-xs tracking-widest text-vanguard-red-600 dark:text-vanguard-red-400">
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

        <p className="mt-5 rounded-lg border border-vanguard-red-200 bg-vanguard-red-50/70 p-4 text-sm italic leading-7 text-navy-600 dark:border-vanguard-red-900/70 dark:bg-vanguard-red-900/20 dark:text-navy-300">
          {analysisNarrative.caveat}
        </p>
      </section>

      <SectionDivider />

      <section className="scroll-mt-24" aria-label="Improvement opportunities">
        <SectionKicker index="02" label="Opportunities" />
        <h2 className="mt-5 rounded-xl border border-navy-200 bg-white p-6 font-display text-4xl font-semibold tracking-tight text-navy-900 shadow-[0_12px_32px_-24px_rgba(13,24,48,0.55)] dark:border-navy-800 dark:bg-navy-900 dark:text-navy-50">
          Improvement opportunities
        </h2>
        <div className="mt-8 space-y-5">
          {analysisOpportunities.map((opportunity) => (
            <article
              key={opportunity.id}
              className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(13,24,48,0.04),0_12px_32px_-16px_rgba(13,24,48,0.25)] transition-all hover:-translate-y-0.5 hover:border-vanguard-red-300 hover:shadow-[0_2px_4px_rgba(13,24,48,0.05),0_20px_48px_-20px_rgba(200,16,46,0.35)] dark:border-navy-800 dark:bg-navy-900 dark:shadow-none dark:hover:border-vanguard-red-600"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-vanguard-red-300 via-vanguard-red-400 to-vanguard-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <h3 className="font-display text-xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
                {opportunity.name}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-navy-600 dark:text-navy-200">
                {opportunity.claim}
              </p>
              <p className="mt-3 text-sm leading-6 text-navy-600 dark:text-navy-200">
                <span className="font-medium text-vanguard-red-700 dark:text-vanguard-red-400">
                  Evidence:
                </span>{" "}
                {opportunity.evidence
                  .map((metric) => metricMeta[metric].name)
                  .join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-200">
                <span className="font-medium text-vanguard-red-700 dark:text-vanguard-red-400">
                  Read:
                </span>{" "}
                {opportunity.read}
              </p>
            </article>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section className="scroll-mt-24" aria-label="Improvement lens">
        <SectionKicker index="03" label="Lens" />
        <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          Improvement lens
        </h2>
        <blockquote className="relative mt-8 overflow-hidden rounded-xl border border-vanguard-red-500/20 bg-linear-to-br from-vanguard-red-500/[0.07] to-transparent p-8">
          <Quote
            aria-hidden
            className="absolute -top-3 left-6 size-8 text-vanguard-red-400/70"
          />
          <p className="relative font-display text-2xl font-light italic leading-relaxed text-navy-800 dark:text-navy-100">
            {improvementLens}
          </p>
          <span
            aria-hidden
            className="mt-6 block h-px w-16 bg-linear-to-r from-vanguard-red-400 to-transparent"
          />
        </blockquote>
      </section>
    </>
  );
}

function PeerSetPanel() {
  return (
    <section
      data-testid="peer-set-panel"
      className="relative mt-8 overflow-hidden rounded-2xl bg-navy-950 p-7 text-white shadow-2xl shadow-navy-950/30 ring-1 ring-navy-800 dark:bg-navy-900 dark:ring-navy-700"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-vanguard-red-300 via-vanguard-red-500 to-transparent"
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
          className="mt-2 block h-0.5 w-12 rounded-full bg-linear-to-r from-vanguard-red-300 to-vanguard-red-500"
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
            className="rounded-md border border-navy-700 bg-navy-900 p-3 transition-colors hover:border-vanguard-red-500/50 dark:bg-navy-950"
          >
            <span className="font-medium text-white">{firmMeta[firm].name}</span>{" "}
            <span className="block text-xs text-navy-200/70">
              {ownershipLabel[firmMeta[firm].ownership]}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="relative mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-vanguard-red-300">
        Membership rules
      </h3>
      <ol className="relative mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-navy-100/85">
        {peerSetMembershipRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>

      <h3 className="relative mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-vanguard-red-300">
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
        className="relative mt-5 rounded-md border-l-4 border-vanguard-red-400 bg-navy-900/70 p-3 text-sm leading-6 text-navy-50"
      >
        {ownershipCaveat}
      </p>
    </section>
  );
}

function BenchmarkingExplorer({
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
          className={tabClass(activeMetric === null)}
        >
          All metrics
        </Link>
        {headlineMetrics.map((metric) => (
          <Link
            key={metric}
            href={`/benchmarking?metric=${metric}`}
            aria-current={activeMetric === metric ? "page" : undefined}
            className={tabClass(activeMetric === metric)}
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
            className="w-full rounded-md border border-navy-200 bg-white py-2 pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-400 focus:border-vanguard-red-500 focus:outline-none focus:ring-1 focus:ring-vanguard-red-400 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:placeholder:text-navy-400"
          />
        </div>
      </div>

      {metrics.map((metric) => (
        <BenchmarkTable key={metric} metric={metric} firmFilter={firmFilter} />
      ))}
    </div>
  );
}

function tabClass(active: boolean): string {
  return `border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-vanguard-red-500 text-navy-900 dark:border-vanguard-red-400 dark:text-navy-50"
      : "border-transparent text-navy-500 hover:border-navy-300 hover:text-navy-800 dark:text-navy-300 dark:hover:border-navy-600 dark:hover:text-navy-100"
  }`;
}
