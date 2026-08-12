# Spec: Vanguard Intelligence UI polish — Take B site-wide system

Status: ready-for-agent
Type: spec

## Problem Statement

The Vanguard Intelligence site needs a coherent, production-ready visual system across every route: Take B mode 2 with a desktop left rail, mobile top menu, Vanguard red/navy identity, strong light and dark themes, card/grid-based content, useful firm marks and icons, accessible motion, and in-place metric switching. The user wants the site to feel like a professional financial analysis product without disturbing a single number, test contract, or piece of data content.

## Solution

A site-wide visual system pass that makes Vanguard Intelligence feel like a finished product while leaving every behavioral contract intact:

- **Firm logos as hand-rendered SVG marks** — Vanguard, BlackRock, Fidelity, State Street, Invesco, and Amundi — placed in the benchmarking tables, peer set panel, and RoE comparison views. The RoE tree drilldown stays clean, and the header keeps its text identity.
- **A professional red + navy palette** — deep navy for structure and emphasis, Vanguard red for active states and data highlights, and pale navy/white/red-tint surfaces in light mode. Expressed as design tokens in both themes.
- **UI icons via `lucide-react`** for navigation, metric cards, home cards, product categories, and actions. Firm marks remain hand-rendered SVGs.
- **Subtle, accessible motion** — hover lifts, scroll fade-ins, and nav transitions, with no table animation and full `prefers-reduced-motion` support.
- **Streamed chatbot replies** — progressive presentation while preserving the deterministic engine's exact final text and accessibility semantics.
- **Take B mode 2 is the locked shell** — a left rail on desktop, a compact top menu on mobile, and no alternate layout selector.
- **Card/grid composition** — content groups use cards and CSS grids across all routes; semantic data tables remain actual tables inside responsive framed panels, with flex reserved for small control internals.
- **Client-side metric switching** — benchmarking metric selection updates its table in place, preserves the `?metric=` URL and firm-search state, and does not perform a document reload.


## User Stories

