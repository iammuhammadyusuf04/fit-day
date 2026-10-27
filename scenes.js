'use strict';

// ---------- Trenajor animatsiyalari: tayanch qism ----------
// Har bir sahna (SCENES[id]) — trenajor rasmi + undagi odam. Odam yon tomondan (view: 'side', o‘ngga qaragan)
// yoki oldindan (view: 'front') ko‘rinadi. Poza: tos (hip), tana og‘ishi (T), bosh (hd) va ikki tomon
// a‘zolari (A — yaqin/chap, B — uzoq/o‘ng). Qo‘l-oyoq yo wr/an (IK: qo‘l yoki to‘piq joyi) yoki burchaklar
// (FK: ua, fa, th, sh) bilan beriladi. Burchak: 0 = pastga, 90 = o‘ngga, 180 = yuqoriga.
const SCENES = {};
const FLOOR = 146;
const COL = {
  bg: '#eef2f7', floor: '#cfd8e3', frame: '#8a9bb2', frameD: '#64748b', dark: '#475569', black: '#334155',
  pad: '#3b82f6', padD: '#1d4ed8', mv: '#f59e0b', mvD: '#b45309', plate: '#94a3b8', plateD: '#64748b',
  cable: '#475569', screen: '#38bdf8', skin: '#f1c7a1', skinF: '#d6a47c', shirt: '#f97316', shirtF: '#c2570c',
  pants: '#1e3a8a', pantsF: '#4a66b5', shoe: '#f8fafc', shoeF: '#cbd5e1', hl: '#ef4444', text: '#334155', mat: '#34d399',
};
const BL = { torso: 34, neck: 4, head: 8, ua: 20, fa: 19, th: 29, sh: 28, ft: 11 };

const f1 = n => Math.round(n * 10) / 10;
const TAU = Math.PI * 2;
const seg = (u, a, b) => { const t = Math.min(1, Math.max(0, (u - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
// 0 → 1 → 0: a gacha ko‘tariladi, b gacha ushlab turiladi, so‘ng qaytadi
const rep = (u, a = 0.45, b = 0.55) => u < a ? seg(u, 0, a) : u < b ? 1 : 1 - seg(u, b, 1);
const rad = d => d * Math.PI / 180;
const dv = a => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];

// --- SVG yordamchilari ---
const R = (x, y, w, h, fill, rx = 2, ex = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}" ${ex}/>`;
const Ln = (x1, y1, x2, y2, stroke, w = 3, ex = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;
const L2 = (a, b, stroke, w = 3, ex = '') => Ln(a[0], a[1], b[0], b[1], stroke, w, ex);
const Ci = (cx, cy, r, fill, ex = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}" ${ex}/>`;
const Pa = (d, fill = 'none', stroke = 'none', w = 0, ex = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${ex}/>`;
const Tx = (x, y, s, size = 7.5, anchor = 'middle', fill = COL.text) => `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-weight="700" font-family="system-ui,sans-serif" stroke="#eef2f7" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round">${s}</text>`;
const Poly = (pts, fill, stroke = 'none', w = 0) => Pa('M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' L') + ' Z', fill, stroke, w);

// Gantel/plastina yon tomondan (uchidan): disk
const Disc = (p, r = 6, fill = COL.black, mid = COL.mv) => Ci(p[0], p[1], r, fill) + Ci(p[0], p[1], r * 0.45, mid);
// Og‘irlik to‘plami (stack): n ta plastina, sel+1 tasi (tepadan) ko‘tarilgan, off — ko‘tarilish masofasi
function Stack(x, y, w, h, n, sel, off) {
  const ph = h / n;
  let s = R(x - 2, y - 3, w + 4, h + 4 + 3, 'none', 2, `stroke="${COL.frameD}" stroke-width="1.5"`);
  for (let i = 0; i < n; i++) {
    const lift = i <= sel ? off : 0;
    s += R(x, y + i * ph + 0.8 - lift, w, ph - 1.6, i <= sel ? COL.mv : COL.plate, 1.5);
  }
  s += Ln(x - 1, y + (sel + 0.5) * ph - off, x + w + 1, y + (sel + 0.5) * ph - off, COL.mvD, 1.6);
  return s;
}

// Gantel tokchasi (stellaj) — zalda gantellar shu yerda turadi
const dbRack = (x, y) => {
  let s = Ln(x, y, x, FLOOR, COL.frame, 4) + Ln(x + 56, y, x + 56, FLOOR, COL.frame, 4);
  [y + 8, y + 32].forEach((yy, r) => {
    s += R(x - 2, yy + 6, 60, 4, COL.frameD, 2);
    for (let k = 0; k < 4; k++) {
      const cx = x + 9 + k * 13, h = 6 + k * 1.3 + r * 1.5;
      s += R(cx - 6, yy + 6 - h, 3.6, h, COL.black, 1) + R(cx + 2.4, yy + 6 - h, 3.6, h, COL.black, 1) + Ln(cx - 3, yy + 6 - h / 2, cx + 3, yy + 6 - h / 2, COL.plate, 2);
    }
  });
  return s;
};

// --- Suyaklarni hisoblash (IK / FK) ---
function ik(root, tgt, l1, l2, bend) {
  const dx = tgt[0] - root[0], dy = tgt[1] - root[1];
  const d = Math.hypot(dx, dy);
  const dc = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, d));
  const base = Math.atan2(dy, dx);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dc * dc - l2 * l2) / (2 * l1 * dc))));
  const j = base + bend * a;
  return {
    mid: [root[0] + l1 * Math.cos(j), root[1] + l1 * Math.sin(j)],
    end: [root[0] + dc * Math.cos(base), root[1] + dc * Math.sin(base)],
    miss: Math.abs(d - dc),
  };
}

