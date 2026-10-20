'use strict';

// ---------- Ma'lumotlar (faqat telefonda, localStorage) ----------
const KEY = 'fitday.v1';
const fresh = () => ({ startDate: null, height: '', goal: '', weights: [], done: {}, pick: {}, extra: {}, low: true, sound: true });
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
const DAYS = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];
const FULL = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

// ---------- Mashqlar rejasi ----------
// Hafta kunlari: 1=Du ... 0=Yak. Har 2 haftada yuklama biroz oshadi.
// A/B — kuch, C/D — yog‘ yoqish kardio (interval), W — tez yurish, R — dam.
const SCHEDULE = { 1: 'A', 2: 'C', 3: 'B', 4: 'W', 5: 'A', 6: 'D', 0: 'R' };
const TYPES = ['A', 'B', 'C', 'D', 'W'];
const NAMES = { A: 'Kuch A', B: 'Kuch B', C: 'Kardio 1', D: 'Kardio 2', W: 'Yurish' };
const ICON = { A: '💪', B: '💪', C: '🔥', D: '🔥', W: '🚶', R: '😴' };
const LABEL = { A: 'Butun tana — A', B: 'Butun tana — B', W: 'Tez yurish', R: 'Dam olish', C: CIRCUITS.C.label, D: CIRCUITS.D.label };

function level() {
  const days = Math.floor((parse(today()) - parse(S.startDate)) / 864e5);
  return Math.min(3, Math.max(0, Math.floor(days / 14)));
}

// Kardio aylana: daraja oshgan sari ish vaqti ko‘payadi, dam qisqaradi.
function cardio() {
  const l = level();
  return { work: [20, 30, 40, 45][l], rest: [40, 30, 20, 15][l], rounds: [2, 2, 3, 3][l] };
}

// Sakramasdan rejim yoqilgan bo‘lsa, kardio mashqning yengil varianti olinadi.
const variant = id => { const m = MOVES[id]; return S.low && m.low ? { ...m, ...m.low } : m; };

// Mashqning odatiy miqdori (daraja oshgan sari ko‘payadi).
function amountOf(id) {
  const m = MOVES[id], sets = m.sets || 3;
  const n = m.n + level() * (m.step ?? (m.kind === 'reps' || m.kind === 'side' ? 2 : 5));
  switch (m.kind) {
    case 'reps': return `${sets} × ${n}`;
    case 'side': return `${sets} × ${n} (har tomonga)`;
    case 'time': return `${sets} × ${n} soniya`;
    case 'timeside': return `${sets} × ${n} soniya (har tomonga)`;
    default: return `${n} daqiqa`;
  }
}

function exercises(type) {
  const l = level();
  const r = (base, step = 2) => base + l * step;
  const n = id => MOVES[id].name;
  const warm = { id: 'warm', name: 'Qizish: joyida yurish + qo‘l aylantirish', amount: '3 daqiqa', tip: 'Sekin boshlang, nafasni rostlang.' };
  const cool = { id: 'cool', name: n('cool'), amount: '3 daqiqa', tip: 'Oyoq, sonlar va yelkani 30–45 soniyadan cho‘zing.' };
  if (type === 'A') return [
    warm,
    { id: 'squat', name: n('squat'), amount: `3 × ${r(10)}`, tip: 'Tizza oyoq uchidan oshmasin, orqa to‘g‘ri.' },
    { id: 'pushwall', name: n('pushwall'), amount: `3 × ${r(10)}`, tip: 'Keyinchalik stol chetidan, so‘ng polga o‘ting.' },
    { id: 'bridge', name: n('bridge'), amount: `3 × ${r(12)}`, tip: 'Yuqorida 1 soniya ushlang.' },
    { id: 'plank', name: n('plank'), amount: `3 × ${r(20, 10)} soniya`, timer: r(20, 10), tip: 'Tizzada boshlasangiz ham bo‘ladi.' },
    cool,
  ];
  if (type === 'B') return [
    warm,
    { id: 'lunge', name: n('lunge'), amount: `3 × ${r(8)} (har oyoqqa)`, tip: 'Muvozanat qiyin bo‘lsa, devorga suyaning.' },
    { id: 'pushinc', name: n('pushinc'), amount: `3 × ${r(8)}`, tip: 'Tana bir chiziqda bo‘lsin.' },
    { id: 'superman', name: n('superman'), amount: `3 × ${r(10)}`, tip: 'Qo‘l-oyoqni bir vaqtda ko‘taring.' },
    { id: 'bike', name: n('bike'), amount: `3 × ${r(12)}`, tip: 'Bo‘yinni tortmang, sekin bajaring.' },
    { id: 'stepup', name: n('stepup'), amount: `3 × ${r(10)}`, tip: 'Past zinapoya yoki mustahkam stul.' },
    cool,
  ];
  if (CIRCUITS[type]) {
    const { work, rounds } = cardio();
    return [
      warm,
      ...CIRCUITS[type].moves.map(id => ({ id, name: variant(id).name, amount: `${rounds} × ${work} soniya`, tip: variant(id).cue })),
      cool,
    ];
  }
  if (type === 'W') return [
    { id: 'walk', name: n('walk'), amount: `${30 + l * 5} daqiqa`, tip: 'Gaplashsa bo‘ladi, lekin qo‘shiq aytib bo‘lmaydi — shu tezlik.' },
  ];
  return [];
}

