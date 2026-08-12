# 21 — Task: lock Take B tokens and the rail shell

**What to build:** Lock Take B mode 2 as the site shell and establish the tokens every later ticket builds against: deep navy structure, Vanguard red accents, pale navy/white light surfaces, explicit dark overrides, typography, spacing, radii, shadows, and motion tokens. Apply the system to the shared rail header/footer, colored Lucide navigation icons, active states, data-as-of marker, and theme toggle. The desktop shell uses a left rail; mobile behavior is handled by ticket 28. Light mode is the default unless a saved explicit preference exists. Remove the alternate layout controls and make the in-app theme toggle authoritative over OS preference.

**Blocked by:** None — can start immediately.

**Status:** resolved (Take B mode 2 is the shared production foundation; mobile behavior remains ticket 28)

**Assignee:** GitHub Copilot

- [x] Take B mode 2/left rail selected; alternate layout controls removed
- [x] Red/navy token values, AA pairings, type treatment, radius/shadow scale, and light/dark surfaces locked
- [x] `lucide-react` added (pinned); colored section icons render in the header nav
- [x] Navy header and footer, red active-nav accent, theme toggle, nav transitions — in both light and dark modes
- [x] Nav link names, active detection, and the data-as-of marker contract unchanged; scaffold E2E green

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

**Status:** resolved (production shell promoted after review repair; downstream page work stays ticketed separately)
