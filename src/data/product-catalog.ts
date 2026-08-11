/**
 * The product & services catalog — the structured dataset the /products view
 * renders from. Organized by the ticket-13 taxonomy (funds, ETFs, retirement,
 * brokerage, advice, institutional); every item carries provenance (source
 * name, URL, verification tag, as-of) per the same discipline as the fact
 * base. Content is literal fact from the disclosure research
 * (`.scratch/vanguard-intelligence/assets/01-vanguard-public-disclosures.md`),
 * seed depth — the line-of-business depth decision remains open (ticket 07)
 * and richer catalog data lands with the analysis pipeline (ticket 17).
 */

import type { VerificationTag } from "./fact-base";

/** The six product lines the catalog organizes by (ticket 13 taxonomy; seed
 * decision for ticket 07). Display order is decided. */
export type ProductCategoryId =
  | "funds"
  | "etfs"
  | "retirement"
  | "brokerage"
  | "advice"
  | "institutional";

export interface CatalogItem {
  /** Offering name, as the site labels it. */
  name: string;
  /** Sourced fact or description — literal from asset 01, never invented. */
  description: string;
  /** Human-readable source name. */
  source: string;
  sourceUrl: string;
  verification: VerificationTag;
  /** As-of date when the fact is period-specific (ISO date). */
  asOf?: string;
  /** Free-form note: definition caveats, gap reasons, taxonomy notes. */
  note?: string;
}

export interface ProductCategory {
  id: ProductCategoryId;
  name: string;
  /** One line on what this category covers. */
  blurb: string;
  items: CatalogItem[];
}

const factsAndFiguresUrl =
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/why-vanguard/who-we-are/facts-and-figures.html";
const ceoLetterUrl =
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/salim-letter-to-investors-2026.html";
const feePressUrl =
  "https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-deliver-more-than-half-a-billion-in-expected-savings-to-investors-since-2025-020226.html";

/** The product & services catalog, in taxonomy display order. */
export const productCategories: readonly ProductCategory[] = [
  {
    id: "funds",
    name: "Funds",
    blurb:
      "Index and active mutual funds — the core of Vanguard's investment management line.",
    items: [
      {
        name: "Fund lineup",
        description:
          "465 funds worldwide — 228 US funds (incl. variable annuity portfolios) and 237 non-US — as of Feb 28, 2026.",
        source: "Vanguard corporate — Facts and figures (current page)",
        sourceUrl: factsAndFiguresUrl,
        verification: "verified-from-url",
        asOf: "2026-02-28",
      },
      {
        name: "Fund-lineup expense ratio",
        description:
          "Fund-lineup average expense ratio 0.06% ($6 per $10,000), vs industry 0.44%.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
        note: "The 0.06% lineup average is a different measure from the 0.07% asset-weighted US fund expense ratio on facts-and-figures — compare like-for-like (asset 01).",
      },
      {
        name: "Fund lineup costs",
        description:
          "$250M in 2026 fee reductions (84 share classes across 53 funds) and ~$600M combined 2025+2026 savings delivered to investors.",
        source: "Vanguard pressroom — press release (Feb 2, 2026)",
        sourceUrl: feePressUrl,
        verification: "verified-from-url",
        asOf: "2026-02-02",
      },
      {
        name: "Fund performance vs peers",
        description:
          "84% of funds outperformed Lipper peer-group averages over 10 years (275 of 326 funds, period ended Dec 31, 2025).",
        source: "Vanguard pressroom — press release (Feb 2, 2026)",
        sourceUrl: feePressUrl,
        verification: "verified-from-url",
        asOf: "2025-12-31",
      },
      {
        name: "Active fixed income",
        description:
          "88% of active fixed income funds outperformed Lipper peer-group averages over 10 years (42 of 48 funds).",
        source: "Vanguard pressroom — press release (Feb 2, 2026)",
        sourceUrl: feePressUrl,
        verification: "verified-from-url",
        asOf: "2025-12-31",
      },
    ],
  },
  {
    id: "etfs",
    name: "ETFs",
    blurb:
      "Exchange-traded offerings inside the fund lineup — index ETFs and bond index funds.",
    items: [
      {
        name: "Bond index funds",
        description:
          "$1.5T+ in bond index funds, as of Mar 31, 2026.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
        asOf: "2026-03-31",
        note: "ETF AUM is not published as a separate firm figure — only combined fund-lineup measures (asset 01).",
      },
      {
        name: "Index ETFs",
        description:
          "Index ETFs sit inside the fund lineup: 228 US funds (incl. variable annuity portfolios), as of Feb 28, 2026.",
        source: "Vanguard corporate — Facts and figures (current page)",
        sourceUrl: factsAndFiguresUrl,
        verification: "verified-from-url",
        asOf: "2026-02-28",
      },
    ],
  },
  {
    id: "retirement",
    name: "Retirement",
    blurb:
      "Retirement plans (401(k)/DC) and the tools that support them.",
    items: [
      {
        name: "Retirement plans (401(k)/DC)",
        description:
          "45% of 401(k) investors raised their contribution rates; the average retirement savings rate reached an all-time high of 12% of income.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
      },
      {
        name: "Retirement plan administration",
        description:
          "Vanguard administers employer retirement plans; plan-level AUM and participant counts are not published at firm level (asset 01).",
        source: "Vanguard corporate — Facts and figures (current page)",
        sourceUrl: factsAndFiguresUrl,
        verification: "not-published",
        note: "Retirement-plan metrics would need to be collected per plan or from secondary sources (ticket 17).",
      },
    ],
  },
  {
    id: "brokerage",
    name: "Brokerage",
    blurb:
      "Brokerage accounts and cash products for individual investors.",
    items: [
      {
        name: "Vanguard Cash Plus",
        description:
          "500K+ Cash Plus accounts, Vanguard's cash-management brokerage product.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
      },
      {
        name: "Net new assets",
        description:
          "Record net new assets in 2025 — qualitative claim from the CEO letter; the firm does not publish a dollar figure.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
        note: "Qualitative — no firm AUM or flows figure published (asset 01).",
      },
      {
        name: "Investor Choice",
        description:
          "22M+ equity index fund investors in Investor Choice.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
      },
    ],
  },
  {
    id: "advice",
    name: "Advice",
    blurb:
      "Advisory services for individual investors — personal advice and guidance.",
    items: [
      {
        name: "Personal advisor services",
        description:
          "Vanguard's advice offering (Personal Advisor Services and related); during the April 2025 tariff volatility, 93% of investors stayed invested, with a 5:1 buy-to-sell ratio, and Vanguard reports record investment in client experience.",
        source: "Vanguard — CEO letter to investors (May 1, 2026)",
        sourceUrl: ceoLetterUrl,
        verification: "verified-from-url",
        note: "Client counts for the advice business are not published; the taxonomy naming follows ticket 13 (ticket 07 depth decision pending).",
      },
    ],
  },
  {
    id: "institutional",
    name: "Institutional",
    blurb:
      "Institutional client offerings — served through the same fund lineup.",
    items: [
      {
        name: "Institutional offerings",
        description:
          "Vanguard serves institutional clients through the fund lineup (incl. 237 non-US funds worldwide as of Feb 28, 2026); firm-level institutional AUM is not published.",
        source: "Vanguard corporate — Facts and figures (current page)",
        sourceUrl: factsAndFiguresUrl,
        verification: "not-published",
        note: "Institutional AUM would need to be collected from secondary sources (ticket 17); only the fund-lineup count is published.",
      },
    ],
  },
];
