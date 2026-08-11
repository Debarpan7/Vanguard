# 16 — Task: RoE comparison views

**What to build:** Vanguard's RoE compared against the peer set over the 5 years, plus line-of-business RoE compared against the industries each line competes in — with the ownership caveat and the line-of-business derivation disclosure (proxies or stated limitations) displayed.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 08 (Task: fact base assembly)

**Status:** resolved

## Answer

Built per the ticket-06 decisions (recorded verbatim in `issues/06-grilling-roe-comparison.md`):

- **Peer-set RoE table** — reuses the benchmark-table pattern (`BenchmarkTable metric="roe"`) so rows are Vanguard-first, columns FY2021–25, cells are literal facts or explicit gap labels ("Not published" for Vanguard, "Pending collection" for peers), with the ownership caveat and Fidelity voluntary-side-data note traveling with the table. The copy-link button points at `/roe-comparison#peer-set` via the new optional `copyHref` prop (default unchanged for benchmarking).
- **Line-of-business-vs-industry panel** — the provisional 4-line model (investment management / retirement / brokerage / advice, order as decided), each line mapped to its industry and peer-set representatives: investment management → Asset management (BlackRock, Invesco, Amundi); retirement → Retirement recordkeeping (State Street, Fidelity voluntary); brokerage → Brokerage & trading (Fidelity voluntary; Schwab deferred note); advice → Wealth/advice management (Fidelity voluntary; Schwab deferred note). Every Vanguard LoB cell renders the literal "Not published" gap; every representative cell renders "Pending collection" until ticket 17. The derivation disclosure (not-published gaps — never invented, provisional model pending ticket 07, peer-set reps only, Schwab deferred to ticket 17) renders with the panel.
- **No year selector** on this page (decision 06 answer 3) — no URL params; the RoE tree owns year drilldown.

## Review

Reviewed by two-axis review during implementation. Standards axis: APPROVE. Spec axis: one MAJOR — representative cells must render the decided literal "Pending collection" label (and E2E must assert it) — fixed: `repLabel` now appends "— Pending collection" per representative, E2E asserts it per line; NITs folded in (section anchor ids + deep-link copy href, `LobRepresentative` type import, dead `LobIndustry.id` dropped, disclosure regex tightened, sr-only caption no longer claims a year dimension). Re-verified after fixes: `tsc --noEmit` clean, `eslint` clean, unit 29/29 (incl. 6 new), E2E 23/23 (incl. 2 new). Commit: see git log.

## Checklist

- [x] Peer set RoE comparison renders over the 5 years
- [x] Line-of-business RoE comparison renders against each relevant industry
- [x] Ownership caveat and line-of-business derivation disclosure are shown
- [x] Browser E2E test asserts the comparison views render the correct values from a seeded fact base
