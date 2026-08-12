# 17 — Task: LLM analysis pipeline — narrative and improvement opportunities

**What to build:** The analysis pipeline runs LLM research loops over the fact base to produce the "how is Vanguard faring" narrative and named improvement opportunities, each connected to the metrics behind it; the site presents the narrative and the opportunity list with the improvement lens stated (broad business performance, technology one lever among many).

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 07 (Grilling: products & services and LoB taxonomy), 08 (Task: fact base assembly)

**Status:** resolved

## Answer

Three decisions, grilled one at a time (user-approved), recorded before implementation:

1. **Scope — pipeline only; peer data stays `pending-collection`.** Ticket 17 = the analysis pipeline per its checklist: a seeded narrative grounded in the fact base (Vanguard's own published trajectory: cost ratio 0.09%→0.07% 2021–25, client counts with the 2023 methodology break, AUM through H1 2022, revenue/RoE gaps) + named improvement opportunities each connected to its evidence metrics + the improvement lens stated (broad business performance, technology one lever among many). Peer-relative reads are honestly labeled as awaiting peer data. Real peer data collection (Form ADV read, 10-K gathering via research loops) becomes its own follow-up effort — outside this ticket. (Resolves the ticket-08/14/16 "deferred to ticket 17" peer-collection references as a separate follow-up.)
2. **Placement — the home page is the analysis view.** `/` keeps the h1 "Vanguard Intelligence" + tagline (scaffold E2E requires the h1), then renders the narrative ("How Vanguard is faring") and the named improvement opportunities (each connected to its evidence metrics) with the improvement lens stated, then the existing nav cards below. No new nav section.
3. **Opportunity set — the 4-opportunity grounded set** (each named + connected to evidence metrics, never invented):
   - **Extend the cost advantage** (evidence: `cost-ratio`) — cost ratio fell 0.09%→0.07% over 5 years; the read is compounding the advantage.
   - **Close the profitability visibility gap** (evidence: `revenue`, `roe`) — no firm-level financials → RoE not computable; publishing them (or reading Form ADV) unlocks value-creation reads.
   - **Restore AUM disclosure** (evidence: `aum`) — firm AUM stops at H1 2022; the fee-based scale story depends on it.
   - **Measure clients consistently** (evidence: `clients`) — the 30M+→50M+ jump carries a 2023 methodology break; consistent counting keeps the growth read honest.

   Narrative = grounded summary of those four reads + ownership caveat; lens stated (broad business performance, technology one lever among many).

## Review

Reviewed by two-axis review during implementation. Standards axis: APPROVE (module doc-comment, `readonly` arrays, type-only imports, `@/*` alias, server component, unit-test literal-constant discipline, E2E `main` scoping, accessor pattern all match siblings). Spec axis: APPROVE-with-fixes — one should-fix (intro's opening clause "publishes what listed peers publish plus a cost ratio" did not trace to a fact-base literal) plus nits; all folded in: intro reworded to the grounded "publishes headline statistics — AUM, client counts, the cost ratio — and fund-level statements, but no firm-level financials"; read wording aligned to the decided Answer section (Form ADV read, fee-based scale story); `AnalysisView` split into three labelled sections (one per h2 block, sibling pattern); E2E evidence assertions now target the exact rendered evidence labels (incl. "Return on equity" display name); JSDoc indentation normalized. Re-verified after fixes: `tsc --noEmit` clean, `eslint` clean, unit 37/37 (incl. 8 new), E2E 27/27 (incl. 4 new). Commit: `ffc9f36`.

## Checklist

- [x] Pipeline produces a narrative from the fact base
- [x] Improvement opportunities are named and connected to their evidence metrics
- [x] Improvement lens is stated with the reads
- [x] Pipeline output is stored for the site to present
- [x] Browser E2E test asserts the narrative and opportunities render from a seeded analysis
