# Research: customer-experience data landscape

## Question

For Vanguard, BlackRock, State Street, and Fidelity: what customer-experience data is citable with a dated URL, per firm?

1. App Store rating — does the firm have an iOS app listing, current rating, listing URL and retrieval date?
2. Google Play rating — same.
3. Social signals on Reddit, LinkedIn, X — what exactly is citable (follower counts, subreddit membership, engagement)?

**Status:** complete (research subagent reported 2026-08-14)
**Report:** `.scratch/working/cx-data-landscape.md`

## Answer

- **Citable (strong, retrieved live 2026-08-14)**: Vanguard iOS 4.6★/177,342 ratings · Play 2.7★/11.4K; BlackRock iOS "Active Investor" 2.1★/14 (tiny sample) + "Institutional" 4.2★/74, Play 3.7★/13; State Street iOS "Insights" 5.0★/12 (tiny), Play "State Street Bank" 4.6★/108; Fidelity iOS 4.8★/3,263,143, Play 4.1★/220K. All four X handles exist (@Vanguard_Group, @BlackRock, @StateStreet, @Fidelity) with server-rendered titles.
- **Not reliably citable**: X follower counts (JS-only rendering; follow-button API returns empty — only BlackRock has a dated third-party figure); LinkedIn counts (login wall, HTTP 999; only third-party Icebreaker mirror snapshots); Reddit subscriber counts (platform blocks programmatic access; only r/fidelityinvestments official has a snapshot).
- **Critical identity hazard**: r/vanguard is the **Vanguard: Saga of Heroes MMO subreddit**, not the investment firm — do not use as a Vanguard signal.
- **Sample-size caveat**: BlackRock and State Street have 2–74 ratings — tiny samples that must be shown with rating counts.
- **Sourcing-policy implication for ticket 52**: app/play ratings are citable platform facts (URL + rating + retrieval date + rating count); volatile social counts need a dated third-party tracker or archive.org snapshot, else omitted (gaps, per the evidence policy in ticket 47).
