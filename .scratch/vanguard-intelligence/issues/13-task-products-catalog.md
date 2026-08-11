# 13 — Task: products & services catalog

**What to build:** A browsable catalog of Vanguard's products & services organized by the agreed taxonomy — funds, ETFs, retirement, brokerage, advice, institutional — populated from public sources to the depth the taxonomy decides, with sources visible.

**Blocked by:** 11 (Task: site scaffold — stack, shell, navigation), 07 (Grilling: products & services and LoB taxonomy)

**Status:** resolved

- [x] Catalog renders organized by the agreed taxonomy
- [x] Catalog content is populated from public sources to the agreed depth
- [x] Source is shown for the catalog content
- [x] Browser E2E test asserts the catalog renders per the taxonomy from seed content

## Answer

`/products` renders the catalog organized by the ticket-13 taxonomy — **funds, ETFs, retirement, brokerage, advice, institutional** (display order) — from a new sourced dataset, with the source name, URL, and as-of shown for every item.

Built (commit `90eb60c`):

- `src/data/product-catalog.ts` — typed catalog (`ProductCategoryId` six categories, `ProductCategory`, `CatalogItem` with name / description / source / sourceUrl / verification / asOf / note). Every item is a literal fact from asset 01 (facts-and-figures, CEO letter, press release), reusing the fact base's `VerificationTag`; gaps are explicit `not-published` items, never invented (ticket 03 exclusion 3); each item cites exactly one source URL.
- `src/app/products/page.tsx` — placeholder replaced, metrics-page pattern: h1 + intro + `DataAsOfMarker` line + seed-depth caveat (tickets 07/17 open).
- `src/components/product-catalog.tsx` — server component: categories in taxonomy order, items with sources (links), as-of dates, notes; testids `product-category-{id}` / `product-item-{category}-{index}`.
- Seam 2 `tests/product-catalog.spec.ts` (6 tests) — taxonomy order, per-item provenance, seeded literals (465/228/237 funds; 0.06% vs 0.44%; $250M / ~$600M; 84%/275; 88%/42-of-48; 45%/12%; 500K+ Cash Plus), one-source-per-item, honest gap marking.
- Seam 1 `e2e/products.spec.ts` (3 tests) — the six h2s render in exact taxonomy order, every category shows an item with a visible source link, seeded literals + data-as-of render, placeholder gone.

Verification: `tsc --noEmit` clean, `npm run lint` clean, Seam 2 17/17, Seam 1 17/17.

Taxonomy note: the six categories seed the ticket-07 taxonomy for the catalog; the LoB depth decision (07) and richer catalog data (ticket 17) remain open — the page discloses both.

## Review

Two-axis review (standards + spec, parallel sub-agents) over the uncommitted diff; both axes clean after fixes:

- **Standards** — no hard violations. One actionable finding: a local `catalogAsOfLabel` duplicated `formatAsOf` in `src/lib/format.ts` → fixed by importing `formatAsOf`. Remaining notes were judgement calls (taxonomy re-declared in tests, kept under the literal-facts discipline; verification legend simplified to what seed items may use).
- **Spec** — four findings, all fixed: (1) the ETF item inferred "0.07% covers combined mutual fund and ETF expenses", which asset 01 does not say → split into single-source items and dropped the inference; (2) dual-source items showed only one URL → every item now cites exactly one source, enforced by a new unit test; (3) the "45% of 401(k) investors" claim carried the April-2025 volatility context asset 01 attaches to the 93% stat → corrected to literal; (4) "self-directed investing experience" was editorial → made literal ("22M+ equity index fund investors in Investor Choice"). The E2E "taxonomy order" claim is now an exact ordered-heading assertion (`toHaveText`).
