// Vice Got a Price! — GTA VI trophy guide tracker.
// Loads the local trophy data, renders the roadmap and cards,
// and wires up search, grade filters, the missable toggle and
// the in-memory earned checklist with its progress readout.

const STAGES = [
  {
    number: 1,
    name: "Stage 1 — Main Story",
    plan: "Play the story start to finish, enjoying Leonida and banking story trophies as they come.",
  },
  {
    number: 2,
    name: "Stage 2 — Story Cleanup & Missables",
    plan: "Reload your pre-finale saves and clear every choice-based and missable trophy before moving on.",
  },
  {
    number: 3,
    name: "Stage 3 — Open World & Collectibles",
    plan: "Tour the whole state: strangers, activities, landmarks and hidden packages across the map.",
  },
  {
    number: 4,
    name: "Stage 4 — Skill & Grind",
    plan: "Grind the skill, money and challenge trophies with replays, ranges and repeatable jobs.",
  },
  {
    number: 5,
    name: "Stage 5 — Final Cleanup & Platinum",
    plan: "Sweep the last stragglers, confirm 54 of 55, and watch the platinum pop.",
  },
];

const state = {
  trophies: [],
  earned: new Set(),
  query: "",
  grade: "all",
  missableOnly: false,
  hideEarned: false,
};

const listEl = document.getElementById("trophy-list");
const emptyEl = document.getElementById("empty-note");
const stageGridEl = document.getElementById("stage-grid");
const readoutEl = document.getElementById("progress-readout");
const fillEl = document.getElementById("progress-fill");
const visibleEl = document.getElementById("visible-count");
const searchEl = document.getElementById("search-box");
const missableEl = document.getElementById("missable-toggle");
const hideEarnedEl = document.getElementById("hide-earned-toggle");

function gradeKey(grade) {
  return String(grade || "").toLowerCase();
}

function matchesFilters(trophy) {
  if (state.grade !== "all" && gradeKey(trophy.grade) !== state.grade) {
    return false;
  }
  if (state.missableOnly && !trophy.missable) {
    return false;
  }
  if (state.hideEarned && state.earned.has(trophy.name)) {
    return false;
  }
  if (state.query) {
    const haystack = (trophy.name + " " + trophy.description).toLowerCase();
    if (!haystack.includes(state.query)) {
      return false;
    }
  }
  return true;
}

function updateProgress() {
  const total = state.trophies.length || 55;
  const done = state.earned.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  readoutEl.textContent = done + " / " + total + " earned · " + pct + "%";
  fillEl.style.width = pct + "%";
}

function renderRoadmap() {
  stageGridEl.innerHTML = "";
  for (const stage of STAGES) {
    const count = state.trophies.filter((t) => t.stage === stage.number).length;
    const card = document.createElement("article");
    card.className = "stage-card";
    const heading = document.createElement("h3");
    heading.textContent = stage.name;
    const plan = document.createElement("p");
    plan.textContent = stage.plan;
    const tally = document.createElement("span");
    tally.className = "stage-count";
    tally.textContent = count + (count === 1 ? " trophy" : " trophies");
    card.appendChild(heading);
    card.appendChild(plan);
    card.appendChild(tally);
    stageGridEl.appendChild(card);
  }
}

