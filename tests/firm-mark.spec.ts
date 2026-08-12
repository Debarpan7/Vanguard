import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FirmMark } from "../src/components/firm-mark";
import type { FirmMarkProps } from "../src/components/firm-mark";
import { allFirms, firmMeta } from "../src/data/fact-base";

// Seam 2 — the firm-mark component. Expected values are literal facts from
// the mark-references research asset
// (`.scratch/vanguard-intelligence/efforts/ui-polish/assets/01-firm-mark-references.md`)
// and the fact base's display metadata — never recomputed from the code
// under test.
//
// Elements are built with `createElement`, not JSX: Playwright's unit-test
// transform compiles JSX against its own `playwright/jsx-runtime` (marker
// objects, not React elements), and Node 26's native TS loader rejects JSX
// in `.ts` files — see the effort map's "Decisions so far".

const FIRM_BRAND_HEXES: Record<string, string> = {
  vanguard: "#c41230",
  blackrock: "#141414",
  fidelity: "#00a550",
  "state-street": "#d50032",
  invesco: "#f5821f",
  amundi: "#e2001a",
};

const render = (props: FirmMarkProps): string =>
  renderToStaticMarkup(createElement(FirmMark, props));

test("renders a distinct mark for every firm id in the fact base", () => {
  // allFirms is the fact base's display order: Vanguard first, then the peer set.
  expect(allFirms).toEqual([
    "vanguard",
    "blackrock",
    "fidelity",
    "state-street",
    "invesco",
    "amundi",
  ]);

  const markups = allFirms.map((firm) => render({ firm }));

  // One svg per firm, with an accessible label naming that firm.
  for (const [i, firm] of allFirms.entries()) {
    expect(markups[i]).toContain("<svg");
    expect(markups[i]).toContain(`aria-label="${firmMeta[firm].name} logo"`);
  }

  // Each firm renders its own geometry — the six outputs are pairwise distinct.
  expect(new Set(markups).size).toBe(6);
});

test("labels every firm by its fact-base display name", () => {
  expect(render({ firm: "vanguard" })).toContain('aria-label="Vanguard logo"');
  expect(render({ firm: "blackrock" })).toContain('aria-label="BlackRock logo"');
  expect(render({ firm: "fidelity" })).toContain('aria-label="Fidelity logo"');
  expect(render({ firm: "state-street" })).toContain(
    'aria-label="State Street (SSGA) logo"',
  );
  expect(render({ firm: "invesco" })).toContain('aria-label="Invesco logo"');
  expect(render({ firm: "amundi" })).toContain('aria-label="Amundi logo"');
});

test("honors size (default 24px, within the spec's 24–32px legibility floor)", () => {
  const defaults = render({ firm: "vanguard" });
  expect(defaults).toContain('width="24"');
  expect(defaults).toContain('height="24"');
  expect(defaults).toContain('viewBox="0 0 32 32"');

  const sized = render({ firm: "blackrock", size: 32 });
  expect(sized).toContain('width="32"');
  expect(sized).toContain('height="32"');
});

test("honors className onto the svg", () => {
  const markup = render({ firm: "invesco", className: "h-6 w-6 shrink-0" });
  expect(markup).toContain('class="h-6 w-6 shrink-0"');
});

test("defaults to the firm's brand hue; the color prop overrides it", () => {
  // Brand hexes are literals from the mark-references asset.
  const vanguard = render({ firm: "vanguard" });
  expect(vanguard).toContain('fill="#c41230"');
  expect(vanguard).not.toContain('fill="currentColor"');

  const overridden = render({ firm: "vanguard", color: "#123456" });
  expect(overridden).toContain('fill="#123456"');
});

test("monochrome variant renders currentColor and drops the brand hue", () => {
  for (const firm of allFirms) {
    const markup = render({ firm, monochrome: true });
    expect(markup).toContain('fill="currentColor"');
    expect(markup).toContain('stroke="currentColor"');
    expect(markup).not.toContain(FIRM_BRAND_HEXES[firm]);
  }
});
