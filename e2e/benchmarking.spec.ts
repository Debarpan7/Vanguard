import { test, expect } from "@playwright/test";

// Seam 1 — benchmarking views render correct comparisons from the seeded fact
// base, with the peer set membership rules and ownership caveat displayed
// alongside every comparison (ticket 14; spec stories 6, 7, 11, 12).
// Expected values are literal facts from the fact base (src/data/fact-base.ts),
// never recomputed from the page under test.

test("benchmarking view shows the peer set panel with membership rules and ownership caveat", async ({
  page,
}) => {
  await page.goto("/benchmarking");
  await expect(
    page.getByRole("heading", { name: "Benchmarking", level: 1 }),
  ).toBeVisible();

  const panel = page.getByTestId("peer-set-panel");
  await expect(panel).toBeVisible();

  // Core set members (decision: ticket 04).
  for (const name of [
    "BlackRock",
    "Fidelity",
    "State Street (SSGA)",
    "Invesco",
    "Amundi",
  ]) {
    await expect(panel.getByText(name, { exact: true })).toBeVisible();
  }

  // Membership rules.
  await expect(panel.getByText(/Audited financials/)).toBeVisible();
  await expect(panel.getByText(/AUM scale floor/)).toBeVisible();
  await expect(panel.getByText(/Business-mix overlap/)).toBeVisible();

  // Ownership caveat.
  await expect(panel.getByText(/client-owned \(mutual\)/)).toBeVisible();
});

test("comparison tables render seeded values for Vanguard and pending-collection for peers", async ({
  page,
}) => {
  await page.goto("/benchmarking");

  // All five metrics render by default, one comparison table each.
  for (const metric of ["aum", "clients", "cost-ratio", "revenue", "roe"]) {
    await expect(page.getByTestId(`benchmark-table-${metric}`)).toBeVisible();
  }

  // AUM: Vanguard's seeded points, then explicit gaps; peers pending.
  const aum = page.getByTestId("benchmark-table-aum");
  const vg = aum.getByTestId("benchmark-row-vanguard");
  await expect(vg.getByTestId("benchmark-cell-vanguard-2021")).toHaveText("$8.0T");
  await expect(vg.getByTestId("benchmark-cell-vanguard-2022")).toHaveText("$8.1T");
  await expect(vg.getByTestId("benchmark-cell-vanguard-2023")).toHaveText(
    "Not published",
  );
  const blk = aum.getByTestId("benchmark-row-blackrock");
  await expect(blk.getByTestId("benchmark-cell-blackrock-2021")).toHaveText(
    "Pending collection",
  );
  // Fidelity's availability note travels with its row.
  await expect(aum.getByTestId("benchmark-row-fidelity")).toContainText(
    /voluntary/i,
  );

  // Cost ratio: Vanguard's seeded series 0.09 → 0.07.
  const ratio = page.getByTestId("benchmark-table-cost-ratio");
  const vgRatio = ratio.getByTestId("benchmark-row-vanguard");
  await expect(vgRatio.getByTestId("benchmark-cell-vanguard-2021")).toHaveText(
    "0.09%",
  );
  await expect(vgRatio.getByTestId("benchmark-cell-vanguard-2025")).toHaveText(
    "0.07%",
  );

  // Revenue: Vanguard is an explicit gap, never an invented number.
  const revenue = page.getByTestId("benchmark-table-revenue");
  await expect(revenue.getByTestId("benchmark-row-vanguard")).toContainText(
    "Not published",
  );
});

test("Fidelity is excluded from audited-metric comparisons and flagged as voluntary side data", async ({
  page,
}) => {
  await page.goto("/benchmarking");

  // Revenue and RoE are audited-statement metrics (ticket 04): Fidelity is
  // dropped from these comparisons, and the table says so explicitly.
  for (const metric of ["revenue", "roe"]) {
    const table = page.getByTestId(`benchmark-table-${metric}`);
    await expect(table.getByTestId("benchmark-row-fidelity")).toHaveCount(0);
    await expect(
      table.getByTestId(`voluntary-note-${metric}`),
    ).toContainText(/voluntary side data/);
  }

  // AUM, clients, and cost-ratio are published/voluntary figures — Fidelity
  // stays in those tables with its voluntary-data caveat.
  for (const metric of ["aum", "clients", "cost-ratio"]) {
    const table = page.getByTestId(`benchmark-table-${metric}`);
    await expect(table.getByTestId("benchmark-row-fidelity")).toBeVisible();
    await expect(table.getByTestId("benchmark-row-fidelity")).toContainText(
      /voluntary/i,
    );
  }
});

test("ownership caveat is displayed alongside every comparison", async ({
  page,
}) => {
  await page.goto("/benchmarking");
  for (const metric of ["aum", "clients", "cost-ratio", "revenue", "roe"]) {
    await expect(
      page.getByTestId(`benchmark-table-${metric}`),
    ).toContainText("client-owned (mutual)");
  }
});

test("metric filter narrows the view with a stable shareable URL", async ({
  page,
}) => {
  await page.goto("/benchmarking");
  await page.getByRole("link", { name: "Cost ratio" }).click();
  await expect(page).toHaveURL(/\/benchmarking\?metric=cost-ratio$/);
  await expect(page.getByTestId("benchmark-table-cost-ratio")).toBeVisible();
  await expect(page.getByTestId("benchmark-table-aum")).toHaveCount(0);

  // Direct navigation to the stable link renders the same filtered view.
  await page.goto("/benchmarking?metric=aum");
  await expect(page.getByTestId("benchmark-table-aum")).toBeVisible();
  await expect(page.getByTestId("benchmark-table-cost-ratio")).toHaveCount(0);
});

test("firm search state survives metric switching without a document reload", async ({
  page,
}) => {
  await page.goto("/benchmarking");

  // Type a firm filter, then switch metric via the in-place tab (ticket 29).
  await page.getByTestId("benchmarking-firm-search").fill("BlackRock");
  await page.getByRole("link", { name: "Cost ratio" }).click();

  // Client-side navigation: the URL carries the shareable metric, and the
  // firm-search input keeps its value — a full document reload would reset it.
  await expect(page).toHaveURL(/\/benchmarking\?metric=cost-ratio$/);
  await expect(page.getByTestId("benchmarking-firm-search")).toHaveValue(
    "BlackRock",
  );

  // The filtered table still applies the firm filter: only BlackRock remains.
  const table = page.getByTestId("benchmark-table-cost-ratio");
  await expect(table.getByTestId("benchmark-row-blackrock")).toBeVisible();
  await expect(table.getByTestId("benchmark-row-vanguard")).toHaveCount(0);

  // Back to "All metrics" restores every comparison while keeping the filter.
  await page.getByRole("link", { name: "All metrics" }).click();
  await expect(page).toHaveURL(/\/benchmarking$/);
  await expect(page.getByTestId("benchmarking-firm-search")).toHaveValue(
    "BlackRock",
  );
  for (const metric of ["aum", "clients", "cost-ratio", "revenue", "roe"]) {
    await expect(page.getByTestId(`benchmark-table-${metric}`)).toBeVisible();
  }
});
