const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RAR = [["Consumer", "#b0c3d9"], ["Industrial", "#5e98d9"], ["Mil-Spec", "#4b69ff"], ["Restricted", "#8847ff"], ["Classified", "#d32ce6"], ["Covert", "#eb4b4b"], ["Contraband", "#e4ae39"]];

const CATALOG = [
  ["P250", "Sand Dune", 0.1, 0], ["MP9", "Storm", 0.3, 0], ["Glock-18", "Candy Apple", 0.8, 2], ["SSG 08", "Blue Spruce", 1.2, 1],
  ["Nova", "Antique", 2.4, 2], ["MAC-10", "Neon Rider", 5, 3], ["UMP-45", "Primal Saber", 7, 3], ["Five-SeveN", "Hyper Beast", 12, 4],
  ["P90", "Asiimov", 20, 5], ["USP-S", "Kill Confirmed", 31, 5], ["M4A4", "Neo-Noir", 55, 5], ["AK-47", "Redline", 72, 4],
  ["Desert Eagle", "Blaze", 480, 4], ["AWP", "Asiimov", 95, 5], ["M4A1-S", "Printstream", 165, 5], ["AK-47", "Vulcan", 140, 4],
  ["AK-47", "Fire Serpent", 420, 5], ["AWP", "Dragon Lore", 1900, 5], ["M4A4", "Howl", 3100, 6], ["AWP", "Gungnir", 5200, 5],
  ["Karambit", "Doppler", 780, 5], ["Butterfly Knife", "Fade", 1250, 5], ["Karambit", "Fade", 1900, 5], ["M9 Bayonet", "Crimson Web", 1100, 5],
  ["Karambit", "Gamma Doppler", 2400, 5], ["Sport Gloves", "Pandora's Box", 9800, 5], ["Specialist Gloves", "Emerald Web", 4300, 5], ["Talon Knife", "Marble Fade", 1700, 5],
].map(([weapon, name, price, r], id) => ({ id, weapon, name, price, r }));
CATALOG.sort((a, b) => a.price - b.price).forEach((s, i) => (s.id = i));

const colorOf = (s) => (s.r != null ? RAR[s.r][1] : "#8a97a8");

const gun = (c) => `<svg viewBox="0 0 120 48" fill="none"><g fill="${c}" opacity=".95"><rect x="30" y="16" width="62" height="9" rx="2"/><rect x="88" y="19" width="28" height="4" rx="1"/><path d="M30 18 8 22l3 9 21-3z"/><path d="M52 25h10l-3 17H48z" opacity=".75"/><rect x="40" y="12" width="24" height="4" rx="1" opacity=".6"/></g></svg>`;