const infoBtn = id => MOVES[id] ? `<button class="info" data-info="${id}" aria-label="Qanday bajariladi">ⓘ</button>` : '';

const isDone = (date, id) => (S.done[date] || []).includes(id);
function progress(date, type) {
  const ex = exercises(type);
  const n = ex.filter(e => isDone(date, e.id)).length;
  return { n, total: ex.length, ok: ex.length > 0 && n === ex.length };
}
// Kun hisoblanadi, agar istalgan mashg‘ulot to‘liq bajarilgan bo‘lsa (reja o‘zgarsa ham eski natijalar saqlanadi).
const dayOk = date => TYPES.some(t => progress(date, t).ok);
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
const extrasOf = date => S.extra[date] || [];
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

function runButton(type) {
  const plan = circuitPlan(type);
  return `<button class="btn run" data-run="${type}">▶ Avtomatik taymer bilan boshlash
      <small>~${planMinutes(plan)} daqiqa · ${plan.rounds} raund · ${plan.work} s ish / ${plan.rest} s dam</small></button>
    <p class="muted">Telefon ovoz va ekran bilan yo‘l ko‘rsatadi. Nafas qiyin bo‘lsa, to‘xtab dam oling.</p>`;
}

function extrasCard(date) {
  const ids = extrasOf(date);
  if (!ids.length) return '';
  const n = ids.filter(id => isDone(date, 'x:' + id)).length;
  const rows = ids.map(id => {
    const d = isDone(date, 'x:' + id);
    return `<div class="ex ${d ? 'done' : ''}">
      <button class="chk" data-xex="${id}">${d ? '✓' : ''}</button>
      <div class="grow"><div class="name">${variant(id).name}</div><div class="muted">${amountOf(id)}</div></div>
      ${infoBtn(id)}
      <button class="info del" data-unx="${id}" aria-label="Olib tashlash">✕</button>
    </div>`;
  }).join('');
  const runnable = ids.some(id => MOVES[id].kind !== 'min');
  return `<div class="card" style="margin-top:12px"><div class="row between"><h2>Qo‘shimcha mashqlar</h2><span class="muted">${n}/${ids.length}</span></div>
    ${runnable ? '<button class="btn sec" data-run-extra>▶ Taymer bilan boshlash</button>' : ''}${rows}</div>`;
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
      <p class="muted">Xohlasangiz, tepadan mashg‘ulot tanlang yoki “Mashqlar” bo‘limidan yengil mashq qo‘shing.</p></div>`;
  } else {
    html += `<div class="bar"><div style="width:${p.total ? p.n / p.total * 100 : 0}%"></div></div>`;
    if (CIRCUITS[type]) html += runButton(type);
    ex.forEach(e => {
      const d = isDone(date, e.id);
      html += `<div class="ex ${d ? 'done' : ''}">
        <button class="chk" data-ex="${e.id}">${d ? '✓' : ''}</button>
        <div class="grow"><div class="name">${e.name}</div>
        <div class="muted">${e.amount}${e.tip ? ' · ' + e.tip : ''}</div></div>
        ${e.timer ? `<button class="btn sec sm" data-timer="${e.timer}">⏱</button>` : ''}
        ${infoBtn(e.id)}
      </div>`;
    });
    html += `</div>
      <button class="btn sec" data-timer="30">⏱ 30 soniya dam olish</button>`;
    if (p.ok) html += `<div class="card" style="margin-top:12px">🎉 Barakalla! Bugungi reja bajarildi.</div>`;
  }
  html += extrasCard(date);
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
    const date = ymd(d);
    cells += `<div class="${date === today() ? 'today' : ''} ${dayOk(date) ? 'ok' : ''}">${DAYS[d.getDay()]}<b>${ICON[SCHEDULE[d.getDay()]]}</b></div>`;
  }
  const { work, rest, rounds } = cardio();
  const daysOf = t => [1, 2, 3, 4, 5, 6, 0].filter(d => SCHEDULE[d] === t).map(d => FULL[d]).join(', ');
  const row = e => `<div class="prow"><div>${e.name}<div class="muted">${e.amount}</div></div>${infoBtn(e.id)}</div>`;
  const card = t => `<div class="card"><h2>${LABEL[t]}</h2>
    <p class="muted">${daysOf(t)}${CIRCUITS[t] ? ` · ${rounds} raund, ${work} s ish / ${rest} s dam` : ''}</p>
    ${exercises(t).map(row).join('')}</div>`;
  view.innerHTML = `
    <div class="card"><h2>Bu hafta</h2><div class="week">${cells}</div>
      <p class="muted">${daysOf('R')} — dam kuni. Yuklama har 2 haftada oshadi. Hozirgi daraja: ${level() + 1}/4</p></div>
    ${TYPES.map(card).join('')}
    <div class="tip">⚠️ Og‘riq, bosh aylanishi yoki ko‘krakda siqilish sezsangiz, darhol to‘xtang. Sog‘lig‘ingizda muammo bo‘lsa, avval shifokor bilan maslahatlashing.</div>`;
}

// ---------- Mashqlar kutubxonasi ----------
const LV = ['Oson', 'O‘rta', 'Qiyin'];
const CAT_IDS = Object.keys(CATS);
let libQ = '', libCat = '';
const norm = s => s.toLowerCase().replace(/[‘’ʻʼ'`´]/g, '');

