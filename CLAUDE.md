# Legends of the Game — project notes

Static site for legendmemoria.org. Plain HTML/CSS/JS, no build step, deployed as-is.

- **Hosting: this repo does not publish the site.** GitHub Pages is off here. legendmemoria.org
  is served by GitHub Pages from `main` of the **LegendsOfTheGame/legendmemoria** repo (checked
  2026-11-01). Merging to `main` here publishes nothing. To publish the tracker:
  1. Merge the change to `main` here.
  2. Copy `apex/index.html` to `apex/index.html` in the legendmemoria repo.
  3. Copy `apex/vendor/vue.global.prod.js` too, if it changed.
  4. Remove the Google Fonts `<link>` and the `manifest.json` `<link>`. That site loads nothing
     from other hosts, and it has no manifest.
  5. Write `apex/version.json` in legendmemoria:
     `{"v": "<Game-Challenge-Tracker main commit, 8 characters>", "t": "<push time, UTC, YYYY-MM-DDTHH:MM:SSZ>"}`.
     Run `date -u` for the time. The rail shows the commit and the time under the version.
     Without the file it shows "local dev".
  6. Push legendmemoria `main`. That push publishes the site.
  The site was moved off Netlify (the user found it a constant headache); don't suggest going
  back to it.

- `index.html` — landing page
- `apex/index.html` — Challenge Memoria, the Apex Legends weekly/daily challenge tracker. Single
  self-contained file, plus the pinned Vue 3.5.13 in `apex/vendor/`. User data lives only in the
  browser's `localStorage` (key `cm5`).
- **Version:** MAJOR.MINOR.PATCH, the same rules as the HSC Ops Hub. The version is in two places
  in `apex/index.html`: `<title>` and `#app-version` (text and `data-version`). Change both
  before you commit a user-facing change. Put the version in the commit subject, for example
  `Apex: ... (v0.15.1)`.
  - Minor: something new to record, or a new area. Patch: fixes and conveniences.
  - PATCH stops at 9: the patch after x.y.9 is x.(y+1).0. MINOR stops at 99.
  - History: v0.14 ran to 1 November 2026, including the Season 31 commit. v0.15 was the reskin
    and the daily-reset fix. The Vue move went live still labelled v0.15. v0.15.1 adds the
    version line.
- Season timing is in the `SEASONS` list in the CONSTANTS block near the top of the `<script>`
  in `apex/index.html`. Each entry has `num`, `name`, `start` (season start in UTC, not split
  start), `wks` and `p1Wks` (weeks in Split 1). Add the next season as a new entry when it is
  announced; do not edit the old one. The tracker uses the last entry whose start has passed. At
  the switch it moves the previous season's weekly challenges into `S.archive[<season>]` in the
  save, so a push before launch is safe. The header and the `iSeason` chip read from the entry.
- **Write times in UTC**, with Eastern Time (ET) alongside when helpful. This is the user's
  preference. EA announces in Pacific Time, so convert PT times you're given.
- **Weekly, season and split resets follow 10:00 Pacific, so they move in UTC.** Confirmed
  2026-11-01: the in-game Battle Pass Weeklies timer put the S30 end at 18:00 UTC on 2026-11-03,
  and esports.gg gave the S31 start as 10:00 PT. The week arithmetic in the code steps 7 days from
  `start`, so a season that crosses a US DST change (S32 crosses 2027-03-14) needs a fix.

  | Reset                                | PT    | UTC summer (PDT) | UTC winter (PST) | ET            |
  |--------------------------------------|-------|------------------|------------------|---------------|
  | Weekly, season and split start (Tue) | 10:00 | 17:00            | 18:00            | 13:00         |
  | Daily (`DAY_RST_PT`)                 | 03:00 | 10:00            | 11:00            | 06:00         |

  Daily winter time confirmed 2026-11-01: the in-game "Refreshes: 15h 1m" at 19:58 UTC gives
  11:00 UTC. The code reads the Pacific offset each day, so the daily reset needs no DST fix.

## Apex season timeline

A "split" is a mid-season release, similar to a Windows 11 feature update (e.g. 25H2): same
season, new version. Times are UTC; dates below are written YYYY-MM-DD.

Terminology: the tracker's "Part" is the game's "Split" (Part 2 = Split 2). Labels use the
Windows-release style the community uses: "H" is the split and "W" is the week number within
that split. So `S30H2W1` means Season 30, Split 2, week 1 (`wkLabel()` in the code). Saves also
carry a `weekLabels` map with these labels; the code itself keys weeks by season week number. In the code,
`getPW()` maps season weeks 1–`p1Wks` to Part 1 and the rest to Part 2 (S30: `p1Wks` 6, weeks
7–13 = P2W1–P2W7).

| Season / split       | Start (UTC)      | ET               | Notes |
|----------------------|------------------|------------------|-------|
| S28 (Breach)         | 2026-02-10       |                  | Ended 2026-05-05 (esportstales). Old code had 18:00 UTC; time unconfirmed |
| S29 (Overclocked)    | 2026-05-05       |                  | Ended 2026-08-04 (esportstales) |
| S30 (Marked) Split 1 | 2026-08-04 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT) |
| S30 (Marked) Split 2 | 2026-09-15 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT) |
| S30 P2W6             | 2026-10-20 17:00 | 13:00 EDT        | Matches in-game countdown seen by the user on 2026-09-27 (22d 20h at 20:24 UTC) |
| S30 P2W7             | 2026-10-27 17:00 | 13:00 EDT        | Final week; may have no weekly challenge track of its own |
| S30 (Marked) ends    | 2026-11-03 18:00 | 13:00 EST        | **Confirmed**: in-game "Season ends in 36 days" on 2026-09-27; Battle Pass Weeklies "Expires: 1d 22h" at 19:10 UTC on 2026-11-01. 13 weeks |
| S31 (Cipher) starts  | 2026-11-03 18:00 | 13:00 EST        | **Confirmed**: esports.gg, 10 am PT. Length and split weeks unknown until the launch screenshot; `wks` 14 and `p1Wks` 6 are pre-season guesses |

Sources for season dates, in order of trust: the in-game timers the user reports, then
<https://www.esportstales.com/apex-legends/season-end-date> (user's preferred reference for season
start/end dates; check it when a new season or split is announced), then search results.
Search-engine AI summaries are estimates, not confirmed dates.

### Season length history (from esportstales)

Season length varies (12–14 weeks), and splits are not always equal. `wks` and `p1Wks` in
`SEASONS` must be checked every season, not assumed.

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
| S30 Marked         | 2026-08-04 | 2026-11-03 | 13    | 6 + 7 |

Pattern since S20: Feb season 12 weeks, May 13, Aug 13, Nov 14 (seasons start on the first or
second Tuesday of those months). S30 followed it (13 weeks, longer split second, like S22).
Lesson: the number of weekly challenge tracks visible in game is not the number of weeks in the
split. Use the in-game "Season ends in N days" timer to confirm the end date each season.
S31 starts 2026-11-03 18:00 UTC and, per the pattern, may run 14 weeks.