function solve(sc, p) {
  const front = sc.view === 'front';
  const Td = p.T || 0, T = rad(Td), hip = p.hip;
  const sh = [hip[0] + BL.torso * Math.sin(T), hip[1] - BL.torso * Math.cos(T)];
  const Hd = rad(Td + (p.hd || 0));
  const neck = [sh[0] + BL.neck * Math.sin(Hd), sh[1] - BL.neck * Math.cos(Hd)];
  const head = [sh[0] + (BL.neck + BL.head) * Math.sin(Hd), sh[1] - (BL.neck + BL.head) * Math.cos(Hd)];
  const J = { hip, sh, neck, head, miss: 0 };
  for (const k of ['A', 'B']) {
    const own = !!p[k], S = p[k] || p.A, sgn = k === 'A' ? -1 : 1;
    let sa = sh, ha = hip;
    if (front) {
      const px = Math.cos(T), py = Math.sin(T);
      sa = [sh[0] + sgn * 11 * px, sh[1] + sgn * 11 * py];
      ha = [hip[0] + sgn * 6.5 * px, hip[1] + sgn * 6.5 * py];
    } else if (k === 'B' && !own) { sa = [sh[0] - 1.6, sh[1] + 0.4]; ha = [hip[0] - 1.6, hip[1]]; }
    const eb = k === 'B' && sc.ebB != null ? sc.ebB : sc.eb;
    const kb = k === 'B' && sc.kbB != null ? sc.kbB : sc.kb;
    let el, wr, kn, an;
    if (S.el && S.wr) { el = S.el; wr = S.wr; }
    else if (S.wr) { const r = ik(sa, S.wr, BL.ua, BL.fa, eb); el = r.mid; wr = r.end; J.miss = Math.max(J.miss, r.miss); }
    else { el = add(sa, dv(S.ua || 0), BL.ua); wr = add(el, dv(S.fa || 0), BL.fa); }
    if (S.kn && S.an) { kn = S.kn; an = S.an; }
    else if (S.an) { const r = ik(ha, S.an, BL.th, BL.sh, kb); kn = r.mid; an = r.end; J.miss = Math.max(J.miss, r.miss); }
    else { kn = add(ha, dv(S.th || 0), BL.th); an = add(kn, dv(S.sh || 0), BL.sh); }
    const to = front ? [an[0] + sgn * 7, an[1] + 2.5] : add(an, dv(S.ft == null ? 90 : S.ft), BL.ft);
    J[k] = { sa, el, wr, ha, kn, an, to };
  }
  return J;
}

