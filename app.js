'use strict';

// ---------- Ma'lumotlar (faqat telefonda, localStorage) ----------
const KEY = 'fitday.v1';
const def = { startDate: null, height: '', goal: '', weights: [], done: {} };
let S;
try { S = Object.assign({}, def, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = { ...def }; }
if (!S.startDate) S.startDate = ymd(new Date());
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

function ymd(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const today = () => ymd(new Date());
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const DAYS = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];

// ---------- Mashqlar rejasi ----------
// Hafta kunlari: 1=Du ... 0=Yak. Har 2 haftada yuklama biroz oshadi.
const SCHEDULE = { 1: 'A', 2: 'W', 3: 'B', 4: 'W', 5: 'A', 6: 'W', 0: 'R' };
const LABEL = { A: 'Butun tana — A', B: 'Butun tana — B', W: 'Tez yurish', R: 'Dam olish' };

function level() {
  const days = Math.floor((parse(today()) - parse(S.startDate)) / 864e5);
  return Math.min(3, Math.max(0, Math.floor(days / 14)));
}

function exercises(type) {
  const l = level();
  const r = (base, step = 2) => base + l * step;
  const warm = { id: 'warm', name: 'Qizish: joyida yurish + qo‘l aylantirish', amount: '3 daqiqa', tip: 'Sekin boshlang, nafasni rostlang.' };
  const cool = { id: 'cool', name: 'Cho‘zilish', amount: '3 daqiqa', tip: 'Oyoq, sonlar va yelkani 20 soniyadan cho‘zing.' };
  if (type === 'A') return [
    warm,
    { id: 'squat', name: 'Stulga o‘tirib-turish (squat)', amount: `3 × ${r(10)}`, tip: 'Tizza oyoq uchidan oshmasin, orqa to‘g‘ri.' },
    { id: 'pushwall', name: 'Devordan turtib-itarilish', amount: `3 × ${r(10)}`, tip: 'Keyinchalik stol chetidan, so‘ng polga o‘ting.' },
    { id: 'bridge', name: 'Dumba ko‘tarish (glute bridge)', amount: `3 × ${r(12)}`, tip: 'Yuqorida 1 soniya ushlang.' },
    { id: 'plank', name: 'Plank (tirsakda)', amount: `3 × ${r(20, 10)} soniya`, timer: r(20, 10), tip: 'Tizzada boshlasangiz ham bo‘ladi.' },
    cool,
  ];
  if (type === 'B') return [
    warm,
    { id: 'lunge', name: 'Oldinga qadam tashlab cho‘kish (lunge)', amount: `3 × ${r(8)} (har oyoqqa)`, tip: 'Muvozanat qiyin bo‘lsa, devorga suyaning.' },
    { id: 'pushinc', name: 'Stol/divan chetidan turtib-itarilish', amount: `3 × ${r(8)}`, tip: 'Tana bir chiziqda bo‘lsin.' },
    { id: 'superman', name: 'Superman (qorin bilan yotib)', amount: `3 × ${r(10)}`, tip: 'Qo‘l-oyoqni bir vaqtda ko‘taring.' },
    { id: 'bike', name: 'Velosiped (qorin mushaklari)', amount: `3 × ${r(12)}`, tip: 'Bo‘yinni tortmang, sekin bajaring.' },
    { id: 'stepup', name: 'Zinapoyaga chiqish-tushish', amount: `3 × ${r(10)}`, tip: 'Past zinapoya yoki mustahkam stul.' },
    cool,
  ];
  if (type === 'W') return [
    { id: 'walk', name: 'Tez yurish', amount: `${30 + l * 5} daqiqa`, tip: 'Gaplashsa bo‘ladi, lekin qo‘shiq aytib bo‘lmaydi — shu tezlik.' },
  ];
  return [];
}

const isDone = (date, id) => (S.done[date] || []).includes(id);
function progress(date, type) {
  const ex = exercises(type);
  const n = ex.filter(e => isDone(date, e.id)).length;
  return { n, total: ex.length, ok: ex.length > 0 && n === ex.length };
}
function dayOk(date) {
  const type = SCHEDULE[parse(date).getDay()];
  return type === 'R' ? false : progress(date, type).ok;
}
function streak() {
  let c = 0, d = new Date();
  if (!dayOk(ymd(d))) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 400; i++) {
    const date = ymd(d);
    const type = SCHEDULE[d.getDay()];
    if (type === 'R') { d.setDate(d.getDate() - 1); continue; }
    if (!dayOk(date)) break;
    c++; d.setDate(d.getDate() - 1);
  }
  return c;
}

// ---------- Ko‘rinishlar ----------
const view = document.getElementById('view');
const title = document.getElementById('title');
let tab = 'today';

