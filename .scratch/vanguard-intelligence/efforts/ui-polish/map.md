# Map: Vanguard Intelligence UI polish — color, logos, icons, animation

Label: `wayfinder:map`

## Destination

A Vanguard Intelligence site that no longer reads as a default template: firm logos and colored icons across the data views, a professional navy + gold palette applied site-wide in both light and dark modes, and subtle, accessible motion (hover lifts, scroll fade-ins, nav transitions, streamed chatbot replies) — with every existing E2E/unit test contract and all data content intact.

## Notes

- **Domain**: UI design + frontend implementation for an internal-reference financial analysis site (Next.js 16 App Router, React 19, TS, Tailwind 4; shell source of truth `src/lib/site.ts`, fact base `src/data/fact-base.ts`).
- **Execution is in scope**: this effort carries the build, not just decisions — the destination is the changed UI, per the user's request. Tickets 21–26 deliver; ticket 21 (tokens + shell) decides the tokens they build against, ticket 22 builds the firm marks, ticket 23 the visual-regression seam.
- **Direction decided in the charting session (2026-08-12)**:
  - Logos = firm logos only, real marks hand-rendered as SVG; no designed site wordmark — the header keeps its text identity.
  - Logo placements = benchmarking tables, peer set panel, RoE comparisons (tables + LoB-vs-industry panel); the RoE tree drilldown stays clean.
  - Palette = professional financial navy + gold, full palette in BOTH light and dark modes (AA contrast on gold/navy).
  - UI icons = `lucide-react`; firm marks = hand-rolled SVG components.
  - Animations = subtle & accessible: hover lifts, scroll fade-ins, nav transitions; no table animation; all respect `prefers-reduced-motion`.
  - Chatbot = responses stream progressively (final text unchanged — verbatim E2E strings must still match).
- **Hard constraints**: every existing E2E/unit test stays green per ticket (no testid/text/verbatim-string breakage); data is literal — restyling never invents figures; internal reference only.
- **Skills to consult**: frontend-blueprint / frontend-design (visual direction), prototype (design take in ticket 21), research (mark accuracy in ticket 22), frontend-ui-engineering + accessibility, browser-testing-with-devtools / webapp-testing (visual verification), ci-cd-and-automation (suite stays green).
- **Tracker conventions**: issues live in `issues/` as `NN-type-slug.md` (numbers continue the site effort at 21); blocking via the `**Blocked by:**` body line (local-markdown tracker has no native dependencies); **claiming** = set the ticket's `**Assignee:**` line to your handle before any work; on resolution, post a resolution note, mark `**Status:** resolved (commit …)`, and append a context pointer to this map's Decisions so far.

## Decisions so far

<!-- one line per closed ticket: title + gist; detail lives in the ticket -->

- Ticket 22 — firm marks: hand-rendered SVG per fact-base firm id via the shared `FirmMark` component (size/color props + monochrome variant, legible 24–32px); component and tests are JSX-free because Playwright's unit-test transform compiles JSX to its own `playwright/jsx-runtime` (marker objects, not React elements) and Node 26's native TS loader rejects JSX in `.ts` files — `createElement` sidesteps both. Sources: `assets/01-firm-mark-references.md`.

## Not yet specified

- Anything the token-and-shell pass (ticket 21) surfaces that isn't yet a ticket — expected shape: exact typography treatment (Geist weights/sizes), refined spacing/radius/shadow scale, and any accent treatment the take introduces beyond navy + gold.
- Whether home-page nav cards and section pages carry icons beyond the header nav — will be settled by ticket 21's take, then graduated.
- Dark-mode gold handling specifics — exact AA-compliant gold/dark-navy pairings; graduates from ticket 21.

## Out of scope

- A designed site wordmark — the header keeps its text identity (decided in charting).
- Firm logos in the RoE tree drilldown (decided in charting).
- Table animations of any kind (decided in charting).
- Client-facing delivery — the site is internal reference only (carried from the site effort).
- Paid / premium data sources — public data only (carried).
- Investment advice or regulatory content — the site informs; it doesn't advise (carried).