const CDN = "https://community.akamai.steamstatic.com/economy/image/";
const IMG = {
  "P250|Sand Dune": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwjFU0OGvZqBSLPmUBnPelesn5-RrSXDlwRhx5TjSwtmocCifPwQpDpshReBfsxPrk4DhNu3jshue1dy8VcXxuA",
  "MP9|Storm": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f7i1k_OaheqlrMv-dGlicyOl-pK8_S3zjxRh_5mmGn9epIymQPQBxDpQlFuUJ5xa6kt2yZLjkswLY2ooT02yg2WH9Y1dp",
  "Glock-18|Candy Apple": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1I4M28baBSLPmUBnPelb93teA-FivjzB5wsjzTyI2pIn_CPAMoW8N3ROJZshm5w9zgNbnk5xue1dyMA9ZU_Q",
  "SSG 08|Blue Spruce": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1I4M2jZ7d-H_yaCW-Ej7sl6OVsHXHizUQksGyDyNn7dH-WZgEgXJshFOdZskO6xoC1Y-LjtVDAy9US2YFh0PQ",
  "Nova|Antique": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL_kYDhwiFO0PyhfqVSIf6HB3aFxNF6ueZhW2fmwRwl6jyHw96vIn2UbVVzXMdyRuYLt0O7ltPjZbu0tQTejo9Hyn2skGoXucYtjcOH",
  "MAC-10|Neon Rider": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dC2ie0-dytfNWQyC0nQlp5DzTntmgdC7COABxX5NxQrUOtUS5w4LgMu6zsVCK2IJCmyisjitM6DErvbicsEA0SQ",
  "UMP-45|Primal Saber": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkk4a0qB1Y-s27ZbQ5dc-DHG6dwOJlseNsXRa_nBovp3PRn478JHmePQ8hDcF2Q7YDtxXrk92zYbyw7gXYjIhEyCn_3Hsbui44_a9cBklqRdMs",
  "Five-SeveN|Hyper Beast": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-lwXyyhlxgmoCm6lob-KT-JO1QgWZVyELEPu0W4l9KzYbzn5Fbf3YkTzn_8hihIvXxtsOoFUKYirLqX0V_f6-eqCw",
  "P90|Asiimov": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf_jdk_6v-JaV-KfmeAXGvzedxuPUnTSjikRgksjuBzoz4dXLFb1QoC8QlTLQD4EPqk4LvN-Pns1aMioNBzTK-0H3gQVv65g",
  "USP-S|Kill Confirmed": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160",
  "M4A4|Neo-Noir": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSLvWcMWmfyPxJvOhuRz39wE1142vSztmvInvBOgV0W5R1FLYNuxW4wIbgNrmx4g2Kj4tMmCX93zQJsHgJr0dqFw",
  "AK-47|Redline": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
  "Desert Eagle|Blaze": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU",
  "AWP|Asiimov": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
  "M4A1-S|Printstream": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_F7Rienhgk1tjyIpYPwJiPTcAAoCpsiEO5ZsUbpm9C2Zuni4VHW3o5EzSX62HxP7Sg96-hWVqYi_6TJz1aW0nxrkGs",
  "AK-47|Vulcan": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSMuWRDGKC_uJ_t-l9AXCxxEh14zjTztivci2ePQZ2W8NzTecD4BKwloLiYeqxtAOIj9gUyyngznQeF7I6QE8",
  "AK-47|Fire Serpent": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q",
  "AWP|Dragon Lore": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV",
  "M4A4|Howl": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF6ueZhW2exwkl2tmTXwt39eCiUPQR2DMN4TOVetUK8xoLgM-K341eM2otDnC6okGoXufBz_TAB",
  "AWP|Gungnir": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6N4LvedB3WvzedxuPUnHnjnzUl0sWrdztitI3rDZgJzAsZ1QOFY4UPqldDgMO_l41HXit9AmTK-0H227dAsvQ",
  "Karambit|Doppler": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4gKJk4jxNWXFb1cpDJR2FOFbsBTql9bjYbzq7gPZiN1MxH7_2ytNuCdpte1UB_Ui5OSJ2GbkVqni",
  "Butterfly Knife|Fade": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw",
  "Karambit|Fade": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8",
  "M9 Bayonet|Crimson Web": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMW-J_vlzsvJWQyC0nQlp4GrWzYuqeHjDZlN1XJohTecO5xawwdDvNuLm5wPcjY0QzyX83Xsd7zErvbgxKe4lfw",
  "Karambit|Gamma Doppler": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iXwON7sd5tQDmjmRg1jC2Nm5z8cBTLN1F4TowkROZctEXqxNO2Nevn4QzZ2I9Mz3r62C9L634_5uhTWKEh_fKD2w7HL_RjthCBcAWy",
  "Sport Gloves|Pandora's Box": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H-CGHHecxNF6ueZhW2exk01w4j7cmYn4eHPCbAMhApdwTOIN5BPsx9yyYu605FTeid0Uy3j3kGoXueKyz5wo",
  "Specialist Gloves|Emerald Web": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJtexsXSi_kSIwtj-6lob-KT-Jbw4kA8d4QOBb5hnqmoHuMLmx4AWK341Bnyr93CxN6itjsb1XUfAgqLqX0V92--w69A",
  "Talon Knife|Marble Fade": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1M5vahf6lsK_WBMWad_uN3ouNlSha1lBkijCqMnoDuHifOOV5kFJMlQecC4RW5x4bkMLvgsgGP2IIXzy_-iysaunlo4bwEBfYh_aLS3A7fcepqAVr8ibw",
};
const pic = (s) => {
  const svg = gun(colorOf(s)), u = IMG[s.weapon + "|" + s.name];
  return u ? `<img src="${CDN}${u}/256fx192f" alt="" loading="lazy" referrerpolicy="no-referrer" data-fb='${svg}'>` : svg;
};
addEventListener("error", (e) => { const t = e.target; if (t.tagName === "IMG" && t.dataset.fb) t.outerHTML = t.dataset.fb; }, true);

