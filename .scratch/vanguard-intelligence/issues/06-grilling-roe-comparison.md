# 06 — Grilling: RoE comparison across peer set, industries, and lines of business

Type: grilling
Status: resolved
Blocked by: 04, 05

## Question

How is RoE compared — across the peer set, across industries, and across lines of business?

Decide, using the peer set (04) and the RoE tree (05):
- **Peer set comparison**: Vanguard's RoE vs. each peer's RoE, over the 5 years; how the mutual-vs-listed caveat is presented.
- **Line-of-business comparison**: Vanguard doesn't report segment RoE — decide how LoB-level RoE is derived (proxies, disclosures, or explicit limitations), using the LoB model from the products & services taxonomy ticket (07) where settled.
- **Industry comparison**: which industries the LoB RoEs are compared against (asset management, wealth management, retirement recordkeeping, brokerage), and which public firms represent each industry.
- **Display**: how these comparisons are shown on the site.

## Answer

Four decisions, grilled one at a time (user-approved):

1. **LoB model timing — adopt the provisional 4-line model now.** The line-of-business comparison uses the provisional model **investment management / retirement / brokerage / advice** (ticket 06), marked provisional pending ticket 07's formal LoB taxonomy resolution. Vanguard segment RoE renders as explicit `not-published` gaps with a stated limitation — no derivation via proxies or invented figures (ticket 03 exclusion 3 holds at LoB level too). Unblocks ticket 16 fully; ticket 07 remains open and may revise the model later (displayed label + note will say "provisional").
2. **Industry representatives — peer-set representatives only.** Each industry is represented by firms already in the peer set (04) where a peer genuinely competes in that industry; no new firm ids are added to the fact base. Non-core industry benchmarks (e.g., Schwab for brokerage/advice) are explicitly deferred to ticket 17 with a disclosed note.
3. **Display — two sections, no year selector.** `/roe-comparison` keeps h1 "RoE comparisons" (scaffold E2E) and shows: (A) peer-set RoE table — benchmark-table pattern, rows = firms Vanguard-first, columns = FY2021–25, cells literal facts or explicit gap labels ("Pending collection" vs "Not published"), ownership caveat + Fidelity voluntary-side-data note alongside; (B) LoB-vs-industry panel — the 4 provisional lines, each with its industry's peer representatives, all cells `not-published` (Vanguard) / `pending-collection` (reps), derivation disclosure shown. No `?year=` selector: all cells are gaps and the RoE tree already owns year drilldown.
4. **LoB → industry → representative mapping** (adopted as proposed, grounded in ticket 02/04 comparators):

   | LoB | Industry | Representatives |
   |---|---|---|
   | Investment management | Asset management | BlackRock, Invesco, Amundi |
   | Retirement | Retirement recordkeeping | State Street, Fidelity (voluntary) |
   | Brokerage | Brokerage & trading | Fidelity (voluntary; Schwab deferred to 17) |
   | Advice | Wealth/advice management | Fidelity (voluntary; Schwab deferred to 17) |

   Every Vanguard LoB cell = "Not published" (no segment disclosure — stated limitation, never invented); every representative cell = "Pending collection" until ticket 17.

Feeds ticket 16 (the only ready-for-agent task). Ticket 07 (LoB taxonomy) remains open; the 4-line model is provisional until then.

## Review

- Reviewed by two-axis review during ticket 16 implementation (commit `b922ed7`). No blockers on the comparison design decisions; implementation detail lives in `issues/16-task-roe-comparison-views.md`.
