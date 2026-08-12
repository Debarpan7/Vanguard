# 21 — Task: design tokens and site shell color pass

**What to build:** A first styled pass that both locks the visual direction and applies it to the site shell — the tokens every later ticket builds against. Starts with a cheap, rough take on the home page and one data view (benchmarking) to react to, then lands the agreed navy + gold system in code: a token surface (colors, shadows, radii, durations/easings; light and dark variants; AA contrast on every navy/gold pairing), the navy header and footer, gold active-nav accent, nav transitions, and colored lucide-react icons on the header nav sections. This is the human-in-the-loop design gate: the exact hue/scale/type decisions are made here, in consultation, before the build tickets proceed.

**Blocked by:** None — can start immediately.

**Status:** in-progress (prototype take in review)

**Assignee:** GitHub Copilot

- [ ] Rough styled take on home + benchmarking produced and agreed — token values (navy/gold hues, AA pairings, type treatment, radius/shadow scale) locked
- [ ] `lucide-react` added (pinned); colored section icons render in the header nav
- [ ] Navy header and footer, gold active-nav accent, nav transitions — in both light and dark modes
- [ ] Nav link names, active detection, and the data-as-of marker contract unchanged; scaffold E2E green

## Code review (commits `7949756` + `2900010`)

Two-axis review of `f0f9dfd...HEAD` (prototype take + fixes). **Standards**: no
hard violations remain. Fixed: `LiveChrome` moved out of `prototype/` so
production never depends on throwaway code; `VARIANT_LABELS`/`SHELLS` made
`Readonly`; Take C light-mode wordmark gradient darkened to `gold-700/800`
(AA ≥ 4.5 on white; bright gold gradient reserved for dark mode). Judgement
calls noted, not blocking: near-duplicate `TakeAExplorer`/`TakeBExplorer`
bodies (extract if a take wins), `if (take === "A"|"B"|"C")` cascades in both
pages (a shared map would do), `null` as the live-site sentinel, `parseVariant`
accepting `string[]` that never occurs. **Spec**: deliverable faithful — 3
structurally-different takes on `/` + `/benchmarking` via `?variant=`, switcher
with keyboard cycling + focus guard, NODE_ENV gates on layout/shell/switcher/
pages, all contract testids kept. Known quirks, accepted for the prototype:
(1) in-take nav links, metric tabs, and brand links drop `?variant=` and exit
to the live site; (2) Take C hero adds two narrative sentences ("Client-owned
— no shareholders…") not in the fact base — flagged as scope creep, either
trim before folding or keep as a locked-copy decision; (3) takes/switcher stay
in the prod JS bundle (runtime-gated, not compile-removed).

**Status:** in-progress (prototype take in review — HITL)
