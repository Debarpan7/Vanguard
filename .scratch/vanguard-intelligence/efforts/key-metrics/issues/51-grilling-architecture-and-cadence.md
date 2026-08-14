# Grilling: architecture and cadence

## Question

How the two sections are built into the existing app:

- Standalone typed data modules + views, per the established repo pattern (data module → accessor → server component → tests → refresh gate), without touching existing sections or the `data-rich-fact-base` pipeline (settled: standalone).
- Two new nav entries: "Key metrics" and "Advisory" (settled: yes).
- Per-section data-as-of markers.
- Refresh-gate extension: separate checks for the two sections, or one shared gate? The existing `src/lib/refresh.ts` gate validates the headline fact base; decide whether the new sections get their own validation modules.
- Refresh cadence: priority 2 (user directive) — quarterly default aligned with the site, per-cell as-of dates so staleness is visible. Decide the minimum viable cadence mechanism (no over-engineering).
