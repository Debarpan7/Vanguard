# 21 — Task: design tokens and site shell color pass

**What to build:** A first styled pass that both locks the visual direction and applies it to the site shell — the tokens every later ticket builds against. Starts with a cheap, rough take on the home page and one data view (benchmarking) to react to, then lands the agreed navy + gold system in code: a token surface (colors, shadows, radii, durations/easings; light and dark variants; AA contrast on every navy/gold pairing), the navy header and footer, gold active-nav accent, nav transitions, and colored lucide-react icons on the header nav sections. This is the human-in-the-loop design gate: the exact hue/scale/type decisions are made here, in consultation, before the build tickets proceed.

**Blocked by:** None — can start immediately.

**Status:** in-progress (prototype take in review)

**Assignee:** GitHub Copilot

- [ ] Rough styled take on home + benchmarking produced and agreed — token values (navy/gold hues, AA pairings, type treatment, radius/shadow scale) locked
- [ ] `lucide-react` added (pinned); colored section icons render in the header nav
- [ ] Navy header and footer, gold active-nav accent, nav transitions — in both light and dark modes
- [ ] Nav link names, active detection, and the data-as-of marker contract unchanged; scaffold E2E green
