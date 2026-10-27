'use strict';

// ---------- Ma'lumotlar (faqat telefonda, localStorage) ----------
const KEY = 'fitday.v1';
const fresh = () => ({ startDate: null, height: '', goal: '', weights: [], done: {}, pick: {}, extra: {}, kg: {}, sound: true });
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = fresh(); }
if (!S.startDate) { S.startDate = ymd(new Date()); save(); }

function ymd(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const today = () => ymd(new Date());
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const $ = id => document.getElementById(id);
// Harakatni kamaytirish sozlamasi yoqilgan bo‘lsa, animatsiya o‘z-o‘zidan boshlanmaydi (bosib ishga tushiriladi)
const STILL = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DAYS = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];
const FULL = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

// ---------- Zal rejasi ----------
// Hafta kunlari: 1=Du ... 0=Yak. A/B — kuch (butun tana), C/D/W — kardio seanslari, R — dam.
const SCHEDULE = { 1: 'A', 2: 'C', 3: 'B', 4: 'W', 5: 'A', 6: 'D', 0: 'R' };
const TYPES = ['A', 'B', 'C', 'D', 'W'];
const NAMES = { A: 'Kuch A', B: 'Kuch B', C: 'Kardio 1', D: 'Kardio 2', W: 'Qiyalik' };
const ICON = { A: '💪', B: '💪', C: '🏃', D: '🚴', W: '🚶', R: '😴' };
const LABEL = { A: 'Kuch A — butun tana', B: 'Kuch B — butun tana', C: 'Kardio: yo‘lak intervali', D: 'Kardio: aralash trenajorlar', W: 'Kardio: qiyalikda yurish', R: 'Dam olish' };
// Ilovaning uy mashqlari davridagi eski kunlar hisobda qolishi uchun (seriya buzilmasin)
const LEGACY = {
  A: ['warm', 'squat', 'pushwall', 'bridge', 'plank', 'cool'],
  B: ['warm', 'lunge', 'pushinc', 'superman', 'bike', 'stepup', 'cool'],
  C: ['warm', 'jack', 'knees', 'fastsq', 'climber', 'skater', 'box', 'cool'],
  D: ['warm', 'burpee', 'kicks', 'shuffle', 'plankjack', 'jlunge', 'twist', 'cool'],
  W: ['walk'],
};

function level() {
  const days = Math.floor((parse(today()) - parse(S.startDate)) / 864e5);
  return Math.min(3, Math.max(0, Math.floor(days / 14)));
}

// Mashqning odatiy miqdori (daraja oshgan sari yondashuvlar va vaqt ko‘payadi)
function amountOf(id) {
  const x = EX[id], l = level(), sets = [2, 3, 3, 3][l];
  switch (x.kind) {
    case 'min': return `${x.n + l * 2} daqiqa`;
    case 'hold': return `${sets} × ${x.n + l * 5} soniya`;
    case 'stretch': return `2 × ${x.n} soniya${x.side ? ' (har tomonga)' : ''}`;
    default: return `${sets} × ${x.n}${x.side ? ' (har oyoqqa)' : ''}`;
  }
}

const sessionSecs = key => SESSIONS[key].steps(level()).reduce((a, s) => a + s.secs, 0);
const sessionMins = key => Math.round(sessionSecs(key) / 60);

function exercises(type) {
  const l = level();
  return (PLAN[type] || []).map(p => {
    if (p.session) {
      const s = SESSIONS[p.session];
      return { id: 'ses_' + p.session, name: s.name, eq: s.eqLabel, amount: `~${sessionMins(p.session)} daqiqa`, tip: s.note, info: s.main, scene: s.main, session: p.session };
    }
    const x = EX[p.ex], min = Array.isArray(p.min) ? p.min[l] : p.min;
    return {
      id: p.ex, name: x.name, eq: EQUIP[x.eq].name, amount: min ? `${min} daqiqa` : amountOf(p.ex), tip: p.tip || x.tip, info: p.ex, scene: p.ex,
      timer: x.kind === 'hold' ? x.n + l * 5 : 0, weight: x.kind === 'sets',
    };
  });
}

