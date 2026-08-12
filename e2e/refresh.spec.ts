import { test, expect } from "@playwright/test";

// Seam 1 — the quarterly refresh pipeline's visible contract (ticket 20).
// The pipeline stamps `site.dataAsOf` (src/lib/site.ts) with the refresh
// date; the marker (src/components/data-as-of-marker.tsx) must render the
// dated label site-wide — never the "Not yet refreshed" fallback. The label
// literal comes from the first refresh stamp (2026-08-12).

test("home page shows the dated data-as-of marker from the last refresh", async ({
  page,
}) => {
  await page.goto("/");
  const marker = page.locator("main").getByTestId("data-as-of");
  await expect(marker).toBeVisible();
  await expect(marker).toHaveText("As of August 12, 2026");
  await expect(marker).not.toHaveText("Not yet refreshed");
});

test("about page shows the dated data-as-of marker", async ({ page }) => {
  await page.goto("/about");
  const marker = page.locator("main").getByTestId("data-as-of");
  await expect(marker).toBeVisible();
  await expect(marker).toHaveText("As of August 12, 2026");
});

test("footer shows the dated data-as-of marker site-wide", async ({ page }) => {
  await page.goto("/metrics");
  const footer = page.getByRole("contentinfo");
  const marker = footer.getByTestId("data-as-of");
  await expect(marker).toBeVisible();
  await expect(marker).toHaveText("As of August 12, 2026");
});
