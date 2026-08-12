# 29 — Task: client-side benchmarking metric switching

**What to build:** Change the benchmarking metric selector so selecting a metric updates the visible comparison table in place instead of causing a document reload. Keep the selected metric represented in the shareable `?metric=` URL, preserve the current firm-search value when switching, maintain accessible current-tab semantics, and preserve direct-link behavior on initial load. Use the existing fact-base and table contracts; this is an interaction change, not a data change.

**Blocked by:** 21 (Task: lock Take B tokens and the rail shell)

**Status:** ready-for-agent

**Assignee:**

- [ ] Metric selection renders the new table without a full document navigation
- [ ] URL query state remains shareable and direct links initialize the correct metric
- [ ] Firm search state survives metric changes
- [ ] Active tab/current state and keyboard interaction remain accessible
- [ ] Existing benchmarking E2E and unit contracts remain green
