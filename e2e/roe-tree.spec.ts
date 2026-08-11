import { test, expect } from "@playwright/test";

// Seam 1 — the RoE tree renders per the agreed decomposition (decision:
// ticket 05 — income-statement drilldown) across the 5 years, with drilldown
// into driver nodes and every node traceable to the published number it
// derives from (ticket 15; spec stories 8, 9, 10, 12). Expected values are
// literal facts from the RoE tree dataset (src/data/roe-tree.ts) and the fact
// base, never recomputed from the page under test.

const NODES = [
  "roe",
  "net-income",
  "operating-income",
  "revenue",
  "operating-expenses",
  "average-equity",
];

test("the tree renders per the income-statement decomposition with explicit gaps and the mutual caveat", async ({
  page,
}) => {
  await page.goto("/roe-tree");
  await expect(
    page.getByRole("heading", { name: "RoE tree", level: 1 }),
  ).toBeVisible();

  // Every node of the decided decomposition renders (root first).
  for (const id of NODES) {
    await expect(page.getByTestId(`roe-node-${id}`)).toBeVisible();
  }

  // Vanguard publishes no firm-level statements — every node is an explicit
  // gap for the default year (2025), never an invented number.
  for (const id of NODES) {
    await expect(page.getByTestId(`roe-node-${id}-value`)).toHaveText(
      "Not published",
    );
    // No fabricated year-over-year change on gap nodes.
    await expect(page.getByTestId(`roe-node-${id}-delta`)).toHaveText("—");
  }

  // The mutual-vs-listed caveat rides on the root (spec story 12).
  await expect(page.getByTestId("roe-node-roe")).toContainText(
    /client-owned \(mutual\)/,
  );
  await expect(page.getByTestId("roe-node-roe")).toContainText(/labeled proxy/);

  // The operating-expenses node carries the published cost ratio as a labeled
  // note — a ratio of AUM, not an income-statement line (ticket 05).
  const expenses = page.getByTestId("roe-node-operating-expenses");
  await expect(expenses).toContainText("0.07%");
  await expect(expenses).toContainText(/not an income-statement line/);

  // AUM attaches as context, not a node — the context line shows Vanguard's
  // published AUM points from the fact base.
  const aum = page.getByTestId("roe-tree-aum-context");
  await expect(aum).toContainText("$8.0T");
  await expect(aum).toContainText("$8.1T");
  await expect(aum).toContainText("Sep 30, 2021");
});

test("the year selector switches across the 5 years with the latest fiscal year as default", async ({
  page,
}) => {
  await page.goto("/roe-tree");

  // Latest fiscal year (2025) is the default primary view.
  await expect(page.getByTestId("roe-tree-year-2025")).toHaveAttribute(
    "aria-current",
    "true",
  );

  // Switching years updates the URL and keeps every node an explicit gap.
  await page.getByTestId("roe-tree-year-2021").click();
  await expect(page).toHaveURL(/\/roe-tree\?year=2021$/);
  await expect(page.getByTestId("roe-tree-year-2021")).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByTestId("roe-tree-year-2025")).not.toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByTestId("roe-node-revenue-value")).toHaveText(
    "Not published",
  );

  // Every year of the window is selectable.
  for (const year of [2022, 2023, 2024]) {
    await expect(page.getByTestId(`roe-tree-year-${year}`)).toBeVisible();
  }
});

test("drilling into a driver node shows definition, source, gap reason, and the 5-year series", async ({
  page,
}) => {
  await page.goto("/roe-tree?node=operating-expenses");
  const detail = page.getByTestId("roe-node-detail-operating-expenses");
  await expect(detail).toBeVisible();

  // Definition and unit.
  await expect(detail).toContainText("Operating expenses as reported");
  await expect(detail).toContainText("USD billions");

  // Traceability: the published-number source is linked (spec story 10).
  const source = detail.getByTestId("roe-node-detail-operating-expenses-source");
  await expect(source).toHaveAttribute(
    "href",
    /corporate\.vanguard\.com.*facts-and-figures/,
  );

  // Gap reason disclosed, never invented.
  await expect(detail).toContainText(/no firm-level income statement/);

  // The 5-year series renders (header + 5 years), every year an explicit gap.
  const series = detail.getByTestId("roe-series-operating-expenses");
  await expect(series.getByRole("row")).toHaveCount(6);
  await expect(
    detail.getByTestId("roe-series-operating-expenses-value-2021"),
  ).toHaveText("Not published");
  await expect(
    detail.getByTestId("roe-series-operating-expenses-value-2025"),
  ).toHaveText("Not published");
});

test("drilling into the root shows the labeled-proxy caveat and its 5-year series", async ({
  page,
}) => {
  await page.goto("/roe-tree?node=roe");
  const detail = page.getByTestId("roe-node-detail-roe");
  await expect(detail).toBeVisible();

  // Root definition states the average-equity basis (ticket 03).
  await expect(detail).toContainText(/Net income.*average equity/);
  await expect(detail).toContainText(/labeled proxy/);

  const series = detail.getByTestId("roe-series-roe");
  await expect(series.getByRole("row")).toHaveCount(6);
  await expect(detail.getByTestId("roe-series-roe-value-2025")).toHaveText(
    "Not published",
  );
});
