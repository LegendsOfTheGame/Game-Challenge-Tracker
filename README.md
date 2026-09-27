# Legends of the Game

Static site for [legendmemoria.org](https://legendmemoria.org) — the Legends of the Game landing
page plus Challenge Memoria, the Apex Legends weekly/daily challenge tracker.

- `index.html` — landing page
- `apex/` — Challenge Memoria (self-contained, no build step, data stored in the browser's
  `localStorage` only)

No build tooling — plain static HTML/CSS/JS, deployed as-is.

Hosted on GitHub Pages from the `main` branch (repo root); every merge to `main` goes live.
`CNAME` sets the custom domain and `.nojekyll` tells Pages to serve the files untouched.
(Previously hosted on Netlify.)

An earlier, unfinished multi-game React rewrite (Apex + Overwatch 2) lives on the
`wip/react-rewrite` branch.