const KEY = "upgrd2";
const store = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } },
  save() { localStorage.setItem(KEY, JSON.stringify({ balance: S.balance, inv: S.inv, uid: S.uid })); },
};
const S = Object.assign({ balance: 125.5, inv: [], uid: 1 }, store.get());
const byName = (w, n) => CATALOG.find((s) => s.weapon === w && s.name === n).id;
if (!store.get()) {
  [["Desert Eagle", "Blaze"], ["M4A1-S", "Printstream"], ["AK-47", "Vulcan"], ["AK-47", "Vulcan"], ["AWP", "Asiimov"], ["AK-47", "Redline"],
    ["M4A4", "Neo-Noir"], ["USP-S", "Kill Confirmed"], ["P90", "Asiimov"], ["Five-SeveN", "Hyper Beast"], ["MAC-10", "Neon Rider"],
  ].forEach(([w, n]) => S.inv.push({ uid: S.uid++, id: byName(w, n) }));
}
const item = (it) => CATALOG[it.id];

function addItem(id) { const it = { uid: S.uid++, id }; S.inv.push(it); return it; }
function setBalance(v) { S.balance = Math.max(0, Math.round(v * 100) / 100); store.save(); renderBalance(); }
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2200); }
function syncSlider() { const m = $("#addbal"), mx = +m.max; m.style.setProperty("--p", (mx ? (+m.value / mx) * 100 : 0) + "%"); }
function renderBalance() { $("#balance").textContent = money(S.balance); const m = $("#addbal"); m.max = Math.floor(S.balance * 2) / 2; if (+m.value > +m.max) m.value = m.max; syncSlider(); }

