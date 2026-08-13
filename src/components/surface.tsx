import type { HTMLAttributes, ReactNode } from "react";

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/** Shared framed surface for content groups across the site. */
export function SurfaceCard({ className = "", children, ...props }: SurfaceCardProps) {
  return (
    <section
      className={`rounded-[var(--radius-card)] border border-navy-200 bg-white p-5 shadow-[var(--shadow-card)] dark:border-navy-800 dark:bg-navy-900 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

type SurfaceGridProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Responsive grid for related cards; control internals may still use flex. */
export function SurfaceGrid({ className = "", children, ...props }: SurfaceGridProps) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type TablePanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Framed overflow boundary that preserves semantic table markup inside. */
export function TablePanel({ className = "", children, ...props }: TablePanelProps) {
  return (
    <div
      className={`overflow-x-auto rounded-[var(--radius-card)] border border-navy-200 bg-white p-1 shadow-[var(--shadow-card)] dark:border-navy-800 dark:bg-navy-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
