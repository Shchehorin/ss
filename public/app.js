const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CATALOG = [
  ["P250", "Sand Dune", 0.1], ["MP9", "Storm", 0.3], ["Glock-18", "Candy Apple", 0.8], ["SSG 08", "Blue Spruce", 1.2],
  ["Nova", "Antique", 2.4], ["MAC-10", "Neon Rider", 5], ["UMP-45", "Primal Saber", 7], ["Five-SeveN", "Hyper Beast", 12],
  ["P90", "Asiimov", 20], ["USP-S", "Kill Confirmed", 31], ["M4A4", "Neo-Noir", 55], ["AK-47", "Redline", 72],
  ["Desert Eagle", "Blaze", 480], ["AWP", "Asiimov", 95], ["M4A1-S", "Printstream", 165], ["AK-47", "Vulcan", 140],
  ["AK-47", "Fire Serpent", 420], ["AWP", "Dragon Lore", 1900], ["M4A4", "Howl", 3100], ["AWP", "Gungnir", 5200],
  ["Karambit", "Doppler", 780], ["Butterfly Knife", "Fade", 1250], ["Karambit", "Fade", 1900], ["M9 Bayonet", "Crimson Web", 1100],
  ["Karambit", "Gamma Doppler", 2400], ["Sport Gloves", "Pandora's Box", 9800], ["Specialist Gloves", "Emerald Web", 4300], ["Talon Knife", "Marble Fade", 1700],
].map(([weapon, name, price], id) => ({ id, weapon, name, price }));
CATALOG.sort((a, b) => a.price - b.price).forEach((s, i) => (s.id = i));

const rarity = (p) => p < 1 ? "#8a97a8" : p < 6 ? "#4b9bff" : p < 40 ? "#7c5cff" : p < 300 ? "#d044e8" : p < 1000 ? "#eb4b4b" : "#e4ae39";

const gun = (c) => `<svg viewBox="0 0 120 48" fill="none"><g fill="${c}" opacity=".95"><rect x="30" y="16" width="62" height="9" rx="2"/><rect x="88" y="19" width="28" height="4" rx="1"/><path d="M30 18 8 22l3 9 21-3z"/><path d="M52 25h10l-3 17H48z" opacity=".75"/><rect x="40" y="12" width="24" height="4" rx="1" opacity=".6"/></g></svg>`;

const store = {
  get() { try { return JSON.parse(localStorage.getItem("upgrd")) || null; } catch { return null; } },
  save() { localStorage.setItem("upgrd", JSON.stringify({ balance: S.balance, inv: S.inv, uid: S.uid })); },
};
const S = Object.assign({ balance: 125.5, inv: [], uid: 1 }, store.get());
if (!store.get()) [14, 15, 15, 11, 9, 5].forEach((id) => S.inv.push({ uid: S.uid++, id }));
const item = (it) => CATALOG[it.id];

function addItem(id) { const it = { uid: S.uid++, id }; S.inv.push(it); return it; }
function setBalance(v) { S.balance = Math.max(0, Math.round(v * 100) / 100); store.save(); renderBalance(); }
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2200); }
function renderBalance() { $("#balance").textContent = money(S.balance); const m = $("#addbal"); m.max = Math.floor(S.balance * 2) / 2; if (+m.value > +m.max) m.value = m.max; }

function skinHTML(s, extra = "", cls = "") {
  return `<div class="skin ${cls}" style="--rc:${rarity(s.price)}" ${extra}>${gun(rarity(s.price))}<div class="nm">${s.name}</div><div class="wp">${s.weapon}</div><div class="pr">${money(s.price)}</div></div>`;
}

/* ---------- router ---------- */
function route() {
  const h = (location.hash || "#upgrade").slice(1);
  const id = document.getElementById(h) ? h : "upgrade";
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("on", p.id === id));
  document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  renderAll();
}
addEventListener("hashchange", route);

/* ---------- upgrade ---------- */
const U = { sel: new Set(), add: 0, target: null, mult: null, sortDesc: true, busy: false, angle: 0 };
const num = (v) => parseFloat(String(v).replace(",", ".")) || 0;
const srcValue = () => [...U.sel].reduce((s, uid) => { const it = S.inv.find((x) => x.uid === uid); return s + (it ? item(it).price : 0); }, 0) + U.add;
const chance = () => { const t = U.target != null ? CATALOG[U.target].price : 0; const v = srcValue(); return t && v ? Math.min(95, (v / t) * 95) : 0; };

function pickByMult() {
  const v = srcValue(); if (!v || !U.mult) return;
  const want = v * U.mult; let best = null;
  for (const s of CATALOG) if (s.price > v && s.price <= want) best = s;
  U.target = best ? best.id : null;
}

