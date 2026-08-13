# Map: Vanguard Intelligence UI polish — Take B site-wide system

Label: `wayfinder:map`

## Destination

A production-ready Vanguard Intelligence website using Take B mode 2 as the locked visual system: left-rail navigation on desktop, a compact top menu on mobile, Vanguard red/navy branding, first-class light and dark themes, card/grid-based content across every page, firm marks and icons where useful, subtle accessible motion, and client-side metric switching — with every existing E2E/unit test contract and all data content intact.

## Notes

- **Domain**: UI design + frontend implementation for an internal-reference financial analysis site (Next.js 16 App Router, React 19, TS, Tailwind 4; shell source of truth `src/lib/site.ts`, fact base `src/data/fact-base.ts`).
- **Execution is in scope**: this effort carries the build, not just decisions — the destination is the changed UI, per the user's request. Tickets 21–29 deliver; ticket 21 locks the visual system and shell, ticket 22 builds the firm marks, ticket 23 establishes visual regression coverage.
- **Direction decided in the charting session (2026-08-12)**:
  - Logos = firm logos only, real marks hand-rendered as SVG; no designed site wordmark — the header keeps its text identity.
  - Logo placements = benchmarking tables, peer set panel, RoE comparisons (tables + LoB-vs-industry panel); the RoE tree drilldown stays clean.
  - Palette = deep navy structure plus Vanguard red accents, with pale navy, white, and restrained red tints in light mode; gold is not a primary accent for new UI.
  - UI icons = `lucide-react`; firm marks = hand-rolled SVG components.
  - Animations = subtle & accessible: hover lifts, scroll fade-ins, nav transitions; no table animation; all respect `prefers-reduced-motion`.
  - Chatbot = responses stream progressively (final text unchanged — verbatim E2E strings must still match).
  - Responsive shell = left rail on medium/large screens; compact top menu on small screens.
  - Content composition = cards and CSS grids for content; semantic tables remain tables inside framed panels; flex is reserved for control internals.
  - Theme default = light mode unless a saved explicit preference exists; the in-app toggle is authoritative over OS preference.
  - Metric interaction = benchmarking metric selection updates in place, preserves the URL and firm search, and does not perform a document reload.
- **Hard constraints**: every existing E2E/unit test stays green per ticket (no testid/text/verbatim-string breakage); data is literal — restyling never invents figures; internal reference only.
- **Skills to consult**: frontend-blueprint / frontend-design (visual direction), prototype (design take in ticket 21), research (mark accuracy in ticket 22), frontend-ui-engineering + accessibility, browser-testing-with-devtools / webapp-testing (visual verification), ci-cd-and-automation (suite stays green).
- **Tracker conventions**: issues live in `issues/` as `NN-type-slug.md` (numbers continue the site effort at 21); blocking via the `**Blocked by:**` body line (local-markdown tracker has no native dependencies); **claiming** = set the ticket's `**Assignee:**` line to your handle before any work; on resolution, post a resolution note, mark `**Status:** resolved (commit …)`, and append a context pointer to this map's Decisions so far.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

- Ticket 22 — firm marks: hand-rendered SVG per fact-base firm id via the shared `FirmMark` component (size/color props + monochrome variant, legible 24–32px); component and tests are JSX-free because Playwright's unit-test transform compiles JSX to its own `playwright/jsx-runtime` (marker objects, not React elements) and Node 26's native TS loader rejects JSX in `.ts` files — `createElement` sidesteps both. Sources: `assets/01-firm-mark-references.md`.
- Ticket 27 — card composition: shared `SurfaceCard`, `SurfaceGrid`, and `TablePanel` primitives establish framed content groups, responsive grids, and semantic responsive table boundaries across route components; list/table semantics and existing contracts remain intact.

## Not yet specified

- Whether any new page-level interaction beyond benchmarking metric selection needs URL state or local state; revisit after the first full page pass.
- Whether the visual-regression seam needs separate mobile baselines after the responsive shell ticket establishes its final breakpoints.

## Out of scope

- A designed site wordmark — the header keeps its text identity (decided in charting).
- Firm logos in the RoE tree drilldown (decided in charting).
- Table animations of any kind (decided in charting).
- Reintroducing alternate Take B layouts; mode 2/rail is locked for this effort.
- Gold as a primary accent in new UI; legacy token compatibility may remain until unused.
- Client-facing delivery — the site is internal reference only (carried from the site effort).
- Paid / premium data sources — public data only (carried).
- Investment advice or regulatory content — the site informs; it doesn't advise (carried).