const libIds = () => {
  const q = norm(libQ.trim());
  return Object.keys(MOVES)
    .filter(id => CATS[MOVES[id].cat] && (!libCat || MOVES[id].cat === libCat)
      && (!q || norm(`${variant(id).name} ${MOVES[id].name} ${CATS[MOVES[id].cat]}`).includes(q)))
    .sort((a, b) => CAT_IDS.indexOf(MOVES[a].cat) - CAT_IDS.indexOf(MOVES[b].cat) || MOVES[a].lvl - MOVES[b].lvl);
};

function libRow(id) {
  const m = MOVES[id], on = extrasOf(today()).includes(id);
  return `<div class="prow"><div><div class="name">${variant(id).name}</div>
    <div class="muted">${CATS[m.cat]} · ${LV[m.lvl - 1]} · ${amountOf(id)}</div></div>
    <div class="acts">${infoBtn(id)}<button class="add ${on ? 'on' : ''}" data-add="${id}" aria-label="${on ? 'Bugundan olib tashlash' : 'Bugunga qo‘shish'}">${on ? '✓' : '+'}</button></div></div>`;
}

function updateLib() {
  const ids = libIds();
  $('libCount').textContent = `(${ids.length})`;
  $('libCats').innerHTML = [['', 'Hammasi'], ...Object.entries(CATS)]
    .map(([k, v]) => `<button class="chip ${libCat === k ? 'on' : ''}" data-cat="${k}">${v}</button>`).join('');
  $('libList').innerHTML = ids.length ? ids.map(libRow).join('') : '<p class="muted">Hech narsa topilmadi.</p>';
}

function presetRow(p) {
  const plan = presetPlan(p);
  return `<div class="prow"><div><div class="name">${p.name}</div>
    <div class="muted">${p.note} · ~${planMinutes(plan)} daqiqa · ${p.ids.length} mashq</div></div>
    <button class="btn sm" data-preset="${p.id}" aria-label="Boshlash: ${p.name}">▶</button></div>`;
}

