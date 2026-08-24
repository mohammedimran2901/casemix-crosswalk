const FREE_LOOKUPS = 3;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_LINK_HERE"; // TODO: replace with your real Stripe Payment Link

let freeUsed = parseInt(localStorage.getItem("cc_free_used") || "0", 10);
let unlocked = localStorage.getItem("cc_unlocked") === "true";
const tbody = document.querySelector("#resultsTable tbody");
const searchBox = document.getElementById("searchBox");
const resultCount = document.getElementById("resultCount");
const paywall = document.getElementById("paywall");

function fmtRate(v, cur) {
  const sym = cur === "USD" ? "$" : cur === "GBP" ? "£" : cur === "EUR" ? "€" : "A$";
  return sym + v.toLocaleString();
}

function renderRow(p, blur) {
  const cm = typeof CASEMIX !== "undefined" ? CASEMIX[p.name] : null;
  const tr = document.createElement("tr");
  if (blur) tr.classList.add("blurred");
  tr.innerHTML =
    `<td><strong>${p.name}</strong></td>` +
    cell(p.us, "USD", cm && cm.alos.us) + cell(p.uk, "GBP", cm && cm.alos.uk) +
    cell(p.de, "EUR", cm && cm.alos.de) + cell(p.au, "AUD", cm && cm.alos.au);
  tbody.appendChild(tr);
}
function cell(arr, cur, alos) {
  const alosHtml = alos != null ? `<span class="alos">🏥 ${alos.toFixed(1)} days ALOS</span>` : "";
  return `<td><span class="code">${arr[0]}</span> <span class="rate">${fmtRate(arr[2], cur)}</span>${alosHtml}<span class="desc">${arr[1]}</span></td>`;
}

const COUNTRY_KEYS = ["us", "uk", "de", "au"];
const COUNTRY_NAMES = { us: "🇺🇸 US MS-DRG", uk: "🇬🇧 UK HRG", de: "🇩🇪 G-DRG", au: "🇦🇺 AR-DRG" };

function renderComplexity(p, blur) {
  const cm = typeof CASEMIX !== "undefined" ? CASEMIX[p.name] : null;
  const panel = document.getElementById("complexityPanel");
  if (!cm || !panel) { if (panel) panel.innerHTML = ""; return; }
  let html = `<h3>📐 Case-mix complexity breakdown — ${p.name}</h3>
    <p class="cm-sub">Share of cases by complexity tier (approx. % of cases)</p>
    <div class="cm-grid">`;
  COUNTRY_KEYS.forEach(k => {
    const rows = cm.complexity[k];
    html += `<div class="cm-card${blur ? " blurred" : ""}"><div class="cm-title">${COUNTRY_NAMES[k]}</div>`;
    rows.forEach(([label, pct]) => {
      html += `<div class="cm-row"><span class="cm-label">${label}</span>
        <div class="cm-bar"><div class="cm-fill" style="width:${pct}%"></div></div>
        <span class="cm-pct">${pct}%</span></div>`;
    });
    html += `<div class="cm-alos">Avg. stay: <strong>${cm.alos[k].toFixed(1)} days</strong></div></div>`;
  });
  html += `</div><p class="fineprint">Complexity tiers reflect each system's own split logic (e.g. US MCC/CC levels, German komplizierte Grundkrankheit). Approximate distributions — verify against official statistics.</p>`;
  panel.innerHTML = html;
}

function showPaywall() {
  paywall.classList.remove("hidden");
  if (!unlocked) {
    document.getElementById("buyButton").href = STRIPE_PAYMENT_LINK;
    document.getElementById("buyButton2").href = STRIPE_PAYMENT_LINK;
  } else {
    paywall.innerHTML = "<h3>✅ Full access active</h3>";
  }
}

function search(qRaw) {
  const q = qRaw.trim().toLowerCase();
  tbody.innerHTML = "";
  let matches = [];
  if (q) {
    const aliasIdx = Object.keys(CODE_ALIASES).find(c => c.toLowerCase() === q);
    if (aliasIdx !== undefined) {
      matches = [PROCEDURES[CODE_ALIASES[aliasIdx]]];
    } else {
      matches = PROCEDURES.filter(p =>
        p.name.toLowerCase().includes(q) ||
        [p.us[0], p.uk[0], p.de[0], p.au[0]].some(c => c.toLowerCase().includes(q))
      );
    }
  }
  currentMatches = matches;
  resultCount.textContent = q ? `${matches.length} match(es) for "${qRaw.trim()}"` : "";
  updateExportBar(matches);
  if (!matches.length) return;

  if (unlocked || freeUsed < FREE_LOOKUPS) {
    matches.forEach(p => renderRow(p, false));
    renderComplexity(matches[0], false);
    if (!unlocked) {
      freeUsed++;
      localStorage.setItem("cc_free_used", freeUsed);
      if (freeUsed >= FREE_LOOKUPS) showPaywall();
      else resultCount.textContent += ` · ${FREE_LOOKUPS - freeUsed} free lookup(s) left`;
    }
  } else {
    // Show blurred teaser rows
    matches.slice(0, 4).forEach(p => renderRow(p, true));
    renderComplexity(matches[0], true);
    showPaywall();
  }
}

let currentMatches = [];

function updateExportBar(matches) {
  const bar = document.getElementById("exportBar");
  if (!bar) return;
  bar.classList.toggle("hidden", !matches.length);
  const btn = document.getElementById("exportBtn");
  if (unlocked) {
    btn.disabled = false;
    btn.textContent = "⬇ Export results as CSV";
  } else {
    btn.disabled = true;
    btn.textContent = "🔒 CSV export — full access only";
  }
}

function csvEscape(s) { return `"${String(s).replace(/"/g, '""')}"`; }

function exportCSV() {
  if (!unlocked || !currentMatches.length) return;
  const head = ["Procedure",
    "US code","US rate (USD)","US ALOS (days)",
    "UK code","UK rate (GBP)","UK ALOS (days)",
    "DE code","DE rate (EUR)","DE ALOS (days)",
    "AU code","AU rate (AUD)","AU ALOS (days)",
    "US complexity split","UK complexity split","DE complexity split","AU complexity split"];
  const lines = [head.join(",")];
  currentMatches.forEach(p => {
    const cm = CASEMIX[p.name] || {};
    const alos = k => cm.alos ? cm.alos[k] : "";
    const split = k => cm.complexity ? cm.complexity[k].map(([l, pc]) => `${l}: ${pc}%`).join("; ") : "";
    lines.push([p.name,
      p.us[0], p.us[2], alos("us"),
      p.uk[0], p.uk[2], alos("uk"),
      p.de[0], p.de[2], alos("de"),
      p.au[0], p.au[2], alos("au"),
      split("us"), split("uk"), split("de"), split("au")].map(csvEscape).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "casemix-crosswalk.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

searchBox.addEventListener("input", e => search(e.target.value));
document.getElementById("exportBtn").addEventListener("click", exportCSV);

if (new URLSearchParams(location.search).get("success") === "1") {
  unlocked = true;
  localStorage.setItem("cc_unlocked", "true");
}