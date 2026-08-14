# Customer-Experience Data Landscape: Vanguard, BlackRock, State Street, Fidelity

**Purpose:** Establish what is actually citable today for a "Key metrics" comparison across App Store rating, Google Play rating, X (Twitter), LinkedIn, and Reddit for the four asset managers.
**Retrieval date (all live values):** 2026-08-14
**Method:** Direct HTTP retrieval of first-party platform pages (Apple App Store, Google Play, x.com) with a standard browser user-agent; corroboration via dated third-party trackers (AltIndex, Icebreaker, reddifier, subredditstats) and Internet Archive CDX records. All values below were captured **on 2026-08-14** unless a different date is stated.

**Citable classification used in this report**
- **CITABLE (strong)** — first-party platform page with a stable URL and a value readable in the server-rendered HTML (App Store / Google Play).
- **CITABLE (weak)** — third-party tracker/mirror snapshot with a dated URL; value is a snapshot, not the platform's live number.
- **NOT-RELIABLY-CITABLE** — login wall, JS-only rendering with no server-side value, dynamic count with no stable endpoint, or platform blocking programmatic access.
- **NOT-EXISTS / cannot confirm** — no evidence of the entity, or existence cannot be confirmed today.

---

## 1. Vanguard

| Metric | Value today (2026-08-14) | Exact URL | Retrieval date | Citable? |
|---|---|---|---|---|
| App Store (iOS), flagship: **Vanguard: Save, Invest, Retire** | **4.6★, 177,342 ratings** (displayed "177K Ratings") | https://apps.apple.com/us/app/vanguard-save-invest-retire/id335186209 | 2026-08-14 | **CITABLE (strong)** |
| App Store alternates | Vanguard Australia (id1384798989), Vanguard Events; other regional/advisor apps | https://apps.apple.com/au/app/vanguard-etfs-and-super/id1384798989 | 2026-08-14 | CITABLE (strong) |
| Google Play, flagship: **Vanguard: Save, Invest, Retire** (`com.vanguard`) | **2.7★, "11.4K reviews"** as displayed; distribution 5★ 3,181 / 4★ 823 / 3★ 861 / 2★ 1,077 / 1★ 4,879 (sums to 10,821 — displayed count rounds up); last update Aug 7, 2026 | https://play.google.com/store/apps/details?id=com.vanguard | 2026-08-14 | **CITABLE (strong)** — quote the summary number ("2.7★, 11.4K reviews"); note rounding vs. distribution |
| X: **@Vanguard_Group** | Handle **exists** (profile title verified: "Vanguard (@Vanguard_Group) / X"). **Follower count: cannot confirm** — count is JS-rendered, absent from server HTML; X's public follow-button JSON endpoint returns empty as of today; no dated third-party figure found | https://x.com/Vanguard_Group | 2026-08-14 | Existence: CITABLE. **Follower count: NOT-RELIABLY-CITABLE** |
| LinkedIn: **linkedin.com/company/vanguard** | Page **exists** (verified via search index + mirror). **First-party count blocked** (LinkedIn returns HTTP 999 to programmatic access). Third-party mirror (Icebreaker): **584,778 followers** (snapshot) | https://www.linkedin.com/company/vanguard/ ; mirror: https://app.icebreaker.xyz/companies/www.linkedin.com%2Fcompany%2Fvanguard | 2026-08-14 | Existence: CITABLE. **Count: NOT-RELIABLY-CITABLE** (first-party); CITABLE (weak) via mirror snapshot |
| Reddit | **No usable firm subreddit.** `r/vanguard` is (was) the **Vanguard: Saga of Heroes (MMO) subreddit**, not the investment firm (per subredditstats.com title: "r/vanguard Subreddit Stats (Vanguard: Saga of Heroes)"). Today `r/vanguard` returns 404 on old.reddit (banned/private or gone); Internet Archive has 200 snapshots 2024–2025. Subscriber count: **cannot confirm**. De-facto Vanguard-investor community is `r/Bogleheads` (not firm-owned) | https://www.reddit.com/r/vanguard/ ; https://subredditstats.com/r/vanguard | 2026-08-14 | **NOT-RELIABLY-CITABLE; identity hazard** — must NOT be used as a Vanguard signal |

