import { test, expect } from "@playwright/test";

// Ticket 18 — live grounded chatbot (Seam 1). The /chatbot view hosts a
// client-side chat: message list + input + send, with the deterministic
// retrieval engine running in-browser (ticket 09, decisions D1/D5). Answers
// are grounded in the fact base with source links; advice and out-of-fact-base
// questions are refused with fixed literal strings; benchmarking answers carry
// the ownership caveat. Expected text is the decided content, not recomputed
// from the code under test.

test("chatbot page renders the chat view with an example prompt", async ({
  page,
}) => {
  await page.goto("/chatbot");
  await expect(
    page.getByRole("heading", { name: "Chatbot", level: 1 }),
  ).toBeVisible();
  await expect(page.getByLabel(/your question/i)).toBeVisible();
  await expect(
    page.getByText(/What is Vanguard's AUM\?/i).first(),
  ).toBeVisible();
});

test("a known query returns the correct grounded answer with a source link", async ({
  page,
}) => {
  await page.goto("/chatbot");
  await page.getByLabel(/your question/i).fill("What is Vanguard's AUM?");
  await page.getByRole("button", { name: /ask/i }).click();
  // Grounded answer — decided fact-base literal, not recomputed.
  await expect(
    page
      .locator("main")
      .getByText(/Assets under management: \$10\.2T as of Sep 30, 2025/),
  ).toBeVisible();
  await expect(
    page
      .locator("main")
      .getByText(/display-only regulatory aum; sec form adv verified/i),
  ).toBeVisible();
  // The source is rendered as a real link to the fact-base source URL.
  const sourceLink = page.locator("main").getByRole("link").first();
  await expect(sourceLink).toBeVisible();
  await expect(sourceLink).toHaveAttribute(
    "href",
    /^https:\/\//,
  );
});

test("an advice question is refused with the fixed advice string", async ({
  page,
}) => {
  await page.goto("/chatbot");
  await page.getByLabel(/your question/i).fill("Should I invest in Vanguard?");
  await page.getByRole("button", { name: /ask/i }).click();
  await expect(
    page
      .locator("main")
      .getByText(/can't give investment, regulatory, or legal advice/i),
  ).toBeVisible();
});

test("an out-of-fact-base question is refused with the fixed refusal string", async ({
  page,
}) => {
  await page.goto("/chatbot");
  await page.getByLabel(/your question/i).fill("What is the weather in London?");
  await page.getByRole("button", { name: /ask/i }).click();
  await expect(
    page.locator("main").getByText(/outside the fact base/i),
  ).toBeVisible();
});

test("a benchmarking answer carries the ownership caveat", async ({ page }) => {
  await page.goto("/chatbot");
  await page
    .getByLabel(/your question/i)
    .fill("Compare Vanguard's AUM to BlackRock");
  await page.getByRole("button", { name: /ask/i }).click();
  await expect(
    page.locator("main").getByText(/client-owned \(mutual\)/i).first(),
  ).toBeVisible();
});
