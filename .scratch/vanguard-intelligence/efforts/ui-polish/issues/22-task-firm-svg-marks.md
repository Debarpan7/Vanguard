# 22 — Task: hand-built firm SVG mark components

**What to build:** Accurate, hand-rendered SVG marks for the six firms — Vanguard, BlackRock, Fidelity, State Street, Invesco, Amundi — as one reusable component keyed by the fact base's firm ids, ready for the data views to drop in. Sources are researched from official public mark references (brand pages / press kits — public sources only) and recorded as a linked asset: `../assets/01-firm-mark-references.md` (this effort).

**Blocked by:** None — can start immediately.

**Status:** resolved (commit `337b633`)

**Assignee:** GitHub Copilot

- [x] Mark source references gathered from public brand pages and recorded as a linked asset (`../assets/01-firm-mark-references.md`)
- [x] Shared firm-mark component renders a recognizable mark per firm id (matching the fact base's firm ids), with size/color props and a monochrome variant; legible at 24–32px
- [x] Unit tests green: renders per firm id, honors size/className, monochrome variant works

## Answer

**Built:**
- `src/components/firm-mark.ts` — the shared `FirmMark` component keyed by fact-base firm id (`FirmId` from `src/data/fact-base.ts`), exporting `FirmMark`, `FirmMarkProps`, and `FIRM_MARK_COLORS`. Renders one hand-rolled SVG per firm (viewBox 0 0 32 32, default 24px — inside the spec's 24–32px legibility floor), with `size`, `color`, `monochrome`, and `className` props. `monochrome` renders `fill`/`stroke` as `currentColor` so callers can drop the marks into the site's navy/gold contexts; the default is the firm's brand hue (approximations ⚠️, sourced in the linked asset). Server-compatible (no hooks, no client state) so the data views can render it directly. Dark-mode legibility (spec story 4) is applied by callers per surface (`monochrome`/`color` on dark backgrounds) and lands with ticket 24's placement.
- `tests/firm-mark.spec.ts` — Seam 2 coverage: distinct mark per firm id (six pairwise-distinct outputs), aria-labels match fact-base display names (incl. `State Street (SSGA) logo`), size honors default 24 / 32 override, className lands on the svg, brand hue default with `color` override, monochrome variant uses `currentColor` and drops the brand hue.
- Research asset `../assets/01-firm-mark-references.md` — official/public mark sources per firm with a verification legend (✅/⚠️/🚫); BlackRock's corporate page is legally gated (🚫 recorded).

**Verification (both seams):**
- Seam 2 — `npm run test:unit`: 70/70 green (64 prior + 6 new firm-mark tests); `npx tsc --noEmit` clean; `npm run lint` clean.
- Seam 1 — untouched this ticket: the component is not wired into pages until ticket 24, so no E2E changes; the suite stays green as-is.
- Loader note: the component and test are deliberately JSX-free (`createElement`), because Playwright's unit-test transform compiles JSX against its own `playwright/jsx-runtime` (marker objects, not React elements) and Node 26's native TS loader rejects JSX inside `.ts` files — recorded in the map's Decisions so far.

## Review (code review, post-resolution)

Two-axis review (Standards = documented repo standards; Spec = this ticket + the ui-polish spec) of `9e8231d..HEAD`.

**Standards axis — approved, no blocking findings.** Judgement-call nits, both fixed in commit `f8142bc`:
- `firm-mark.tsx` contained zero JSX → renamed to `firm-mark.ts` (`git mv`, history preserved); the honest extension.
- `FIRM_MARK_PATHS` was a plain `Record` while `FIRM_MARK_COLORS` was `Readonly` → made consistent.
- Test tooling shaping prod code (JSX-free form dictated by the Playwright unit pipeline) — documented above, unavoidable, accepted.

**Spec axis — 3 findings, all addressed in `f8142bc`:**
- **(a1) Story 4 (dark mode) only half-provided.** The component ships the `monochrome`/`color` mechanism but BlackRock's `#141414` is unreadable on the dark theme until a caller applies it. Recorded as deferred: dark-mode legibility is owned by ticket 24's placement (its checklist item 2), and the component docstring now documents that callers apply `monochrome`/`color` per surface.
- **(a2) "Linked asset" references did not resolve.** The ticket's `assets/01-firm-mark-references.md` (from `issues/`) and the component docstring's `efforts/ui-polish/assets/...` both lacked the `.scratch/` prefix. Fixed: ticket now links `../assets/...` (resolves relative to `issues/`, matching the site effort's convention), map Sources now `assets/...` (relative to map), component docstring fully-qualified.
- **(c1) Pairwise-distinct test was circular.** `new Set(markups).size === 6` proved only aria-label uniqueness (labels are unique by construction — six identical geometries would pass). Fixed: distinctness is now asserted on the svg's **inner geometry** (slice between the first `>` and `</svg>`), `new Set(geometries).size === 6`.

Post-review verification: `npm run test:unit` 70/70, `npx tsc --noEmit` clean, `npm run lint` clean.
