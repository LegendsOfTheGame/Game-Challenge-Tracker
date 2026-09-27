# Legends of the Game — project notes

Static site for legendmemoria.org. Plain HTML/CSS/JS, no build step, deployed as-is (migrated from Netlify).

- `index.html` — landing page
- `apex/index.html` — Challenge Memoria, the Apex Legends weekly/daily challenge tracker. Single
  self-contained file. User data lives only in the browser's `localStorage` (key `cm5`).
- Season timing is hardcoded in the CONSTANTS block near the top of the `<script>` in
  `apex/index.html`: `SEA_START` (season start in UTC, not split start), `SEA_WKS`,
  `DAY_RST_UTC`. The
  season number also appears in the header text, the `iSeason` chip markup, and the `iSeason`
  render code in `updInfo()` — update all of them at each new season.
- **Talk about times in Pacific Time (PT)**, because EA is based there.
- Resets are pinned to UTC, so their PT time moves back an hour when daylight saving ends. The code
  stores UTC (`SEA_START`, `DAY_RST_UTC`); don't convert it to PT wall-clock time.

  | Reset                          | UTC   | PDT (summer) | PST (winter) |
  |--------------------------------|-------|--------------|--------------|
  | Weekly, season and split start (Tue) | 17:00 | 10:00 | 09:00 |
  | Daily                          | 10:00 | 03:00        | 02:00        |

## Apex season timeline

A "split" is a mid-season release, similar to a Windows 11 feature update (e.g. 25H2): same
season, new version. Times are PT; dates below are written YYYY-MM-DD.

Terminology: the tracker's "Part" is the game's "Split" (Part 2 = Split 2), and "W" is the week
number within that split. So the label `S30 P2W1` means Season 30, Split 2, week 1. In the code,
`getPW()` maps season weeks 1–6 to Part 1 and weeks 7–12 to Part 2.

| Season / split       | Start (PT)       | Notes |
|----------------------|------------------|-------|
| S28 (Breach)         | 2026-02-10 10:00 | Old code value (18:00 UTC); unconfirmed, the 17:00 UTC rule would give 09:00 PST |
| S30 (Marked) Split 1 | 2026-08-04 10:00 | Given by the user; `SEA_START` = 2026-08-04T17:00Z |
| S30 (Marked) Split 2 | 2026-09-15 10:00 | Given by the user (as 15/9/26, 1700 UTC) |
| S30 (Marked) ends    | 2026-10-27 10:00 | Calculated: 12 weeks from season start |

All S30 dates are PDT. Splits are 6 weeks each, 12 weeks per season.
