const $ = (id) => document.getElementById(id);

const API_BASE_URL = "http://127.0.0.1:8000";

async function loadTransactionsFromAPI() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/transactions`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    state.transactions = result.transactions.map((transaction) => ({
      id: transaction.transaction_id,
      customer: transaction.customer ?? "—",
      merchant: transaction.merchant ?? "—",
      amount: transaction.amount,
      currency: transaction.currency ?? "USD",
      type: transaction.type ?? "Transaction",
      risk: transaction.risk_level,
      status: transaction.status,
      location: transaction.location ?? "Unknown",
    }));

    if (state.page !== "Overview") {
      renderDataPage();
    }

    showToast("Transactions loaded from the VaultGuard API.");
  } catch (error) {
    console.error("Could not load transactions:", error);
    showToast(
      "Could not load transactions. Check the API server."
    );
  }
}


const pageInfo = {
  "Overview": ["Risk Overview", "Real-time monitoring of transaction risk and fraud indications."],
  "Transactions": ["Transactions", "Search, review and inspect transaction records."],
  "Fraud Detection": ["Fraud Detection", "Review risk signals and the current demo decision rules."],
  "Investigations": ["Investigations", "Track alerts that need an analyst's investigation."],
  "Customers": ["Customers", "Review synthetic customer profiles and their risk indicators."],
  "Merchants": ["Merchants", "Monitor merchant activity and sample risk levels."],
  "Rules & Models": ["Rules & Models", "Inspect the temporary frontend rules and model status."],
  "Alerts": ["Alerts", "Create and manage sample alerts for this browser session."],
  "Reports": ["Reports", "Review summary metrics and export the visible records."],
  "Compliance": ["Compliance", "Review demo control checks and evidence status."],
  "Admin Panel": ["Admin Panel", "Inspect prototype settings and feature availability."]
};

const state = {
  page: "Overview",
  collapsed: false,
  risk: "all",
  status: "all",
  query: "",
  alerts: [
    {id:"ALT-003", severity:"High", title:"High transaction volume observed in AU debit transactions", segment:"AU Cards", started:"10 min ago", status:"Monitoring", owner:"Emily Wang"},
    {id:"ALT-002", severity:"Medium", title:"Decline rate increase in APAC credit cards", segment:"APAC Cards", started:"5 min ago", status:"Investigating", owner:"John Lee"},
    {id:"ALT-005", severity:"Low", title:"System downtime affecting ME card transactions", segment:"ME Cards", started:"20 min ago", status:"Resolved", owner:"Amina Hassan"},
    {id:"ALT-008", severity:"Medium", title:"Customer request for new features in AS card app", segment:"AS Cards", started:"10 min ago", status:"Pending Review", owner:"Mike Chen"},
    {id:"ALT-007", severity:"High", title:"Issue with incorrect transaction amounts on AS card statements", segment:"APAC Cards", started:"15 min ago", status:"Monitoring", owner:"Sara Lee"}
  ],
  transactions: [
    {id:"TXN-10421", customer:"CUS-208", merchant:"Northstar Market", amount:125.50, currency:"USD", type:"Online purchase", risk:"Low", status:"Approved", location:"Usual"},
    {id:"TXN-10422", customer:"CUS-112", merchant:"Metro Electronics", amount:1840.00, currency:"USD", type:"Online purchase", risk:"High", status:"Flagged", location:"Unusual"},
    {id:"TXN-10423", customer:"CUS-451", merchant:"City Transit", amount:32.80, currency:"USD", type:"Point-of-sale", risk:"Low", status:"Approved", location:"Usual"},
    {id:"TXN-10424", customer:"CUS-307", merchant:"Travel Hub", amount:620.00, currency:"USD", type:"Bank transfer", risk:"Medium", status:"Review", location:"Unusual"},
    {id:"TXN-10425", customer:"CUS-208", merchant:"Northstar Market", amount:78.25, currency:"USD", type:"Point-of-sale", risk:"Low", status:"Approved", location:"Usual"}
  ],
  customers: [
    {id:"CUS-112", name:"Customer 112", region:"EU", transactions:18, risk:"High", status:"Review required"},
    {id:"CUS-208", name:"Customer 208", region:"EU", transactions:42, risk:"Low", status:"Active"},
    {id:"CUS-307", name:"Customer 307", region:"APAC", transactions:12, risk:"Medium", status:"Monitoring"},
    {id:"CUS-451", name:"Customer 451", region:"AU", transactions:29, risk:"Low", status:"Active"}
  ],
  merchants: [
    {id:"MER-021", name:"Northstar Market", category:"Retail", volume:421, risk:"Low", status:"Active"},
    {id:"MER-034", name:"Metro Electronics", category:"Electronics", volume:183, risk:"High", status:"Monitoring"},
    {id:"MER-041", name:"City Transit", category:"Transport", volume:902, risk:"Low", status:"Active"},
    {id:"MER-052", name:"Travel Hub", category:"Travel", volume:117, risk:"Medium", status:"Review"}
  ],
  investigations: [
    {id:"INV-021", alert:"ALT-002", title:"APAC card decline spike", severity:"Medium", status:"Investigating", owner:"John Lee"},
    {id:"INV-018", alert:"ALT-007", title:"Statement amount discrepancy", severity:"High", status:"Pending Review", owner:"Sara Lee"}
  ],
  rules: [
    {id:"RULE-001", name:"Unusual transaction amount", condition:"Amount ≥ $1,000 (demo)", action:"Flag for review", status:"Enabled"},
    {id:"RULE-002", name:"Unusual location", condition:"Location marked unusual (demo)", action:"Flag for review", status:"Enabled"},
    {id:"RULE-003", name:"Velocity anomaly", condition:"Not implemented yet", action:"No action", status:"Planned"}
  ]
};

const tableConfigs = {
  "Transactions": {heading:"Transaction Records", desc:"Synthetic transaction data for interface testing.", cols:[["id","Transaction ID"],["customer","Customer"],["merchant","Merchant"],["amount","Amount"],["type","Type"],["risk","Risk"],["status","Status"]], key:"transactions"},
  "Investigations": {heading:"Investigation Queue", desc:"Sample cases assigned to risk operations.", cols:[["id","Case ID"],["alert","Alert ID"],["title","Investigation"],["severity","Severity"],["status","Status"],["owner","Owner"]], key:"investigations"},
  "Customers": {heading:"Customer Profiles", desc:"Synthetic profiles only; no real customer data.", cols:[["id","Customer ID"],["name","Name"],["region","Region"],["transactions","Transactions"],["risk","Risk"],["status","Status"]], key:"customers"},
  "Merchants": {heading:"Merchant Monitoring", desc:"Synthetic merchant activity and risk labels.", cols:[["id","Merchant ID"],["name","Merchant"],["category","Category"],["volume","Transaction volume"],["risk","Risk"],["status","Status"]], key:"merchants"},
  "Rules & Models": {heading:"Rules & Model Registry", desc:"Frontend demo rules; no trained model is connected yet.", cols:[["id","Rule ID"],["name","Rule"],["condition","Condition"],["action","Action"],["status","Status"]], key:"rules"},
  "Alerts": {heading:"Alert Queue", desc:"Create, filter and inspect local demo alerts.", cols:[["id","Alert ID"],["severity","Severity"],["title","Alert"],["segment","Segment"],["started","Started"],["status","Status"],["owner","Owner"]], key:"alerts"},
  "Fraud Detection": {heading:"Risk Signals", desc:"These rules are illustrative only and are not a fraud model.", cols:[["id","Transaction ID"],["merchant","Merchant"],["amount","Amount"],["location","Location signal"],["risk","Demo risk"],["status","Decision"]], key:"transactions"},
  "Reports": {heading:"Risk Summary Report", desc:"Summary calculated from the sample records currently in this browser.", cols:[["metric","Metric"],["value","Value"],["meaning","Description"]], key:"reports"},
  "Compliance": {heading:"Control Checklist", desc:"Prototype checklist only; not a certification or compliance assessment.", cols:[["control","Control"],["status","Status"],["evidence","Evidence / next step"]], key:"compliance"},
  "Admin Panel": {heading:"Prototype Administration", desc:"Settings that apply to this local browser prototype only.", cols:[["setting","Setting"],["value","Current value"],["notes","Notes"]], key:"admin"}
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function money(amount, currency = $("currencySelect").value) {
  const locales = {
    USD: "en-US",
    EUR: "de-DE",
    NGN: "en-NG",
    GBP: "en-GB",
  };

  return new Intl.NumberFormat(locales[currency] || "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function pill(value) {
  const v = String(value || "");
  const cls = v.toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
  if (["high","medium","low"].includes(v.toLowerCase())) return `<span class="severity ${cls}">${escapeHTML(v)}</span>`;
  if (["monitoring","investigating","resolved","pending review"].includes(v.toLowerCase())) return `<span class="status-pill status-${cls}">${escapeHTML(v)}</span>`;
  return escapeHTML(v);
}
function filteredAlerts() {
  return state.alerts.filter(a => (state.risk === "all" || a.severity === state.risk) && (state.status === "all" || a.status === state.status) && matchesQuery(a));
}
function matchesQuery(row) {
  if (!state.query) return true;
  return Object.values(row).some(v => String(v).toLowerCase().includes(state.query));
}
function renderOverview() {
  const rows = filteredAlerts().slice(0,5);
  $("overviewAlertsBody").innerHTML = rows.length ? rows.map(a => `<tr><td>${pill(a.severity)}</td><td><strong>${escapeHTML(a.title)}</strong><br><span class="muted">${escapeHTML(a.id)}</span></td><td>${escapeHTML(a.segment)}</td><td>${escapeHTML(a.started)}</td><td>${pill(a.status)}</td><td>${escapeHTML(a.owner)}</td></tr>`).join("") : `<tr><td colspan="6" class="empty-state">No alerts match the current search and filters.</td></tr>`;
  $("alertNavCount").textContent = state.alerts.filter(a => a.status !== "Resolved").length;
}
function reportRows() {
  const flagged = state.transactions.filter(t => t.risk === "High").length;
  const review = state.transactions.filter(t => t.risk === "Medium").length;
  return [
    {metric:"Transactions in sample",value:state.transactions.length,meaning:"Number of synthetic transaction records"},
    {metric:"High-risk demo records",value:flagged,meaning:"Records marked High by the temporary demo rule"},
    {metric:"Medium-risk demo records",value:review,meaning:"Records marked Medium in sample data"},
    {metric:"Open alerts",value:state.alerts.filter(a=>a.status!=="Resolved").length,meaning:"Alerts not marked Resolved"},
    {metric:"Resolved alerts",value:state.alerts.filter(a=>a.status==="Resolved").length,meaning:"Alerts marked Resolved"}
  ];
}
function complianceRows() {
  return [
    {control:"Least-privilege IAM",status:"Planned",evidence:"Configure and review IAM policies before AWS deployment"},
    {control:"Data encryption",status:"Planned",evidence:"Document encryption in transit and at rest"},
    {control:"Audit logging",status:"Planned",evidence:"Add CloudWatch logs and define retention"},
    {control:"Synthetic test data",status:"In place",evidence:"Current frontend uses fictional demo records"},
    {control:"Model validation",status:"Not started",evidence:"Add evaluation metrics after model training"}
  ];
}
function adminRows() {
  return [
    {setting:"Environment",value:"Local demo",notes:"No backend connection"},
    {setting:"Data source",value:"In-memory sample data",notes:"Resets when the page reloads"},
    {setting:"Prediction engine",value:"Demo rules only",notes:"Not a trained machine-learning model"},
    {setting:"Currency display",value:$("currencySelect").value,notes:"Display preference only; values are not converted"},
    {setting:"Region",value:$("regionSelect").value,notes:"Demo filter context only"}
  ];
}
function getRowsForPage(page) {
  if (page === "Alerts") return filteredAlerts();
  if (page === "Fraud Detection") return state.transactions.filter(matchesQuery).map(t => ({...t,location:t.location==="Unusual"?"Unusual location":"Usual location",status:t.risk==="High"?"Flagged for review":t.risk==="Medium"?"Manual review":"No demo rule triggered"}));
  if (page === "Reports") return reportRows();
  if (page === "Compliance") return complianceRows();
  if (page === "Admin Panel") return adminRows();
  const config = tableConfigs[page];
  return config ? (state[config.key] || []).filter(matchesQuery) : [];
}
function displayValue(key, value, row) {
  if (key === "amount") return money(value, row.currency || $("currencySelect").value);
  if (key === "risk" || key === "severity" || key === "status") return pill(value);
  if (key === "metric" || key === "control" || key === "setting") return `<strong>${escapeHTML(value)}</strong>`;
  return escapeHTML(value);
}
function renderDataPage() {
  const page = state.page, config = tableConfigs[page];
  if (!config) return;
  $("dataHeading").textContent = config.heading;
  $("dataDescription").textContent = config.desc;
  $("dataTableHead").innerHTML = `<tr>${config.cols.map(c=>`<th>${escapeHTML(c[1])}</th>`).join("")}${["Transactions","Alerts","Customers","Merchants","Investigations"].includes(page)?"<th>Action</th>":""}</tr>`;
  const rows = getRowsForPage(page);
  const canInspect = ["Transactions","Alerts","Customers","Merchants","Investigations"].includes(page);
  $("dataTableBody").innerHTML = rows.length ? rows.map((row,i)=>`<tr>${config.cols.map(([key])=>`<td>${displayValue(key,row[key],row)}</td>`).join("")}${canInspect?`<td><button class="text-button inspect-btn" data-index="${i}">Inspect →</button></td>`:""}</tr>`).join("") : `<tr><td colspan="${config.cols.length+(canInspect?1:0)}" class="empty-state">No records match your search and filters.</td></tr>`;
  $("tableFootnote").textContent = "Sample records only. Data is held in browser memory and resets when the page reloads.";
  $("addSampleBtn").classList.toggle("hidden", !["Transactions","Alerts"].includes(page));
  $("pageExportBtn").classList.remove("hidden");
  $("detailCard").classList.add("hidden");
}
function navigate(page) {
  if (!pageInfo[page]) return;
  state.page = page;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  $("pageTitle").textContent = pageInfo[page][0];
  $("pageSubtitle").textContent = pageInfo[page][1];
  $("overviewPage").classList.toggle("hidden", page !== "Overview");
  $("dataPage").classList.toggle("hidden", page === "Overview");
  if (page !== "Overview") renderDataPage();
  $("sidebar").classList.remove("mobile-open");
  window.scrollTo({top:0,behavior:"smooth"});
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3000);
}
function openAlertModal() {
  $("alertModal").classList.remove("hidden");
  $("newAlertTitle").focus();
}
function closeAlertModal() {
  $("alertModal").classList.add("hidden");
  $("alertForm").reset();
}

async function addSample() {
  // Keep the existing alert workflow unchanged.
  if (state.page === "Alerts") {
    openAlertModal();
    return;
  }

  // Create a new synthetic transaction.
  const n = state.transactions.length + 1;
  const high = n % 3 === 0;

  const transaction = {
    transaction_id: `TXN-${Date.now()}`,
    customer: "CUS-208",
    merchant: high
      ? "Metro Electronics"
      : "Northstar Market",
    amount: high ? 1420.75 : 85.40,
    currency: $("currencySelect").value,
    type: "Online purchase",
    status: high ? "Flagged" : "Approved",
    location: high ? "Unusual" : "Usual",
  };

  try {
    // Send the transaction to the FastAPI backend.
    const response = await fetch(
      `${API_BASE_URL}/api/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      }
    );

    // Display an error returned by the backend.
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));

      throw new Error(
        errorBody.detail ||
        `Request failed with status ${response.status}`
      );
    }

    // Reload records from SQLite through the API.
    await loadTransactionsFromAPI();

    showToast(
      `Transaction ${transaction.transaction_id} saved successfully.`
    );
  } catch (error) {
    console.error("Could not save transaction:", error);

    showToast(
      `Could not save transaction: ${error.message}`
    );
  }
}