function skinHTML(s, extra = "", cls = "", tail = "") {
  return `<div class="skin ${cls}" style="--rc:${colorOf(s)}" ${extra}><div class="im">${pic(s)}</div><div class="nm">${s.name}</div><div class="wp">${s.weapon} · ${RAR[s.r][0]}</div><div class="pr">${money(s.price)}</div>${tail}</div>`;
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
const U = { sel: new Set(), add: 0, target: null, mult: 2, sortDesc: true, busy: false, angle: 107, fast: false, sound: true, res: null };
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
  U.add = Math.min(U.add, +$("#addbal").max); syncSlider();
  const v = srcValue();
  if (U.mult) pickByMult();
  if (U.target != null && CATALOG[U.target].price <= v) U.target = null;

  const selItems = S.inv.filter((x) => U.sel.has(x.uid));
  $("#give-slot").innerHTML = selItems.length
    ? (selItems.length === 1
      ? `<div style="width:100%"><div class="big">${skinHTML(item(selItems[0]), `data-uid="${selItems[0].uid}"`, "bare")}</div><div class="slot-total">Разом: ${money(v)}</div></div>`
      : `<div style="width:100%"><div class="slot-items">${selItems.map((x) => skinHTML(item(x), `data-uid="${x.uid}"`)).join("")}</div><div class="slot-total">Разом: ${money(v)}</div></div>`)
    : `<div><div class="ph">+</div>Оберіть скін з інвентарю,<br>який хочете покращити${U.add ? `<div class="slot-total">${money(U.add)} з балансу</div>` : ""}</div>`;
  $("#give-slot").querySelectorAll("[data-uid]").forEach((e) => (e.onclick = () => { if (U.busy) return; U.sel.delete(+e.dataset.uid); U.res = null; renderUpgrade(); }));

  const t = U.target != null ? CATALOG[U.target] : null;
  const tint = (slot, s) => { const c = slot.closest(".card"); c.classList.toggle("tint", !!s); if (s) c.style.setProperty("--tc", colorOf(s)); };
  tint($("#give-slot"), selItems.length ? item(selItems.slice().sort((a, b) => item(b).price - item(a).price)[0]) : null);
  $("#get-slot").innerHTML = t ? `<div class="big">${skinHTML(t, "", "static bare")}</div>` : `<div><div class="ph">★</div>Оберіть множник або<br>цільовий скін</div>`;
  tint($("#get-slot"), t);
  document.querySelectorAll("#mults button").forEach((b) => b.classList.toggle("on", +b.dataset.m === U.mult));
  $(".mults").classList.toggle("off", !v);

  // after a spin the last chance/result stays on screen until the next interaction
  const c = U.res ? U.res.c : chance(), C = 2 * Math.PI * 147.5;
  const arc = $("#arc");
  arc.style.strokeDasharray = `${(c / 100) * C} ${C}`;
  arc.style.transform = `rotate(${90 - c * 1.8}deg)`;
  $("#chance-top").textContent = c.toFixed(1) + "%";
  $("#chance-bar").parentElement.style.setProperty("--k", Math.min(1, c / 80));
  if (!U.busy) {
    const w = $("#wheel-text");
    w.className = "wheel-text" + (U.res ? (U.res.win ? " win" : " lose") : "");
    w.textContent = U.res ? (U.res.win ? "Успіх" : "Провал") : c.toFixed(1) + "%";
  }
  $("#go").disabled = U.busy || !t || !v;
  $("#addbal").disabled = $("#addmax").disabled = U.busy;

  $("#addbal-val").textContent = money(U.add);

  const from = num($("#f-from").value), to = num($("#f-to").value) || Infinity;
  const inv = S.inv.filter((x) => item(x).price >= from && item(x).price <= to).sort((a, b) => (U.sortDesc ? 1 : -1) * (item(b).price - item(a).price));
  $("#inv-count").textContent = S.inv.length;
  const g = $("#up-inv"); g.dataset.empty = "Інвентар порожній. Відкрийте кейс!";
  g.innerHTML = inv.map((x) => skinHTML(item(x), `data-uid="${x.uid}"`, U.sel.has(x.uid) ? "sel" : "")).join("");
  g.querySelectorAll("[data-uid]").forEach((e) => (e.onclick = () => { if (U.busy) return; const id = +e.dataset.uid; U.sel.has(id) ? U.sel.delete(id) : U.sel.add(id); U.res = null; renderUpgrade(); }));

  const q = $("#t-search").value.trim().toLowerCase(), tf = num($("#t-from").value), tt = num($("#t-to").value) || Infinity;
  const list = CATALOG.filter((s) => s.price > v && s.price >= tf && s.price <= tt && (s.name + " " + s.weapon).toLowerCase().includes(q));
  const tg = $("#up-target"); tg.dataset.empty = v ? "Нічого не знайдено" : "Спочатку оберіть свій скін в інвентарі";
  tg.innerHTML = v ? list.map((s) => skinHTML(s, `data-id="${s.id}"`, s.id === U.target ? "sel" : "")).join("") : "";
  tg.querySelectorAll("[data-id]").forEach((e) => (e.onclick = () => { if (U.busy) return; U.target = +e.dataset.id; U.mult = null; U.res = null; renderUpgrade(); }));
}

