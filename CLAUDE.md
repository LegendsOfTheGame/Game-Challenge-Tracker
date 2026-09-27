# Legends of the Game — project notes

Static site for legendmemoria.org. Plain HTML/CSS/JS, no build step, deployed as-is (migrated from Netlify).

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
| S28 (Breach)         | 2026-02-10 18:00 | 13:00 EST        | Old code value; unconfirmed (the 17:00 UTC rule would give 17:00) |
| S30 (Marked) Split 1 | 2026-08-04 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT); current `SEA_START` |
| S30 (Marked) Split 2 | 2026-09-15 17:00 | 13:00 EDT        | Confirmed (user + search result, 10 am PT) |
| S30 P2W6             | 2026-10-20 17:00 | 13:00 EDT        | Matches in-game countdown seen by the user on 2026-09-27 (22d 20h at 20:24 UTC) |
| S30 (Marked) ends    | 2026-10-27 17:00 | 13:00 EDT        | Calculated: Split 1 = 6 weeks (from dates), Split 2 = 6 weeks (seen in game by the user); `SEA_WKS = 12` |

Splits are 6 weeks each, 12 weeks per season. A search result estimated a 3 Nov end ("based on
three-month rotations"); that conflicts with the 6 weeks of Split 2 seen in game, so it's
disregarded. If a season ever runs 13 weeks, set `SEA_WKS = 13`: `getPW()` maps week 13 to `P2W7`.
