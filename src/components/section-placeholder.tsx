interface SectionPlaceholderProps {
  title: string;
  description: string;
}

/**
 * Stable placeholder for a section whose build ticket hasn't landed yet.
 * Each section page renders this until its ticket (e.g. metrics dashboard,
 * RoE tree) replaces it with the real view.
 */
export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <p className="mt-8 rounded-[var(--radius-card)] border border-dashed border-navy-300 bg-navy-50 p-4 text-sm text-zinc-500 shadow-[var(--shadow-card)] dark:border-navy-700 dark:bg-navy-950 dark:text-zinc-400">
        This section is under construction — the build ticket for this view has
        not landed yet.
      </p>
    </div>
  );
}