function renderUpgrade() {
  U.sel.forEach((uid) => { if (!S.inv.some((x) => x.uid === uid)) U.sel.delete(uid); });
  const v = srcValue();
  if (U.mult) pickByMult();
  if (U.target != null && CATALOG[U.target].price <= v) U.target = null;

  const selItems = S.inv.filter((x) => U.sel.has(x.uid));
  $("#give-slot").innerHTML = selItems.length
    ? `<div style="width:100%"><div class="slot-items">${selItems.map((x) => skinHTML(item(x), `data-uid="${x.uid}"`)).join("")}</div><div class="slot-total">Разом: ${money(v)}</div></div>`
    : `<div><div class="ph">+</div>Оберіть скін з інвентарю,<br>який хочете покращити${U.add ? `<div class="slot-total">${money(U.add)} з балансу</div>` : ""}</div>`;
  $("#give-slot").querySelectorAll("[data-uid]").forEach((e) => (e.onclick = () => { U.sel.delete(+e.dataset.uid); renderUpgrade(); }));

  const t = U.target != null ? CATALOG[U.target] : null;
  $("#get-slot").innerHTML = t ? `<div class="big">${skinHTML(t, "", "static")}</div>` : `<div><div class="ph">★</div>Оберіть множник або<br>цільовий скін</div>`;
  document.querySelectorAll("#mults button").forEach((b) => b.classList.toggle("on", +b.dataset.m === U.mult));

  const c = chance();
  const C = 2 * Math.PI * 112;
  $("#arc").style.strokeDasharray = `${(c / 100) * C} ${C}`;
  $("#chance-top").textContent = c.toFixed(1) + "%";
  $("#chance-bar").style.height = c + "%";
  if (!U.busy) { const w = $("#wheel-text"); w.className = "wheel-text"; w.textContent = c.toFixed(1) + "%"; }
  $("#go").disabled = U.busy || !t || !v;

  $("#addbal-val").textContent = money(U.add);

  const from = num($("#f-from").value), to = num($("#f-to").value) || Infinity;
  const inv = S.inv.filter((x) => item(x).price >= from && item(x).price <= to).sort((a, b) => (U.sortDesc ? 1 : -1) * (item(b).price - item(a).price));
  $("#inv-count").textContent = S.inv.length;
  const g = $("#up-inv"); g.dataset.empty = "Інвентар порожній. Відкрийте кейс!";
  g.innerHTML = inv.map((x) => skinHTML(item(x), `data-uid="${x.uid}"`, U.sel.has(x.uid) ? "sel" : "")).join("");
  g.querySelectorAll("[data-uid]").forEach((e) => (e.onclick = () => { if (U.busy) return; const id = +e.dataset.uid; U.sel.has(id) ? U.sel.delete(id) : U.sel.add(id); renderUpgrade(); }));

  const q = $("#t-search").value.trim().toLowerCase(), tf = num($("#t-from").value), tt = num($("#t-to").value) || Infinity;
  const list = CATALOG.filter((s) => s.price > v && s.price >= tf && s.price <= tt && (s.name + " " + s.weapon).toLowerCase().includes(q));
  const tg = $("#up-target"); tg.dataset.empty = v ? "Нічого не знайдено" : "Спочатку оберіть свій скін в інвентарі";
  tg.innerHTML = v ? list.map((s) => skinHTML(s, `data-id="${s.id}"`, s.id === U.target ? "sel" : "")).join("") : "";
  tg.querySelectorAll("[data-id]").forEach((e) => (e.onclick = () => { if (U.busy) return; U.target = +e.dataset.id; U.mult = null; renderUpgrade(); }));
}

function initUpgrade() {
  const ticks = $("#ticks");
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI, r1 = i % 5 ? 90 : 86, r2 = 98;
    ticks.insertAdjacentHTML("beforeend", `<line x1="${130 + Math.sin(a) * r1}" y1="${130 - Math.cos(a) * r1}" x2="${130 + Math.sin(a) * r2}" y2="${130 - Math.cos(a) * r2}"/>`);
  }
  $("#addbal").oninput = (e) => { U.add = +e.target.value; renderUpgrade(); };
  $("#addmax").onclick = () => { $("#addbal").value = $("#addbal").max; U.add = +$("#addbal").max; renderUpgrade(); };
  document.querySelectorAll("#mults button").forEach((b) => (b.onclick = () => { if (U.busy) return; U.mult = +b.dataset.m; renderUpgrade(); }));
  ["#f-from", "#f-to", "#t-search", "#t-from", "#t-to"].forEach((s) => ($(s).oninput = renderUpgrade));
  $("#f-sort").onclick = () => { U.sortDesc = !U.sortDesc; $("#f-sort").textContent = U.sortDesc ? "↓" : "↑"; renderUpgrade(); };
  $("#go").onclick = doUpgrade;
}

