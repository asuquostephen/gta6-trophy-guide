// Leonida Legend — offline GTA VI trophy guide & tracker.
// All data comes from the local file data/trophies.json; nothing is fetched from the network.
// Progress lives in localStorage and can be exported to / imported from a JSON file.

const STORAGE_EARNED = 'leonida-legend-earned-v1';
const STORAGE_SPOILER = 'leonida-legend-spoiler-v1';
const STORAGE_NOTES = 'leonida-legend-notes-v1';
const GRADES = ['platinum', 'gold', 'silver', 'bronze'];
const STAGE_INFO = [
  { n: 1, title: 'Stage 1 — Story first', text: 'Play the campaign from Gone Fishing to the final mission, finishing the named-character strands (Andy, Kenton, Billy, Randy, Tyrone) as they appear. Story trophies cannot be earned out of order, and this pass also unlocks most of the world for cleanup.' },
  { n: 2, title: 'Stage 2 — Missable watch (during the story)', text: 'A short list of trophies whose official descriptions suggest a one-time story moment or a choice. The flags are cautious — built from the descriptions only, not confirmed — but watching for these moments during Stage 1 costs nothing and may save a replay.' },
  { n: 3, title: 'Stage 3 — Collectibles & activities cleanup', text: 'With the map open, sweep region by region: meditation spots, card sets, WAiNK locations, vehicle discoveries and area exploration, plus the activity trophies — stunts, races, drone races, shooting range golds, robberies, challenges and the money trophies.' },
  { n: 4, title: 'Stage 4 — Completion & the platinum', text: 'Close out 100% completion (A Long Road), hunting whatever the in-game counter still shows as missing. When the other 54 are earned, the platinum — Vice Got a Price! — unlocks on its own.' },
];

const els = {
  list: document.getElementById('trophy-list'),
  detail: document.getElementById('detail'),
  search: document.getElementById('search'),
  grade: document.getElementById('filter-grade'),
  kind: document.getElementById('filter-kind'),
  missable: document.getElementById('filter-missable'),
  missableOnly: document.getElementById('filter-missable-only'),
  status: document.getElementById('filter-status'),
  spoiler: document.getElementById('spoiler'),
  resultCount: document.getElementById('result-count'),
  progressCount: document.getElementById('progress-count'),
  progressPct: document.getElementById('progress-pct'),
  progressBar: document.getElementById('progress-bar'),
  gradeCounts: document.getElementById('grade-counts'),
  roadmapStages: document.getElementById('roadmap-stages'),
  checklistView: document.getElementById('checklist-view'),
  roadmapView: document.getElementById('roadmap-view'),
  tabChecklist: document.getElementById('tab-checklist'),
  tabRoadmap: document.getElementById('tab-roadmap'),
};

const params = new URLSearchParams(location.search);
let trophies = [];
let earned = new Set(JSON.parse(localStorage.getItem(STORAGE_EARNED) ?? '[]'));
let notes = JSON.parse(localStorage.getItem(STORAGE_NOTES) ?? '{}');
let selectedId = null;
let printAll = false;

function saveEarned() {
  localStorage.setItem(STORAGE_EARNED, JSON.stringify([...earned]));
}

function saveNotes() {
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
}

function isSpoilerHidden(t) {
  if (printAll) return false;
  return els.spoiler.checked && t.kind === 'story' && !earned.has(t.name);
}

function shortGuide(text) {
  const cut = text.indexOf('. ');
  return cut > 40 ? text.slice(0, cut + 1) : text;
}

function renderProgress() {
  const total = trophies.length;
  const pct = total ? Math.round((earned.size / total) * 100) : 0;
  els.progressCount.textContent = `${earned.size} of ${total} earned`;
  els.progressPct.textContent = `${pct}%`;
  els.progressBar.style.width = `${pct}%`;
  els.gradeCounts.replaceChildren();
  for (const g of GRADES) {
    const all = trophies.filter((t) => t.grade === g);
    const got = all.filter((t) => earned.has(t.name)).length;
    const span = document.createElement('span');
    const b = document.createElement('b');
    b.textContent = `${got}/${all.length}`;
    span.append(b, ` ${g}`);
    els.gradeCounts.append(span);
  }
}

function passesFilters(t) {
  if (printAll) return true;
  const q = els.search.value.trim().toLowerCase();
  if (q && !`${t.name} ${t.description} ${t.guide} ${t.kind} ${t.searchTerms ?? ''}`.toLowerCase().includes(q)) return false;
  if (els.grade.value !== 'all' && t.grade !== els.grade.value) return false;
  if (els.kind.value !== 'all' && t.kind !== els.kind.value) return false;
  if (els.missable.value === 'only' && !t.missable) return false;
  if (els.missable.value === 'safe' && t.missable) return false;
  if (els.status.value === 'earned' && !earned.has(t.name)) return false;
  if (els.status.value === 'unearned' && earned.has(t.name)) return false;
  return true;
}