const isDone = (date, id) => (S.done[date] || []).includes(id);
function progress(date, type) {
  const ex = exercises(type);
  const n = ex.filter(e => isDone(date, e.id)).length;
  return { n, total: ex.length, ok: ex.length > 0 && n === ex.length };
}
// Kun hisoblanadi, agar istalgan mashg‘ulot (yangi zal yoki eski uy rejasi) to‘liq bajarilgan bo‘lsa
const dayOk = date => TYPES.some(t => progress(date, t).ok || LEGACY[t].every(id => isDone(date, id)));
function streak() {
  let c = 0, d = new Date();
  if (!dayOk(ymd(d))) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 400; i++) {
    if (dayOk(ymd(d))) c++;
    else if (SCHEDULE[d.getDay()] !== 'R') break;
    d.setDate(d.getDate() - 1);
  }
  return c;
}

// Bugunga qo‘shilgan qo‘shimcha mashqlar: S.extra[sana]; bajarilgani S.done da 'x:' + id bilan (reja hisobiga ta’sir qilmaydi).
const extrasOf = date => (S.extra[date] || []).filter(id => EX[id]);
function toggleExtra(id) {
  const date = today(), list = extrasOf(date);
  if (list.includes(id)) {
    S.extra[date] = list.filter(x => x !== id);
    S.done[date] = (S.done[date] || []).filter(x => x !== 'x:' + id);
  } else S.extra[date] = [...list, id];
  save();
}

// ---------- Ko‘rinishlar ----------
const view = $('view');
const title = $('title');
let tab = 'today';

function render() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const st = streak();
  $('streak').textContent = st ? `🔥 ${st} kun` : 'Boshlaymiz!';
  ({ today: renderToday, plan: renderPlan, lib: renderLib, weight: renderWeight, me: renderMe })[tab]();
}

// Trenajor rasmi (bosilsa animatsiya va tushuntirish ochiladi)
const thumb = id => SCENES[id] ? `<button class="thumb" data-info="${id}" aria-label="Animatsiyani ko‘rish">${sceneSVG(id)}</button>` : '';
const infoBtn = id => EX[id] ? `<button class="info" data-info="${id}" aria-label="Qanday bajariladi">ⓘ</button>` : '';
const lastKg = id => S.kg[id] ? ` · oxirgi: <b>${S.kg[id]} kg</b>` : '';

function sessionButton(key) {
  return `<button class="btn run" data-session="${key}">▶ Taymer bilan boshlash
      <small>~${sessionMins(key)} daqiqa · har bosqichda trenajor animatsiyasi</small></button>
    <p class="muted">Taymer qaysi trenajorda nima qilishni aytadi: tezlik, qiyalik, qarshilik.</p>`;
}

function extrasCard(date) {
  const ids = extrasOf(date);
  if (!ids.length) return '';
  const n = ids.filter(id => isDone(date, 'x:' + id)).length;
  const rows = ids.map(id => {
    const d = isDone(date, 'x:' + id);
    return `<div class="ex ${d ? 'done' : ''}">
      <button class="chk" data-xex="${id}">${d ? '✓' : ''}</button>
      ${thumb(id)}
      <div class="grow"><div class="name">${EX[id].name}</div><div class="eqn">🏋️ ${EQUIP[EX[id].eq].name}</div><div class="muted">${amountOf(id)}${lastKg(id)}</div></div>
      <button class="info del" data-unx="${id}" aria-label="Olib tashlash">✕</button>
    </div>`;
  }).join('');
  return `<div class="card" style="margin-top:12px"><div class="row between"><h2>Qo‘shimcha mashqlar</h2><span class="muted">${n}/${ids.length}</span></div>${rows}</div>`;
}

