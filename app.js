const terms = [
  ["tolerance", "公差", "Acceptable variation from a specified dimension or value.", "The shaft diameter is within tolerance.", ["drawing", "quality"]],
  ["clearance", "间隙", "Space between two mating parts.", "Please confirm the minimum clearance before assembly.", ["drawing", "assembly"]],
  ["interference fit", "过盈配合", "A fit where parts overlap slightly and require force or heat to assemble.", "This bearing uses an interference fit.", ["drawing", "assembly"]],
  ["surface finish", "表面粗糙度 / 表面处理", "The required texture or treatment of a surface.", "The drawing specifies a surface finish of Ra 1.6.", ["drawing", "quality"]],
  ["chamfer", "倒角", "A beveled edge used to remove sharp corners or help assembly.", "Add a 1 mm chamfer to the edge.", ["drawing"]],
  ["datum", "基准", "A reference point, line, or surface used for measurement.", "All dimensions are measured from datum A.", ["drawing", "inspection"]],
  ["nonconformance", "不符合项", "A failure to meet a requirement, specification, or standard.", "Please issue a nonconformance report for this batch.", ["quality"]],
  ["deviation", "偏差", "A difference from the approved drawing, process, or requirement.", "We found a deviation during incoming inspection.", ["quality"]],
  ["containment action", "遏制措施", "Immediate action to stop a problem from spreading.", "Please define the containment action within 24 hours.", ["quality"]],
  ["root cause", "根本原因", "The underlying reason why a problem happened.", "The root cause was insufficient fixture clamping force.", ["quality"]],
  ["corrective action", "纠正措施", "Action taken to remove the cause of a problem.", "The corrective action must prevent recurrence.", ["quality"]],
  ["PPAP", "生产件批准程序", "A production part approval process used in automotive supply chains.", "The supplier will submit PPAP documents next Friday.", ["quality", "supply-chain"]],
  ["commissioning", "调试 / 投运", "Testing and preparing equipment or a system for operation.", "Commissioning will start after installation is complete.", ["equipment", "project"]],
  ["downtime", "停机时间", "Time when equipment or a process is not operating.", "The unexpected downtime affected the delivery schedule.", ["equipment"]],
  ["preventive maintenance", "预防性维护", "Scheduled maintenance used to reduce failure risk.", "Preventive maintenance is planned for Saturday.", ["equipment"]],
  ["calibration", "校准", "Checking and adjusting equipment to meet measurement standards.", "The gauge calibration record is missing.", ["equipment", "quality"]],
  ["lead time", "交期 / 前置时间", "Time required from request or order to delivery.", "The supplier confirmed a lead time of four weeks.", ["supply-chain", "project"]],
  ["expedite", "加急处理", "To speed up delivery, review, approval, or production.", "Could you expedite the shipment?", ["supply-chain"]],
  ["backorder", "欠货 / 延期订单", "An order that cannot be delivered because stock is unavailable.", "The spare part is currently on backorder.", ["supply-chain"]],
  ["change request", "变更申请", "A formal request to change scope, design, cost, schedule, or requirements.", "The design update must be submitted as a change request.", ["project"]],
  ["milestone", "里程碑", "A major checkpoint in a project schedule.", "The next milestone is factory acceptance testing.", ["project"]],
  ["action owner", "行动负责人", "The person responsible for completing a task.", "Please assign an action owner for each open issue.", ["project"]],
  ["acceptance criteria", "验收标准", "Conditions that must be met before work, parts, or systems can be accepted.", "Please confirm the acceptance criteria before production.", ["quality", "project"]],
  ["handover", "交接 / 移交", "Transfer of responsibility, documents, or equipment.", "The handover package includes drawings and test reports.", ["project"]]
];

const phrases = [
  ["确认需求", "Could you confirm the required tolerance and surface finish?", "请确认要求的公差和表面处理。"],
  ["确认版本", "Please make sure we are using the latest drawing revision.", "请确认我们使用的是最新图纸版本。"],
  ["说明异常", "We identified a nonconformance during incoming inspection.", "我们在来料检验中发现了不符合项。"],
  ["描述影响", "This issue may affect assembly, testing, and final delivery.", "该问题可能影响装配、测试和最终交付。"],
  ["要求措施", "Please provide containment action, root cause, and corrective action.", "请提供遏制措施、根因和纠正措施。"],
  ["跟进进度", "Please share the updated schedule and the next action owner.", "请提供更新后的计划和下一步负责人。"],
  ["升级风险", "We need to escalate this risk because the delivery date may be impacted.", "由于交期可能受影响，我们需要升级该风险。"],
  ["会议总结", "Below are the agreed actions, owners, and target dates.", "以下是已确认的行动项、负责人和目标日期。"]
];