---

## 2. BlackRock

| Metric | Value today (2026-08-14) | Exact URL | Retrieval date | Citable? |
|---|---|---|---|---|
| App Store (iOS), consumer flagship: **BlackRock® Active Investor** | **2.1★, 14 ratings** — new app, tiny sample | https://apps.apple.com/us/app/blackrock-active-investor/id6502054391 | 2026-08-14 | **CITABLE (strong)** — flag tiny sample size |
| App Store alternate | **BlackRock Institutional** — 4.2★, 74 ratings; plus Cachematrix, Alumni Network, eFront apps | https://apps.apple.com/us/app/blackrock-institutional/id1399492311 | 2026-08-14 | CITABLE (strong) |
| Google Play, flagship: **BlackRock® Active Investor** (`com.blackrock.activeinvestor`) | **3.7★, 13 reviews** (distribution 5★ 6 / 4★ 3 / 3★ 1 / 1★ 3) | https://play.google.com/store/apps/details?id=com.blackrock.activeinvestor | 2026-08-14 | **CITABLE (strong)** — flag tiny sample size |
| Google Play alternates | BlackRock Institutional (`com.blackrock.public.insights`), BlackRock Advisor Elite | https://play.google.com/store/apps/details?id=com.blackrock.public.insights | 2026-08-14 | CITABLE (strong) |
| X: **@BlackRock** | Handle **exists** (title verified: "BlackRock (@BlackRock) / X"). Follower count: **~1,068,831** per AltIndex tracker snapshot (page title rounds to "1.1M") — third-party, dated by retrieval | https://x.com/BlackRock ; tracker: https://altindex.com/ticker/blk/twitter-followers | 2026-08-14 | Existence: CITABLE. **Count: NOT-RELIABLY-CITABLE** first-party; CITABLE (weak) via AltIndex snapshot |
| LinkedIn: **linkedin.com/company/blackrock** | Page **exists** (search index + mirror). **First-party count blocked** (HTTP 999). Third-party mirror (Icebreaker): **2,330,492 followers** (snapshot) | https://www.linkedin.com/company/blackrock/ ; mirror: https://app.icebreaker.xyz/companies/www.linkedin.com%2Fcompany%2Fblackrock | 2026-08-14 | Existence: CITABLE. **Count: NOT-RELIABLY-CITABLE** (first-party); CITABLE (weak) via mirror snapshot |
| Reddit: **r/BlackRock** | Subreddit **existed** (Internet Archive 200 snapshots Nov 2024–Jul 2025, incl. lowercase `r/blackrock`). **Current status: cannot confirm** — old.reddit returns 404 today; www shell page returns 200 but renders no data (JS-only, shell is served for any name). Subscriber count: **cannot confirm** | https://www.reddit.com/r/BlackRock/ | 2026-08-14 | **NOT-RELIABLY-CITABLE** (existence today unconfirmed; no count) |

---

## 3. State Street (incl. SSGA / State Street Global Advisors)

