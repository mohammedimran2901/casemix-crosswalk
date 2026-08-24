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
  const tr = document.createElement("tr");
  if (blur) tr.classList.add("blurred");
  tr.innerHTML =
    `<td><strong>${p.name}</strong></td>` +
    cell(p.us, "USD") + cell(p.uk, "GBP") + cell(p.de, "EUR") + cell(p.au, "AUD");
  tbody.appendChild(tr);
}
function cell(arr, cur) {
  return `<td><span class="code">${arr[0]}</span> <span class="rate">${fmtRate(arr[2], cur)}</span><span class="desc">${arr[1]}</span></td>`;
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
  resultCount.textContent = q ? `${matches.length} match(es) for "${qRaw.trim()}"` : "";
  if (!matches.length) return;

  if (unlocked || freeUsed < FREE_LOOKUPS) {
    matches.forEach(p => renderRow(p, false));
    if (!unlocked) {
      freeUsed++;
      localStorage.setItem("cc_free_used", freeUsed);
      if (freeUsed >= FREE_LOOKUPS) showPaywall();
      else resultCount.textContent += ` · ${FREE_LOOKUPS - freeUsed} free lookup(s) left`;
    }
  } else {
    // Show blurred teaser rows
    matches.slice(0, 4).forEach(p => renderRow(p, true));
    showPaywall();
  }
}

searchBox.addEventListener("input", e => search(e.target.value));

if (new URLSearchParams(location.search).get("success") === "1") {
  unlocked = true;
  localStorage.setItem("cc_unlocked", "true");
}