import { test, expect } from "@playwright/test";

// Seam 1 — the dashboard renders correct values from the fact base. Expected
// values are the seeded facts (`.scratch/vanguard-intelligence/assets/01-vanguard-public-disclosures.md`).
test("metrics dashboard shows headline metrics with definitions, sources, and 5-year trends", async ({
  page,
}) => {
  await page.goto("/metrics");
  await expect(
    page.getByRole("heading", { name: "Metrics", level: 1 }),
  ).toBeVisible();

  // AUM — latest published point FY2025 regulatory AUM, qualified as display-only adviser data.
  const aum = page.getByTestId("metric-card-aum");
  await expect(aum.getByTestId("metric-value")).toHaveText("$10.2T");
  await expect(aum.getByText("As of Sep 30, 2025", { exact: true })).toBeVisible();
  await expect(
    aum.getByText(/display-only regulatory AUM; SEC Form ADV verified/i),
  ).toBeVisible();
  await expect(aum.getByTestId("trend-2021")).toContainText("$8.0T");
  await expect(aum.getByTestId("trend-2022")).toContainText("$8.1T");
  // FY2023 is the historical regulatory AUM published from Form ADV (eaf69c3),
  // not a gap.
  await expect(aum.getByTestId("trend-2023")).toContainText("$6.6T");
  await expect(aum.getByTestId("trend-2025").locator("a")).toHaveAttribute(
    "href",
    /adviserinfo\.sec\.gov/,
  );

  // Clients — latest 50M+ (FY2025); trend shows the 2023 methodology break.
  const clients = page.getByTestId("metric-card-clients");
  await expect(clients.getByTestId("metric-value")).toHaveText("50M+");
  await expect(clients.getByTestId("trend-2021")).toContainText("30M+");
  await expect(clients.getByTestId("trend-2022")).toContainText("30M+");
  await expect(clients.getByTestId("trend-2023")).toContainText("50M+");
  await expect(clients.getByTestId("trend-2025")).toContainText("50M+");

  // Cost ratio — latest 0.07% (FY2025); trend 0.09 → 0.07.
  const ratio = page.getByTestId("metric-card-cost-ratio");
  await expect(ratio.getByTestId("metric-value")).toHaveText("0.07%");
  await expect(ratio.getByTestId("trend-2021")).toContainText("0.09%");
  await expect(ratio.getByTestId("trend-2022")).toContainText("0.08%");
  await expect(ratio.getByTestId("trend-2024")).toContainText("0.07%");

  // Revenue and RoE — explicit gaps for Vanguard, never invented.
  for (const id of ["metric-card-revenue", "metric-card-roe"]) {
    const card = page.getByTestId(id);
    await expect(card.getByTestId("metric-value")).toHaveText("Not published");
    await expect(card.getByTestId("trend-2021")).toContainText("Not published");
    await expect(card.locator("a").first()).toHaveAttribute(
      "href",
      /corporate\.vanguard\.com/,
    );
  }

  // Data-as-of marker is on the page (main, not just the footer).
  const marker = page.locator("main").getByTestId("data-as-of");
  await expect(marker).toBeVisible();
  await expect(marker).not.toBeEmpty();
});
