import { dataAsOfLabel, site } from "@/lib/site";

/**
 * The single data-as-of marker. Renders the label from the site's last
 * refresh date (src/lib/site.ts) — the contract the refresh pipeline
 * (ticket 20) will update. Every placement uses this component so the
 * testid and label stay consistent across the site.
 */
export function DataAsOfMarker({ className }: { className?: string }) {
  return (
    <span data-testid="data-as-of" className={className}>
      {dataAsOfLabel(site.dataAsOf)}
    </span>
  );
}
