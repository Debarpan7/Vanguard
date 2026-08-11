# 07 — Grilling: products & services and LoB taxonomy

Type: grilling
Status: open
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
