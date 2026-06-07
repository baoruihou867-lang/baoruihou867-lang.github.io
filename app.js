const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector(".search-panel");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const cards = Array.from(document.querySelectorAll(".result-card"));
const searchStatus = document.querySelector("#searchStatus");
const clearSearch = document.querySelector("#clearSearch");
const loadMore = document.querySelector("#loadMore");
const quickSearchButtons = Array.from(document.querySelectorAll("[data-query]"));

let displayLimit = 60;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
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
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = filter === "all" || tags.includes(filter);
    return matchesQuery && matchesFilter;
  });
}

function updateStatus(totalMatches, visibleCount) {
  if (!searchStatus) return;
  if (totalMatches === 0) {
    searchStatus.textContent = "No matching terms. Try another English word, Chinese word, or site object.";
    return;
  }
  searchStatus.textContent = `Showing ${visibleCount} of ${totalMatches} matching terms.`;
}

function applyFilters({ resetLimit = false } = {}) {
  if (resetLimit) displayLimit = 60;

  const matches = matchingCards();
  const matchSet = new Set(matches);
  const visibleMatches = matches.slice(0, displayLimit);
  const visibleSet = new Set(visibleMatches);

  cards.forEach((card) => {
    card.hidden = !matchSet.has(card) || !visibleSet.has(card);
  });

  if (loadMore) {
    loadMore.hidden = matches.length <= displayLimit;
  }

  updateStatus(matches.length, visibleMatches.length);
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters({ resetLimit: true });
  document.querySelector("#dictionary")?.scrollIntoView({ behavior: "smooth" });
});

searchInput?.addEventListener("input", () => {
  applyFilters({ resetLimit: true });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFilters({ resetLimit: true });
  });
});

quickSearchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (searchInput) searchInput.value = button.dataset.query || "";
    filterButtons.forEach((item) => item.classList.remove("active"));
    document.querySelector('[data-filter="all"]')?.classList.add("active");
    applyFilters({ resetLimit: true });
    document.querySelector("#dictionary")?.scrollIntoView({ behavior: "smooth" });
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

applyFilters({ resetLimit: true });
