const FREE_LOOKUPS = 10;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_LINK_HERE"; // TODO: replace with your real Stripe Payment Link

let freeUsed = parseInt(localStorage.getItem("cc_free_used") || "0", 10);
let unlocked = localStorage.getItem("cc_unlocked") === "true";
let currentMatches = [];
const tbody = document.querySelector("#resultsTable tbody");
const searchBox = document.getElementById("searchBox");
const resultCount = document.getElementById("resultCount");
const paywall = document.getElementById("paywall");

const CURR = { us: "$", uk: "£" };
const money = (v, c) => CURR[c] + v.toLocaleString();

function renderRow(p, blur) {
  const ae = typeof AE !== "undefined" ? AE[p.name] : null;
  const tr = document.createElement("tr");
  if (blur) tr.classList.add("blurred");
  tr.innerHTML = `<td><strong>${p.name}</strong></td>` + cell(p.us, "us") + cell(p.uk, "uk") + aeCell(ae);
  tbody.appendChild(tr);
}

function cell(side, key) {
  const t = side.tiers;
  const min = Math.min(...t.map(x => x.price)), max = Math.max(...t.map(x => x.price));
  const std = t[0]; // least-complex tier (baseline rate)
  const alosHtml = std.alos != null ? `<span class="alos">🏥 ${std.alos.toFixed(1)} days avg stay</span>` : "";
  const rangeHtml = min !== max ? `<span class="desc">${money(min, key)} – ${money(max, key)} by complexity</span>` : "";
  return `<td><span class="code">${side.family}</span><span class="rate">${money(std.price, key)}</span>${alosHtml}${rangeHtml}</td>`;
}

function aeCell(ae) {
  if (!ae) return `<td><span class="desc">IR-DRG mapping pending</span></td>`;
  const w = ae.tiers.map(t => t.weight);
  const min = Math.min(...w), max = Math.max(...w);
  const rangeHtml = min !== max ? `<span class="desc">×${min.toFixed(2)} – ×${max.toFixed(2)} by severity</span>` : "";
  return `<td><span class="code">${ae.family}</span><span class="rate">×${w[0].toFixed(2)} weight</span>${rangeHtml}<span class="desc">× negotiated base rate (AED)</span></td>`;
}

function renderComplexity(p, blur) {
  const panel = document.getElementById("complexityPanel");
  if (!panel) return;
  let html = `<h3>📐 Complexity price ladder — ${p.name}</h3>
    <p class="cm-sub">Official published payment per complexity tier (source-verified)</p>
    <div class="cm-grid">`;
  [["us", "🇺🇸 US MS-DRG", "$"], ["uk", "🇬🇧 UK HRG", "£"]].forEach(([key, title]) => {
    const tiers = p[key].tiers;
    const max = Math.max(...tiers.map(t => t.price));
    html += `<div class="cm-card${blur ? " blurred" : ""}"><div class="cm-title">${title}</div>`;
    tiers.forEach(t => {
      html += `<div class="cm-row"><span class="cm-label">${t.code} · ${t.tier}</span>
        <div class="cm-bar"><div class="cm-fill" style="width:${Math.round(t.price / max * 100)}%"></div></div>
        <span class="cm-pct">${money(t.price, key)}</span></div>`;
    });
    html += `</div>`;
  });
  const ae = typeof AE !== "undefined" ? AE[p.name] : null;
  if (ae) {
    const maxW = Math.max(...ae.tiers.map(t => t.weight));
    html += `<div class="cm-card${blur ? " blurred" : ""}"><div class="cm-title">🇦🇪 UAE IR-DRG (relative weight)</div>`;
    ae.tiers.forEach(t => {
      html += `<div class="cm-row"><span class="cm-label">${t.code} · ${t.tier}</span>
        <div class="cm-bar"><div class="cm-fill" style="width:${Math.round(t.weight / maxW * 100)}%"></div></div>
        <span class="cm-pct">×${t.weight.toFixed(2)}</span></div>`;
    });
    html += `<div class="cm-alos">Payment = weight × facility base rate (AED)</div></div>`;
  }
  html += `</div><p class="fineprint">US: national average = DRG weight × $7,276.76 (FY2026 operating + capital standardized amounts), before geographic adjustment. UK: 2025/26 elective unit price, before Market Forces Factor. UAE: DoH Abu Dhabi IR-DRG relative weights (v2012-Q2 era publication); current weights via Shafafiya portal. Sources: ${SOURCES.us}; ${SOURCES.uk}; ${SOURCES.ae}.</p>`;
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
    matches = PROCEDURES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.us.tiers.some(t => t.code.toLowerCase() === q) ||
      p.uk.tiers.some(t => t.code.toLowerCase() === q) ||
      (typeof AE !== "undefined" && AE[p.name] && AE[p.name].tiers.some(t => t.code.toLowerCase() === q))
    );
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
    matches.slice(0, 4).forEach(p => renderRow(p, true));
    renderComplexity(matches[0], true);
    showPaywall();
  }
}

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

const csvEscape = s => `"${String(s).replace(/"/g, '""')}"`;

function exportCSV() {
  if (!unlocked || !currentMatches.length) return;
  const head = ["Procedure",
    "US DRG family", "US tier", "US code", "US payment (USD)", "US avg LOS (days)",
    "UK HRG family", "UK tier", "UK code", "UK price (GBP, elective)",
    "UAE IR-DRG family", "UAE tier", "UAE code", "UAE relative weight"];
  const lines = [head.join(",")];
  currentMatches.forEach(p => {
    p.us.tiers.forEach(t => lines.push([p.name, p.us.family, t.tier, t.code, t.price, t.alos ?? "", "", "", "", "", "", "", "", ""].map(csvEscape).join(",")));
    p.uk.tiers.forEach(t => lines.push([p.name, "", "", "", "", "", p.uk.family, t.tier, t.code, t.price, "", "", "", ""].map(csvEscape).join(",")));
    const ae = typeof AE !== "undefined" ? AE[p.name] : null;
    if (ae) ae.tiers.forEach(t => lines.push([p.name, "", "", "", "", "", "", "", "", "", ae.family, t.tier, t.code, t.weight].map(csvEscape).join(",")));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "casemix-crosswalk-verified.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

searchBox.addEventListener("input", e => search(e.target.value));
document.getElementById("exportBtn").addEventListener("click", exportCSV);

if (new URLSearchParams(location.search).get("success") === "1") {
  unlocked = true;
  localStorage.setItem("cc_unlocked", "true");
}
