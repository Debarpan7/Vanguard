import {
  analysisNarrative,
  analysisOpportunities,
  improvementLens,
} from "@/data/analysis";
import { metricMeta } from "@/data/fact-base";
import { SurfaceCard, SurfaceGrid } from "@/components/surface";

/**
 * The analysis view (ticket 17 — LLM analysis pipeline): the home page's
 * narrative, improvement opportunities, and lens, rendered from the seeded
 * pipeline output (`src/data/analysis.ts`). Server component — reads the
 * data module directly, no client state.
 */
export function AnalysisView() {
  return (
    <div className="mt-10 max-w-3xl">
      <section aria-label="How Vanguard is faring">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {analysisNarrative.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {analysisNarrative.intro}
        </p>

        <SurfaceGrid className="mt-6 lg:grid-cols-2">
          {analysisNarrative.reads.map((read) => (
            <SurfaceCard
              key={read.heading}
              className="p-4"
            >
              <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                {read.heading}
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {read.body}
              </p>
            </SurfaceCard>
          ))}
        </SurfaceGrid>

        <p className="mt-4 text-sm italic text-zinc-500 dark:text-zinc-400">
          {analysisNarrative.caveat}
        </p>
      </section>

      <section className="mt-10" aria-label="Improvement opportunities">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Improvement opportunities
        </h2>
        <SurfaceGrid className="mt-6 lg:grid-cols-2">
          {analysisOpportunities.map((opportunity) => (
            <SurfaceCard
              key={opportunity.id}
              className="p-4"
            >
              <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                {opportunity.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {opportunity.claim}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Evidence:</span>{" "}
                {opportunity.evidence
                  .map((metric) => metricMeta[metric].name)
                  .join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Read:</span> {opportunity.read}
              </p>
            </SurfaceCard>
          ))}
        </SurfaceGrid>
      </section>

      <section className="mt-10" aria-label="Improvement lens">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Improvement lens
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {improvementLens}
        </p>
      </section>
    </div>
  );
}
