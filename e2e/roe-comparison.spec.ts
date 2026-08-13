import { test, expect } from "@playwright/test";

// Seam 1 — the RoE comparison views render per the agreed design (decision:
// ticket 06): the peer-set RoE table over the 5 years with the ownership
// caveat, plus the line-of-business-vs-industry panel with the canonical
// 4-line model, peer-set representatives, and the derivation disclosure
// (ticket 16; spec stories 13, 15, section 18). Expected values are literal
// facts from the fact base and the comparison dataset, never recomputed from
// the page under test.

test("the peer-set RoE table renders over the 5 years with explicit gaps and the ownership caveat", async ({
  page,
}) => {
  await page.goto("/roe-comparison");
  await expect(
    page.getByRole("heading", { name: "RoE comparisons", level: 1 }),
  ).toBeVisible();

  // The peer-set comparison reuses the benchmark-table pattern for roe.
  const table = page.getByTestId("benchmark-table-roe");
  await expect(table).toBeVisible();

  // Vanguard first: every cell an explicit not-published gap (no firm-level
  // statements published — never an invented number).
  const vanguard = table.getByTestId("benchmark-row-vanguard");
  for (const year of [2021, 2022, 2023, 2024, 2025]) {
    await expect(
      vanguard.getByTestId(`benchmark-cell-vanguard-${year}`),
    ).toHaveText("Not published");
  }

  // BlackRock and Invesco now render audited RoE; the remaining listed peers
  // remain explicit pending-collection gaps.
  for (const firm of ["blackrock", "state-street", "invesco", "amundi"]) {
    const row = table.getByTestId(`benchmark-row-${firm}`);
    for (const year of [2021, 2022, 2023, 2024, 2025]) {
      const expected =
        firm === "blackrock"
          ? ["16.2%", "13.7%", "14.3%", "14.7%", "10.7%"][year - 2021]
          : firm === "invesco"
            ? ["9.3%", "4.5%", "-2.2%", "3.7%", "-1.3%"][year - 2021]
            : "Pending collection";
      await expect(row.getByTestId(`benchmark-cell-${firm}-${year}`)).toHaveText(expected);
    }
  }

  // roe is an audited metric — Fidelity is dropped, the voluntary side-data
  // note and the ownership caveat travel with the table (ticket 04).
  await expect(table.getByTestId("benchmark-row-fidelity")).toHaveCount(0);
  await expect(table.getByTestId("voluntary-note-roe")).toBeVisible();
  await expect(table).toContainText(/client-owned \(mutual\)/);
});

test("the line-of-business panel renders the canonical 4-line model against its industries", async ({
  page,
}) => {
  await page.goto("/roe-comparison");

  const panel = page.getByTestId("lob-comparison-panel");
  await expect(panel).toBeVisible();

  // Every decided line renders with its industry (ticket 06 answer 4).
  const lines = [
    {
      id: "investment-management",
      industry: "Asset management",
      reps: ["BlackRock", "Invesco", "Amundi"],
    },
    {
      id: "retirement",
      industry: "Retirement recordkeeping",
      reps: ["State Street", "Fidelity"],
    },
    {
      id: "brokerage",
      industry: "Brokerage & trading",
      reps: ["Fidelity"],
    },
    {
      id: "advice",
      industry: "Wealth/advice management",
      reps: ["Fidelity"],
    },
  ];

  for (const line of lines) {
    const row = panel.getByTestId(`lob-row-${line.id}`);
    await expect(row).toBeVisible();
    await expect(row.getByTestId(`lob-row-${line.id}-industry`)).toHaveText(
      line.industry,
    );
    // Vanguard's segment RoE is not published — explicit gap, never derived.
    await expect(row.getByTestId(`lob-row-${line.id}-vanguard`)).toHaveText(
      "Not published",
    );
    // Every representative cell is a literal pending-collection gap until
    // ticket 17 (ticket 06 answer 3B) — never an invented figure.
    const reps = row.getByTestId(`lob-row-${line.id}-reps`);
    await expect(reps).toContainText("Pending collection");
    for (const rep of line.reps) {
      await expect(reps).toContainText(rep);
    }
  }

  // Fidelity is voluntary data wherever it stands in for an industry.
  const brokerage = panel.getByTestId("lob-row-brokerage");
  await expect(brokerage.getByTestId("lob-row-brokerage-reps")).toContainText(
    /voluntary/,
  );

  // The derivation disclosure states the limitations verbatim.
  const disclosure = panel.getByTestId("lob-derivation-disclosure");
  await expect(disclosure).toContainText(/not-published/);
  await expect(disclosure).toContainText(/canonical/);
  await expect(disclosure).toContainText(/ticket 07/);
  await expect(disclosure).toContainText(/ticket 17/);
});
