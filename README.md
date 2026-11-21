# Vice Got a Price! — GTA VI Trophy Guide & Platinum Roadmap

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/asuquostephen/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/asuquostephen/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An unofficial, fully offline trophy guide and platinum roadmap for Grand Theft Auto VI on PlayStation 5, built for the make.fun competition [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What the guide is

Vice City is back, and so is the platinum hunt. This guide covers all **55 official PlayStation trophies** for GTA VI — 1 Platinum, 2 Gold, 6 Silver and 46 Bronze — with an original one-line description and a practical, own-words guide for every single trophy. Nothing here is copied from another guide: the trophy names and grades follow the official published list, and everything else was written fresh for this entry.

The heart of the guide is a **five-stage platinum roadmap**:

1. **Main Story** — play the story start to finish and bank story trophies as they come.
2. **Story Cleanup & Missables** — revisit pre-finale saves and clear the 11 missable trophies, including the choice-based endings and one-off character encounters.
3. **Open World & Collectibles** — tour the whole state of Leonida: strangers and freaks, activities, landmarks and hidden packages.
4. **Skill & Grind** — shooting range medals, money targets, strikes, streaks and personal bests.
5. **Final Cleanup & Platinum** — sweep the stragglers, confirm 54 of 55, and watch "Vice Got a Price!" pop.

Every trophy card flags whether it is **MISSABLE** and whether it is a **HIDDEN** trophy (28 of the 55 are hidden), and shows which roadmap stage it belongs to, so you always know what to do next and what you cannot afford to skip.

## Features

- **All 55 trophies** with grade badges colour-coded by grade: pale cyan for Platinum, gold, silver grey and bronze.
- **Five-stage roadmap** with a plain-English plan and a live trophy count for each stage.
- **Text search** across trophy names and descriptions.
- **Grade filters** — All, Platinum, Gold, Silver, Bronze — plus a **Missable only** toggle for cleanup sessions.
- **Earned checklist**: tick trophies off as you earn them and the "Road to Platinum" counter in the header updates instantly with your count and percentage, with a progress bar to match. A **Hide earned** toggle clears finished trophies out of the list so cleanup sessions only show what is left.
- **Deep-link views** for sharing and screenshots: `?grade=bronze` opens filtered by grade, `?missable=1` opens with missables only, `?view=roadmap` jumps straight to the roadmap, and `?scroll=1400` opens the page already scrolled.
- **Works fully offline**: plain static files, no build step, no network requests — the trophy data loads from a local JSON file beside the page.

## How to run it

You need Node.js (the entry was built and tested on Node 22). From this folder:

```
node serve.ts
```

Then open the local address it prints (http://localhost:8080 by default) in your browser. To use a different port, run `node serve.ts --port 8092` and open that address instead. Any static file server pointed at the `app/` folder works just as well.

## How the entry is handed in

Running the entrypoint packages the guide exactly as the judge receives it:

```
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` first checks the guide data — it loads `app/data/trophies.json`, counts the trophies and confirms every one carries a guide, printing the count — then copies `app/` and `screenshots/` into the output folder and writes `out/dossier.json` using the vendored make.fun dossier library in `vendor/`. The four screenshots in `screenshots/` (cover, roadmap, missable view and the scrolled bronze view, as described in `shots.json`) are captured from the running app itself.

## Layout

- `app/index.html` — the page: header, summary strip, roadmap, controls and trophy list.
- `app/style.css` — the Vice City night look: neon pink and teal over deep purple.
- `app/app.js` — data loading, rendering, filters, search and the progress tracker.
- `app/data/trophies.json` — the 55 trophies with names, grades, descriptions, guides, missable and hidden flags, and roadmap stages.
- `main.ts` — the handover program described above.
- `serve.ts` — a tiny local static server for previewing the guide.
- `shots.json` — which views the screenshots were taken of.
