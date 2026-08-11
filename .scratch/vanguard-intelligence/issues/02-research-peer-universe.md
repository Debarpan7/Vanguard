# 02 — Research: peer universe comparability

Type: research
Status: resolved
Blocked by:

## Question

Which firms are credible peers for benchmarking Vanguard, and what financial data does each publish publicly?

Cover the candidate universe:
- **Public asset managers**: BlackRock, State Street, T. Rowe Price, Franklin, Invesco, Amundi, and others — what each reports (10-K / annual report), business mix, revenue model, ownership.
- **Private firms**: Fidelity and others — what they publish voluntarily, and the comparability limits that creates.
- **Comparability to Vanguard**: ownership (mutual vs. listed), product mix (index vs. active, retail vs. institutional), revenue model (fee-based AUM vs. other).

Produce a markdown fact sheet as a linked asset: one row per candidate — firm, ownership, public data available, business mix notes, comparability notes. This ticket feeds the peer set decision; it does not pick the set.

**Linked asset:** `../assets/02-peer-universe.md`

## Answer

Research completed against primary sources (SEC EDGAR for every US-listed candidate's 10-K presence, firm pages for T. Rowe Price, Amundi, and Fidelity, Wayback fallback where live pages were blocked); full deliverable in the linked asset with per-claim verification tags.

Key findings:

- **Listed, fully data-comparable candidates** (all file audited statements — 10-K presence verified via EDGAR): BlackRock (NYSE, 10-K — ⚠️ current EDGAR entity renamed "BlackRock Finance, Inc." 2024-09-26; 10-Ks exist annually but the *current* entity's filing trail is unread this session), State Street (NYSE, 10-K, bank holding company), T. Rowe Price (NASDAQ, 10-K; $1.89T AUM as of Jun 30 2026, active-focused, retirement ~⅔ of AUM), Franklin Resources (NYSE, 10-K, FYE **Sep 30**), Invesco (NYSE, 10-K), Janus Henderson (NYSE/LSE, 10-K, FYE **Jun 30**), Northern Trust (NASDAQ, 10-K, bank holding company), Amundi (Euronext Paris, **Universal Registration Document** — EU 10-K equivalent, IFRS/EUR; Crédit Agricole subsidiary; €2,398bn AUM as of Mar 31 2026).
- **Private, data-limited candidate:** Fidelity (FMR LLC) — no audited firm financials; voluntary stats only (workforce, presence, business breadth). RoE and revenue/profit series impossible from primary sources — same constraint as Vanguard itself.
- **Data comparability ≠ business comparability.** Closest business comparators to Vanguard's index/ETF + retirement + advice mix: BlackRock (scale + iShares), Fidelity (retail breadth), SSGA/State Street (index/ETF, but servicing-led parent), Invesco (index/ETF + active). Pure-active (T. Rowe Price, Janus Henderson) and bank-parented (State Street, Northern Trust) candidates are useful only for specific metric contrasts, with mix caveats.
- **Comparability traps for the fact base (ticket 08) and peer set decision (ticket 04):** three ownership regimes (mutual / listed / private); revenue models differ (Aladdin tech fees, custody/servicing fees, net interest income, bancassurance — revenue totals not like-for-like); staggered fiscal years (Franklin Sep 30, Janus Henderson Jun 30); GAAP regime (US GAAP vs IFRS/EUR for Amundi).
- **This ticket does not pick the peer set** — it delivers the candidate fact sheet; ticket 04 grills the membership rules.

Verification: no code changed (markdown-only research asset + ticket/map records); full e2e suite run as routine check (3 passed); no test run required by this ticket.