// --- Poza oraliqlari ---
function lerp(a, b, t) {
  if (typeof a === 'number') return a + (b - a) * t;
  if (Array.isArray(a)) return a.map((v, i) => lerp(v, b[i], t));
  if (a && typeof a === 'object') {
    const o = {};
    for (const k in a) o[k] = k in b ? lerp(a[k], b[k], t) : a[k];
    return o;
  }
  return a;
}

function poseAt(sc, u) {
  u = ((u % 1) + 1) % 1;
  if (sc.pose) return sc.pose(u);
  const ks = sc.keys;
  let i = 0;
  while (i < ks.length - 2 && u > ks[i + 1][0]) i++;
  const [t0, a] = ks[i], [t1, b] = ks[i + 1];
  let s = t1 === t0 ? 0 : Math.min(1, Math.max(0, (u - t0) / (t1 - t0)));
  if (sc.ease !== 'linear') s = s * s * (3 - 2 * s);
  return lerp(a, b, s);
}

// --- Odam rasmi ---
function figure(sc, J) {
  const front = sc.view === 'front';
  const hl = sc.hl || [];
  const has = n => hl.includes(n) || ((n === 'thigh' || n === 'shin') && hl.includes('legs')) || ((n === 'uarm' || n === 'farm') && hl.includes('arms'));
  let glow = '', body = '';
  const seg = (a, b, col, w, tag) => { if (tag && has(tag)) glow += L2(a, b, COL.hl, w + 7, 'opacity=".42"'); body += L2(a, b, col, w); };
  const leg = k => {
    const F = k === 'B' && !front, j = J[k];
    seg(j.ha, j.kn, F ? COL.pantsF : COL.pants, 9.5, 'thigh');
    seg(j.kn, j.an, F ? COL.skinF : COL.skin, 7.5, 'shin');
    body += L2(j.an, j.to, F ? '#94a3b8' : '#64748b', 6.6) + L2(j.an, j.to, F ? COL.shoeF : COL.shoe, 4.4);
  };
  const arm = k => {
    const F = k === 'B' && !front, j = J[k];
    seg(j.sa, j.el, F ? COL.shirtF : COL.shirt, 7.5, 'uarm');
    seg(j.el, j.wr, F ? COL.skinF : COL.skin, 6, 'farm');
    body += Ci(j.wr[0], j.wr[1], 3.4, F ? COL.skinF : COL.skin);
  };
  const torso = () => {
    if (has('torso')) glow += L2(J.hip, J.sh, COL.hl, front ? 29 : 22, 'opacity=".42"');
    body += Ci(J.hip[0], J.hip[1], front ? 9 : 7.5, COL.pants);
    body += L2(J.hip, J.sh, COL.shirt, front ? 22 : 15);
    if (front) body += L2(J.A.sa, J.B.sa, COL.shirt, 10);
    else body += Ci(J.sh[0], J.sh[1], 7, COL.shirt);
    body += L2(J.sh, J.neck, COL.skin, 5);
  };
  if (front) { leg('A'); leg('B'); torso(); arm('A'); arm('B'); }
  else { leg('B'); arm('B'); torso(); leg('A'); arm('A'); }
  body += Ci(J.head[0], J.head[1], BL.head, COL.skin, `stroke="#c79a72" stroke-width="1"`);
  if (!front) body += Pa(`M${f1(J.head[0] - 7.5)},${f1(J.head[1] - 1)} A8,8 0 0 1 ${f1(J.head[0] + 3)},${f1(J.head[1] - 7.4)} L${f1(J.head[0] - 3)},${f1(J.head[1] - 2)} Z`, '#3b2f2f');
  else body += Pa(`M${f1(J.head[0] - 8)},${f1(J.head[1])} A8,8 0 0 1 ${f1(J.head[0] + 8)},${f1(J.head[1])} Z`, '#3b2f2f');
  return glow + body;
}