1. As a consultant benchmarking Vanguard against its peers, I want each firm's logo shown beside its name in the benchmarking tables, so that I can tell firms apart at a glance instead of reading names.
2. As a consultant, I want Vanguard's mark shown first in the firm column, so that the subject of the site anchors every comparison.
3. As a consultant, I want each logo legible and recognizable at small table-cell sizes, so that the marks aid scanning rather than blurring into noise.
4. As a consultant, I want the firm marks to adapt to dark mode, so that they stay legible on the dark theme.
5. As a consultant viewing the peer set panel, I want each firm's mark beside its name and ownership label, so that the membership rules read as a roster of real firms.
6. As a consultant viewing the RoE comparisons, I want the firm marks in the peer-set RoE table and the line-of-business-vs-industry panel, so that both comparison surfaces share the same firm identity language.
7. As a consultant drilling into the RoE tree, I want the decomposition uncluttered by logos, so that the income-statement drilldown stays the focus.
8. As a consultant, I want the site header to keep its text identity, so that "Vanguard Intelligence" reads as the site's name rather than a brand mark (no designed wordmark).
9. As a consultant, I want each header nav section to carry a small colored icon, so that the navigation is scannable and visually distinct from a text menu.
10. As a consultant, I want the active nav section highlighted with the red accent, so that I always know where I am on the site.
11. As a consultant, I want a deep-navy site header and footer, so that the shell frames the content with a professional financial feel.
12. As a consultant, I want navy used for section headers and emphasis across pages, so that the hierarchy reads as intentional design rather than default gray.
13. As a consultant, I want Vanguard red used for links, active states, and data highlights, so that the palette's accent draws the eye to interactive and important elements.
14. As a consultant, I want every red/navy pairing to meet AA contrast in both light and dark modes, so that the styled site remains readable for everyone.
15. As a consultant, I want the palette expressed as a consistent token system, so that all pages restyle together and the site never drifts into one-off colors.
16. As a consultant viewing the metrics dashboard, I want each headline metric card to carry its own colored icon (AUM, clients, cost ratio, revenue, RoE), so that the five metrics are distinguishable at a glance.
17. As a consultant viewing a metric card, I want the value and trend emphasized in the palette, so that the number — not the chrome — is what I see first.
18. As a consultant searching or exporting from the metrics and benchmarking views, I want the search, export, and copy-link actions to carry icons consistent with the rest of the site, so that the action set looks like one system.
19. As a consultant browsing the products catalog, I want each offering category to carry its own icon, so that the catalog's structure is scannable.
20. As a consultant landing on the home page, I want the nav cards to carry section icons and lift on hover, so that the page invites exploration rather than reading as a text list.
21. As a consultant, I want cards, links, and buttons to lift subtly on hover (shadow + border), so that interactive elements feel tactile.
22. As a consultant scrolling a page, I want sections to fade in gently as they enter the viewport, so that the page feels alive without disorienting me.
23. As a consultant, I want these entrances to never cause layout shift, so that content doesn't jump while I'm reading.
24. As a consultant with reduced-motion preferences, I want all animation disabled, so that the site is comfortable and stable for me.
25. As a consultant, I want the dense data tables (benchmarking, RoE) to stay static, so that animating them never impairs reading the numbers.
26. As a consultant using the chatbot, I want answers to stream in progressively, so that replies feel responsive rather than appearing as one wall of text.
27. As a consultant using the chatbot, I want the streamed reply's final text to be exactly the grounded answer (verbatim refusals, caveats, and figures included), so that streaming never alters what the deterministic engine says.
28. As a consultant, I want the chatbot message region to remain polite for assistive technology while streaming, so that screen-reader users aren't spammed by every chunk.
29. As a consultant, I want every page in the new palette to render correctly in dark mode, so that the light and dark themes stay first-class.
30. As a consultant, I want the data-as-of marker styled within the new system, so that the refresh stamp is visible but not loud.
31. As the engineering team, I want every existing E2E and unit test to stay green through the visual pass, so that the restyle provably preserves navigation, headings, testids, chatbot strings, and data content.
32. As the engineering team, I want a screenshot-diff seam over the key pages, so that visual regressions in the restyle are caught automatically.
33. As the engineering team, I want the new tokens, icons, and marks to follow the existing site-shell and fact-base conventions, so that the polish is maintainable alongside the quarterly refresh.
34. As a consultant, I want the visual identity to stop at the site's own boundary — no client-facing styling, no new branding — so that the internal tool doesn't overreach its purpose.
35. As a consultant, I want zero content change: every figure, source link, gap label, and narrative claim exactly as it is today, so that the polish never touches the data.

## Implementation Decisions

- **Design tokens**: the red + navy palette lands as Tailwind 4 `@theme` tokens (colors, shadows, radii, durations/easings) with explicit light and dark variants, expressed in the global stylesheet — one token surface the whole site reads from. Ticket 21 locks the exact hue/scale/type values and AA pairings.
- **Firm marks**: a single shared firm-mark component keyed by firm id, matching the fact base's firm ids exactly (Vanguard, BlackRock, Fidelity, State Street, Invesco, Amundi), with size/color props and a monochrome variant for constrained contexts. Marks are hand-rolled SVG components built from public mark references (brand pages / press kits — public sources only, per the effort's standing preference), with sources recorded as a linked asset. Recognizable at 24–32px, not pixel-perfect trademark reproductions.
- **UI icons**: `lucide-react` added (pinned) and tree-shaken — nav sections, metric cards, products categories, action buttons, home nav cards. Firm marks are never drawn from the icon library.
- **Palette application**: deep navy for shell and emphasis; Vanguard red for links, active nav, actions, and data highlights; pale navy/white/red-tint surfaces for light mode. Light mode is the default unless a saved explicit preference exists, and the in-app toggle is authoritative over OS preference.
- **Motion**: a small client motion primitive (an in-view hook + wrapper) for scroll fade-ins — SSR-safe, no layout shift, bails out under `prefers-reduced-motion`; hover lifts and nav transitions as CSS-level motion tokens; data tables get no animation.
- **Chatbot streaming**: presentation-only. The engine stays pure and returns the complete answer string; the chat view reveals it progressively. The final rendered text must equal the engine output exactly — verbatim refusal strings, the ownership caveat, figures, and source links included. The message region keeps its polite live-region semantics (no chunk-level announcements).
- **Contracts preserved**: navigation names, headings, test IDs (`data-as-of`, `chatbot-messages`), chatbot verbatim strings, cell text and formatting behavior, metric-card anchors, CSV behavior, and the refresh pipeline's validation gate are untouched by this effort.
- **Visual-regression seam**: a dedicated Playwright screenshot-diff spec over the key pages at a fixed viewport against committed baselines, with any dynamic regions masked; baselines regenerated via a documented script, compared in CI. It runs against the same production build the E2E suite already boots.
- **Stack respected**: no change to the Next.js/React/Tailwind stack decided in the site-stack ADR; this effort adds a UI dependency and CSS tokens only.

