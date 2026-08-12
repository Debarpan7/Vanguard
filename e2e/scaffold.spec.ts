import { test, expect } from "@playwright/test";

// The sections every page must be reachable from, with the stable
// placeholder heading each section shows until its build ticket lands.
const NAV_LINKS = [
  { name: "Metrics", path: "/metrics", heading: "Metrics" },
  { name: "Products & services", path: "/products", heading: "Products & services" },
  { name: "Benchmarking", path: "/benchmarking", heading: "Benchmarking" },
  { name: "RoE tree", path: "/roe-tree", heading: "RoE tree" },
  { name: "RoE comparisons", path: "/roe-comparison", heading: "RoE comparisons" },
  { name: "Chatbot", path: "/chatbot", heading: "Chatbot" },
  { name: "About", path: "/about", heading: "About" },
];

test("home page shows the site name and navigation to every section", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Vanguard Intelligence", level: 1 }),
  ).toBeVisible();
  const nav = page.getByRole("banner");
  for (const link of NAV_LINKS) {
    await expect(nav.getByRole("link", { name: link.name })).toBeVisible();
  }
});

test("theme toggle is authoritative and persists the explicit preference", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("vanguard-take-b-theme", "dark");
  });
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
});

test("navigation reaches every section with a stable placeholder", async ({ page }) => {
  const nav = page.getByRole("banner");
  for (const link of NAV_LINKS) {
    await page.goto("/");
    await nav.getByRole("link", { name: link.name }).click();
    await expect(page).toHaveURL(new RegExp(`${link.path}$`));
    await expect(
      page.getByRole("heading", { name: link.heading, level: 1 }),
    ).toBeVisible();
  }
});

test("about view states internal reference only, how to read the site, and data as of", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About", level: 1 })).toBeVisible();

  // Internal-reference-only statement (scoped to the page, not the footer).
  await expect(
    page.locator("main").getByText("internal reference only", { exact: false }),
  ).toBeVisible();

  // How to read this site.
  await expect(
    page.getByRole("heading", { name: "How to read this site", level: 2 }),
  ).toBeVisible();

  // Data-as-of (last refresh) marker mechanism.
  const marker = page.locator("main").getByTestId("data-as-of");
  await expect(marker).toBeVisible();
  await expect(marker).not.toBeEmpty();
});
