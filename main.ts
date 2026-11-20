// A working gta6-trophy-guide-01 entry (Node 22, standard library only): the guide is this directory's app/ folder,
// plain static files a browser opens at app/index.html (ES modules, CSS, no build step), offline: it loads nothing
// over the network, and its trophy list and guides are app/data/trophies.json. The program hands it in: it copies app/
// and screenshots/ from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your
// screenshots, the first load's files and bytes, and your source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Only the plumbing, not a winner: a plain checklist of the 55 trophies with a one-line hint each. Write a real guide
// for every trophy in your own words, a roadmap to the platinum, filters and a spoiler setting in app/, put 3 or 4 PNG
// or JPEG screenshots of it in screenshots/ (the first by name is the cover; shots.json says which views this
// starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Authored for this entry: Leonida Legend, an original 55-trophy GTA VI guide & tracker (roadmap, cautious missable flags, per-trophy cited sources).
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

// Sidecar summary of the trophy list, computed from the app's own data file and
// written beside the dossier (the dossier above is left exactly as buildDossier
// wrote it). Counts are derived, never hand-typed, so they cannot drift from
// app/data/trophies.json.
const trophyDoc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const byGrade = {};
for (const t of trophyDoc.trophies) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
// Roadmap coverage: how many trophies carry a roadmapOrder (the "What next?"
// sequence in the app), and the stage counts listed in roadmap order.
const roadmapStages = [...new Set(trophyDoc.trophies.map((t) => t.stage))]
  .sort((a, b) => a - b)
  .map((stage) => ({ stage, count: trophyDoc.trophies.filter((t) => t.stage === stage).length }));
const summary = {
  game: trophyDoc.game,
  platform: trophyDoc.platform,
  total: trophyDoc.trophies.length,
  byGrade,
  missable: trophyDoc.trophies.filter((t) => t.missable).length,
  withSearchTerms: trophyDoc.trophies.filter((t) => typeof t.searchTerms === 'string').length,
  roadmap: {
    withOrder: trophyDoc.trophies.filter((t) => Number.isInteger(t.roadmapOrder)).length,
    stages: roadmapStages,
  },
};
writeFileSync(join(out, 'trophies-summary.json'), JSON.stringify(summary, null, 2) + '\n');
