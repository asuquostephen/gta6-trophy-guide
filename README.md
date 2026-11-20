[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/asuquostephen/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/asuquostephen/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

A complete, fully offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy carries its official name, description and grade exactly as PlayStation publishes them, plus an original guide written for this entry — what to do, where and how, and when it can be missed — with its sources cited beside it.

## Features

- **Checklist of all 55 trophies** with official names, descriptions and grades, a one-line summary per trophy, and a full detail panel per trophy: official description, grade, kind, missable flag, tracked target count where PlayStation tracks one, the full guide, step-by-step steps, and cited sources.
- **Progress tracking** — tick trophies off; progress is saved in the browser (localStorage), with a completion percentage and per-grade counts, and can be **exported to a JSON file and imported back**.
- **Filters and search** — full-text search plus filters by grade (platinum/gold/silver/bronze), kind (story, collectibles, activities, online, misc), missable status, and earned/unearned.
- **Spoiler shield** — a setting that hides the names and descriptions of story trophies until you have earned them.
- **Platinum roadmap** — a four-stage roadmap built from the official descriptions: story first, a cautious missable watch during the story, collectibles & activities cleanup, then 100% completion and the platinum.
- **Honest flags** — kind, roadmap stage and missable flags are inferred from the official descriptions only and are labelled as such in the app. Three trophies carry cautious "missable?" flags, each with its reasoning in its guide. The official list contains **no online trophies**, and 28 trophies are hidden on PSN — this guide does not guess which ones.

## Data sources

- Official trophy list (names, descriptions, grades): [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and PSNProfiles, which agree on every name, description and grade; each trophy's detail panel cites them.
- Guide references cited per trophy where relevant: PowerPyx and PlayStationTrophies. All guide text here is original — sources are cited, never copied.
- Data lives in `app/data/trophies.json` (official fields untouched; enrichment fields added alongside).

## Run it

The app is plain static files under `app/` — no build step, no network requests at runtime.

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

or serve `app/` with any static file server. To hand the entry in the way the bounty expects:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # copies app/ + screenshots/ to out/ and writes out/dossier.json
```

## Layout

- `app/index.html`, `app/app.js`, `app/style.css` — the guide & tracker (vanilla JS, system fonts, no external anything).
- `app/data/trophies.json` — the 55 trophies with official data, original guides, steps and sources.
- `screenshots/` — real browser renders of the app (see `shots.json` for the views).
- `main.ts` / `serve.ts` / `vendor/makefun-frontend.ts` — hand-in plumbing and local server from the bounty starter kit; `vendor/makefun-frontend.ts` is byte-identical to the kit's copy.

## License

MIT — see `LICENSE`.
