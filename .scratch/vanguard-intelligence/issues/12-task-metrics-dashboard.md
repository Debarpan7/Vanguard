# 12 — Task: metrics dashboard and 5-year trends

**What to build:** The dashboard shows Vanguard's headline metrics (AUM, number of clients, revenue, RoE) for the latest fiscal year, drawn from the fact base, each with its definition, unit, source, and 5-year trend. This slice also establishes the fact base access layer and the provenance tests — every series must trace to its public source with the correct value and year coverage.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 03 (Grilling: core metric set and definitions), 08 (Task: fact base assembly)

**Status:** ready-for-agent

- [ ] Dashboard renders the headline metrics for the latest fiscal year
- [ ] Each metric shows its definition, unit, source, and 5-year trend
- [ ] Fact base access layer serves the metric set from the fact base
- [ ] Provenance tests assert each series traces to its public source with correct value and year coverage
- [ ] Browser E2E test asserts the dashboard renders the correct values from a seeded fact base