function inspectRecord(index) {
  const rows = getRowsForPage(state.page);
  const row = rows[index];
  if (!row) return;
  $("detailTitle").textContent = `${state.page} · ${row.id || row.metric || row.control || row.setting || "Record"}`;
  $("detailContent").innerHTML = `<div class="detail-grid">${Object.entries(row).map(([key,value])=>`<div class="detail-item"><small>${escapeHTML(key.replace(/([A-Z])/g," $1"))}</small><strong>${escapeHTML(value)}</strong></div>`).join("")}</div><p class="muted">This is a local prototype record. In the connected version, detail views will be populated by the backend API and access-controlled.</p>`;
  $("detailCard").classList.remove("hidden");
  $("detailCard").scrollIntoView({behavior:"smooth",block:"start"});
}
function exportCurrentCSV() {
  const page = state.page;
  const config = tableConfigs[page];
  if (!config) {
    showToast("Open a data section first to export its current records.");
    return;
  }
  const rows = getRowsForPage(page);
  if (!rows.length) {
    showToast("There are no rows to export.");
    return;
  }
  const cols = config.cols.map(([key,label])=>({key,label}));
  const csvCell = value => `"${String(value ?? "").replace(/"/g,'""')}"`;
const csv = [
  cols.map((c) => csvCell(c.label)).join(","),
  ...rows.map((row) =>
    cols
      .map((c) =>
        csvCell(
          c.key === "amount"
            ? money(row[c.key], row.currency || $("currencySelect").value)
            : row[c.key]
        )
      )
      .join(",")
  ),
].join("\r\n");

const blob = new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vaultguard-${page.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.csv`;
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  showToast("CSV export started.");
}

$("mainNav").addEventListener("click", event => {
  const btn = event.target.closest("[data-page]");
  if (btn) navigate(btn.dataset.page);
});
document.addEventListener("click", event => {
  const go = event.target.closest("[data-goto]");
  if (go) navigate(go.dataset.goto);
  const inspect = event.target.closest(".inspect-btn");
  if (inspect) inspectRecord(Number(inspect.dataset.index));
});
$("collapseSidebar").addEventListener("click", () => {
  state.collapsed = !state.collapsed;
  $("sidebar").classList.toggle("collapsed",state.collapsed);
  $("collapseSidebar").innerHTML = state.collapsed ? "› <span>Show Panel</span>" : "‹ <span>Hide Panel</span>";
});
$("mobileMenu").addEventListener("click", () => $("sidebar").classList.toggle("mobile-open"));
$("filtersBtn").addEventListener("click", () => $("filterStrip").classList.toggle("hidden"));
$("riskFilter").addEventListener("change", e => {state.risk=e.target.value;renderOverview();if(state.page==="Alerts")renderDataPage();});
$("statusFilter").addEventListener("change", e => {state.status=e.target.value;renderOverview();if(state.page==="Alerts")renderDataPage();});
$("clearFilters").addEventListener("click", () => {
  state.risk="all";state.status="all";$("riskFilter").value="all";$("statusFilter").value="all";
  renderOverview();if(state.page==="Alerts")renderDataPage();showToast("Filters cleared.");
});
$("globalSearch").addEventListener("input", e => {
  state.query=e.target.value.trim().toLowerCase();
  renderOverview();
  if(state.page!=="Overview")renderDataPage();
});
$("createAlertBtn").addEventListener("click",openAlertModal);
$("closeModal").addEventListener("click",closeAlertModal);
$("cancelModal").addEventListener("click",closeAlertModal);
$("alertModal").addEventListener("click",e=>{if(e.target===$("alertModal"))closeAlertModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAlertModal();$("sidebar").classList.remove("mobile-open");}});
$("alertForm").addEventListener("submit",e=>{
  e.preventDefault();
  const n=state.alerts.length+1;
  state.alerts.unshift({
    id:`ALT-${String(10+n).padStart(3,"0")}`,
    severity:$("newAlertSeverity").value,
    title:$("newAlertTitle").value.trim(),
    segment:$("newAlertSegment").value.trim(),
    started:"Just now",
    status:"Pending Review",
    owner:$("newAlertOwner").value.trim()
  });
  closeAlertModal();renderOverview();if(state.page==="Alerts")renderDataPage();
  showToast("Demo alert created in this browser session.");
});
$("addSampleBtn").addEventListener("click",addSample);
$("pageExportBtn").addEventListener("click",exportCurrentCSV);
$("exportBtn").addEventListener("click",exportCurrentCSV);
$("settingsBtn").addEventListener("click",()=>navigate("Admin Panel"));
$("notificationBtn").addEventListener("click",()=>{navigate("Alerts");showToast(`${state.alerts.filter(a=>a.status!=="Resolved").length} open demo alert(s).`);});
$("compareBtn").addEventListener("click",()=>showToast("Period comparison will be enabled when historical backend data is connected."));
$("currencySelect").addEventListener("change",()=>{if(state.page!=="Overview")renderDataPage();showToast("Currency display changed. Sample amounts are not converted.");});
$("regionSelect").addEventListener("change",()=>showToast(`Region context set to ${$("regionSelect").value}. Sample data is unchanged.`));
$("timeSelect").addEventListener("change",()=>showToast("Time range changed for the demo view; sample chart values remain illustrative."));
$("closeDetail").addEventListener("click",()=>$("detailCard").classList.add("hidden"));

renderOverview();
navigate("Overview");
loadTransactionsFromAPI();
