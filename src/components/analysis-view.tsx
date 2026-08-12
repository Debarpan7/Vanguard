import {
  analysisNarrative,
  analysisOpportunities,
  improvementLens,
} from "@/data/analysis";
import { metricMeta } from "@/data/fact-base";

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

        <div className="mt-6 space-y-4">
          {analysisNarrative.reads.map((read) => (
            <div
              key={read.heading}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                {read.heading}
              </h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {read.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm italic text-zinc-500 dark:text-zinc-400">
          {analysisNarrative.caveat}
        </p>
      </section>

      <section className="mt-10" aria-label="Improvement opportunities">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Improvement opportunities
        </h2>
        <div className="mt-6 space-y-4">
          {analysisOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
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
            </div>
          ))}
        </div>
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