function renderList() {
  els.list.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!passesFilters(t)) continue;
    shown += 1;
    const hidden = isSpoilerHidden(t);
    const li = document.createElement('li');
    li.className = 'trophy-row' + (earned.has(t.name) ? ' earned' : '') + (hidden ? ' spoiler-hidden' : '');
    if (selectedId === t.id) li.classList.add('selected');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      saveEarned();
      renderAll();
    });

    const main = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : t.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Spoiler shield is on: this story trophy stays hidden until earned.' : t.description;
    const guide = document.createElement('div');
    guide.className = 'trophy-guide-short';
    guide.textContent = hidden ? '' : shortGuide(t.guide);
    main.append(name, desc, guide);

    const badges = document.createElement('div');
    badges.className = 'badges';
    const gb = document.createElement('span');
    gb.className = `badge ${t.grade}`;
    gb.textContent = t.grade;
    const kb = document.createElement('span');
    kb.className = 'badge kind';
    kb.textContent = t.kind;
    badges.append(gb, kb);
    if (t.missable) {
      const mb = document.createElement('span');
      mb.className = 'badge missable';
      mb.textContent = 'Missable?';
      badges.append(mb);
    }
    if (typeof t.count === 'number') {
      const cb = document.createElement('span');
      cb.className = 'badge kind';
      cb.textContent = `Target: ${t.count.toLocaleString('en-US')}`;
      badges.append(cb);
    }

    li.append(box, main, badges);
    li.addEventListener('click', () => { selectedId = t.id; renderList(); renderDetail(); });
    els.list.append(li);
  }
  els.resultCount.textContent = shown === trophies.length
    ? `Showing all ${shown} trophies.`
    : `Showing ${shown} of ${trophies.length} trophies.`;
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId);
  els.detail.replaceChildren();
  if (!t) {
    const p = document.createElement('p');
    p.className = 'detail-empty';
    p.textContent = 'Select a trophy to read its full guide, steps and sources — and to keep your own notes on it.';
    els.detail.append(p);
    return;
  }
  const hidden = isSpoilerHidden(t);
  const h = document.createElement('h3');
  h.textContent = hidden ? 'Hidden story trophy' : t.name;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden ? 'Name and description hidden by the spoiler shield until earned.' : `Official description: “${t.description}”`;
  els.detail.append(h, official);

  const meta = document.createElement('div');
  meta.className = 'meta';
  for (const label of [t.grade, t.kind, `Roadmap stage ${t.stage}`, ...(t.missable ? ['Missable? (cautious flag)'] : []), ...(typeof t.count === 'number' ? [`Tracked target: ${t.count.toLocaleString('en-US')}`] : []), ...(earned.has(t.name) ? ['Earned ✓'] : ['Not yet earned'])]) {
    const s = document.createElement('span');
    s.className = 'badge ' + (label === t.grade ? t.grade : label.startsWith('Missable') ? 'missable' : 'kind');
    s.textContent = label;
    meta.append(s);
  }
  els.detail.append(meta);

  const gh = document.createElement('h4');
  gh.textContent = 'Guide — in our own words';
  const gp = document.createElement('p');
  gp.textContent = t.guide;
  els.detail.append(gh, gp);

  if (Array.isArray(t.steps) && t.steps.length) {
    const sh = document.createElement('h4');
    sh.textContent = 'Steps';
    const ol = document.createElement('ol');
    for (const step of t.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.append(li);
    }
    els.detail.append(sh, ol);
  }

  const srch = document.createElement('h4');
  srch.textContent = 'Sources';
  els.detail.append(srch);
  for (const s of t.sources ?? []) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.rel = 'noreferrer';
    const role = document.createElement('span');
    role.className = 'source-role';
    role.textContent = ` — ${s.role}. (Links open only if you follow them; this app fetches nothing.)`;
    p.append(a, role);
    els.detail.append(p);
  }

  const nh = document.createElement('h4');
  nh.textContent = 'Your notes';
  const noteBox = document.createElement('textarea');
  noteBox.className = 'note-area';
  noteBox.rows = 4;
  noteBox.placeholder = 'Your own plan for this one — where you are attempting it, what to bring, what went wrong last time…';
  noteBox.value = notes[t.id] ?? '';
  noteBox.setAttribute('aria-label', `Your notes for ${t.name}`);
  const noteRow = document.createElement('div');
  noteRow.className = 'note-row';
  const noteHint = document.createElement('span');
  noteHint.className = 'note-hint';
  noteHint.textContent = 'Saved in this browser only, as you type.';
  const noteStatus = document.createElement('span');
  noteStatus.className = 'note-status';
  noteStatus.hidden = true;
  noteStatus.textContent = 'Note saved ✓';
  noteRow.append(noteHint, noteStatus);
  let noteTimer = null;
  let hideTimer = null;
  noteBox.addEventListener('input', () => {
    clearTimeout(noteTimer);
    clearTimeout(hideTimer);
    noteStatus.hidden = true;
    noteTimer = setTimeout(() => {
      const text = noteBox.value.trim();
      if (text) notes[t.id] = noteBox.value; else delete notes[t.id];
      saveNotes();
      noteStatus.hidden = false;
      hideTimer = setTimeout(() => { noteStatus.hidden = true; }, 2000);
    }, 350);
  });
  els.detail.append(nh, noteBox, noteRow);
}

