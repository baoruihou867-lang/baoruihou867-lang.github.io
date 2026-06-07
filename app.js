const terms = [
  {
    term: "tolerance",
    zh: "\u516c\u5dee",
    definition: "The acceptable variation from a specified dimension or value.",
    example: "The shaft diameter is within tolerance.",
    tags: ["drawing", "quality", "dimension"]
  },
  {
    term: "commissioning",
    zh: "\u8c03\u8bd5 / \u6295\u8fd0",
    definition: "The process of testing and preparing equipment or a system for operation.",
    example: "Commissioning will start after installation is complete.",
    tags: ["equipment", "site", "project"]
  },
  {
    term: "nonconformance",
    zh: "\u4e0d\u7b26\u5408\u9879",
    definition: "A failure to meet a requirement, specification, or standard.",
    example: "Please issue a nonconformance report for this batch.",
    tags: ["quality", "inspection", "NCR"]
  },
  {
    term: "lead time",
    zh: "\u4ea4\u671f / \u524d\u7f6e\u65f6\u95f4",
    definition: "The time required from order, request, or approval to delivery.",
    example: "The supplier confirmed a lead time of four weeks.",
    tags: ["supply chain", "schedule"]
  },
  {
    term: "change request",
    zh: "\u53d8\u66f4\u7533\u8bf7",
    definition: "A formal request to change scope, design, cost, schedule, or requirements.",
    example: "The design update must be submitted as a change request.",
    tags: ["project", "scope", "cost"]
  },
  {
    term: "acceptance criteria",
    zh: "\u9a8c\u6536\u6807\u51c6",
    definition: "The conditions that must be met before work, parts, or systems can be accepted.",
    example: "Please confirm the acceptance criteria before production.",
    tags: ["quality", "contract", "inspection"]
  }
];

const results = document.querySelector("#results");
const form = document.querySelector(".search-panel");
const input = document.querySelector("#searchInput");

function renderTerms(items) {
  if (!items.length) {
    results.innerHTML =
      '<p class="result-card">\u6ca1\u6709\u627e\u5230\u5339\u914d\u5185\u5bb9\u3002\u53ef\u4ee5\u6362\u4e00\u4e2a\u82f1\u6587\u8bcd\u3001\u4e2d\u6587\u8bcd\u6216\u5de5\u7a0b\u573a\u666f\u8bd5\u8bd5\u3002</p>';
    return;
  }

  results.innerHTML = items
    .map(
      (item) => `
        <article class="result-card">
          <h3>${item.term} <span lang="zh-CN">/ ${item.zh}</span></h3>
          <p>${item.definition}</p>
          <p><strong>Example:</strong> ${item.example}</p>
          <div class="term-meta">
            ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function searchTerms(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return terms;

  return terms.filter((item) => {
    const text = [item.term, item.zh, item.definition, item.example, ...item.tags]
      .join(" ")
      .toLowerCase();
    return text.includes(normalized);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderTerms(searchTerms(input.value));
  document.querySelector("#dictionary").scrollIntoView({ behavior: "smooth" });
});

input.addEventListener("input", () => {
  renderTerms(searchTerms(input.value));
});

renderTerms(terms);