function doUpgrade() {
  const t = CATALOG[U.target], c = chance(), v = srcValue();
  if (!t || !v || U.busy || U.add > S.balance) return;
  U.busy = true; $("#go").disabled = true;
  const roll = Math.random() * 100, win = roll < c;
  const ptr = $("#pointer");
  U.angle = Math.ceil(U.angle / 360) * 360 + 360 * 5 + (roll / 100) * 360;
  ptr.classList.add("spin");
  ptr.style.transform = `rotate(${U.angle}deg)`;
  const given = S.inv.filter((x) => U.sel.has(x.uid));
  setTimeout(() => {
    S.inv = S.inv.filter((x) => !U.sel.has(x.uid));
    setBalance(S.balance - U.add);
    const w = $("#wheel-text");
    if (win) { addItem(t.id); w.textContent = "Успіх"; w.className = "wheel-text win"; toast(`Ви отримали ${t.weapon} | ${t.name}`); }
    else { w.textContent = "Провал"; w.className = "wheel-text lose"; }
    store.save();
    pushLive(given.length ? item(given[0]) : { weapon: "Баланс", name: "", price: v }, t, c, win);
    U.sel.clear(); U.add = 0; $("#addbal").value = 0; U.target = win ? null : U.target; U.mult = null;
    setTimeout(() => { U.busy = false; ptr.classList.remove("spin"); ptr.style.transform = "rotate(0deg)"; U.angle = 0; renderAll(); }, 1500);
    renderInventoryViews();
  }, 4700);
}

/* ---------- live feed ---------- */
function pushLive(from, to, ch, win) {
  const el = document.createElement("div");
  el.className = "live-item " + (win ? "w" : "l");
  el.innerHTML = `<div class="sk">${gun(rarity(from.price))}<small>${money(from.price)}</small></div><div class="pc">${ch.toFixed(1)}%</div><div class="sk to">${gun(rarity(to.price))}<small>${money(to.price)}</small></div>`;
  const live = $("#live"); live.prepend(el);
  while (live.children.length > 9) live.lastChild.remove();
}
function fakeLive() {
  const to = CATALOG[3 + Math.floor(Math.random() * (CATALOG.length - 3))];
  const cands = CATALOG.filter((s) => s.price < to.price);
  const from = cands[Math.floor(Math.random() * cands.length)];
  const ch = Math.min(95, (from.price / to.price) * 95);
  pushLive(from, to, ch, Math.random() * 100 < ch);
}

