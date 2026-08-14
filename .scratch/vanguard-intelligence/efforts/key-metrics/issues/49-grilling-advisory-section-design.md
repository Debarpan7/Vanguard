# Grilling: advisory-section design

## Question

The advisory table's exact shape from Form ADV data:

- **Rows**: regulatory AUM total + by client type (Item 5.D(3)), client counts by type (5.D(1)), discretionary/non-discretionary split (5.F(2)), and Part 2A brochure facts (AUM-based fee schedule, minimums, wrap-fee programs, discretionary vs non-discretionary client assets per Item 4.E).
- **Vanguard column**: Vanguard Advisers Inc (CRD 106715) — the advice arm, not the whole firm (user directive).
- **Peer set** (from research 45): BlackRock Advisors 106614, PIMCO 104559, J.P. Morgan IM 107038, GSAM 107738, Fidelity M&R 108281, Morgan Stanley IM 110353, T. Rowe Price 105496, Capital Research 110885. (Column count / tabbing is a display decision for this ticket.)
- **Open**: how is unstructured Part 2A content captured (verbatim brochure quotes with page cites vs. curated fields)? How are entity-level caveats displayed (multi-entity advisers: BlackRock has 6 active IAs; JPM's dual registrant unresolved)? How is the as-of-vs-submission-date distinction rendered?

**Status:** ready-for-agent. Ticket 50 generates real data to validate the chosen rows before the build.

**Blocked by:** 45 — Research: ADV advisory landscape (complete)
