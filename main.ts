// Vice Got a Price! — GTA VI Trophy Guide & Platinum Roadmap (make.fun entry gta6-trophy-guide-01).
// This program hands the guide in: it copies the static app in app/ and the captures in
// screenshots/ to the output directory and writes dossier.json there with the vendored
// make.fun library, so the judge reads exactly the files a browser would open.
// Before copying, it sanity-checks the guide data itself: it loads app/data/trophies.json
// from beside this file, counts the trophies it holds and prints that count, so a broken
// or truncated data file fails loudly here instead of reaching the judge.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Guide data check (authored for this entry) ---------------------------
// The guide lives or dies by its trophy list, so verify it before packaging:
// the JSON must parse, it must hold a trophies array, and every entry in that
// array must carry a non-blank guide string for the reader.
const trophyFile = join(here, 'app', 'data', 'trophies.json');
const trophyData = JSON.parse(readFileSync(trophyFile, 'utf8'));
const trophyList = Array.isArray(trophyData) ? trophyData : trophyData.trophies;
if (!Array.isArray(trophyList)) {
  throw new Error('trophies.json: expected an object holding a "trophies" array');
}
const unguided = trophyList.filter(
  (entry) => typeof entry.guide !== 'string' || entry.guide.trim() === '',
);
if (unguided.length > 0) {
  throw new Error(`trophies.json: ${unguided.length} trophies are missing a guide`);
}
console.log(`Vice Got a Price! guide check: ${trophyList.length} trophies, every one with a guide.`);

// --- Packaging (starter plumbing, kept working) ---------------------------
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
