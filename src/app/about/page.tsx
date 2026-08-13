import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { navLinks } from "@/lib/site";
import { SurfaceCard } from "@/components/surface";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        About
      </h1>

      <SurfaceCard className="mt-6 bg-navy-50 dark:bg-navy-950">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          This site is internal reference only — it is not client-facing and
          nothing on it is intended for external distribution.
        </p>
      </SurfaceCard>

      <SurfaceCard className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          How to read this site
        </h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          This is an internal intelligence view of how Vanguard is faring and
          where it can improve. The analysis is produced by LLM research over a
          fact base built from public sources only — Vanguard&apos;s annual report,
          key statistics, and press releases, plus peers&apos; public filings.
        </p>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          The sections are:
        </p>
        <ul className="mt-3 grid gap-4 text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
          {navLinks
            .filter((link) => link.name !== "About")
            .map((link) => (
              <li key={link.path}>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {link.name}
                </span>{" "}
                — see the section page for what it covers.
              </li>
            ))}
        </ul>
        <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
          Where RoE is compared, keep the ownership caveat in mind: Vanguard is
          client-owned (mutual), while some peers are listed companies — the
          comparison treats this explicitly.
        </p>
        <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
          The improvement lens is broad business performance: where Vanguard is
          faring well and where it can improve, with technology one possible
          lever among many, not the default answer.
        </p>
      </SurfaceCard>

      <SurfaceCard className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Data and refresh
        </h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          Every number on the site is intended to trace back to its public
          source, and provenance is verified as part of each refresh. The fact
          base is refreshed on a quarterly cadence; the marker below shows when
          the site&apos;s data was last refreshed.
        </p>
        <DataAsOfMarker className="mt-4 inline-block rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300" />
      </SurfaceCard>
    </div>
  );
}
