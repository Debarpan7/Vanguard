# 31 — Grilling: canonical metric taxonomy and comparability policy

Type: grilling
Status: resolved
Assignee: GitHub Copilot
Blocked by: 30

## Question

Given the public-source coverage research, which expanded financial and operating metrics are canonical for the five-year competitor fact base, and how is each defined, scoped, unitized, and qualified for comparison?

Decide the coverage threshold; treatment of Vanguard’s mutual-firm gaps and Fidelity’s voluntary data; currency and accounting-basis handling; segment versus firm scope; whether a value is comparable, display-only, or excluded; and the user-visible behavior for unavailable values. Preserve existing approved headline definitions unless intentionally superseded.

## Answer

The canonical metric taxonomy expands the existing headline set into four families:

- **Core financial statements**: revenue, operating expenses, operating income, net income, assets, liabilities, equity, cash flow, and RoE inputs.
- **Scale and flows**: AUM, net flows, clients/investors, headcount, locations, and fund/product counts.
- **Profitability and efficiency**: operating margin, net margin, cost-to-income or comparable efficiency ratios, each with its accounting and scope basis.
- **Business mix and segments**: segment revenue/profit and investment-management, retirement, brokerage, or advice economics where publicly disclosed.

An expanded metric is canonical only when it can be filled for Vanguard plus at least two peers across at least three of the five fiscal years. The existing five headline definitions remain in force. Published observations that do not satisfy the floor are still stored, but are labelled with their scope, definition, currency, accounting basis, and comparability state.

Non-comparable published observations are **stored and shown with a warning by default** rather than silently normalized or hidden. Derived ratios and normalized values are allowed only when all inputs are complete and compatible; they are stored separately from reported values with their formula, basis, and source links. Vanguard and Fidelity disclosure gaps remain explicit gaps, and Fidelity voluntary data remains visibly voluntary.

Verification: resolved through the interactive decision round on 2026-08-13; no application code changed.
