const fullDictionary = document.querySelector("#fullDictionary");
const enterDictionary = document.querySelector("#enterDictionary");
const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector(".search-panel");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const cards = Array.from(document.querySelectorAll("#results .result-card"));
const searchStatus = document.querySelector("#searchStatus");
const clearSearch = document.querySelector("#clearSearch");
const loadMore = document.querySelector("#loadMore");
const quickSearchButtons = Array.from(document.querySelectorAll("[data-query]"));
const scenarioButtons = Array.from(document.querySelectorAll("[data-scenario-button]"));
const emailBuilder = document.querySelector("#emailBuilder");
const generatedMail = document.querySelector("#generatedMail");
const copyGeneratedMail = document.querySelector("#copyGeneratedMail");
const toggleChinese = document.querySelector("#toggleChinese");
const todayStudy = document.querySelector("#todayStudy");

let displayLimit = 60;
let chineseHidden = false;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function showFullDictionary() {
  if (fullDictionary) fullDictionary.hidden = false;
  document.querySelector("#dictionary")?.scrollIntoView({ behavior: "smooth" });
  applyFilters({ resetLimit: true });
}

function activeFilter() {
  return document.querySelector(".filter-button.active")?.dataset.filter || "all";
}

function matchingCards() {
  const query = normalize(searchInput?.value);
  const filter = activeFilter();
  return cards.filter((card) => {
    const text = normalize(card.textContent);
    const tags = normalize(card.dataset.tags);
    return (!query || text.includes(query)) && (filter === "all" || tags.includes(filter));
  });
}

function updateStatus(total, visible) {
  if (!searchStatus) return;
  if (total === 0) {
    searchStatus.textContent = "没有找到匹配词条。可以换一个英文词、中文词、标签或场景。";
    return;
  }
  searchStatus.textContent = `当前显示 ${visible} / ${total} 个匹配词条。`;
}

function applyFilters({ resetLimit = false } = {}) {
  if (resetLimit) displayLimit = 60;
  const matches = matchingCards();
  const visible = matches.slice(0, displayLimit);
  const matchSet = new Set(matches);
  const visibleSet = new Set(visible);
  cards.forEach((card) => {
    card.hidden = !matchSet.has(card) || !visibleSet.has(card);
  });
  if (loadMore) loadMore.hidden = matches.length <= displayLimit;
  updateStatus(matches.length, visible.length);
}

enterDictionary?.addEventListener("click", showFullDictionary);

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  showFullDictionary();
});

searchInput?.addEventListener("input", () => {
  if (fullDictionary) fullDictionary.hidden = false;
  applyFilters({ resetLimit: true });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showFullDictionary();
  });
});

quickSearchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (searchInput) searchInput.value = button.dataset.query || "";
    filterButtons.forEach((item) => item.classList.remove("active"));
    document.querySelector('[data-filter="all"]')?.classList.add("active");
    showFullDictionary();
  });
});

clearSearch?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  filterButtons.forEach((item) => item.classList.remove("active"));
  document.querySelector('[data-filter="all"]')?.classList.add("active");
  applyFilters({ resetLimit: true });
});

loadMore?.addEventListener("click", () => {
  displayLimit += 60;
  applyFilters();
});

toggleChinese?.addEventListener("click", () => {
  chineseHidden = !chineseHidden;
  document.body.classList.toggle("hide-chinese", chineseHidden);
  toggleChinese.textContent = chineseHidden ? "显示中文" : "隐藏中文";
});

todayStudy?.addEventListener("click", () => {
  showFullDictionary();
  displayLimit = 20;
  cards.forEach((card, index) => {
    card.hidden = index >= 20;
  });
  if (loadMore) loadMore.hidden = false;
  if (searchStatus) searchStatus.textContent = "今日学习 20 个词条。";
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(button.dataset.copy || "");
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy failed";
  }
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
});

function valueOf(id) {
  return document.querySelector(id)?.value.trim() || "";
}

function fallback(value, placeholder) {
  return value || `[${placeholder}]`;
}

function buildMail() {
  const scenario = fallback(valueOf("#mailScenario"), "Scenario");
  const project = fallback(valueOf("#mailProject"), "Project Name");
  const reference = fallback(valueOf("#mailReference"), "Drawing / Document No.");
  const location = fallback(valueOf("#mailLocation"), "Location");
  const issue = fallback(valueOf("#mailIssue"), "Issue Description");
  const action = fallback(valueOf("#mailAction"), "Required Action");
  const deadline = fallback(valueOf("#mailDeadline"), "Deadline");
  const attachments = fallback(valueOf("#mailAttachments"), "Attachment");
  return `Subject: ${scenario} - ${project} - ${location}

Dear Engineer,

We are writing regarding ${scenario} for ${project}.

Reference:
- Location: ${location}
- Drawing / Document No.: ${reference}
- Attachments: ${attachments}

Issue / Request:
${issue}

Required Action:
${action}

Please provide your response by ${deadline}.

If further information is required, please let us know.

Best regards,`;
}

emailBuilder?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (generatedMail) generatedMail.textContent = buildMail();
});

copyGeneratedMail?.addEventListener("click", async () => {
  if (!generatedMail) return;
  const original = copyGeneratedMail.textContent;
  try {
    await navigator.clipboard.writeText(generatedMail.textContent);
    copyGeneratedMail.textContent = "Copied";
  } catch {
    copyGeneratedMail.textContent = "Copy failed";
  }
  window.setTimeout(() => {
    copyGeneratedMail.textContent = original;
  }, 1200);
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const scenario = button.dataset.scenarioButton || "";
    const scenarioInput = document.querySelector("#mailScenario");
    if (scenarioInput) scenarioInput.value = scenario;
    document.querySelector("#email-tool")?.scrollIntoView({ behavior: "smooth" });
  });
});

applyFilters({ resetLimit: true });