function initUpgrade() {
  const ticks = $("#ticks");
  for (let i = 0; i < 100; i++) {
    const a = (i * 3.6 * Math.PI) / 180, [r1, r2, k] = i % 10 === 0 ? [118, 131, "t3"] : i % 5 === 0 ? [119.5, 128.5, "t2"] : [121, 127, "t1"];
    const x = (r) => (170 + Math.sin(a) * r).toFixed(2), y = (r) => (170 - Math.cos(a) * r).toFixed(2);
    ticks.insertAdjacentHTML("beforeend", `<line class="${k}" x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}"/>`);
  }
  $("#pointer").style.transform = `rotate(${U.angle}deg)`;
  $("#addbal").oninput = (e) => { if (U.busy) return; U.add = +e.target.value; U.res = null; renderUpgrade(); };
  $("#addmax").onclick = () => { if (U.busy) return; const m = $("#addbal"); m.value = m.max; U.add = +m.max; U.res = null; renderUpgrade(); };
  document.querySelectorAll("#mults button").forEach((b) => (b.onclick = () => { if (U.busy) return; U.mult = +b.dataset.m; U.res = null; renderUpgrade(); }));
  ["#f-from", "#f-to", "#t-search", "#t-from", "#t-to"].forEach((s) => ($(s).oninput = renderUpgrade));
  $("#f-sort").onclick = () => { U.sortDesc = !U.sortDesc; $("#f-sort").classList.toggle("asc", !U.sortDesc); renderUpgrade(); };
  $("#t-find").onclick = () => { const i = $("#t-search"); i.hidden = !i.hidden; if (i.hidden) { i.value = ""; renderUpgrade(); } else i.focus(); };
  $("#snd").onclick = (e) => e.currentTarget.classList.toggle("on", (U.sound = !U.sound));
  $("#fast").onclick = (e) => e.currentTarget.classList.toggle("on", (U.fast = !U.fast));
  $("#go").onclick = doUpgrade;
}

let actx;
function beep(freq, len) {
  if (!U.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
    o.frequency.value = freq; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(t + len);
  } catch {}
}

function doUpgrade() {
  const t = CATALOG[U.target], c = chance(), v = srcValue();
  if (!t || !v || U.busy || U.add > S.balance) return;
  U.busy = true; U.res = null; $("#go").disabled = true; $("#addbal").disabled = $("#addmax").disabled = true;
  const roll = Math.random() * 100, win = roll < c, dur = U.fast ? 1.2 : 4.6;
  const ptr = $("#pointer");
  // the green arc is centred at the bottom, so a winning roll lands inside it
  U.angle = (Math.floor(U.angle / 360) + 6) * 360 + (180 - c * 1.8) + roll * 3.6;
  ptr.style.setProperty("--spin", dur + "s");
  ptr.classList.add("spin");
  ptr.style.transform = `rotate(${U.angle}deg)`;
  const given = S.inv.filter((x) => U.sel.has(x.uid));
  setTimeout(() => {
    S.inv = S.inv.filter((x) => !U.sel.has(x.uid));
    setBalance(S.balance - U.add);
    if (win) { addItem(t.id); toast(`Ви отримали ${t.weapon} | ${t.name}`); }
    store.save();
    pushLive(given.length ? item(given[0]) : { weapon: "Баланс", name: "", price: v }, t, c, win);
    beep(win ? 880 : 196, 0.3);
    U.sel.clear(); $("#addbal").value = 0;
    Object.assign(U, { add: 0, target: null, mult: 2, busy: false, res: { c, win } });
    renderAll();
  }, dur * 1000 + 100);
}

/* ---------- live feed ---------- */
function pushLive(from, to, ch, win) {
  const el = document.createElement("div");
  el.className = "live-item " + (win ? "w" : "l");
  el.innerHTML = `<div class="sk">${pic(from)}<small>${money(from.price)}</small></div><div class="pc"><b>${ch.toFixed(1)}%</b><i>→</i></div><div class="sk to">${pic(to)}<small>${money(to.price)}</small></div>`;
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
    skinHTML(item(x), `data-uid="${x.uid}"`, "", `<button class="mini act" data-sell="${x.uid}">Продати</button>`)).join("");
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
for (let i = 0; i < 9; i++) fakeLive();
setInterval(fakeLive, 3500);
