# Legends of the Game — project notes

Static site for legendmemoria.org. Plain HTML/CSS/JS, no build step, deployed as-is (migrated from Netlify).

- `index.html` — landing page
- `apex/index.html` — Challenge Memoria, the Apex Legends weekly/daily challenge tracker. Single
  self-contained file. User data lives only in the browser's `localStorage` (key `cm5`).
- Season timing is hardcoded in the CONSTANTS block near the top of the `<script>` in
  `apex/index.html`: `SEA_START`, `SEA_WKS`, `DAY_RST_UTC`. The header text and the `S28` season
  chip are hardcoded in the markup and in the `iSeason` render code.

## Apex season timeline

A "split" is a mid-season release, similar to a Windows 11 feature update (e.g. 25H2): same
season, new version. Times are UTC; dates below are written YYYY-MM-DD.

| Season / split     | Start (UTC)      | Notes |
|--------------------|------------------|-------|
| Season 28 (Breach) | 2026-02-10 18:00 | Value still set in `SEA_START` in `apex/index.html` |
| Season 30 Split 2  | 2026-09-15 17:00 | Given by the user (15/9/26, 1700 UTC) |

Note: as of 2026-09-27 the tracker's constants and labels still point at Season 28 and have not
been updated for Season 30.
