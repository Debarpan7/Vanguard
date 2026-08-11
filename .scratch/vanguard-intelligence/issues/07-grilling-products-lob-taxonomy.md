# 07 — Grilling: products & services and LoB taxonomy

Type: grilling
Status: resolved
Blocked by:

## Question

What is the products & services taxonomy the site catalogs, and what are Vanguard's lines of business for the RoE comparison?

Decide, one question at a time (grilling + domain-modeling):
- **Product taxonomy**: the canonical catalog the site shows — funds (index/active), ETFs, retirement (401(k)/DC), brokerage, advice (Personal Advisor Services etc.), institutional — and how deep it goes.
- **LoB model**: which lines of business the RoE comparison uses (e.g., investment management, retirement, brokerage, advice), and how Vanguard's disclosure maps to them.
- Term conflicts are resolved into `CONTEXT.md` as they arise.

## Note — catalog seed (ticket 13, resolved)

Ticket 13 shipped the catalog on the six categories listed above (display order: funds, ETFs, retirement, brokerage, advice, institutional), seed depth: headline offerings with sourced facts from asset 01, explicit `not-published` gaps where the firm publishes nothing. This **seeds** the product-taxonomy half of this ticket for the catalog; still open here:
- **Depth**: how deep the catalog should go (fund-level granularity was excluded at ticket 03 — the seed stays offering-level until you decide otherwise).
- **LoB model**: the investment-management / retirement / brokerage / advice mapping for the RoE comparison — gates tickets 15, 16, 17.

## Answer

Three decisions, grilled one at a time (user-approved):

1. **Catalog depth — offering-level, canonical.** The catalog stays at headline-offering depth per category (ticket 13's seed). Fund-level granularity remains excluded (ticket 03 exclusion). Ticket 17 enriches facts at offering level — it does not drill into individual funds/ETFs. The catalog taxonomy is canonical: **funds, ETFs, retirement, brokerage, advice, institutional** (display order, ticket 13).

2. **LoB model — the 4-line model becomes canonical.** The provisional model from ticket 06 is confirmed as the canonical LoB taxonomy: **investment management / retirement / brokerage / advice** (in that order). No new lines; non-core industry representatives (e.g., Schwab) remain deferred to ticket 17's peer-collection work. Vanguard publishes no segment financials — every Vanguard LoB cell renders as an explicit "Not published" gap; no derivation, no proxies (ticket 03 exclusion 3 holds at LoB level).

3. **Catalog-to-LoB mapping — canonical, documented.** The two taxonomies are two views of the same business: the catalog is the product view, the LoB model is the financial-comparison view. Mapping: **funds + ETFs + institutional → investment management; retirement → retirement; brokerage → brokerage; advice → advice**. Recorded in `CONTEXT.md` and reused by ticket 17's pipeline (opportunities connect to metrics and lines).

Unblocks tickets 15, 16 (de-provisionalizes their LoB display), and 17 (full).

## Review

- Reviewed during ticket 17 implementation (commit `XXXXXXX`). No blockers on the taxonomy decisions; implementation detail lives in `issues/17-task-analysis-pipeline.md`.