function render() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const st = streak();
  document.getElementById('streak').textContent = st ? `🔥 ${st} kun` : 'Boshlaymiz!';
  ({ today: renderToday, plan: renderPlan, weight: renderWeight, me: renderMe })[tab]();
}

function renderToday() {
  title.textContent = 'Bugungi mashq';
  const date = today();
  const type = SCHEDULE[new Date().getDay()];
  const ex = exercises(type);
  const p = progress(date, type);
  let html = `<div class="card"><div class="row between"><h2>${LABEL[type]}</h2><span class="muted">${p.n}/${p.total}</span></div>`;
  if (type === 'R') {
    html += `<p>Bugun dam olish kuni 😴 Mushaklar tinch holatda o‘sadi. Ko‘proq suv iching va 7–8 soat uxlang.</p></div>`;
  } else {
    html += `<div class="bar"><div style="width:${p.total ? p.n / p.total * 100 : 0}%"></div></div>`;
    ex.forEach(e => {
      const d = isDone(date, e.id);
      html += `<div class="ex ${d ? 'done' : ''}">
        <button class="chk" data-ex="${e.id}">${d ? '✓' : ''}</button>
        <div class="grow"><div class="name">${e.name}</div>
        <div class="muted">${e.amount}${e.tip ? ' · ' + e.tip : ''}</div></div>
        ${e.timer ? `<button class="btn sec sm" data-timer="${e.timer}">⏱</button>` : ''}
      </div>`;
    });
    html += `</div>
      <button class="btn sec" data-timer="30">⏱ 30 soniya dam olish</button>`;
    if (p.ok) html += `<div class="card" style="margin-top:12px">🎉 Barakalla! Bugungi reja bajarildi.</div>`;
  }
  html += `<div class="tip" style="margin-top:12px">💧 Kuniga 2 litr suv iching · 🍽 Shirinlik va gazli ichimliklarni kamaytiring · 😴 Yaxshi uxlang</div>`;
  view.innerHTML = html;
}

function renderPlan() {
  title.textContent = 'Haftalik reja';
  const now = new Date();
  const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  let cells = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const date = ymd(d), t = SCHEDULE[d.getDay()];
    cells += `<div class="${date === today() ? 'today' : ''} ${dayOk(date) ? 'ok' : ''}">${DAYS[d.getDay()]}<b>${t === 'R' ? '😴' : t === 'W' ? '🚶' : '💪'}</b></div>`;
  }
  const names = { A: exercises('A'), B: exercises('B') };
  const list = k => names[k].map(e => `<li>${e.name} — <span class="muted">${e.amount}</span></li>`).join('');
  view.innerHTML = `
    <div class="card"><h2>Bu hafta</h2><div class="week">${cells}</div>
      <p class="muted">Yuklama har 2 haftada oshadi. Hozirgi daraja: ${level() + 1}/4</p></div>
    <div class="card"><h2>${LABEL.A}</h2><p class="muted">Dushanba, Juma</p><ul>${list('A')}</ul></div>
    <div class="card"><h2>${LABEL.B}</h2><p class="muted">Chorshanba</p><ul>${list('B')}</ul></div>
    <div class="card"><h2>Tez yurish</h2><p class="muted">Seshanba, Payshanba, Shanba — ${30 + level() * 5} daqiqa.<br>Yakshanba — dam.</p></div>
    <div class="tip">⚠️ Og‘riq yoki bosh aylansa to‘xtang. Sog‘lig‘ingizda muammo bo‘lsa, avval shifokor bilan maslahatlashing.</div>`;
}

function renderWeight() {
  title.textContent = 'Vazn kundaligi';
  const w = [...S.weights].sort((a, b) => a.date.localeCompare(b.date));
  const last = w.at(-1), first = w[0];
  const diff = last && first ? last.kg - first.kg : 0;
  const goal = parseFloat(S.goal);
  let info = '';
  if (last) {
    info = `<div class="big">${last.kg} kg</div>
      <div class="muted">Boshlanishdan: ${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg${goal ? ` · Maqsadgacha: ${Math.max(0, last.kg - goal).toFixed(1)} kg` : ''}</div>`;
  } else info = `<p class="muted">Hali vazn kiritilmagan. Ertalab, nonushtadan oldin tortilgan ma’qul.</p>`;
  view.innerHTML = `
    <div class="card">${info}${chart(w, goal)}</div>
    <div class="card"><label>Bugungi vazn (kg)</label>
      <div class="row"><input id="kg" type="number" inputmode="decimal" step="0.1" placeholder="masalan 82.5">
      <button class="btn sm" id="addW">Saqlash</button></div></div>
    <div class="card"><h2>Tarix</h2>${[...w].reverse().map(x =>
      `<div class="log"><span>${x.date}</span><span><b>${x.kg} kg</b> <button data-del="${x.date}">🗑</button></span></div>`).join('') || '<span class="muted">Bo‘sh</span>'}</div>`;
}