function renderToday() {
  title.textContent = 'Bugungi mashq';
  const date = today();
  const picked = S.pick[date] || '';
  const type = picked || SCHEDULE[new Date().getDay()];
  const ex = exercises(type);
  const p = progress(date, type);
  const chips = ['', ...TYPES].map(t => `<button class="chip ${picked === t ? 'on' : ''}" data-pick="${t}">${t ? NAMES[t] : 'Reja'}</button>`).join('');
  let html = `<div class="chips">${chips}</div>
    <div class="card"><div class="row between"><h2>${LABEL[type]}</h2><span class="muted">${p.n}/${p.total}</span></div>`;
  if (type === 'R') {
    html += `<p>Bugun dam olish kuni 😴 Mushaklar tinch holatda o‘sadi. Ko‘proq suv iching va 7–8 soat uxlang.</p>
      <p class="muted">Xohlasangiz, tepadan mashg‘ulot tanlang yoki “Mashqlar” bo‘limidan qo‘shimcha mashq qo‘shing.</p></div>`;
  } else {
    html += `<div class="bar"><div style="width:${p.total ? p.n / p.total * 100 : 0}%"></div></div>`;
    const ses = ex.find(e => e.session);
    if (ses) html += sessionButton(ses.session);
    html += `<p class="muted">👆 Trenajor rasmini bossangiz — animatsiya va qanday bajarilishi chiqadi.</p>`;
    ex.forEach(e => {
      const d = isDone(date, e.id);
      html += `<div class="ex ${d ? 'done' : ''}">
        <button class="chk" data-ex="${e.id}">${d ? '✓' : ''}</button>
        ${thumb(e.scene)}
        <div class="grow"><div class="name">${e.name}</div><div class="eqn">🏋️ ${e.eq}</div>
        <div class="muted">${e.amount}${e.tip ? ' · ' + e.tip : ''}${e.weight ? lastKg(e.id) : ''}</div></div>
        ${e.timer ? `<button class="btn sec sm" data-timer="${e.timer}">⏱</button>` : ''}
        ${infoBtn(e.info)}
      </div>`;
    });
    html += `</div>
      <div class="row" style="gap:8px"><button class="btn sec" data-timer="60">⏱ 60 s dam</button><button class="btn sec" data-timer="90">⏱ 90 s dam</button></div>`;
    if (p.ok) html += `<div class="card" style="margin-top:12px">🎉 Barakalla! Bugungi reja bajarildi.</div>`;
  }
  html += extrasCard(date);
  html += `<div class="tip" style="margin-top:12px">💧 Zalga suv shishasini olib boring · 🍽 Shirinlik va gazli ichimliklarni kamaytiring · 😴 Yaxshi uxlang</div>`;
  view.innerHTML = html;
}

function renderPlan() {
  title.textContent = 'Haftalik reja';
  const now = new Date();
  const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  let cells = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const date = ymd(d);
    cells += `<div class="${date === today() ? 'today' : ''} ${dayOk(date) ? 'ok' : ''}">${DAYS[d.getDay()]}<b>${ICON[SCHEDULE[d.getDay()]]}</b></div>`;
  }
  const daysOf = t => [1, 2, 3, 4, 5, 6, 0].filter(d => SCHEDULE[d] === t).map(d => FULL[d]).join(', ');
  const row = e => `<div class="prow">${thumb(e.scene)}<div class="grow"><div class="name">${e.name}</div><div class="eqn">🏋️ ${e.eq}</div><div class="muted">${e.amount}</div></div></div>`;
  const card = t => `<div class="card"><h2>${LABEL[t]}</h2><p class="muted">${daysOf(t)}</p>${exercises(t).map(row).join('')}</div>`;
  view.innerHTML = `
    <div class="card"><h2>Bu hafta</h2><div class="week">${cells}</div>
      <p class="muted">${daysOf('R')} — dam kuni. Yuklama har 2 haftada oshadi. Hozirgi daraja: ${level() + 1}/4</p></div>
    ${TYPES.map(card).join('')}
    <div class="tip">💡 Vaqtingiz kam bo‘lsa: eng muhimi — kuch kunlari (Du, Chor, Ju). Kardio kunlari qo‘shimcha, ularni imkon qadar bajaring.</div>
    <div class="tip" style="margin-top:12px">⚠️ Og‘riq, bosh aylanishi yoki ko‘krakda siqilish sezsangiz, darhol to‘xtang. Sog‘lig‘ingizda muammo bo‘lsa, avval shifokor bilan maslahatlashing.</div>`;
}

