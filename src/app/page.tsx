import Link from "next/link";
import { AnalysisView } from "@/components/analysis-view";
import { DataAsOfMarker } from "@/components/data-as-of-marker";
import { TakeAHome } from "@/components/prototype/take-a";
import { TakeBHome } from "@/components/prototype/take-b";
import { TakeCHome } from "@/components/prototype/take-c";
import { parseVariant } from "@/components/prototype/variants";
import { navLinks, site } from "@/lib/site";

/** The live home page (no ?variant=). */
function LiveHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {site.name}
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {site.tagline}
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
      </section>

      {/* Ticket 17 — the home page is the analysis view: narrative, improvement
      opportunities, and lens from the seeded pipeline output. */}
      <AnalysisView />

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <h2 className="font-medium text-zinc-950 dark:text-zinc-50">
              {link.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Opens the {link.name.toLowerCase()} section.
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}

/**
 * Ticket 21 — design tokens & shell (HITL gate): home + benchmarking get
 * three structurally different prototype takes, switchable via `?variant=`.
 * Dev-only; production always renders the live page.
 */
export default async function Home({ searchParams }: PageProps<"/">) {
  const { variant } = await searchParams;
  const take = process.env.NODE_ENV === "production" ? null : parseVariant(variant);

  if (take === "A") return <TakeAHome />;
  if (take === "B") return <TakeBHome />;
  if (take === "C") return <TakeCHome />;
  return <LiveHome />;
}