const templates = [
  {
    title: "询问技术资料",
    body: "Dear team,\n\nCould you please provide the latest drawing, specification sheet, and acceptance criteria for this part?\n\nWe need these documents to complete the technical review and confirm the next steps.\n\nBest regards,"
  },
  {
    title: "反馈质量异常",
    body: "Dear team,\n\nDuring inspection, we identified a nonconformance related to [issue description]. Please review the attached report and advise the containment action, root cause analysis, and corrective action plan.\n\nTarget response date: [date]\n\nBest regards,"
  },
  {
    title: "催促交期",
    body: "Dear team,\n\nCould you please confirm the updated delivery schedule for [part/project]? The current lead time may affect our production plan.\n\nPlease advise whether the shipment can be expedited.\n\nBest regards,"
  },
  {
    title: "会议后跟进",
    body: "Dear all,\n\nThanks for the discussion today. Below are the agreed actions:\n\n1. [Action] - Owner: [Name] - Due: [Date]\n2. [Action] - Owner: [Name] - Due: [Date]\n\nPlease let me know if anything needs correction.\n\nBest regards,"
  },
  {
    title: "提交变更申请",
    body: "Dear team,\n\nWe would like to submit a change request for [scope/design/process]. This change may affect cost, lead time, and validation scope.\n\nPlease review and confirm the approval process.\n\nBest regards,"
  },
  {
    title: "验收确认",
    body: "Dear team,\n\nBased on the inspection result and acceptance criteria, the item is accepted with the following open points:\n\n1. [Open point]\n2. [Open point]\n\nPlease confirm the handover date and document package.\n\nBest regards,"
  }
];

const results = document.querySelector("#results");
const phraseList = document.querySelector("#phraseList");
const templateList = document.querySelector("#templateList");
const form = document.querySelector(".search-panel");
const input = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
let activeFilter = "all";

function tagLabel(tag) {
  const labels = {
    drawing: "图纸",
    quality: "质量",
    project: "项目",
    equipment: "设备",
    "supply-chain": "供应链",
    assembly: "装配",
    inspection: "检验"
  };
  return labels[tag] || tag;
}

function renderTerms(items) {
  if (!items.length) {
    results.innerHTML = '<p class="empty-state">没有找到匹配内容。可以换一个英文词、中文词或工程场景。</p>';
    return;
  }

  results.innerHTML = items
    .map(([term, zh, definition, example, tags]) => `
      <article class="result-card">
        <div class="card-topline">
          <h3>${term}</h3>
          <button class="copy-button" type="button" data-copy="${term}">复制</button>
        </div>
        <p class="zh">${zh}</p>
        <p>${definition}</p>
        <p><strong>Example:</strong> ${example}</p>
        <div class="term-meta">${tags.map((tag) => `<span class="tag">${tagLabel(tag)}</span>`).join("")}</div>
      </article>
    `)
    .join("");
}

function renderPhrases() {
  phraseList.innerHTML = phrases
    .map(([title, en, zh]) => `
      <article class="phrase-card">
        <div>
          <h3>${title}</h3>
          <p>${en}</p>
          <span>${zh}</span>
        </div>
        <button class="copy-button" type="button" data-copy="${en}">复制</button>
      </article>
    `)
    .join("");
}

function renderTemplates() {
  templateList.innerHTML = templates
    .map((template) => `
      <article class="template-card">
        <div class="card-topline">
          <h3>${template.title}</h3>
          <button class="copy-button" type="button" data-copy="${template.body.replace(/"/g, "&quot;")}">复制</button>
        </div>
        <pre>${template.body}</pre>
      </article>
    `)
    .join("");
}

function filteredTerms() {
  const query = input.value.trim().toLowerCase();
  return terms.filter(([term, zh, definition, example, tags]) => {
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    const haystack = [term, zh, definition, example, ...tags.map(tagLabel)].join(" ").toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesFilter && matchesQuery;
  });
}

function refreshTerms() {
  renderTerms(filteredTerms());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  refreshTerms();
  document.querySelector("#dictionary").scrollIntoView({ behavior: "smooth" });
});

input.addEventListener("input", refreshTerms);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    refreshTerms();
  });
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;

  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    const original = button.textContent;
    button.textContent = "已复制";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  } catch {
    button.textContent = "复制失败";
  }
});

renderTerms(terms);
renderPhrases();
renderTemplates();