| Metric | Value today (2026-08-14) | Exact URL | Retrieval date | Citable? |
|---|---|---|---|---|
| App Store (iOS), primary: **State Street Insights** | **5.0★, 12 ratings** — tiny sample | https://apps.apple.com/us/app/state-street-insights/id6469635047 | 2026-08-14 | **CITABLE (strong)** — flag tiny sample size |
| App Store alternates | **State Street Springboard** — 2.5★, 2 ratings (https://apps.apple.com/us/app/state-street-springboard/id463525845); SSGA "One SGA" (id6463144451) | see URLs | 2026-08-14 | CITABLE (strong) |
| Google Play, primary: **State Street Bank** (`com.statestreetbank.grip`, developer "State Street Bank and Trust Company") | **4.6★, 108 reviews** (distribution 5★ 85 / 4★ 12 / 3★ 4 / 2★ 0 / 1★ 4) | https://play.google.com/store/apps/details?id=com.statestreetbank.grip | 2026-08-14 | **CITABLE (strong)** — note: this is the bank's retail app; no "State Street Insights" listing found on Google Play (iOS-only) |
| X: **@StateStreet** | Handle **exists** (title verified: "State Street (@StateStreet) / X"). **Follower count: cannot confirm** — same JS-only wall as other handles; no dated figure retrievable today | https://x.com/StateStreet | 2026-08-14 | Existence: CITABLE. **Follower count: NOT-RELIABLY-CITABLE** |
| LinkedIn: **linkedin.com/company/state-street** | Page **exists** (search index + mirror). **First-party count blocked** (HTTP 999). Third-party mirror (Icebreaker): **712,312 followers**. Separate SSGA page (**state-street-global-advisors**): **110,760 followers** | https://www.linkedin.com/company/state-street/ ; https://www.linkedin.com/company/state-street-global-advisors/ ; mirrors: https://app.icebreaker.xyz/companies/www.linkedin.com%2Fcompany%2Fstate-street , https://app.icebreaker.xyz/companies/www.linkedin.com%2Fcompany%2Fstate-street-global-advisors | 2026-08-14 | Existence: CITABLE. **Count: NOT-RELIABLY-CITABLE** (first-party); CITABLE (weak) via mirror snapshot |
| Reddit: **r/state_street** | **Existence: cannot confirm.** No Internet Archive snapshot has ever been captured; old.reddit served a rendered page on first contact then switched to a signup wall / 403; www shell page returns 200 with no data (shell served for any name). No subscriber count retrievable | https://www.reddit.com/r/state_street/ | 2026-08-14 | **NOT-RELIABLY-CITABLE** (existence unconfirmed; no count) |

---

## 4. Fidelity

| Metric | Value today (2026-08-14) | Exact URL | Retrieval date | Citable? |
|---|---|---|---|---|
| App Store (iOS), flagship: **Fidelity Investments** | **4.8★, 3,263,143 ratings** | https://apps.apple.com/us/app/fidelity-investments/id348177453 | 2026-08-14 | **CITABLE (strong)** |
| App Store alternates | Fidelity Bloom, Fidelity Spire, Fidelity Brokerage, regional apps | (developer page: https://apppricinglab.com/developer/apple/Fidelity%20Investments) | 2026-08-14 | CITABLE (strong) |
| Google Play, flagship: **Fidelity Investments** (`com.fidelity.android`) | **4.1★, "220K reviews"** as displayed; distribution 5★ 148,388 / 4★ 17,579 / 3★ 7,320 / 2★ 6,270 / 1★ 34,678 (sums to 214,235 — displayed count rounds up) | https://play.google.com/store/apps/details?id=com.fidelity.android | 2026-08-14 | **CITABLE (strong)** — quote "4.1★, 220K reviews"; note rounding |
| X: **@Fidelity** | Handle **exists** (title verified: "Fidelity Investments (@Fidelity) / X"). **Follower count: cannot confirm** — JS-only; no dated figure retrievable today | https://x.com/Fidelity | 2026-08-14 | Existence: CITABLE. **Follower count: NOT-RELIABLY-CITABLE** |
| LinkedIn: **linkedin.com/company/fidelity-investments** | Page **exists** (search index + mirror). **First-party count blocked** (HTTP 999). Third-party mirror (Icebreaker): **1,131,027 followers** (snapshot) | https://www.linkedin.com/company/fidelity-investments/ ; mirror: https://app.icebreaker.xyz/companies/www.linkedin.com%2Fcompany%2Ffidelity-investments | 2026-08-14 | Existence: CITABLE. **Count: NOT-RELIABLY-CITABLE** (first-party); CITABLE (weak) via mirror snapshot |
| Reddit: **r/fidelityinvestments** (official, Fidelity-run — Fidelity reps answer in-thread) | **305,901 members** per reddifier.com stats tool (FAQ JSON-LD, regenerated 2026-08-14) — third-party snapshot. Milestone context: 100K members announced ~Mar 2024 (mirrored post). **Direct subscriber count from Reddit itself: cannot confirm today** (platform blocks programmatic access; see notes) | https://www.reddit.com/r/fidelityinvestments/ ; tracker: https://reddifier.com/free-subreddit-analysis-tool/r/fidelityinvestments | 2026-08-14 | Existence + official status: CITABLE. **Count: CITABLE (weak)** via tracker; NOT-RELIABLY-CITABLE from first party |
| Reddit alternate: **r/Fidelity** (unofficial) | **Existed** (Internet Archive 200 snapshots Jan–May 2025). Current status/count: **cannot confirm** (old.reddit 404 today) | https://www.reddit.com/r/Fidelity/ | 2026-08-14 | **NOT-RELIABLY-CITABLE** |

---

## 5. Summary — fillability by firm and dimension

| Dimension | Vanguard | BlackRock | State Street | Fidelity |
|---|---|---|---|---|
| App Store (iOS) rating | ✅ 4.6★ / 177,342 | ✅ 2.1★ / 14 (Active Investor) | ✅ 5.0★ / 12 (Insights) | ✅ 4.8★ / 3,263,143 |
| Google Play rating | ✅ 2.7★ / 11.4K | ✅ 3.7★ / 13 (Active Investor) | ✅ 4.6★ / 108 (State Street Bank) | ✅ 4.1★ / 220K |
| X handle existence | ✅ @Vanguard_Group | ✅ @BlackRock | ✅ @StateStreet | ✅ @Fidelity |
| X follower count | ❌ cannot confirm | ⚠️ weak: 1,068,831 (AltIndex) | ❌ cannot confirm | ❌ cannot confirm |
| LinkedIn page existence | ✅ /company/vanguard | ✅ /company/blackrock | ✅ /company/state-street (+ SSGA page) | ✅ /company/fidelity-investments |
| LinkedIn follower count | ⚠️ weak: 584,778 (Icebreaker) | ⚠️ weak: 2,330,492 (Icebreaker) | ⚠️ weak: 712,312 / SSGA 110,760 (Icebreaker) | ⚠️ weak: 1,131,027 (Icebreaker) |
| Reddit community | ❌ r/vanguard = MMO game sub, not the firm | ⚠️ r/BlackRock existed 2024–25; status unconfirmed | ❌ r/state_street existence unconfirmed | ✅ r/fidelityinvestments official; ⚠️ 305,901 (tracker) |
| Sample-size caveat | fine | tiny (13–74 ratings) | tiny (2–12 ratings) | fine |

Legend: ✅ = citable with a strong first-party URL · ⚠️ = citable only as weak third-party snapshot · ❌ = cannot confirm / not reliably citable today.

**Bottom line:** App Store and Google Play ratings are fully fillable for all four firms with strong first-party citations (with sample-size caveats for BlackRock and State Street). X, LinkedIn, and Reddit counts are **not** retrievable from first-party platforms from this environment and can only be quoted as weak, dated third-party snapshots (only BlackRock's X count has one). Handle/page/subreddit **existence** is citable for all X and LinkedIn entities.

---

## 6. Notes — citation stability, corroboration needs, and policy recommendations

### 6.1 Why App Store / Google Play are strong, and how to keep them honest
- Both platforms server-render rating value and count into the page HTML; URLs are stable and per-app (Apple: `apps.apple.com/us/app/<slug>/id<id>`; Google: `play.google.com/store/apps/details?id=<pkg>`). These qualify as **first-party platform pages** under a strong sourcing policy.
- Ratings and counts are **point-in-time**: they change daily and the same URL will show different values later. Policy: every citation must carry the retrieval date; consider snapshotting via archive.org at publish time so the claim is re-verifiable.
- **Display rounding:** Google Play's summary bar rounds counts (Vanguard "11.4K" vs distribution sum 10,821; Fidelity "220K" vs 214,235). Apple's page shows an exact count (Vanguard 177,342; Fidelity 3,263,143). Recommend citing the summary-bar number (what a reader sees) and, where available, the exact figure from the page's embedded JSON.
- **Sample-size caveat:** BlackRock (14 iOS / 13 Android ratings) and State Street (12 iOS / 108 Android ratings) have trivially small samples. A cross-firm comparison that ranks "State Street 5.0★ > Fidelity 4.8★" would be statistically meaningless; footnote sample sizes and/or suppress stars below a minimum-count threshold.

### 6.2 X (Twitter) — existence citable, counts are not
- Profile existence and display name are citable: `x.com/<handle>` returns a server-rendered `<title>` (verified for all four handles on 2026-08-14).
- **Follower counts are not retrievable from the public page without JS/login**: the count is absent from the served HTML, and the legacy public follow-button endpoint (`cdn.syndication.twimg.com/widgets/followbutton/info.json`) returns an empty body as of today — i.e., **no stable first-party endpoint exists** for logged-out follower counts anymore.
- Counts are also inherently volatile. **Recommendation:** the sourcing policy should treat X follower counts as **weak**; either (a) cite a dated third-party tracker snapshot (only BlackRock has one today: AltIndex 1,068,831, retrieved 2026-08-14), or (b) drop counts from the metric set and use "official handle exists + verified" as the X signal, or (c) commission a screenshot/archive.org capture at publish time as the dated source.

### 6.3 LinkedIn — login wall; first-party counts not citable
- LinkedIn returns HTTP 999 to programmatic access (login wall); follower counts are only visible to logged-in sessions, so there is **no stable first-party dated URL** for company follower counts.
- Third-party mirrors (Icebreaker) serve scraped snapshots (Vanguard 584,778; BlackRock 2,330,492; State Street 712,312; SSGA 110,760; Fidelity 1,131,027 — all retrieved 2026-08-14). These are **weak** sources: they are copies, not the platform, and can be stale or wrong.
- **Recommendation:** either exclude LinkedIn counts from the "strong" metric set (list them in a clearly-labeled "third-party snapshot, not verified against LinkedIn" row), or capture a logged-in screenshot (dated) as the primary citation. Note the **SSGA vs State Street split**: the asset-manager arm is `state-street-global-advisors`, a separate page from the parent company.

### 6.4 Reddit — public counts, but programmatically blocked; identity hazards
- Subscriber counts are public and displayed on the subreddit page, but Reddit blocks datacenter/non-browser access (HTTP 403/404, signup walls; `old.reddit` is being retired and served a wall during retrieval). The new `www.reddit.com` page is a JS shell that reveals nothing in server HTML. **No stable logged-out JSON endpoint is dependable** (`/about.json` requires OAuth-tolerant access; public calls 403).
- **Identity hazard — r/vanguard:** this subreddit is the *Vanguard: Saga of Heroes* (MMO) community, not The Vanguard Group's; today it 404s on old.reddit (likely banned/private). It must never be used as a Vanguard signal. Vanguard's investor community lives in r/Bogleheads (community-run, not firm-owned).
- The only firm-owned community of the four is **r/fidelityinvestments** (Fidelity staff participate); third-party tracker reddifier shows 305,901 members (retrieved 2026-08-14) — usable only as a weak snapshot. r/BlackRock and r/Fidelity existed in 2024–25 (Internet Archive records) but their current status/counts cannot be confirmed today; r/state_street has never been archived and its existence is unconfirmed.
- **Recommendation:** treat Reddit subscriber counts as **weak, point-in-time**; require either an archive.org snapshot (dated URL) or a named third-party stats tool with retrieval date; clearly label r/vanguard as not-a-firm-community.

### 6.5 Cross-cutting policy recommendation
Define two citation tiers in the sourcing policy:
1. **Strong** — first-party platform pages (App Store, Google Play; also x.com for handle existence, LinkedIn for page existence). Value + URL + retrieval date.
2. **Weak** — third-party trackers/mirrors (AltIndex, Icebreaker, reddifier, subredditstats, archive.org snapshots) for volatile social counts; must be labeled with the tracker name and retrieval date, and should be corroborated by a second source where feasible (only App Store/Play values have first-party corroboration today).
Any metric that cannot be placed in a tier (no dated URL at all) should be omitted from the comparison rather than filled from memory.

### 6.6 What is NOT citable today (do-not-publish list)
- X follower counts for Vanguard, State Street, Fidelity (no dated source found; cannot confirm).
- LinkedIn first-party follower counts for all four firms (login wall; HTTP 999).
- Reddit subscriber counts from Reddit itself (blocked); r/BlackRock, r/Fidelity, r/state_street current existence/counts.
- Any use of r/vanguard as a Vanguard signal (wrong community).
