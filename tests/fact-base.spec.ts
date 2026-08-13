import { test, expect } from "@playwright/test";
import {
  seriesFor,
  latestPublishedPoint,
  peerFirms,
  allFirms,
  firmMeta,
  primarySourceFor,
  auditedMetrics,
  isAuditedMetric,
} from "../src/lib/fact-base";

// Seam 2 — fact base provenance. Expected values are literal facts from the
// disclosure research (`.scratch/vanguard-intelligence/assets/01-vanguard-public-disclosures.md`),
// never recomputed from the code under test.
const YEARS = [2021, 2022, 2023, 2024, 2025];

test("Vanguard AUM series traces to its published points with the correct coverage", () => {
  const aum = seriesFor("aum", "vanguard");
  expect(aum.unit).toBe("USD trillions");
  expect(aum.definition.toLowerCase()).toContain("period-end");

  // Published points (asset 01): $8.0T as of Sep 30 2021, $8.1T as of Mar 31 2022.
  const byYear = new Map(aum.points.map((p) => [p.year, p]));
  expect(aum.points).toHaveLength(5);

  const p2021 = byYear.get(2021)!;
  expect(p2021.value).toBe(8.0);
  expect(p2021.asOf).toBe("2021-09-30");
  expect(p2021.verification).toBe("verified-from-url");
  expect(p2021.sourceUrl).toContain("web.archive.org");

  const p2022 = byYear.get(2022)!;
  expect(p2022.value).toBe(8.1);
  expect(p2022.asOf).toBe("2022-03-31");
  expect(p2022.verification).toBe("verified-from-url");

  // FY2023–FY2025: unpublished on vanguard.com — gaps, never invented.
  for (const year of [2023, 2024, 2025]) {
    const p = byYear.get(year)!;
    expect(p.value).toBeNull();
    expect(p.verification).toBe("not-published");
  }
});

test("latest published AUM point is FY2022 at $8.1T", () => {
  const latest = latestPublishedPoint("aum", "vanguard");
  expect(latest?.year).toBe(2022);
  expect(latest?.value).toBe(8.1);
});

test("Vanguard clients series covers 2021–2025 with the 2023 methodology break noted", () => {
  const clients = seriesFor("clients", "vanguard");
  expect(clients.unit).toBe("Millions of investors");
  const byYear = new Map(clients.points.map((p) => [p.year, p]));

  expect(byYear.get(2021)?.value).toBe(30);
  expect(byYear.get(2022)?.value).toBe(30);
  expect(byYear.get(2023)?.value).toBe(50);
  expect(byYear.get(2024)?.value).toBe(50);
  expect(byYear.get(2025)?.value).toBe(50);

  // Period-end as-of dates, per the cited Wayback captures (asset 01): the
  // 50M+ figure is published with a one-year lag — the Oct-2023 page states
  // "as of Dec 31, 2022", the Dec-2024 page "as of Dec 31, 2023".
  expect(byYear.get(2021)?.asOf).toBe("2021-01-31");
  expect(byYear.get(2022)?.asOf).toBe("2022-11-30");
  expect(byYear.get(2023)?.asOf).toBe("2022-12-31");
  expect(byYear.get(2024)?.asOf).toBe("2023-12-31");
  expect(byYear.get(2025)?.asOf).toBe("2025-12-31");

  // The 30M+ → 50M+ jump is a counting change, not growth — the note must say so.
  const note = byYear.get(2023)?.note ?? "";
  expect(note.toLowerCase()).toContain("methodology break");
  for (const p of clients.points) expect(p.verification).toBe("verified-from-url");
});

test("Vanguard cost ratio series: 0.09, 0.08, 0.08, 0.07, 0.07 (2021–2025)", () => {
  const ratio = seriesFor("cost-ratio", "vanguard");
  expect(ratio.unit).toBe("% of average net assets");
  expect(ratio.definition).toContain("prior-year average net US assets");

  const values = ratio.points.map((p) => p.value);
  expect(values).toEqual([0.09, 0.08, 0.08, 0.07, 0.07]);
  const years = ratio.points.map((p) => p.year);
  expect(years).toEqual(YEARS);

  // Annual-average measure — no period-end as-of on any point.
  for (const p of ratio.points) expect(p.asOf).toBeUndefined();

  // Provenance (verified against Wayback captures this session): FY2021
  // fast-facts 0.09% (2020/21 plateau); FY2022 Oct-2023 page (share of 2022
  // avg); FY2023 Dec-2024 page (share of 2023 avg); FY2024 0.07% per asset 01
  // — no capture documents the 2024 measure; FY2025 current page (share of
  // 2025 avg).
  expect(ratio.points[1].sourceUrl).toContain("20231020161441");
  expect(ratio.points[2].sourceUrl).toContain("20241213021319");
  expect(ratio.points[3].verification).toBe("unverified");
  expect(ratio.points[4].sourceUrl).toContain(
    "corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard",
  );
});