function chart(w, goal) {
  if (w.length < 2) return '';
  const W = 320, H = 150, pad = 16;
  const vals = w.map(x => x.kg).concat(goal ? [goal] : []);
  const min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
  const x = i => pad + i * (W - 2 * pad) / (w.length - 1);
  const y = v => H - pad - (v - min) / (max - min) * (H - 2 * pad);
  const pts = w.map((p, i) => `${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
  const g = goal ? `<line x1="${pad}" x2="${W - pad}" y1="${y(goal)}" y2="${y(goal)}" stroke="#f59e0b" stroke-dasharray="4"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}
    <polyline points="${pts}" fill="none" stroke="#16a34a" stroke-width="3" stroke-linejoin="round"/>
    ${w.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.kg)}" r="4" fill="#16a34a"/>`).join('')}</svg>`;
}

function renderMe() {
  title.textContent = 'Profil';
  const last = [...S.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  let bmi = '';
  const h = parseFloat(S.height) / 100;
  if (h && last) bmi = `<p>BMI: <b>${(last.kg / (h * h)).toFixed(1)}</b> <span class="muted">(18.5–24.9 — me’yor)</span></p>`;
  view.innerHTML = `
    <div class="card"><label>Bo‘y (sm)</label><input id="height" type="number" inputmode="numeric" value="${S.height}">
      <label>Maqsad vazn (kg)</label><input id="goal" type="number" inputmode="decimal" value="${S.goal}">
      <label>Boshlagan sana</label><input id="start" type="date" value="${S.startDate}">
      <p></p><button class="btn" id="saveP">Saqlash</button>${bmi}</div>
    <div class="card"><h2>Zaxira nusxa</h2>
      <p class="muted">Ma’lumotlar faqat shu telefonda saqlanadi. Telefonni almashtirsangiz yoki brauzer ma’lumotlarini tozalasangiz, yo‘qoladi — vaqti-vaqti bilan zaxira oling.</p>
      <div class="row"><button class="btn sec sm grow" id="exp">Eksport</button>
      <button class="btn sec sm grow" id="imp">Import</button></div>
      <input type="file" id="file" accept="application/json" hidden></div>`;
}

// ---------- Taymer ----------
let tInt;
function startTimer(sec, label) {
  const box = document.getElementById('timer'), num = document.getElementById('timerNum');
  document.getElementById('timerLabel').textContent = label;
  let left = sec; num.textContent = left; box.hidden = false;
  clearInterval(tInt);
  tInt = setInterval(() => {
    left--; num.textContent = left;
    if (left <= 0) { clearInterval(tInt); navigator.vibrate?.([300, 100, 300]); setTimeout(() => box.hidden = true, 800); }
  }, 1000);
}
document.getElementById('timerStop').onclick = () => { clearInterval(tInt); document.getElementById('timer').hidden = true; };

// ---------- Hodisalar ----------
document.querySelector('nav').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  tab = b.dataset.tab; render(); scrollTo(0, 0);
};

view.onclick = e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.ex) {
    const date = today(), arr = S.done[date] || (S.done[date] = []);
    const i = arr.indexOf(t.dataset.ex);
    i >= 0 ? arr.splice(i, 1) : arr.push(t.dataset.ex);
    save(); render();
  } else if (t.dataset.timer) {
    const s = +t.dataset.timer;
    startTimer(s, s === 30 ? 'Dam olish' : 'Ushlab turing!');
  } else if (t.id === 'addW') {
    const kg = parseFloat(document.getElementById('kg').value);
    if (!(kg > 20 && kg < 400)) return alert('Vaznni to‘g‘ri kiriting');
    const date = today();
    S.weights = S.weights.filter(x => x.date !== date).concat({ date, kg: Math.round(kg * 10) / 10 });
    save(); render();
  } else if (t.dataset.del) {
    if (confirm('O‘chirilsinmi?')) { S.weights = S.weights.filter(x => x.date !== t.dataset.del); save(); render(); }
  } else if (t.id === 'saveP') {
    S.height = document.getElementById('height').value;
    S.goal = document.getElementById('goal').value;
    S.startDate = document.getElementById('start').value || S.startDate;
    save(); render();
  } else if (t.id === 'exp') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
    a.download = `fitday-${today()}.json`; a.click();
  } else if (t.id === 'imp') {
    document.getElementById('file').click();
  }
};

view.onchange = e => {
  if (e.target.id !== 'file' || !e.target.files[0]) return;
  const r = new FileReader();
  r.onload = () => {
    try { S = Object.assign({}, def, JSON.parse(r.result)); save(); render(); alert('Tiklandi ✅'); }
    catch { alert('Fayl noto‘g‘ri'); }
  };
  r.readAsText(e.target.files[0]);
};

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
