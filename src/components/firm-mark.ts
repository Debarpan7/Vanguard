import { createElement } from "react";
import type { ReactElement } from "react";
import type { FirmId } from "@/data/fact-base";
import { firmMeta } from "@/data/fact-base";

/**
 * Approximate brand hues per firm, from the mark-references research asset
 * (`.scratch/vanguard-intelligence/efforts/ui-polish/assets/01-firm-mark-references.md`
 * — ⚠️ approximations from general brand knowledge, tagged there). Every
 * caller can override via `color` or force `monochrome` for the site's own
 * navy/gold contexts; the firms' palettes are deliberately not the site
 * palette (ticket 21).
 */
export const FIRM_MARK_COLORS: Readonly<Record<FirmId, string>> = {
  vanguard: "#c41230",
  blackrock: "#141414",
  fidelity: "#00a550",
  "state-street": "#d50032",
  invesco: "#f5821f",
  amundi: "#e2001a",
};

export interface FirmMarkProps {
  /** Firm id from the fact base — the mark renders for this key. */
  firm: FirmId;
  /** Rendered box size in px (viewBox is 32×32); default 24. */
  size?: number;
  /** Overrides the firm's brand hue. Ignored when `monochrome` is set. */
  color?: string;
  /** Renders in `currentColor` for constrained contexts (navy/gold reuse). */
  monochrome?: boolean;
  className?: string;
}

/**
 * Hand-rolled, simplified mark geometry per firm — recognizable at 24–32px,
 * not pixel-perfect trademark reproductions (spec rule; sources in the
 * mark-references asset). Shapes inherit `fill`/`stroke` from the root svg;
 * outline shapes set `fill="none"` and their own stroke width.
 *
 * Built with `createElement` (not JSX) on purpose: this component is loaded
 * by Playwright's unit-test pipeline, where JSX would compile against
 * Playwright's own `playwright/jsx-runtime` (marker objects, not React
 * elements) — see the effort map's "Decisions so far".
 */
const FIRM_MARK_PATHS: Readonly<Record<FirmId, ReactElement>> = {
  // The Vanguard "V" — bold angular V (sail/needle motif; named for HMS Vanguard).
  vanguard: createElement("path", { d: "M3 5 L12 5 L16 18 L20 5 L29 5 L16 31 Z" }),
  // BlackRock — bold "B" (stem + two bowls) with the swoosh sweeping beneath.
  blackrock: createElement(
    "g",
    null,
    createElement("rect", { x: 7, y: 6, width: 4, height: 22, rx: 1 }),
    createElement("path", { d: "M11 6h4a5.5 5.5 0 0 1 0 11h-4z" }),
    createElement("path", { d: "M11 17h4a5.5 5.5 0 0 1 0 11h-4z" }),
    createElement("path", {
      d: "M2 27c10 0 19-4 27-14",
      fill: "none",
      strokeWidth: 3,
      strokeLinecap: "round",
    }),
  ),
  // Fidelity — the pyramid logomark (triangle with a step-cut base).
  fidelity: createElement("path", { d: "M4 27 L10 27 L16 13 L22 27 L28 27 L16 5 Z" }),
  // State Street — the swallowtail pennant/flag symbol.
  "state-street": createElement("path", {
    d: "M5 6 L23 6 L23 12 L27 16 L23 20 L23 26 L5 26 Z",
  }),
  // Invesco — the mountain logomark (two-peak silhouette).
  invesco: createElement("path", { d: "M4 26 L12 9 L16 18 L20 8 L28 26 Z" }),
  // Amundi — bold "A" with the arc sweeping above it.
  amundi: createElement(
    "g",
    null,
    createElement("path", { d: "M8 27 L16 6 L24 27 L20.5 27 L16 13 L11.5 27 Z" }),
    createElement("rect", { x: 12, y: 16.5, width: 8, height: 2.5 }),
    createElement("path", {
      d: "M7 6 C 12 2.5, 20 2.5, 25 6",
      fill: "none",
      strokeWidth: 2.5,
      strokeLinecap: "round",
    }),
  ),
};

/**
 * The shared firm-mark component — one SVG per fact-base firm id, usable
 * from server components (no hooks, no client state). Renders the firm's
 * brand hue by default; pass `monochrome` to inherit `currentColor`, or
 * `color` to override the hue entirely. Dark-mode legibility (spec story 4)
 * is applied by callers per surface — pass `monochrome` or a context `color`
 * on dark backgrounds; the placement lands with ticket 24.
 */
export function FirmMark({
  firm,
  size = 24,
  color,
  monochrome = false,
  className,
}: FirmMarkProps) {
  const fill = monochrome ? "currentColor" : (color ?? FIRM_MARK_COLORS[firm]);
  return createElement(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      role: "img",
      "aria-label": `${firmMeta[firm].name} logo`,
      fill,
      stroke: fill,
      xmlns: "http://www.w3.org/2000/svg",
    },
    FIRM_MARK_PATHS[firm],
  );
}