// --- Sahna kadrlari ---
const bgOf = sc => R(0, 0, 240, 160, COL.bg, 0) + R(0, FLOOR, 240, 14, COL.floor, 0) + Ln(0, FLOOR, 240, FLOOR, '#b6c2d1', 1) + (sc.bg || '');

function labelsOf(sc) {
  return (sc.labels || []).map(([x, y, s, px, py, anchor]) => {
    let o = '';
    if (px != null) o += Ln(x, y + (py > y ? 1.5 : -7), px, py, '#94a3b8', 0.9) + Ci(px, py, 1.6, '#64748b');
    return o + Tx(x, y, s, 7.2, anchor || 'middle');
  }).join('');
}

function frameParts(sc, u) {
  const J = solve(sc, poseAt(sc, u));
  return { J, back: sc.back ? sc.back(J, u) : '', fig: figure(sc, J), front: sc.front ? sc.front(J, u) : '' };
}

function scene(id, o) {
  SCENES[id] = Object.assign({ id, view: 'side', dur: 3000, ease: 'smooth', thumb: 0.5, hl: [], eb: 1, kb: -1 }, o);
}

// Jadval/ro‘yxat uchun qimirlamaydigan kichik rasm
function sceneSVG(id, u, o = {}) {
  const sc = SCENES[id]; if (!sc) return '';
  const p = frameParts(sc, u == null ? sc.thumb : u);
  return `<svg class="${o.cls || 'scene'}" viewBox="0 0 240 160" role="img" aria-label="${o.alt || sc.alt || ''}">${bgOf(sc)}${p.back}${p.fig}${p.front}${o.labels ? labelsOf(sc) : ''}</svg>`;
}

// Animatsiya pleyeri: hostga SVG joylaydi va kadrma-kadr yangilaydi
class Player {
  constructor(host, id, o = {}) {
    this.sc = SCENES[id]; this.u = this.sc.thumb; this.speed = o.speed || 1; this.playing = false; this.raf = 0;
    host.innerHTML = `<svg class="scene" viewBox="0 0 240 160" role="img" aria-label="${this.sc.alt || ''}"><g>${bgOf(this.sc)}</g><g class="s-back"></g><g class="s-fig"></g><g class="s-front"></g><g>${o.labels === false ? '' : labelsOf(this.sc)}</g></svg>`;
    this.g = ['back', 'fig', 'front'].map(c => host.querySelector('.s-' + c));
    this.draw();
  }
  draw() {
    const p = frameParts(this.sc, this.u);
    this.g[0].innerHTML = p.back; this.g[1].innerHTML = p.fig; this.g[2].innerHTML = p.front;
  }
  play() {
    if (this.playing) return;
    this.playing = true; this.last = performance.now();
    const step = now => {
      if (!this.playing) return;
      this.raf = requestAnimationFrame(step);
      if (now - this.last < 28) return; // ~30 kadr/soniya: silliq ko‘rinadi, telefon quvvati kam ketadi
      this.u = (this.u + (now - this.last) * this.speed / this.sc.dur) % 1; this.last = now;
      this.draw();
    };
    this.raf = requestAnimationFrame(step);
  }
  pause() { this.playing = false; cancelAnimationFrame(this.raf); }
  toggle() { this.playing ? this.pause() : this.play(); return this.playing; }
  setSpeed(s) { this.speed = s; }
}