/* ---------- inventory & contracts ---------- */
const C = { sel: new Set() };
function renderInventoryViews() {
  const total = S.inv.reduce((s, x) => s + item(x).price, 0);
  $("#inv2-count").textContent = S.inv.length;
  $("#inv-total").textContent = "Вартість: " + money(total);
  const g = $("#inv-grid"); g.dataset.empty = "Інвентар порожній. Відкрийте кейс!";
  g.innerHTML = [...S.inv].sort((a, b) => item(b).price - item(a).price).map((x) =>
    skinHTML(item(x), `data-uid="${x.uid}"`, "").replace("</div></div>", `</div><button class="mini act" data-sell="${x.uid}">Продати</button></div>`)).join("");
  g.querySelectorAll("[data-sell]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); sell(+b.dataset.sell); }));

  C.sel.forEach((uid) => { if (!S.inv.some((x) => x.uid === uid)) C.sel.delete(uid); });
  const cg = $("#ct-inv"); cg.dataset.empty = "Немає скінів для контракту";
  cg.innerHTML = [...S.inv].sort((a, b) => item(b).price - item(a).price).map((x) => skinHTML(item(x), `data-uid="${x.uid}"`, C.sel.has(x.uid) ? "sel" : "")).join("");
  cg.querySelectorAll("[data-uid]").forEach((e) => (e.onclick = () => {
    const id = +e.dataset.uid;
    if (C.sel.has(id)) C.sel.delete(id); else if (C.sel.size < 10) C.sel.add(id);
    renderInventoryViews();
  }));
  const sum = S.inv.filter((x) => C.sel.has(x.uid)).reduce((s, x) => s + item(x).price, 0);
  $("#ct-sum").textContent = `${C.sel.size}/10 · ${money(sum)}`;
  $("#ct-go").disabled = C.sel.size < 3;
}
function sell(uid) {
  const it = S.inv.find((x) => x.uid === uid); if (!it) return;
  S.inv = S.inv.filter((x) => x.uid !== uid); setBalance(S.balance + item(it).price); renderAll();
}
$("#sell-all").onclick = () => { const t = S.inv.reduce((s, x) => s + item(x).price, 0); S.inv = []; setBalance(S.balance + t); renderAll(); };
$("#ct-go").onclick = () => {
  const items = S.inv.filter((x) => C.sel.has(x.uid)); if (items.length < 3) return;
  const sum = items.reduce((s, x) => s + item(x).price, 0);
  const target = sum * (0.5 + Math.random() * 1.0) * 0.95;
  const best = CATALOG.reduce((a, b) => (Math.abs(b.price - target) < Math.abs(a.price - target) ? b : a));
  S.inv = S.inv.filter((x) => !C.sel.has(x.uid)); C.sel.clear(); addItem(best.id); store.save();
  const r = $("#ct-result"); r.hidden = false;
  r.innerHTML = `<h6>Результат контракту</h6>${skinHTML(best, "", "static")}`;
  renderAll();
};

/* ---------- cases ---------- */
const CASES = [
  { name: "Старт", price: 2, color: "#4b9bff" }, { name: "Чорний ринок", price: 10, color: "#7c5cff" },
  { name: "Хімія", price: 40, color: "#d044e8" }, { name: "Червоний рівень", price: 150, color: "#eb4b4b" },
  { name: "Золотий", price: 600, color: "#e4ae39" },
];
const boxSVG = (c) => `<svg class="box" viewBox="0 0 110 90"><path d="M10 30 55 10l45 20v42L55 88 10 72z" fill="${c}" opacity=".25" stroke="${c}" stroke-width="2"/><path d="M10 30l45 20 45-20M55 50v38" stroke="${c}" stroke-width="2" fill="none"/><rect x="46" y="44" width="18" height="12" rx="2" fill="${c}"/></svg>`;
const O = { c: null, busy: false };

function pool(c) {
  return CATALOG.filter((s) => s.price >= c.price * 0.12 && s.price <= c.price * 14).map((s) => ({ s, w: 1 / Math.pow(s.price, 1.35) }));
}
function pickFrom(p) {
  const t = p.reduce((a, b) => a + b.w, 0); let r = Math.random() * t;
  for (const x of p) if ((r -= x.w) <= 0) return x.s; return p[0].s;
}
function renderCases() {
  $("#cases-grid").innerHTML = CASES.map((c, i) => `<div class="case" style="--cc:${c.color}" data-i="${i}">${boxSVG(c.color)}<b>${c.name}</b><span>${money(c.price)}</span></div>`).join("");
  document.querySelectorAll(".case").forEach((e) => (e.onclick = () => openBox(CASES[+e.dataset.i])));
}
function openBox(c) {
  if (O.busy) return;
  O.c = c; $("#open-box").hidden = false; $("#open-title").textContent = `${c.name} · ${money(c.price)}`;
  $("#open-btn").textContent = `Відкрити за ${money(c.price)}`; $("#open-btn").disabled = false;
  $("#open-res").textContent = ""; const st = $("#strip"); st.style.transition = "none"; st.style.transform = "none";
  const p = pool(c);
  st.innerHTML = Array.from({ length: 12 }, () => skinHTML(pickFrom(p), "", "static")).join("");
  $("#open-box").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
$("#open-close").onclick = () => { if (!O.busy) $("#open-box").hidden = true; };
$("#open-btn").onclick = () => {
  const c = O.c; if (!c || O.busy) return;
  if (S.balance < c.price) return toast("Недостатньо коштів. Натисніть + для поповнення");
  O.busy = true; $("#open-btn").disabled = true; setBalance(S.balance - c.price);
  const p = pool(c), win = pickFrom(p), WIN = 34, W = 158;
  const st = $("#strip");
  st.style.transition = "none"; st.style.transform = "translateX(0)";
  st.innerHTML = Array.from({ length: 42 }, (_, i) => skinHTML(i === WIN ? win : pickFrom(p), "", "static")).join("");
  void st.offsetWidth;
  const jitter = (Math.random() - 0.5) * 100;
  st.style.transition = "transform 6s cubic-bezier(.1,.7,.1,1)";
  st.style.transform = `translateX(${-(WIN * W + 75 + jitter)}px)`;
  setTimeout(() => {
    addItem(win.id); store.save(); O.busy = false;
    $("#open-btn").disabled = false;
    $("#open-res").innerHTML = `Випало: <b>${win.weapon} | ${win.name}</b> (${money(win.price)})`;
    renderInventoryViews();
  }, 6200);
};

/* ---------- misc ---------- */
$("#topup").onclick = () => { setBalance(S.balance + 100); toast("+$100 (демо-баланс)"); };
$("#login").onclick = () => toast("Вхід через Steam буде доступний у повній версії");

function renderAll() { renderBalance(); renderUpgrade(); renderInventoryViews(); }
initUpgrade(); renderCases(); route();
for (let i = 0; i < 7; i++) fakeLive();
setInterval(fakeLive, 3500);