function buildCard(trophy) {
  const card = document.createElement("article");
  card.className = "trophy-card";
  if (state.earned.has(trophy.name)) {
    card.classList.add("is-earned");
  }

  const top = document.createElement("div");
  top.className = "card-top";
  const title = document.createElement("h3");
  title.textContent = trophy.name;
  const badge = document.createElement("span");
  badge.className = "badge badge-" + gradeKey(trophy.grade);
  badge.textContent = trophy.grade;
  top.appendChild(title);
  top.appendChild(badge);
  card.appendChild(top);

  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = trophy.description;
  card.appendChild(desc);

  const guide = document.createElement("p");
  guide.className = "trophy-guide";
  guide.textContent = trophy.guide;
  card.appendChild(guide);

  const tags = document.createElement("div");
  tags.className = "tag-row";
  if (trophy.missable) {
    const tag = document.createElement("span");
    tag.className = "tag tag-missable";
    tag.textContent = "MISSABLE";
    tags.appendChild(tag);
  }
  if (trophy.hidden) {
    const tag = document.createElement("span");
    tag.className = "tag tag-hidden";
    tag.textContent = "HIDDEN";
    tags.appendChild(tag);
  }
  const stageTag = document.createElement("span");
  stageTag.className = "tag tag-stage";
  stageTag.textContent = "Stage " + trophy.stage;
  tags.appendChild(stageTag);
  card.appendChild(tags);

  const label = document.createElement("label");
  label.className = "earned-label";
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = state.earned.has(trophy.name);
  box.addEventListener("change", () => {
    if (box.checked) {
      state.earned.add(trophy.name);
      card.classList.add("is-earned");
    } else {
      state.earned.delete(trophy.name);
      card.classList.remove("is-earned");
    }
    updateProgress();
    if (state.hideEarned) {
      renderList();
    }
  });
  label.appendChild(box);
  label.appendChild(document.createTextNode("Earned"));
  card.appendChild(label);

  return card;
}

function renderList() {
  const visible = state.trophies.filter(matchesFilters);
  listEl.innerHTML = "";
  for (const trophy of visible) {
    listEl.appendChild(buildCard(trophy));
  }
  emptyEl.hidden = visible.length !== 0;
  visibleEl.textContent = "Showing " + visible.length + " of " + state.trophies.length + " trophies";
}

function setGradeFilter(grade) {
  state.grade = grade;
  document.querySelectorAll(".grade-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.grade === grade);
  });
  renderList();
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const grade = params.get("grade");
  if (grade && ["platinum", "gold", "silver", "bronze"].includes(grade.toLowerCase())) {
    setGradeFilter(grade.toLowerCase());
  }
  if (params.get("missable") === "1") {
    state.missableOnly = true;
    missableEl.checked = true;
    renderList();
  }
  if (params.get("view") === "roadmap") {
    const roadmap = document.getElementById("roadmap");
    if (roadmap) {
      roadmap.scrollIntoView();
    }
  }
  const scroll = parseInt(params.get("scroll") || "", 10);
  if (!Number.isNaN(scroll) && scroll > 0) {
    window.scrollTo(0, scroll);
  }
}

function updateSummaryCounts() {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of state.trophies) {
    const key = gradeKey(trophy.grade);
    if (key in counts) {
      counts[key] += 1;
    }
  }
  document.getElementById("stat-total").textContent = String(state.trophies.length);
  document.getElementById("stat-platinum").textContent = String(counts.platinum);
  document.getElementById("stat-gold").textContent = String(counts.gold);
  document.getElementById("stat-silver").textContent = String(counts.silver);
  document.getElementById("stat-bronze").textContent = String(counts.bronze);
}

searchEl.addEventListener("input", () => {
  state.query = searchEl.value.trim().toLowerCase();
  renderList();
});

missableEl.addEventListener("change", () => {
  state.missableOnly = missableEl.checked;
  renderList();
});

hideEarnedEl.addEventListener("change", () => {
  state.hideEarned = hideEarnedEl.checked;
  renderList();
});

document.querySelectorAll(".grade-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setGradeFilter(btn.dataset.grade);
  });
});

fetch("data/trophies.json")
  .then((response) => response.json())
  .then((data) => {
    state.trophies = Array.isArray(data) ? data : data.trophies;
    updateSummaryCounts();
    renderRoadmap();
    renderList();
    updateProgress();
    applyUrlParams();
  })
  .catch(() => {
    visibleEl.textContent = "Could not load trophy data. Serve the app folder over HTTP and reload.";
  });