test("Vanguard revenue and RoE are explicit gaps — never invented", () => {
  for (const metric of ["revenue", "roe"] as const) {
    const series = seriesFor(metric, "vanguard");
    expect(series.points).toHaveLength(5);
    for (const p of series.points) {
      expect(p.value).toBeNull();
      expect(p.verification).toBe("not-published");
    }
  }
  expect(latestPublishedPoint("revenue", "vanguard")).toBeUndefined();
  expect(latestPublishedPoint("roe", "vanguard")).toBeUndefined();
});

test("audited metrics are exactly revenue and roe — the Fidelity exclusion scope", () => {
  expect(auditedMetrics).toEqual(["revenue", "roe"]);
  for (const metric of auditedMetrics) {
    expect(isAuditedMetric(metric)).toBe(true);
  }
  for (const metric of ["aum", "clients", "cost-ratio"] as const) {
    expect(isAuditedMetric(metric)).toBe(false);
  }
});

test("every headline metric exists for Vanguard and every peer with full year coverage", () => {
  const firms = [
    "vanguard",
    "blackrock",
    "fidelity",
    "state-street",
    "invesco",
    "amundi",
  ] as const;
  const metrics = ["aum", "clients", "cost-ratio", "revenue", "roe"] as const;
  for (const firm of firms) {
    for (const metric of metrics) {
      const series = seriesFor(metric, firm);
      expect(series.points.map((p) => p.year)).toEqual(YEARS);
      if (firm === "blackrock" || firm === "invesco") {
        const expectedVerification =
          metric === "revenue" || metric === "roe"
            ? "verified-from-url"
            : "pending-collection";
        for (const point of series.points) {
          expect(point.verification).toBe(expectedVerification);
        }
      } else if (firm === "state-street" || firm === "amundi") {
        const expectedVerification = metric === "revenue" ? "unverified" : "pending-collection";
        for (const point of series.points) {
          expect(point.verification).toBe(expectedVerification);
        }
      } else if (firm !== "vanguard") {
        for (const point of series.points) {
          expect(point.verification).toBe("pending-collection");
        }
      }
    }
  }
});

test("peer rows are pending-collection with their primary source identified", () => {
  const blk = seriesFor("aum", "blackrock");
  for (const p of blk.points) {
    expect(p.verification).toBe("pending-collection");
    expect(p.source).toContain("10-K");
  }
  const fid = seriesFor("roe", "fidelity");
  for (const p of fid.points) {
    expect(p.verification).toBe("pending-collection");
    expect(p.source).toContain("voluntary");
  }
});

test("secondary revenue facts remain scoped and display-only", () => {
  const stateStreet = seriesFor("revenue", "state-street");
  const amundi = seriesFor("revenue", "amundi");

  expect(stateStreet.unit).toBe("USD billions");
  expect(stateStreet.points[0]).toMatchObject({
    verification: "unverified",
    issuerScope: "State Street Investment Management segment / SSGA-relevant scope",
    comparabilityClassification: "display-only-segment",
  });
  expect(amundi.unit).toBe("EUR billions");
  expect(amundi.points[0]).toMatchObject({
    verification: "unverified",
    sourceCurrency: "EUR",
    accountingBasis: expect.stringContaining("IFRS"),
    comparabilityClassification: "display-only-eur-ifrs",
  });
});

test("peer set is the ticket-04 core set in display order", () => {
  expect(peerFirms).toEqual([
    "blackrock",
    "fidelity",
    "state-street",
    "invesco",
    "amundi",
  ]);
  expect(allFirms[0]).toBe("vanguard");
  expect(allFirms.slice(1)).toEqual(peerFirms);
});

test("firm metadata records ownership and per-firm availability notes", () => {
  expect(firmMeta.vanguard.ownership).toBe("mutual");
  expect(firmMeta.blackrock.ownership).toBe("listed");
  expect(firmMeta.fidelity.ownership).toBe("private");
  expect(firmMeta["state-street"].ownership).toBe("listed");
  expect(firmMeta.invesco.ownership).toBe("listed");
  expect(firmMeta.amundi.ownership).toBe("listed");

  // Availability notes match the ticket-04 decision, verbatim on every surface.
  expect(firmMeta.fidelity.note.toLowerCase()).toContain("voluntary");
  expect(firmMeta["state-street"].note.toLowerCase()).toContain("segment");
  expect(firmMeta.amundi.note.toLowerCase()).toContain("ifrs");
  expect(firmMeta.amundi.note.toLowerCase()).toContain("eur");
  expect(firmMeta.vanguard.note.toLowerCase()).toContain("mutual");
});

test("peer primary sources identify the filing each series is collected from", () => {
  expect(primarySourceFor("blackrock")).toContain("10-K");
  expect(primarySourceFor("state-street")).toContain("10-K");
  expect(primarySourceFor("invesco")).toContain("10-K");
  expect(primarySourceFor("amundi")).toContain("Universal Registration Document");
  expect(primarySourceFor("fidelity")).toContain("voluntary");
});
