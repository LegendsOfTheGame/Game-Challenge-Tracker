# Legends of the Game — project notes

Static site for legendmemoria.org. Plain HTML/CSS/JS, no build step, deployed as-is.

- **Hosting: GitHub Pages**, deploying `main` from the repo root. Merging to `main` publishes the
  site. `CNAME` (custom domain) and `.nojekyll` must stay in the repo root. The site was moved off
  Netlify (the user found it a constant headache); don't suggest going back to it.

- `index.html` — landing page
- `apex/index.html` — Challenge Memoria, the Apex Legends weekly/daily challenge tracker. Single
  self-contained file. User data lives only in the browser's `localStorage` (key `cm5`).
- Season timing is hardcoded in the CONSTANTS block near the top of the `<script>` in
  `apex/index.html`: `SEA_START` (season start in UTC, not split start), `SEA_WKS`,
  `DAY_RST_UTC`. The season number also appears in the header text, the `iSeason` chip markup, and the `iSeason`
  render code in `updInfo()` — update all of them at each new season.
- **Write times in UTC**, with Eastern Time (ET) alongside when helpful. This is the user's
  preference. EA announces in Pacific Time, so convert PT times you're given.
- Resets are pinned to UTC and never move in UTC. In local time zones they shift an hour when
  daylight saving starts or ends. The code stores UTC (`SEA_START`, `DAY_RST_UTC`).

  | Reset                                | UTC   | ET summer (EDT) | ET winter (EST) | PT summer / winter |
  |--------------------------------------|-------|-----------------|-----------------|--------------------|
  | Weekly, season and split start (Tue) | 17:00 | 13:00           | 12:00           | 10:00 / 09:00      |
  | Daily                                | 10:00 | 06:00           | 05:00           | 03:00 / 02:00      |

## Apex season timeline

A "split" is a mid-season release, similar to a Windows 11 feature update (e.g. 25H2): same
season, new version. Times are UTC; dates below are written YYYY-MM-DD.

Terminology: the tracker's "Part" is the game's "Split" (Part 2 = Split 2), and "W" is the week
number within that split. So the label `S30 P2W1` means Season 30, Split 2, week 1. In the code,
`getPW()` maps season weeks 1–6 to Part 1 and weeks 7–12 to Part 2.

| Season / split       | Start (UTC)      | ET               | Notes |
|----------------------|------------------|------------------|-------|
| S28 (Breach)         | 2026-02-10       |                  | Ended 2026-05-05 (esportstales). Old code had 18:00 UTC; time unconfirmed |
| S29 (Overclocked)    | 2026-05-05       |                  | Ended 2026-08-04 (esportstales) |
| S30 (Marked) Split 1 | 2026-08-04 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT); current `SEA_START` |
| S30 (Marked) Split 2 | 2026-09-15 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT) |
| S30 P2W6             | 2026-10-20 17:00 | 13:00 EDT        | Matches in-game countdown seen by the user on 2026-09-27 (22d 20h at 20:24 UTC) |
| S30 (Marked) ends    | 2026-10-27 17:00 | 13:00 EDT        | If 12 weeks (Split 2 = 6 weeks, as the user saw in game). Current `SEA_WKS = 12` |
| S30 (Marked) ends?   | 2026-11-03 17:00 | 12:00 EST        | If 13 weeks (Split 2 = 7 weeks). esportstales estimate; matches the Aug-season pattern below |

Sources for season dates, in order of trust: the in-game timers the user reports, then
<https://www.esportstales.com/apex-legends/season-end-date> (user's preferred reference for season
start/end dates; check it when a new season or split is announced), then search results.
Search-engine AI summaries are estimates, not confirmed dates.

### Season length history (from esportstales)

Season length varies (12–14 weeks), and splits are not always equal. `SEA_WKS` and the split
boundary in `getPW()` (week 6) must be checked every season, not assumed.

| Season             | Start      | End        | Weeks | Splits (weeks) |
|--------------------|------------|------------|-------|----------------|
| S20 Breakout       | 2024-02-13 | 2024-05-07 | 12    | 7 + 5 |
| S21 Upheaval       | 2024-05-07 | 2024-08-06 | 13    | 7 + 6 |
| S22 Shockwave      | 2024-08-06 | 2024-11-05 | 13    | 6 + 7 |
| S23 From the Rift  | 2024-11-05 | 2025-02-11 | 14    | 6 + 8 |
| S24 Takeover       | 2025-02-11 | 2025-05-06 | 12    | |
| S25 Prodigy        | 2025-05-06 | 2025-08-05 | 13    | |
| S26 Showdown       | 2025-08-05 | 2025-11-04 | 13    | |
| S27 Amped          | 2025-11-04 | 2026-02-10 | 14    | |
| S28 Breach         | 2026-02-10 | 2026-05-05 | 12    | |
| S29 Overclocked    | 2026-05-05 | 2026-08-04 | 13    | |
| S30 Marked         | 2026-08-04 | ?          | 12 or 13 | 6 + 6 or 6 + 7 |

Pattern since S20: Feb season 12 weeks, May 13, Aug 13, Nov 14 (seasons start on the first or
second Tuesday of those months). Both previous August seasons (S22, S26) ran 13 weeks with the
longer split second, which points to S30 ending 2026-11-03. The user saw 6 weeks of Split 2 in
game, which points to 2026-10-27. Settle it with the in-game season timer once P2W6 starts
(2026-10-20): 7 days left → 27 Oct, 14 days → 3 Nov. For 13 weeks set `SEA_WKS = 13`: `getPW()`
already maps week 13 to `P2W7`.
