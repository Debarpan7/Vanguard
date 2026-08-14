import { test, expect } from "@playwright/test";
import {
  historicalTargets,
  matchRawTarget,
  rawTargets,
  selectBestRawFiling,
} from "../scripts/adv-timeseries-lib.mjs";

// Seam 2 — the SEC Form ADV pipeline extension for the advisory-section peer
// set (effort: key-metrics, ticket 50). The advisory comparison is built on
// Item 5 data keyed by CRD (1E1); these tests pin the target registry and the
// CRD-first matching rule so the pipeline cannot silently regress to name
// matching or lose a peer.

const advisoryPeerCrds = [
  "106715", // Vanguard Advisers (advisory-section subject column)
  "106614", // BlackRock Advisors
  "104559", // PIMCO
  "107038", // J.P. Morgan Investment Management
  "107738", // Goldman Sachs Asset Management
  "108281", // Fidelity Management & Research
  "110353", // Morgan Stanley Investment Management
  "105496", // T. Rowe Price
  "110885", // Capital Research and Management
];

test("historical target registry includes every advisory-section peer CRD", () => {
  const crds = historicalTargets.map((target) => String(target.crd));
  for (const crd of advisoryPeerCrds) {
    expect(crds).toContain(crd);
  }
});

test("raw target registry keys the advisory peers by CRD", () => {
  const byName = new Map(rawTargets.map((target) => [target.requestedName, target]));
  expect(byName.get("PIMCO")?.crd).toBe("104559");
  expect(byName.get("J.P. Morgan Investment Management")?.crd).toBe("107038");
  expect(byName.get("Goldman Sachs Asset Management")?.crd).toBe("107738");
  expect(byName.get("Fidelity Management & Research")?.crd).toBe("108281");
  expect(byName.get("Morgan Stanley Investment Management")?.crd).toBe("110353");
  expect(byName.get("T. Rowe Price")?.crd).toBe("105496");
  expect(byName.get("Capital Research and Management")?.crd).toBe("110885");
  expect(byName.get("BlackRock Advisors")?.crd).toBe("106614");
  // State Street stays name-only: CRD 112861 resolves to SSGA Limited (UK,
  // inactive) in SEC data — see research 45 / ticket 50.
  expect(byName.get("State Street Global Advisors")?.crd).toBeUndefined();
});

test("raw target matching keys by CRD first, then falls back to exact legal name", () => {
  const targets = [
    {
      firm: "pimco",
      requestedName: "PIMCO",
      sourceName: "PACIFIC INVESTMENT MANAGEMENT COMPANY LLC",
      crd: "104559",
    },
    {
      firm: "state-street",
      requestedName: "State Street Global Advisors",
      sourceName: "STATE STREET GLOBAL ADVISORS, INC.",
    },
  ];
  // CRD is authoritative even when the row's legal name is unexpected.
  expect(
    matchRawTarget({ "1E1": "104559", "1A": "SOMETHING ELSE LLC" }, targets)?.requestedName,
  ).toBe("PIMCO");
  // A row that matches no CRD falls back to the exact legal name.
  expect(
    matchRawTarget({ "1E1": "999999", "1A": "PACIFIC INVESTMENT MANAGEMENT COMPANY LLC" }, targets)
      ?.requestedName,
  ).toBe("PIMCO");
  // A name-only target (no CRD) matches by legal name.
  expect(
    matchRawTarget({ "1E1": "112861", "1A": "STATE STREET GLOBAL ADVISORS, INC." }, targets)
      ?.requestedName,
  ).toBe("State Street Global Advisors");
  // No CRD and no name match → null (the pipeline records a collection gap).
  expect(
    matchRawTarget({ "1E1": "999999", "1A": "UNRELATED ADVISER LLC" }, targets),
  ).toBeNull();
});

test("best-filing selection prefers the annual updating amendment over an earlier other-than-annual filing", () => {
  // Real March-2026 case (CRD 105958): the other-than-annual amendment carries
  // the stale Item 5 snapshot; the annual amendment is the authoritative
  // fiscal-year figure (research 44/45).
  const rows = [
    { FilingID: "2061251", DateSubmitted: "03/10/2026 01:01:28 PM", "5F2c": "10246596045633" },
    { FilingID: "2070614", DateSubmitted: "03/30/2026 09:15:37 AM", "5F2c": "11092665107962" },
  ];
  const filingTypes = new Map([
    ["2061251", "other"],
    ["2070614", "annual"],
  ]);
  expect(selectBestRawFiling(rows, filingTypes)?.FilingID).toBe("2070614");
});

test("best-filing selection falls back to the latest submission date when no annual amendment exists", () => {
  const rows = [
    { FilingID: "1", DateSubmitted: "03/02/2026 04:41:00 PM" },
    { FilingID: "2", DateSubmitted: "03/05/2026 09:00:00 AM" },
  ];
  expect(selectBestRawFiling(rows, new Map())?.FilingID).toBe("2");
  expect(selectBestRawFiling([], new Map())).toBeNull();
});