function renderRoadmap() {
  els.roadmapStages.replaceChildren();
  for (const stage of STAGE_INFO) {
    const items = trophies.filter((t) => t.stage === stage.n);
    const done = items.filter((t) => earned.has(t.name)).length;
    const box = document.createElement('div');
    box.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = `${stage.title} `;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `— ${done}/${items.length} earned`;
    h.append(count);
    const p = document.createElement('p');
    p.textContent = stage.text;
    const ul = document.createElement('ul');
    for (const t of items) {
      const li = document.createElement('li');
      if (earned.has(t.name)) li.className = 'done';
      li.textContent = t.name;
      if (t.missable) {
        const f = document.createElement('span');
        f.className = 'flag';
        f.textContent = ' ⚠ missable?';
        li.append(f);
      }
      ul.append(li);
    }
    box.append(h, p, ul);
    els.roadmapStages.append(box);
  }
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
}

function showView(which) {
  const roadmap = which === 'roadmap';
  els.roadmapView.hidden = !roadmap;
  els.checklistView.hidden = roadmap;
  els.tabRoadmap.classList.toggle('active', roadmap);
  els.tabChecklist.classList.toggle('active', !roadmap);
}

els.tabChecklist.addEventListener('click', () => showView('checklist'));
els.tabRoadmap.addEventListener('click', () => showView('roadmap'));
for (const el of [els.search, els.grade, els.kind, els.missable, els.status]) {
  el.addEventListener('input', renderList);
  el.addEventListener('change', renderList);
}
// The "Missable only" quick toggle and the Missable select are two views of the
// same filter: moving either one updates the other.
els.missable.addEventListener('change', () => {
  els.missableOnly.checked = els.missable.value === 'only';
});
els.missableOnly.addEventListener('change', () => {
  els.missable.value = els.missableOnly.checked ? 'only' : 'all';
  renderList();
});
// Printing renders the whole list as a tick-off sheet (see the @media print
// rules in style.css): filters and the spoiler shield are lifted for the print
// render only, then the on-screen view is restored.
window.addEventListener('beforeprint', () => { printAll = true; renderList(); });
window.addEventListener('afterprint', () => { printAll = false; renderList(); });
els.spoiler.checked = localStorage.getItem(STORAGE_SPOILER) === '1';
els.spoiler.addEventListener('change', () => {
  localStorage.setItem(STORAGE_SPOILER, els.spoiler.checked ? '1' : '0');
  renderList();
  renderDetail();
});

document.getElementById('export').addEventListener('click', () => {
  const payload = JSON.stringify({ app: 'leonida-legend', earned: [...earned] }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    const valid = new Set(trophies.map((t) => t.name));
    earned = new Set((names ?? []).filter((n) => valid.has(n)));
    saveEarned();
    renderAll();
  } catch {
    els.resultCount.textContent = 'That file could not be read as trophy progress JSON.';
  }
});

// Deep links used for screenshots and sharing views: ?grade=, ?kind=, ?missable=only,
// ?view=roadmap, ?detail=<id>, ?spoiler=1, ?scroll=<px>, and ?note=<text> (with ?detail=,
// pre-fills that trophy's personal note). They only set local UI state.
if (params.get('grade')) els.grade.value = params.get('grade');
if (params.get('kind')) els.kind.value = params.get('kind');
if (params.get('missable')) els.missable.value = params.get('missable');
els.missableOnly.checked = els.missable.value === 'only';
if (params.get('spoiler') === '1') { els.spoiler.checked = true; }
if (params.get('detail')) selectedId = Number(params.get('detail'));

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
if (params.get('note') && selectedId !== null) {
  notes[selectedId] = params.get('note');
  saveNotes();
}
renderAll();
if (params.get('view') === 'roadmap') showView('roadmap');
if (params.get('scroll')) requestAnimationFrame(() => window.scrollTo(0, Number(params.get('scroll')) || 0));
