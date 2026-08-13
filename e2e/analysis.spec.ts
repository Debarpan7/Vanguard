import { test, expect } from "@playwright/test";

// Ticket 17 — LLM analysis pipeline. The home page is the analysis view
// (decision, answer 2): it keeps the site name + tagline + nav cards, then
// renders the narrative ("how is Vanguard faring"), the named improvement
// opportunities each with its evidence metrics, and the stated improvement
// lens — all from the seeded pipeline output (`src/data/analysis.ts`).
// Expected text is the decided content in the issue's Answer section, not
// recomputed from the code under test.

const OPPORTUNITY_NAMES = [
  "Extend the cost advantage",
  "Close the profitability visibility gap",
  "Restore AUM disclosure",
  "Measure clients consistently",
];

test("home page keeps the site name, tagline, and nav cards", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Vanguard Intelligence", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(/internal reference, LLM-produced analysis/)).toBeVisible();
  // Nav cards still render (scaffold contract).
  await expect(page.getByRole("link", { name: "Metrics" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible();
});

test("home page renders the analysis narrative from the seeded pipeline output", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "How Vanguard is faring", level: 2 }),
  ).toBeVisible();
  // The narrative is grounded in fact-base literals.
  await expect(page.locator("main").getByText(/0\.09%|0\.07%/).first()).toBeVisible();
  await expect(
    page.locator("main").getByText(/client-owned \(mutual\)/i).first(),
  ).toBeVisible();
  // The ownership caveat and current peer-availability qualification are stated.
  await expect(
    page.locator("main").getByText(/audited BlackRock and Invesco revenue and RoE series are available/i).first(),
  ).toBeVisible();
});

test("home page renders the four named opportunities each with its evidence metrics", async ({
  page,
}) => {
  await page.goto("/");
  const analysis = page.locator("main");
  for (const name of OPPORTUNITY_NAMES) {
    await expect(
      analysis.getByRole("heading", { name, level: 3 }),
    ).toBeVisible();
  }
  // Evidence metrics are visible by their rendered evidence labels
  // (decided mapping, answer 3).
  await expect(analysis.getByText("Evidence: Cost ratio")).toBeVisible();
  await expect(
    analysis.getByText("Evidence: Revenue, Return on equity"),
  ).toBeVisible();
  await expect(
    analysis.getByText("Evidence: Assets under management"),
  ).toBeVisible();
  await expect(
    analysis.getByText("Evidence: Number of clients"),
  ).toBeVisible();
});

test("home page states the improvement lens", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /improvement lens/i, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByText(/broad business performance.*technology.*one possible lever/i),
  ).toBeVisible();
});
