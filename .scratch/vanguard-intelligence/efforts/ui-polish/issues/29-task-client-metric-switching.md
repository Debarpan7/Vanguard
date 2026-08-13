# 29 — Task: client-side benchmarking metric switching

**What to build:** Change the benchmarking metric selector so selecting a metric updates the visible comparison table in place instead of causing a document reload. Keep the selected metric represented in the shareable `?metric=` URL, preserve the current firm-search value when switching, maintain accessible current-tab semantics, and preserve direct-link behavior on initial load. Use the existing fact-base and table contracts; this is an interaction change, not a data change.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell)

**Status:** resolved (commit `9c2f2a5`)

**Assignee:** GitHub Copilot

- [x] Metric selection renders the new table without a full document navigation
- [x] URL query state remains shareable and direct links initialize the correct metric
- [x] Firm search state survives metric changes
- [x] Active tab/current state and keyboard interaction remain accessible
- [x] Existing benchmarking E2E and unit contracts remain green

Resolution: Already satisfied by the Take B benchmarking view — `TakeBBenchmarking`
renders the metric selector as `Link` tabs (`/benchmarking?metric=…`), which Next.js
App Router navigates client-side without a document reload, and `firmFilter` lives in
`useState`, so the firm-search input keeps its value across metric switches. Closed the
only gap (explicit coverage): added an E2E test to `e2e/benchmarking.spec.ts` asserting
firm-search survives metric switching, the URL stays shareable, and the filtered table
applies the firm filter after switching back to "All metrics". Verified: 6/6 benchmarking
E2E green, 70/70 unit green, typecheck + lint clean.
