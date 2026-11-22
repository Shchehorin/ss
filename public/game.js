const $ = (id) => document.getElementById(id);
const canvas = $("canvas");
const ctx = canvas.getContext("2d");
const el = {
  balance: $("balance"), multiplier: $("multiplier"), status: $("status"),
  history: $("history"), bet: $("bet"), auto: $("auto"), action: $("action"),
};

const GROWTH = 0.12; // швидкість росту множника
let balance = 1000;
let state = "waiting"; // waiting | flying | crashed
let mult = 1, crashAt = 1, startTime = 0;
let bet = null; // { amount, cashed }
let queuedBet = 0;
let trail = [];

let bots = [];
const NAMES = ["Max", "Olena", "Taras", "Iryna", "Dmytro", "Sofia", "Andrii", "Kate", "Bohdan", "Vika", "Oleh", "Nazar"];

function makeBots() {
  const n = 8 + Math.floor(Math.random() * 10);
  bots = Array.from({ length: n }, () => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const amount = [5, 10, 20, 50, 100, 250, 500][Math.floor(Math.random() * 7)];
    return {
      user: name[0] + "***" + Math.floor(Math.random() * 90 + 10),
      amount,
      target: Math.max(1.05, Math.floor(100 / (1 - Math.random() * 0.97)) / 100),
      done: false,
      li: null,
    };
  }).sort((a, b) => b.amount - a.amount);
  $("feed-list").replaceChildren(...bots.map((b) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="user">${b.user}</span><span class="amount">${b.amount.toFixed(2)}</span><span class="x">—</span><span></span>`;
    b.li = li;
    return li;
  }));
  $("feed-count").textContent = bots.length;
}

function updateBots(m, crashedNow) {
  for (const b of bots) {
    if (b.done) continue;
    if (!crashedNow && m >= b.target) {
      b.done = true;
      b.li.classList.add("win");
      b.li.children[2].textContent = b.target.toFixed(2) + "x";
      b.li.children[3].textContent = "+" + (b.amount * (b.target - 1)).toFixed(2);
    } else if (crashedNow) {
      b.done = true;
      b.li.classList.add("lost");
    }
  }
}

function randomCrash() {
  const r = Math.random();
  return Math.max(1, Math.floor(97 / (1 - r)) / 100); // ~97% RTP
}

function resize() {
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * devicePixelRatio;
  canvas.height = r.height * devicePixelRatio;
}
addEventListener("resize", resize);
resize();

function setBalance(v) {
  balance = v;
  el.balance.textContent = v.toFixed(2);
}

function updateButton() {
  const b = el.action;
  b.classList.remove("cashout");
  if (state === "flying" && bet && !bet.cashed) {
    b.classList.add("cashout");
    b.textContent = `Забрати ${(bet.amount * mult).toFixed(2)}`;
  } else if (queuedBet) {
    b.textContent = "Скасувати ставку";
  } else {
    b.textContent = state === "waiting" ? "Зробити ставку" : "Ставка на наступний раунд";
  }
}

el.action.onclick = () => {
  if (state === "flying" && bet && !bet.cashed) return cashOut();
  if (queuedBet) {
    setBalance(balance + queuedBet);
    queuedBet = 0;
  } else {
    const amt = Math.floor(+el.bet.value);
    if (!(amt >= 1) || amt > balance) return;
    setBalance(balance - amt);
    queuedBet = amt;
  }
  updateButton();
};

document.querySelectorAll(".chip").forEach((c) => {
  c.onclick = () => (el.bet.value = Math.max(1, Math.floor(el.bet.value * c.dataset.mul)));
});

function cashOut() {
  bet.cashed = true;
  const win = bet.amount * mult;
  setBalance(balance + win);
  el.multiplier.classList.add("won");
  el.status.textContent = `Виграш +${(win - bet.amount).toFixed(2)}`;
  updateButton();
}

function startRound() {
  state = "waiting";
  mult = 1;
  trail = [];
  bet = null;
  makeBots();
  el.multiplier.className = "multiplier";
  el.multiplier.textContent = "1.00x";
  draw();
  let t = 5;
  const tick = () => {
    if (t <= 0) return fly();
    el.status.textContent = `Зліт через ${t}с`;
    t--;
    setTimeout(tick, 1000);
  };
  tick();
  updateButton();
}

function fly() {
  state = "flying";
  crashAt = randomCrash();
  startTime = performance.now();
  bet = queuedBet ? { amount: queuedBet, cashed: false } : null;
  queuedBet = 0;
  el.status.textContent = bet ? "Летимо!" : "Спостерігаєте";
  updateButton();
  requestAnimationFrame(loop);
}

function crash() {
  state = "crashed";
  mult = crashAt;
  updateBots(crashAt, true);
  el.multiplier.textContent = crashAt.toFixed(2) + "x";
  el.multiplier.classList.remove("won");
  el.multiplier.classList.add("crashed");
  el.status.textContent = bet && !bet.cashed ? `Програш −${bet.amount}` : "Крах!";
  const h = document.createElement("span");
  h.textContent = crashAt.toFixed(2) + "x";
  h.className = crashAt < 2 ? "low" : "high";
  el.history.prepend(h);
  while (el.history.children.length > 12) el.history.lastChild.remove();
  updateButton();
  setTimeout(startRound, 3000);
}

function loop(now) {
  if (state !== "flying") return;
  const t = (now - startTime) / 1000;
  mult = Math.exp(GROWTH * t);
  const auto = parseFloat(el.auto.value);
  if (bet && !bet.cashed && auto >= 1.01 && mult >= auto) {
    mult = auto;
    cashOut();
  }
  if (mult >= crashAt) {
    draw();
    return crash();
  }
  el.multiplier.textContent = mult.toFixed(2) + "x";
  updateBots(mult, false);
  trail.push(mult);
  draw();
  if (bet && !bet.cashed) updateButton();
  requestAnimationFrame(loop);
}

function draw() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#243059";
  ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (h * i) / 6);
    ctx.lineTo(w, (h * i) / 6);
    ctx.stroke();
  }
  if (trail.length < 2) return;
  const maxM = Math.max(2, mult * 1.1);
  const pad = 40 * devicePixelRatio;
  const pts = trail.map((m, i) => [
    pad + (i / (trail.length - 1)) * (w - pad * 2) * Math.min(1, trail.length / 120),
    h - pad - ((m - 1) / (maxM - 1)) * (h - pad * 2),
  ]);
  const crashed = state === "crashed";
  const col = crashed ? "#ff4d6d" : "#ffb703";
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, col + "55");
  g.addColorStop(1, col + "00");
  ctx.beginPath();
  ctx.moveTo(pts[0][0], h);
  pts.forEach((p) => ctx.lineTo(p[0], p[1]));
  ctx.lineTo(pts[pts.length - 1][0], h);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = col;
  ctx.lineWidth = 4 * devicePixelRatio;
  ctx.stroke();
  const [x, y] = pts[pts.length - 1];
  const prev = pts[Math.max(0, pts.length - 5)];
  drawZeppelin(x, y, Math.atan2(y - prev[1], x - prev[0]), crashed);
}

function drawZeppelin(x, y, angle, crashed) {
  const s = devicePixelRatio;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(crashed ? 0.8 : angle);
  ctx.fillStyle = crashed ? "#ff4d6d" : "#e8ecff";
  ctx.beginPath();
  ctx.ellipse(0, 0, 38 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffb703";
  ctx.beginPath();
  ctx.moveTo(-32 * s, 0);
  ctx.lineTo(-48 * s, -14 * s);
  ctx.lineTo(-48 * s, 14 * s);
  ctx.fill();
  ctx.fillStyle = "#243059";
  ctx.fillRect(-8 * s, 15 * s, 16 * s, 7 * s);
  ctx.restore();
}

startRound();
