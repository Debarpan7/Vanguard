import { dataAsOfLabel, site } from "@/lib/site";

/**
 * The single data-as-of marker. Renders the label from the site's last
 * refresh date (src/lib/site.ts), stamped by the quarterly refresh pipeline
 * (ticket 20). Every placement uses this component so the testid and label
 * stay consistent across the site.
 */
export function DataAsOfMarker({ className }: { className?: string }) {
  return (
    <span data-testid="data-as-of" className={className}>
      {dataAsOfLabel(site.dataAsOf)}
    </span>
  );
}
