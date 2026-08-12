# 24 — Task: firm logos in data views

**What to build:** The firm marks from ticket 22 placed in the three decided data views: a mark per firm row (Vanguard first) in the benchmarking tables, marks beside each firm in the peer set panel with the existing ownership labels, and marks in the RoE comparison tables and the line-of-business-vs-industry panel. The RoE tree drilldown stays clean, and the marks adapt to dark mode and stay legible at small sizes. No cell text or formatting path changes.

**Blocked by:** 21 (Task: design tokens and site shell color pass), 22 (Task: hand-built firm SVG mark components)

**Status:** ready-for-agent

- [ ] Marks render per firm row, Vanguard first, in benchmarking tables, peer set panel, and RoE comparisons; RoE tree untouched
- [ ] Marks adapt to dark mode and are legible at table-cell sizes
- [ ] No changes to cell text, `cellText`/formatting paths, or testids; benchmarking + RoE-comparison E2E green
