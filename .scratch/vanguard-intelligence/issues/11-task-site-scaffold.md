# 11 — Task: site scaffold — stack, shell, navigation

**What to build:** The site boots on a chosen stack (the agent picks and documents the choice) and is reachable internally. Full navigation reaches every section — metrics dashboard, products & services, benchmarking, RoE tree, RoE comparisons, chatbot — plus an "About" view that states this is internal reference only, explains what the site is and how to read it, and shows the data-as-of (last refresh) marker mechanism.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Site boots on the chosen stack and is reachable internally
- [x] Navigation reaches every section with a stable placeholder
- [x] About view states internal-reference-only, how to read the site, and the data-as-of mechanism
- [x] Stack choice is documented with rationale
- [x] Browser E2E test asserts navigation and the About view render

## Answer

The site boots on **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4** and is reachable at `http://localhost:3000`. Stack rationale, environment pinning (Turbopack root, system Chrome for Playwright, production-build web server), and the data-as-of contract are recorded in `docs/adr/0001-site-stack.md`.

What was built:

- **Shell** — `src/app/layout.tsx` (Geist fonts, `SiteHeader`, `main`, `SiteFooter`); single source of truth in `src/lib/site.ts` (name, tagline, `navLinks`, `dataAsOf` = `null` → "Not yet refreshed").
- **Navigation** — `src/components/site-header.tsx` (client component, active-state via `usePathname`, `aria-current`) reaches all seven sections; home (`/`) is a card grid over `navLinks`.
- **Section pages** — metrics, products, benchmarking, roe-tree, roe-comparison, chatbot all render `SectionPlaceholder` (H1 + "under construction" note) — real views belong to tickets 12–20.
- **About** — internal-reference-only callout, how-to-read (LLM analysis over public sources, ownership caveat for RoE comparisons, improvement lens), data-and-refresh with the data-as-of marker.
- **Data-as-of mechanism** — `DataAsOfMarker` component (`src/components/data-as-of-marker.tsx`) used in home, footer, and About; `dataAsOfLabel` guards null and unparseable dates so the site never shows a fake or "Invalid Date".
- **E2E** — `e2e/scaffold.spec.ts`, 3 tests against a production build via system Chrome: home name + all 7 nav links; navigation reaches every section with a stable placeholder; About states internal-reference-only + how-to-read + data-as-of. **3/3 green**, typecheck clean, lint clean.

Verification (commit `fc05b09`): `npx tsc --noEmit` pass · `npm run lint` pass · `npm run test:e2e` → 3 passed.