function renderLib() {
  title.textContent = 'Mashqlar';
  view.innerHTML = `
    <div class="card"><h2>⚡ Tayyor mashg‘ulotlar</h2>
      <p class="muted">Bir bosishda boshlang — telefon o‘zi sanaydi va ovoz beradi. Boshlash oldidan qizinib oling.</p>
      ${PRESETS.map(presetRow).join('')}</div>
    <div class="card"><h2>Barcha mashqlar <span class="muted" id="libCount"></span></h2>
      <input id="libQ" type="search" placeholder="Qidirish: squat, qorin, cho‘zilish…" autocomplete="off">
      <div class="chips" id="libCats"></div>
      <p class="muted">“+” mashqni bugungi ro‘yxatga qo‘shadi, ⓘ — qanday bajarilishini ko‘rsatadi.</p>
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
    <div class="card"><h2>Mashq sozlamalari</h2>
      <label class="check"><input type="checkbox" id="low" ${S.low ? 'checked' : ''}>
        <span>Sakrashsiz (yengil) variantlar<br><small class="muted">Sakrash o‘rniga qadam bilan bajariladi — bo‘g‘imlarga yengil. Yangi boshlagan yoki vazni ko‘p bo‘lsa, yoqilgan holda qoldiring.</small></span></label>
      <label class="check"><input type="checkbox" id="sound" ${S.sound ? 'checked' : ''}><span>Taymer ovozi</span></label></div>
    <div class="card"><h2>Zaxira nusxa</h2>
      <p class="muted">Ma’lumotlar faqat shu telefonda saqlanadi. Telefonni almashtirsangiz yoki brauzer ma’lumotlarini tozalasangiz, yo‘qoladi — vaqti-vaqti bilan zaxira oling.</p>
      <div class="row"><button class="btn sec sm grow" id="exp">Eksport</button>
      <button class="btn sec sm grow" id="imp">Import</button></div>
      <input type="file" id="file" accept="application/json" hidden></div>`;
}

// ---------- Mashq haqida ma’lumot ----------
function openInfo(id) {
  const m = MOVES[id]; if (!m) return;
  const v = variant(id);
  const alt = m.low ? (S.low ? { hard: `Sakrab bajariladigan variant: ${m.name}` } : { easy: `Sakramasdan variant: ${m.low.name}` }) : m;
  const meta = CATS[m.cat] ? `<p class="muted">${CATS[m.cat]} · ${LV[m.lvl - 1]} daraja · odatda ${amountOf(id)}</p>` : '';
  $('sheet').innerHTML = `<div class="panel"><h2>${v.name}</h2>${meta}
    <h3>Qanday bajariladi</h3><ol>${v.how.map(s => `<li>${s}</li>`).join('')}</ol>
    ${alt.easy ? `<p>🟢 <b>Yengilroq:</b> ${alt.easy}</p>` : ''}
    ${alt.hard ? `<p>🔴 <b>Qiyinroq:</b> ${alt.hard}</p>` : ''}
    <button class="btn" data-close>Yopish</button></div>`;
  $('sheet').hidden = false;
}
$('sheet').onclick = e => { if (e.target.id === 'sheet' || e.target.closest('[data-close]')) $('sheet').hidden = true; };

// ---------- Taymer ----------
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

// ---------- Avtomatik interval taymer ----------
// plan: { ids, work, rest, rounds, warm?, mark, extras?, restName?, restTip?, restPhase? }
const PHASE = { ready: 'TAYYORLANING', warm: 'QIZISH', work: 'ISHLANG!', rest: 'DAM OLING', cool: 'CHO‘ZILISH' };
let run = null, audio = null, wake = null;

const planMinutes = plan => Math.round(circuitSteps(plan).reduce((a, s) => a + s.secs, 0) / 60);
// Rejadagi kardio kuni: qizish + aylana + cho‘zilish; bajarilganda kun ro‘yxati to‘liq belgilanadi.
const circuitPlan = type => ({ ids: CIRCUITS[type].moves, ...cardio(), warm: true, mark: exercises(type).map(e => e.id) });
// Tayyor mashg‘ulot: daraja oshgan sari ish ko‘payadi, dam qisqaradi; bajarilganda bugungi qo‘shimchalarga tushadi.
function presetPlan(p) {
  const l = level();
  return {
    ids: p.ids, rounds: p.rounds,
    work: p.fixed ? p.work : Math.min(45, p.work + 5 * l),
    rest: p.fixed ? p.rest : Math.max(10, p.rest - 5 * l),
    restName: p.restName, restTip: p.restTip, restPhase: p.restPhase,
    mark: p.ids.map(id => 'x:' + id), extras: p.ids,
  };
}
// Bugun qo‘shilgan mashqlar (daqiqa bilan o‘lchanadigan yurishlardan tashqari).
function extrasPlan(date) {
  const ids = extrasOf(date).filter(id => MOVES[id].kind !== 'min');
  // Faqat cho‘zilish bo‘lsa: 30 s ushlab, 5 s da keyingi holatga o‘tiladi.
  const hold = ids.length && ids.every(id => MOVES[id].cat === 'stretch')
    ? { work: 30, rest: 5, rounds: 1, restName: 'Keyingi holatga o‘ting', restTip: 'Tanani bo‘shating, chuqur nafas oling', restPhase: 'KEYINGISI' }
    : cardio();
  return { ids, ...hold, mark: ids.map(id => 'x:' + id) };
}

