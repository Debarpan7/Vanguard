# 04 — Grilling: peer set selection

Type: grilling
Status: resolved
Blocked by: 02

## Question

Which firms form the benchmark peer set, and what are the membership rules?

Work from the peer universe fact sheet (ticket 02). Decide:
- **Membership**: the specific firms in the set, and how private firms (e.g., Fidelity) are handled given their voluntary disclosure.
- **Membership rules**: what qualifies a firm (scale, business mix, public data availability), so the set is defensible and stable.
- **Basis of comparison**: what comparability means for this effort — same metrics, same 5 years, ownership caveats.

## Answer

Grilled with the user one decision at a time (5 questions + confirmation); all decisions confirmed.

**Core peer set (5 firms):** BlackRock · Fidelity · State Street (SSGA) · Invesco · Amundi.

**Membership rules (all three are hard rules):**
1. **Audited financials** for the 5-year window (10-K or equivalent) — with one documented exception: high-comparability private firms (Fidelity) are admitted as **voluntary-data core members**, every metric labeled voluntary + source + date.
2. **AUM scale floor** — ≥ $500B (to confirm against public AUM figures at fact-base assembly, ticket 08).
3. **Business-mix overlap** — index/ETF + retirement + advice mix comparable to Vanguard's. This rule is what excludes: T. Rowe Price and Janus Henderson (pure-active, no index/ETF), Northern Trust (servicing-led), Franklin Resources (alternatives-heavy multi-manager).

**Structure:** one stated core set; **per-metric availability notes** govern which members appear in each comparison (Fidelity dropped from audited-metric comparisons — e.g., RoE — and shown as voluntary side data; State Street always isolated to its SSGA asset-management segment).

**Basis of comparison:** same metric definitions and same fiscal-year labels across the core — Dec 31 FYE verified for the three US-listed members (BLK/STT/IVZ, asset 02); Amundi's FYE to be confirmed at fact-base assembly (ticket 08); Fidelity has no FYE (no statements). Ownership caveat (mutual/listed/private) displayed wherever RoE is compared (spec story 12); revenue-model caveats (BlackRock Aladdin tech fees, State Street custody/NII, Amundi bancassurance) carried per comparison per asset 02's comparability analysis; Amundi EUR→USD at period FX with the FX date noted, IFRS-vs-US-GAAP flagged; Vanguard RoE = labeled proxy (ticket 01); Fidelity numbers always voluntary-labeled.

**Scale floor is a guardrail, not a discriminator today:** no current excluded candidate fails the ≥$500B floor (TROW $1.89T ✅-verified clears it; others are ⚠️ UNVERIFIED in asset 02). Its purpose is set stability — it blocks future small entrants and will be applied against confirmed AUM figures at ticket 08, where the floor number is also re-checked.

**Feeds:** ticket 06 (RoE comparison design — peer set now fixed), ticket 08 (fact base assembly), ticket 14 (benchmarking views), ticket 16 (RoE comparison views).

Verification: no code changed (grilling decision recorded in ticket + map + CONTEXT.md glossary); no test run required for this ticket.