## Testing Decisions

- **What makes a good test here**: only external behavior is tested — what renders (a mark for each firm id), what the user ends up with (a streamed reply whose final text equals the engine's exact answer), and what the page looks like (screenshots at a fixed viewport). Internal token values, class names, and animation internals are never asserted. For the visual seam, determinism is the test: fixed viewport, self-hosted fonts, static content, masked dynamic regions, committed baselines.
- **Seam 1 — browser E2E (existing)**: the regression guard for the whole effort. It already asserts navigation, headings, testids, the data-as-of marker, and chatbot verbatim strings; every existing spec must stay green unchanged. The streaming contract gets one addition here: after sending a question, the E2E awaits the streamed text's completion and asserts the final text matches the verbatim contract (e.g., a refusal string and a grounded answer with its caveat).
- **Seam 2 — unit (existing, no browser)**: tests the meaningful logic of the polish: the firm-mark component (renders a mark per firm id, honors size/className, monochrome variant), the motion hook (fades in on in-view, bails out under reduced-motion, no layout-shift contract), and the streaming helper (chunk concatenation equals the engine's exact final string — proving streaming is presentation-only).
- **Seam 3 — visual regression (new)**: a screenshot-diff spec covering the key pages — home, metrics, products, benchmarking, RoE tree, RoE comparisons, about, chatbot — at a fixed viewport, compared against committed baselines with dynamic regions masked. Baselines are regenerated through a documented script; CI runs the comparison.
- **Modules tested**: the firm-mark component, the motion hook, and the streaming helper (Seam 2); the key pages' visual output (Seam 3); the full existing behavioral surface (Seam 1).
- **Prior art**: unit tests in the repo's `tests/` directory use literal expected values (e.g., the chatbot spec asserts verbatim strings, never recomputed); E2E specs assert roles/testids/verbatim text against the production build. The visual seam is new and follows Playwright's `toHaveScreenshot` pattern with the repo's existing production-build web server.

## Out of Scope

- A designed site wordmark — the header keeps its text identity (decided in charting).
- Firm logos in the RoE tree drilldown (decided in charting).
- Table animations of any kind (decided in charting).
- Any data or content change: no new facts, no metric changes, no edits to narrative claims, gap labels, or source links.
- New pages, routes, or sections.
- Client-facing delivery — the site is internal reference only (carried from the site effort).
- Paid / premium data sources — public data only (carried).
- Investment advice or regulatory content — the site informs; it doesn't advise (carried).

## Further Notes

- This effort carries the build, not just decisions — the existing UI-polish wayfinder map and its tickets are the execution plan, and this spec is the contract they build against. The exact token values graduate from the shell ticket; everything in this spec beyond those values is decided.
- The design direction was settled by grilling in the charting sessions: firm logos only (real marks, hand-rendered SVG, header stays text), placements = benchmarking + peer set + RoE comparisons (RoE tree clean), Take B mode 2/left rail, red/navy palette, light-mode default with explicit dark toggle, card/grid composition, responsive top menu, `lucide-react` icons, subtle accessible motion (no table animation), streamed chatbot replies with the verbatim contract preserved, and client-side benchmarking metric switching with shareable URL state.
- The visual seam's baselines should be captured once after the shell pass settles and re-baselined deliberately when a later ticket intentionally changes a page — never to mask a regression.
- Refresh hygiene: the quarterly refresh runbook is unaffected — the palette and icons are presentation-only, and the validation gate's outputs are unchanged.
