import { test, expect } from "@playwright/test";
import {
  productCategories,
  type CatalogItem,
} from "../src/data/product-catalog";

// Seam 2 — product catalog provenance. Expected values are literal facts from
// the disclosure research
// (`.scratch/vanguard-intelligence/assets/01-vanguard-public-disclosures.md`),
// never recomputed from the code under test.

// The six product-line categories the catalog organizes by (ticket 13
// taxonomy; ticket 07 seed decision), in display order.
const CATEGORY_ORDER = [
  "funds",
  "etfs",
  "retirement",
  "brokerage",
  "advice",
  "institutional",
] as const;

// The three asset-01 sources the seed catalog content is drawn from.
const ALLOWED_SOURCE_URLS = [
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html",
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/salim-letter-to-investors-2026.html",
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-deliver-more-than-half-a-billion-in-expected-savings-to-investors-since-2025-020226.html",
] as const;

function allItems(): CatalogItem[] {
  return productCategories.flatMap((c) => c.items);
}

test("catalog is organized by the six ticket-13 categories in display order", () => {
  expect(productCategories.map((c) => c.id)).toEqual([...CATEGORY_ORDER]);
  for (const category of productCategories) {
    expect(category.name.length).toBeGreaterThan(0);
    expect(category.blurb.length).toBeGreaterThan(0);
    expect(category.items.length).toBeGreaterThan(0);
  }
});

test("every catalog item carries a source and a verification tag", () => {
  const items = allItems();
  expect(items.length).toBeGreaterThan(0);
  for (const item of items) {
    expect(item.name.length).toBeGreaterThan(0);
    expect(item.description.length).toBeGreaterThan(0);
    expect(item.source.length).toBeGreaterThan(0);
    expect(ALLOWED_SOURCE_URLS).toContain(item.sourceUrl);
    // Seed items are verified from their URL, or explicitly not published —
    // never unverified or pending (richer tags arrive with ticket 17).
    expect(["verified-from-url", "not-published"]).toContain(
      item.verification,
    );
  }
});

test("funds category carries the seeded fund-lineup facts (asset 01)", () => {
  const funds = productCategories.find((c) => c.id === "funds")!;
  const text = funds.items.map((i) => i.description).join(" ");

  // 465 funds worldwide (228 US incl. variable annuity portfolios + 237
  // non-US), as of Feb 28, 2026 — facts-and-figures.
  expect(text).toContain("465");
  expect(text).toContain("228");
  expect(text).toContain("237");
  expect(text).toContain("Feb 28, 2026");

  // Expense ratio: 0.06% lineup avg vs industry 0.44% (CEO letter).
  const expense = funds.items.find((i) =>
    i.name.toLowerCase().includes("expense"),
  )!;
  expect(expense.description).toContain("0.06%");
  expect(expense.description).toContain("0.44%");

  // Fee cuts: $250M in 2026 (84 share classes across 53 funds); ~$600M
  // combined 2025+2026 savings (press release).
  const costs = funds.items.find((i) => i.name.toLowerCase().includes("cost"))!;
  expect(costs.description).toContain("$250M");
  expect(costs.description).toContain("$600M");

  // Performance vs peers: 84% beat Lipper averages over 10 yrs (275 of 326).
  const perf = funds.items.find((i) =>
    i.name.toLowerCase().includes("performance"),
  );
  expect(perf?.description).toContain("84%");
  expect(perf?.description).toContain("275");

  // Active fixed income: 88% beat over a decade (42 of 48).
  const fixed = funds.items.find((i) => i.name.toLowerCase().includes("fixed"));
  expect(fixed?.description).toContain("88%");
  expect(fixed?.description).toContain("42 of 48");
});

test("retirement and brokerage carry the seeded investor-behavior facts", () => {
  const retirement = productCategories.find((c) => c.id === "retirement")!;
  const retirementText = retirement.items
    .map((i) => i.description)
    .join(" ");
  expect(retirementText).toContain("45%");
  expect(retirementText).toContain("12%");

  const brokerage = productCategories.find((c) => c.id === "brokerage")!;
  const brokerageText = brokerage.items.map((i) => i.description).join(" ");
  expect(brokerageText).toContain("500K+");
});

test("every category's items are honest about what is and is not published", () => {
  // Each category must either state a sourced fact or explicitly mark the
  // gap — no item may claim an unsourced number.
  for (const category of productCategories) {
    for (const item of category.items) {
      if (item.verification === "not-published") {
        expect(item.description.toLowerCase()).toContain("not published");
      } else {
        expect(item.verification).toBe("verified-from-url");
      }
    }
  }
});

test("every item cites exactly one source, whose URL is shown", () => {
  // Review finding (ticket 13, spec axis): an item may only claim facts its
  // single cited source supports — no dual-source items with one URL.
  for (const item of allItems()) {
    const urlCount = ALLOWED_SOURCE_URLS.filter(
      (url) => url === item.sourceUrl,
    ).length;
    expect(urlCount).toBe(1);
    expect(item.source.toLowerCase()).not.toContain(";");
  }
});
