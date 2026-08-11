import { test, expect } from "@playwright/test";

// Seam 1 — the products & services catalog renders organized by the ticket-13
// taxonomy from seeded content, with the source visible for every item
// (ticket 13). Expected values are literal facts from the product catalog
// (src/data/product-catalog.ts), never recomputed from the page under test.

test("products catalog renders the six categories in taxonomy order", async ({
  page,
}) => {
  await page.goto("/products");
  await expect(
    page.getByRole("heading", { name: "Products & services", level: 1 }),
  ).toBeVisible();

  // Categories render in taxonomy order, each with its items. The h2 set is
  // exactly the taxonomy, in display order (only category names are h2).
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "Funds",
    "ETFs",
    "Retirement",
    "Brokerage",
    "Advice",
    "Institutional",
  ]);
});

test("every category shows at least one item with its source visible", async ({
  page,
}) => {
  await page.goto("/products");
  for (const id of ["funds", "etfs", "retirement", "brokerage", "advice", "institutional"]) {
    const category = page.getByTestId(`product-category-${id}`);
    await expect(category).toBeVisible();

    // At least one item per category…
    const items = category.getByTestId(/^product-item-/);
    await expect(items.first()).toBeVisible();

    // …and its source is shown on the page (name + link).
    await expect(
      category.getByText(/^Source: /).first(),
    ).toBeVisible();
    await expect(category.locator("a[href^='https://corporate.vanguard.com']").first()).toBeVisible();
  }
});

test("seeded catalog facts render literally, with the data-as-of line", async ({
  page,
}) => {
  await page.goto("/products");

  // Seeded literals from asset 01 (facts-and-figures / CEO letter / press release).
  await expect(page.getByText("465 funds worldwide")).toBeVisible();
  const expense = page.getByTestId("product-category-funds").locator("li", {
    hasText: "Fund-lineup expense ratio",
  });
  await expect(expense.getByText("0.06%").first()).toBeVisible();
  await expect(page.getByText("500K+ Cash Plus accounts")).toBeVisible();
  await expect(page.getByText(/84%/)).toBeVisible();

  // Data-as-of line is present on the page.
  await expect(page.getByText(/Data-as-of:/)).toBeVisible();

  // The placeholder is gone.
  await expect(page.getByText(/under construction/i)).toHaveCount(0);
});
