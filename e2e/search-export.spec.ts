import { test, expect } from "@playwright/test";

// Seam 1 — search, filter, CSV export, and stable shareable links (ticket 19).
// Expected values are literal facts from the fact base (src/data/fact-base.ts),
// never recomputed from the page under test.

async function readStream(stream: NodeJS.ReadableStream | null): Promise<string> {
  if (!stream) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

test("metrics search filters metric cards by name or definition", async ({
  page,
}) => {
  await page.goto("/metrics");
  const search = page.getByTestId("metrics-search");
  const aum = page.getByTestId("metric-card-aum");
  const roe = page.getByTestId("metric-card-roe");

  await expect(aum).toBeVisible();
  await expect(roe).toBeVisible();

  await search.fill("return on equity");
  await expect(roe).toBeVisible();
  await expect(aum).toHaveCount(0);

  await search.fill("zzzz-no-match");
  await expect(page.getByTestId("metrics-empty")).toBeVisible();
});

test("metric card CSV export downloads the 5-year series", async ({ page }) => {
  await page.goto("/metrics");
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-metric-aum").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("vanguard-aum-trend-2021-2025.csv");

  const stream = await download.createReadStream();
  const content = await readStream(stream);
  expect(content).toContain("Fiscal year,Value,Unit,Source,Note");
  expect(content).toContain("2021,$8.0T");
  expect(content).toContain("2022,$8.1T");
  // FY2023 is the historical regulatory AUM published from Form ADV (eaf69c3).
  expect(content).toContain("2023,$6.6T");
});

test("benchmarking CSV export downloads the comparison table", async ({
  page,
}) => {
  await page.goto("/benchmarking?metric=aum");
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-benchmark-aum").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("benchmark-aum-2021-2025.csv");

  const stream = await download.createReadStream();
  const content = await readStream(stream);
  expect(content).toContain("Firm,Ownership,Qualification,Scope,Unit,FY2021");
  expect(content).toContain("Vanguard");
  expect(content).toContain("BlackRock");
  expect(content).toContain("Pending collection");
});

test("stable shareable links per view", async ({ page }) => {
  await page.goto("/metrics");
  // Each card carries an anchor id for a stable fragment link.
  await expect(page.getByTestId("metric-card-aum")).toHaveAttribute("id", "aum");
  await expect(page.getByTestId("metric-card-roe")).toHaveAttribute("id", "roe");

  // The copy button produces the full absolute shareable URL.
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByTestId("copy-metric-aum").click();
  await expect(page.getByTestId("copy-metric-aum")).toHaveText("Copied");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(`${page.url().replace(/\/$/, "")}#aum`);
});

test("firm filter narrows benchmarking rows", async ({ page }) => {
  await page.goto("/benchmarking");
  const aum = page.getByTestId("benchmark-table-aum");
  await page.getByTestId("benchmarking-firm-search").fill("BlackRock");
  await expect(aum.getByTestId("benchmark-row-blackrock")).toBeVisible();
  await expect(aum.getByTestId("benchmark-row-vanguard")).toHaveCount(0);
});