// ---------- Mashqlar (trenajorlar) kutubxonasi ----------
const LV = ['Oson', 'O‘rta', 'Qiyin'];
const CAT_IDS = Object.keys(CATS);
let libQ = '', libCat = '';
const norm = s => s.toLowerCase().replace(/[‘’ʻʼ'`´]/g, '');

const libIds = () => {
  const q = norm(libQ.trim());
  return Object.keys(EX)
    .filter(id => (!libCat || EX[id].cat === libCat)
      && (!q || norm(`${EX[id].name} ${EQUIP[EX[id].eq].name} ${EQUIP[EX[id].eq].en} ${CATS[EX[id].cat]}`).includes(q)))
    .sort((a, b) => CAT_IDS.indexOf(EX[a].cat) - CAT_IDS.indexOf(EX[b].cat) || EX[a].lvl - EX[b].lvl);
};

function libRow(id) {
  const x = EX[id], on = extrasOf(today()).includes(id);
  return `<div class="prow">${thumb(id)}<div class="grow"><div class="name">${x.name}</div>
    <div class="muted">${EQUIP[x.eq].name} · ${LV[x.lvl - 1]} · ${amountOf(id)}</div></div>
    <button class="add ${on ? 'on' : ''}" data-add="${id}" aria-label="${on ? 'Bugundan olib tashlash' : 'Bugunga qo‘shish'}">${on ? '✓' : '+'}</button></div>`;
}

function updateLib() {
  const ids = libIds();
  $('libCount').textContent = `(${ids.length})`;
  $('libCats').innerHTML = [['', 'Hammasi'], ...Object.entries(CATS)]
    .map(([k, v]) => `<button class="chip ${libCat === k ? 'on' : ''}" data-cat="${k}">${v}</button>`).join('');
  $('libList').innerHTML = ids.length ? ids.map(libRow).join('') : '<p class="muted">Hech narsa topilmadi.</p>';
}

function sessionRow(key) {
  const s = SESSIONS[key];
  return `<div class="prow">${thumb(s.main)}<div class="grow"><div class="name">${s.name}</div>
    <div class="muted">${s.note} · ~${sessionMins(key)} daqiqa</div></div>
    <button class="btn sm" data-session="${key}" aria-label="Boshlash: ${s.name}">▶</button></div>`;
}

function renderLib() {
  title.textContent = 'Mashqlar';
  view.innerHTML = `
    <details class="card first"><summary><h2>🧭 Zalga birinchi marta</h2></summary>
      ${FIRST_TIME.map(([i, t, d]) => `<div class="ft"><b>${i} ${t}</b><div class="muted">${d}</div></div>`).join('')}</details>
    <div class="card"><h2>⚡ Kardio seanslari</h2>
      <p class="muted">Taymer qaysi trenajorda nima qilishni bosqichma-bosqich aytadi (tezlik, qiyalik, qarshilik) va animatsiya ko‘rsatadi.</p>
      ${Object.keys(SESSIONS).map(sessionRow).join('')}</div>
    <div class="card"><h2>Barcha mashqlar <span class="muted" id="libCount"></span></h2>
      <input id="libQ" type="search" placeholder="Qidirish: leg press, orqa, treadmill…" autocomplete="off">
      <div class="chips" id="libCats"></div>
      <p class="muted">Rasmni bossangiz — animatsiya va tushuntirish ochiladi. “+” mashqni bugungi ro‘yxatga qo‘shadi.</p>
      <div id="libList"></div></div>`;
  $('libQ').value = libQ;
  updateLib();
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
    <div class="card"><h2>Sozlamalar</h2>
      <label class="check"><input type="checkbox" id="sound" ${S.sound ? 'checked' : ''}><span>Taymer ovozi</span></label></div>
    <div class="card"><h2>Zaxira nusxa</h2>
      <p class="muted">Ma’lumotlar faqat shu telefonda saqlanadi. Telefonni almashtirsangiz yoki brauzer ma’lumotlarini tozalasangiz, yo‘qoladi — vaqti-vaqti bilan zaxira oling.</p>
      <div class="row"><button class="btn sec sm grow" id="exp">Eksport</button>
      <button class="btn sec sm grow" id="imp">Import</button></div>
      <input type="file" id="file" accept="application/json" hidden></div>`;
}

// ---------- Mashq haqida ma’lumot (animatsiya bilan) ----------
let player = null;
const ol = a => `<ol>${a.map(s => `<li>${s}</li>`).join('')}</ol>`;

function openInfo(id) {
  const x = EX[id]; if (!x) return;
  const q = EQUIP[x.eq];
  const kgBox = x.kind === 'sets'
    ? `<div class="kgrow"><label for="kgIn">Bugungi og‘irlik (kg)</label><div class="row"><input id="kgIn" type="number" inputmode="decimal" step="0.5" placeholder="masalan 20" value="${S.kg[id] || ''}"><button class="btn sm" data-savekg="${id}">Saqlash</button></div></div>`
    : '';
  $('sheet').innerHTML = `<div class="panel">
    <div id="anim" class="anim"></div>
    <div class="actl"><button class="chip" id="aPlay">To‘xtatish</button><button class="chip" id="aSlow">Sekin</button></div>
    <p class="muted small">🔴 Qizil — ishlayotgan mushaklar · Rasmni bossangiz, to‘xtaydi/davom etadi</p>
    <h2>${x.name}</h2>
    <p class="muted">${CATS[x.cat]} · ${LV[x.lvl - 1]} daraja · odatda ${amountOf(id)}</p>
    <div class="eq"><div class="eqh">🏋️ ${q.name} <span class="muted">· ${q.en}</span></div>
      <div class="muted">📍 ${q.zone}</div><p>${q.look}</p></div>
    <p>🎯 <b>Ishlaydigan mushaklar:</b> ${x.muscles}</p>
    <h3>Trenajorni sozlash</h3>${ol(x.setup)}
    <h3>Qanday bajariladi</h3>${ol(x.how)}
    <h3>Boshlovchi uchun</h3><p>${x.start}</p>
    <h3>Ko‘p uchraydigan xatolar</h3><ul>${x.mistakes.map(s => `<li>${s}</li>`).join('')}</ul>
    ${kgBox}
    <button class="btn" data-close>Yopish</button></div>`;
  $('sheet').hidden = false;
  if (player) player.pause();
  player = new Player($('anim'), id);
  if (STILL) $('aPlay').textContent = 'Davom etish'; else player.play();
}
function closeInfo() {
  $('sheet').hidden = true;
  if (player) { player.pause(); player = null; }
}
$('sheet').onclick = e => {
  const t = e.target;
  if (t.id === 'sheet' || t.closest('[data-close]')) return closeInfo();
  if (t.closest('#anim') || t.id === 'aPlay') {
    if (!player) return;
    const on = player.toggle(); $('aPlay').textContent = on ? 'To‘xtatish' : 'Davom etish';
  } else if (t.id === 'aSlow') {
    if (!player) return;
    const slow = player.speed === 1; player.setSpeed(slow ? 0.4 : 1);
    t.classList.toggle('on', slow); t.textContent = slow ? 'Sekin ✓' : 'Sekin';
  } else if (t.dataset.savekg) {
    const kg = parseFloat($('kgIn').value);
    if (kg > 0 && kg < 500) { S.kg[t.dataset.savekg] = kg; save(); t.textContent = 'Saqlandi ✓'; render(); }
  }
};

// ---------- Dam olish taymeri ----------
let tInt;
function startTimer(sec, label) {
  const box = $('timer'), num = $('timerNum');
  $('timerLabel').textContent = label;
  let left = sec; num.textContent = left; box.hidden = false;
  clearInterval(tInt);
  tInt = setInterval(() => {
    left--; num.textContent = left;
    if (left <= 0) { clearInterval(tInt); navigator.vibrate?.([300, 100, 300]); setTimeout(() => box.hidden = true, 800); }
  }, 1000);
}
$('timerStop').onclick = () => { clearInterval(tInt); $('timer').hidden = true; };

// ---------- Kardio seansi taymeri ----------
// plan: { steps, mark }. Har bosqichda (scene) trenajor animatsiyasi ko‘rsatiladi.
const PHASE = { ready: 'TAYYORLANING', warm: 'QIZISH', work: 'ISHLANG!', rest: 'DAM OLING', cool: 'SOVUTISH' };
let run = null, audio = null, wake = null;

const sessionPlan = key => ({ steps: SESSIONS[key].steps(level()), mark: ['ses_' + key] });

const fmt = s => s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s);

function beep(freq, ms) {
  if (!S.sound || !audio) return;
  const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
  o.connect(g); g.connect(audio.destination);
  o.start(t); o.stop(t + ms / 1000);
}

// Ekran o‘chib qolmasligi uchun (mashq paytida telefon qo‘lda emas).
async function holdScreen() { try { wake = await navigator.wakeLock?.request('screen'); } catch { wake = null; } }
function freeScreen() { wake?.release().catch(() => {}); wake = null; }
document.addEventListener('visibilitychange', () => { if (run && !document.hidden) holdScreen(); });

function showStep() {
  const s = run.steps[run.i];
  $('circuit').className = s.kind;
  $('cPhase').textContent = s.phase || PHASE[s.kind];
  $('cName').textContent = s.name;
  $('cTip').textContent = s.tip || '';
  $('cMeta').textContent = s.meta || '';
  $('cNext').textContent = run.steps[run.i + 1] ? `Keyingisi: ${run.steps[run.i + 1].name}` : '';
  const sc = s.scene && SCENES[s.scene] ? s.scene : '';
  if (sc !== run.sceneId) {
    if (run.player) run.player.pause();
    run.player = null; run.sceneId = sc;
    $('cScene').innerHTML = '';
    if (sc) { run.player = new Player($('cScene'), sc, { labels: false }); if (!STILL) run.player.play(); }
  }
  $('cScene').hidden = !sc;
}

function tick() {
  if (!run || run.paused) return;
  const s = run.steps[run.i];
  const left = Math.max(0, Math.ceil((run.end - Date.now()) / 1000));
  $('cNum').textContent = fmt(left);
  $('cBar').style.width = `${(run.before[run.i] + s.secs - left) / run.total * 100}%`;
  if (left > 0 && left <= 3 && left !== run.beeped) { run.beeped = left; beep(740, 90); }
  if (left === 0) advance(true);
}

// natural=true: bosqich o‘z vaqtida tugadi — keyingisi oldingisining tugash vaqtidan boshlanadi (kechikish yig‘ilmaydi).
function advance(natural) {
  run.i++;
  if (run.i >= run.steps.length) return finishRun();
  const s = run.steps[run.i];
  run.paused = false; run.beeped = 0;
  run.end = (natural ? Math.max(run.end, Date.now() - 1000) : Date.now()) + s.secs * 1000;
  $('cPause').textContent = 'Pauza';
  showStep();
  beep(s.kind === 'work' ? 988 : 523, 250);
  navigator.vibrate?.(s.kind === 'work' ? 250 : [80, 60, 80]);
  tick();
}

function pauseRun(on) {
  if (!run || run.paused === on) return;
  if (on) run.left = run.end - Date.now(); else run.end = Date.now() + run.left;
  run.paused = on;
  $('cPause').textContent = on ? 'Davom etish' : 'Pauza';
}

function startRun(plan) {
  const steps = plan.steps;
  const before = []; let total = 0;
  steps.forEach(s => { before.push(total); total += s.secs; });
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume?.(); } catch { audio = null; }
  run = { plan, steps, before, total, i: -1, paused: false, beeped: 0, sceneId: null, player: null, timer: setInterval(tick, 200) };
  $('circuit').hidden = false;
  holdScreen();
  advance();
}

function stopScene() { if (run && run.player) run.player.pause(); }

function endRun() {
  if (run) { clearInterval(run.timer); stopScene(); }
  run = null; freeScreen();
  $('circuit').hidden = true;
}

function finishRun() {
  clearInterval(run.timer); stopScene();
  const date = today();
  S.done[date] = [...new Set([...(S.done[date] || []), ...run.plan.mark])];
  save(); freeScreen();
  run = null;
  $('circuit').className = 'done';
  $('cScene').hidden = true;
  $('cPhase').textContent = 'BARAKALLA!';
  $('cNum').textContent = '✓';
  $('cName').textContent = 'Mashg‘ulot tugadi';
  $('cTip').textContent = 'Natija saqlandi. Suv iching va yengil cho‘ziling 💧';
  $('cMeta').textContent = ''; $('cNext').textContent = '';
  $('cBar').style.width = '100%';
  beep(784, 150); setTimeout(() => beep(1047, 300), 180);
  navigator.vibrate?.([200, 80, 200, 80, 400]);
  render();
}

$('cPause').onclick = () => run && pauseRun(!run.paused);
$('cSkip').onclick = () => run && advance();
$('cStop').onclick = () => {
  pauseRun(true);
  if (confirm('To‘xtatilsinmi? Seans belgilanmaydi.')) endRun(); else pauseRun(false);
};
$('cClose').onclick = () => { $('circuit').hidden = true; };

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
  } else if (t.dataset.xex) {
    const date = today(), key = 'x:' + t.dataset.xex, arr = S.done[date] || (S.done[date] = []);
    const i = arr.indexOf(key);
    i >= 0 ? arr.splice(i, 1) : arr.push(key);
    save(); render();
  } else if (t.dataset.unx) {
    toggleExtra(t.dataset.unx); render();
  } else if (t.dataset.add) {
    toggleExtra(t.dataset.add); updateLib();
  } else if ('cat' in t.dataset) {
    libCat = t.dataset.cat; updateLib();
  } else if (t.dataset.info) {
    openInfo(t.dataset.info);
  } else if (t.dataset.session) {
    startRun(sessionPlan(t.dataset.session));
  } else if ('pick' in t.dataset) {
    if (t.dataset.pick) S.pick[today()] = t.dataset.pick; else delete S.pick[today()];
    save(); render();
  } else if (t.dataset.timer) {
    const s = +t.dataset.timer;
    startTimer(s, s <= 30 ? 'Ushlab turing!' : 'Dam olish');
  } else if (t.id === 'addW') {
    const kg = parseFloat($('kg').value);
    if (!(kg > 20 && kg < 400)) return alert('Vaznni to‘g‘ri kiriting');
    const date = today();
    S.weights = S.weights.filter(x => x.date !== date).concat({ date, kg: Math.round(kg * 10) / 10 });
    save(); render();
  } else if (t.dataset.del) {
    if (confirm('O‘chirilsinmi?')) { S.weights = S.weights.filter(x => x.date !== t.dataset.del); save(); render(); }
  } else if (t.id === 'saveP') {
    S.height = $('height').value;
    S.goal = $('goal').value;
    S.startDate = $('start').value || S.startDate;
    save(); render();
  } else if (t.id === 'exp') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
    a.download = `fitday-${today()}.json`; a.click();
  } else if (t.id === 'imp') {
    $('file').click();
  }
};

view.oninput = e => { if (e.target.id === 'libQ') { libQ = e.target.value; updateLib(); } };

view.onchange = e => {
  const t = e.target;
  if (t.id === 'sound') { S.sound = t.checked; save(); return; }
  if (t.id !== 'file' || !t.files[0]) return;
  const r = new FileReader();
  r.onload = () => {
    try { S = Object.assign(fresh(), JSON.parse(r.result)); save(); render(); alert('Tiklandi ✅'); }
    catch { alert('Fayl noto‘g‘ri'); }
  };
  r.readAsText(t.files[0]);
};

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