function circuitSteps(plan) {
  const { ids, work, rest, rounds } = plan;
  const steps = [{ kind: 'ready', name: 'Tayyorlaning', secs: 5, tip: 'Joyingizni tayyorlang, suv yoningizda tursin' }];
  if (plan.warm) WARM_STEPS.forEach((s, i) => steps.push({ kind: 'warm', ...s, meta: `Qizish ${i + 1}/${WARM_STEPS.length}` }));
  for (let r = 1; r <= rounds; r++) ids.forEach((id, k) => {
    const v = variant(id), m = MOVES[id];
    const meta = rounds > 1 ? `Raund ${r}/${rounds} · mashq ${k + 1}/${ids.length}` : `Mashq ${k + 1}/${ids.length}`;
    // Har tomonga bajariladigan mashq chap va o‘ng tomon uchun alohida bosqich bo‘ladi.
    const sides = m.kind === 'side' || m.kind === 'timeside' ? [' — chap tomon', ' — o‘ng tomon'] : [''];
    sides.forEach((sfx, i) => {
      steps.push({ kind: m.cat === 'stretch' ? 'cool' : 'work', name: v.name + sfx, tip: v.cue || v.how[0], secs: work, meta });
      if (i < sides.length - 1) steps.push({ kind: 'rest', phase: 'ALMASHTIRING', name: 'Tomonni almashtiring', tip: '', secs: 4, meta });
    });
    if (rest > 0 && !(r === rounds && k === ids.length - 1)) {
      steps.push({
        kind: 'rest', phase: plan.restPhase, name: plan.restName || 'Nafasni rostlang',
        tip: plan.restTip || 'Chuqur nafas oling, yelkalarni bo‘shating', secs: rest, meta: rounds > 1 ? `Raund ${r}/${rounds}` : '',
      });
    }
  });
  if (plan.warm) COOL_STEPS.forEach((s, i) => steps.push({ kind: 'cool', ...s, meta: `Cho‘zilish ${i + 1}/${COOL_STEPS.length}` }));
  return steps;
}

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
  const nx = run.steps.slice(run.i + 1).find(x => x.kind !== 'rest');
  $('circuit').className = s.kind;
  $('cPhase').textContent = s.phase || PHASE[s.kind];
  $('cName').textContent = s.name;
  $('cTip').textContent = s.tip || '';
  $('cMeta').textContent = s.meta || '';
  $('cNext').textContent = nx ? `Keyingisi: ${nx.name}` : '';
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
  if (!plan.ids.length) return;
  const steps = circuitSteps(plan);
  const before = []; let total = 0;
  steps.forEach(s => { before.push(total); total += s.secs; });
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume?.(); } catch { audio = null; }
  run = { plan, steps, before, total, i: -1, paused: false, beeped: 0, timer: setInterval(tick, 200) };
  $('circuit').hidden = false;
  holdScreen();
  advance();
}

function endRun() {
  if (run) clearInterval(run.timer);
  run = null; freeScreen();
  $('circuit').hidden = true;
}

function finishRun() {
  clearInterval(run.timer);
  const { mark, extras } = run.plan, date = today();
  S.done[date] = [...new Set([...(S.done[date] || []), ...mark])];
  if (extras) S.extra[date] = [...new Set([...extrasOf(date), ...extras])];
  save(); freeScreen();
  run = null;
  $('circuit').className = 'done';
  $('cPhase').textContent = 'BARAKALLA!';
  $('cNum').textContent = '✓';
  $('cName').textContent = 'Mashg‘ulot tugadi';
  $('cTip').textContent = 'Natija saqlandi. Suv iching va dam oling 💧';
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
  if (confirm('To‘xtatilsinmi? Bajarilgan mashqlar belgilanmaydi.')) endRun(); else pauseRun(false);
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
  } else if (t.dataset.run) {
    startRun(circuitPlan(t.dataset.run));
  } else if (t.dataset.preset) {
    startRun(presetPlan(PRESETS.find(p => p.id === t.dataset.preset)));
  } else if ('runExtra' in t.dataset) {
    startRun(extrasPlan(today()));
  } else if ('pick' in t.dataset) {
    if (t.dataset.pick) S.pick[today()] = t.dataset.pick; else delete S.pick[today()];
    save(); render();
  } else if (t.dataset.timer) {
    const s = +t.dataset.timer;
    startTimer(s, s === 30 ? 'Dam olish' : 'Ushlab turing!');
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
  if (t.id === 'low' || t.id === 'sound') { S[t.id] = t.checked; save(); return; }
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
