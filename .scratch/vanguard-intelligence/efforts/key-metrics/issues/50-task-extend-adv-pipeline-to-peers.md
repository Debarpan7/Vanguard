# Task: extend the ADV collection pipeline to peer CRDs

## Question

Extend the repo's existing SEC Form ADV machinery so the advisory section's data can be generated for the full set.

- `scripts/generate-adv-timeseries.mjs` matches by CRD (`1E1`) across history — add the peer CRDs as `historicalTargets`: Vanguard Advisers 106715, BlackRock Advisors 106614, PIMCO 104559, J.P. Morgan IM 107038, GSAM 107738, Fidelity M&R 108281, Morgan Stanley IM 110353, T. Rowe Price 105496, Capital Research 110885.
- Fix the field mapping: use 5D1a / 5D3a / 5F2a–f (the `item5F totalAmountUsd` name does not exist in SEC data — research 45).
- Handle the annual-amendment-in-Q1 cadence: `generate-adv-raw.mjs` matches by firm name in a single month and is brittle for peers that file only in Q1.
- Preserve the as-of-vs-submission-date distinction (Item 5 is a fiscal-year-end snapshot).

Unblocks validating ticket 49 with real data.

**Status:** ready-for-agent
