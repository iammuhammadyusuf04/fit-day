'use strict';

// ---------- Oyoq va dumba trenajorlari ----------

// --- Leg Press (oyoq pressi) ---
(() => {
  const H = [88, 114], T = -48, TH = 38;
  const r = [Math.cos(rad(TH)), -Math.sin(rad(TH))], n = [Math.sin(rad(TH)), Math.cos(rad(TH))];
  const dT = [Math.sin(rad(T)), -Math.cos(rad(T))], nb = [-Math.cos(rad(T)), -Math.sin(rad(T))];
  const S0 = add(add(H, n, 26), r, -14), S1 = add(add(H, n, 26), r, 85);
  const dist = u => mix(34, 55, rep(u));
  scene('legpress', {
    dur: 3400, alt: 'Leg Press trenajorida mashq qilayotgan odam', hl: ['legs'],
    bg: R(46, 142, 150, 5, COL.frame, 2) + L2(S0, S1, COL.dark, 6) + Ln(S1[0], S1[1], S1[0] + 5, 146, COL.frame, 5) + Ln(S0[0], S0[1], S0[0] - 2, 146, COL.frame, 5)
      + L2(add(H, nb, 9), add(add(H, dT, 46), nb, 9), COL.pad, 9) + R(H[0] - 16, H[1] + 8, 36, 7, COL.pad, 3) + Ln(H[0] + 2, H[1] + 15, H[0] + 2, 143, COL.frame, 4),
    labels: [[172, 58, 'Platforma', 134, 82], [36, 76, 'Sirt tayanchi', 56, 96], [150, 148, 'Plastinalar (og‘irlik)', 124, 120]],
    back: (J, u) => {
      const c = add(H, r, dist(u) + 6);
      let s = L2(add(c, n, 20), add(c, n, -20), COL.mv, 5) + L2(add(c, n, 21), add(add(c, n, 25), r, -30), COL.dark, 4);
      for (let k = 1; k <= 3; k++) s += Disc(add(add(c, n, 27), r, -9 * k - 4), 8, COL.black, COL.plate);
      return s;
    },
    front: () => R(96, 99, 3, 11, COL.dark, 1),
    pose: u => ({ hip: H, T, hd: 10, A: { an: add(H, r, dist(u)), ft: 218, wr: [98, 105] } }),
  });
})();

// --- Leg Extension (oyoqni to‘g‘rilash) ---
scene('legext', {
  dur: 3200, alt: 'Leg Extension trenajorida mashq qilayotgan odam', hl: ['thigh'],
  bg: R(44, 142, 150, 5, COL.frame, 2) + R(80, 120, 52, 8, COL.pad, 3) + Ln(88, 118, 83, 66, COL.pad, 9) + Ln(100, 128, 100, 143, COL.frame, 5),
  labels: [[40, 40, 'Og‘irlik to‘plami', 40, 50], [62, 150, 'Sirt tayanchi', 82, 96], [165, 76, 'Rolik (boldir oldida)', 132, 108]],
  back: (J, u) => {
    const off = 12 * rep(u);
    return Stack(30, 50, 20, 74, 10, 4, off) + Ci(40, 38, 4, COL.dark) + L2([40, 50 - off], [40, 38], COL.cable, 1.4) + L2([40, 38], [126, 38], COL.cable, 1.4) + L2([126, 38], [126, 100], COL.cable, 1.4);
  },
  front: (J, u) => {
    const s = mix(8, 88, rep(u)), P = [126, 113], e = add(P, dv(s), 38);
    return L2(P, [126, 100], COL.mv, 3.5) + L2(P, e, COL.mv, 4.5) + Ci(...add(add(P, dv(s), 27), dv(s + 90), 5.5), 5, COL.padD) + Ci(P[0], P[1], 3, COL.mvD);
  },
  pose: u => {
    const s = mix(8, 88, rep(u));
    return { hip: [96, 112], T: -6, hd: 4, A: { th: 90, sh: s, ft: s + 90, wr: [106, 112] } };
  },
});

// --- Seated Leg Curl (oyoqni bukish) ---
scene('legcurl', {
  dur: 3200, alt: 'Leg Curl trenajorida mashq qilayotgan odam', hl: ['shin', 'thigh'],
  bg: R(44, 142, 150, 5, COL.frame, 2) + R(76, 120, 56, 8, COL.pad, 3) + Ln(86, 118, 78, 68, COL.pad, 9) + Ln(100, 128, 100, 143, COL.frame, 5),
  labels: [[40, 40, 'Og‘irlik to‘plami', 40, 50], [60, 150, 'Sirt tayanchi', 80, 96], [172, 78, 'Rolik (to‘piq orqasida)', 140, 112], [112, 92, 'Son tayanchi', 112, 103]],
  back: (J, u) => {
    const off = 12 * rep(u);
    return Stack(30, 50, 20, 74, 10, 4, off) + Ci(40, 38, 4, COL.dark) + L2([40, 50 - off], [40, 38], COL.cable, 1.4) + L2([40, 38], [128, 38], COL.cable, 1.4) + L2([128, 38], [128, 104], COL.cable, 1.4);
  },
  front: (J, u) => {
    const s = mix(86, -8, rep(u)), P = [126, 114], e = add(P, dv(s), 36);
    return R(100, 104, 28, 7, COL.pad, 3) + L2(P, [128, 104], COL.mv, 3.5) + L2(P, e, COL.mv, 4.5) + Ci(...add(add(P, dv(s), 26), dv(s - 90), 5.5), 5, COL.padD) + Ci(P[0], P[1], 3, COL.mvD);
  },
  pose: u => {
    const s = mix(86, -8, rep(u));
    return { hip: [94, 113], T: -10, hd: 4, A: { th: 88, sh: s, ft: s + 90, wr: [106, 110] } };
  },
});

// --- Hip Abduction / Adduction (oyoqni yon tomonga ochish / yig‘ish), old tomondan ---
function hipMachine(id, name, openStart, openEnd, padOut) {
  const hx = 120, hy = 106;
  const legs = s => {
    const o = 9 + 26 * s;
    return { A: { kn: [hx - o, hy + 9], an: [hx - o - 1.5, hy + 37] }, B: { kn: [hx + o, hy + 9], an: [hx + o + 1.5, hy + 37] } };
  };
  scene(id, {
    view: 'front', dur: 3200, alt: name, hl: ['legs'], eb: 1, ebB: -1,
    bg: R(60, 142, 120, 5, COL.frame, 2) + R(hx - 26, hy + 6, 52, 8, COL.pad, 3) + Ln(hx - 38, 143, hx - 38, 126, COL.frame, 5) + Ln(hx + 38, 143, hx + 38, 126, COL.frame, 5),
    labels: [[hx, 150, 'O‘rindiq', hx, 112], [hx + 56, 82, 'Rolik (tizza yonida)', hx + 36, 114, 'middle']],
    back: () => R(hx - 14, 54, 28, 56, COL.pad, 5),
    front: (J, u) => {
      const s = mix(openStart, openEnd, rep(u));
      const o = 9 + 26 * s;
      let g = '';
      for (const sgn of [-1, 1]) {
        const kx = hx + sgn * o, px = kx + sgn * (padOut ? 7 : -7);
        g += L2([hx + sgn * 40, 128], [px, hy + 8], COL.dark, 3.5) + R(px - 3.5, hy - 2, 7, 22, COL.mv, 3) + Ci(hx + sgn * 40, 128, 3, COL.mvD);
      }
      return g;
    },
    pose: u => {
      const s = mix(openStart, openEnd, rep(u)), lg = legs(s);
      return { hip: [hx, hy], T: 0, A: Object.assign({ wr: [hx - 24, hy + 3] }, lg.A), B: Object.assign({ wr: [hx + 24, hy + 3] }, lg.B) };
    },
  });
}
hipMachine('hipabd', 'Oyoqni yon tomonga ochish (Hip Abduction) trenajori', 0, 1, true);
hipMachine('hipadd', 'Oyoqni yig‘ish (Hip Adduction) trenajori', 1, 0, false);

// --- Seated Calf Raise (boldir) ---
scene('calf', {
  dur: 2000, alt: 'Boldir ko‘tarish trenajorida mashq qilayotgan odam', hl: ['shin'],
  bg: R(40, 142, 150, 5, COL.frame, 2) + R(64, 114, 44, 7, COL.pad, 3) + Ln(80, 121, 80, 143, COL.frame, 5) + R(106, 134, 38, 8, COL.frameD, 2) + Ln(150, 143, 150, 62, COL.frame, 6),
  labels: [[170, 56, 'Pad (tizza ustida)', 140, 96], [124, 156, 'Oyoq platformasi', 124, 141]],
  front: (J) => {
    const k = J.A.kn;
    return L2([150, 70], [k[0] + 6, k[1] - 10], COL.mv, 5) + R(k[0] - 16, k[1] - 13, 32, 8, COL.mv, 4) + Ci(150, 70, 3.5, COL.mvD);
  },
  pose: u => {
    const s = rep(u, 0.4, 0.6), ft = mix(108, 52, s), toe = [128, 139];
    const an = [toe[0] - 11 * Math.sin(rad(ft)), toe[1] - 11 * Math.cos(rad(ft))];
    return { hip: [84, 107], T: -2, A: { an, ft, wr: [106, 96] } };
  },
});

// --- Smith mashinasida squat ---
scene('smithsq', {
  dur: 3600, alt: 'Smith mashinasida squat qilayotgan odam', hl: ['legs'],
  bg: R(60, 142, 140, 5, COL.frame, 2) + Ln(112, 12, 112, 143, COL.frame, 6) + Ln(104, 62, 120, 62, COL.mvD, 2.5) + Ln(104, 108, 120, 108, COL.mvD, 2.5) + R(98, 12, 28, 6, COL.dark, 3),
  labels: [[172, 22, 'Smith mashinasi', 122, 14], [180, 66, 'Shtanga (rels bo‘ylab yuradi)', 124, 66], [180, 112, 'To‘xtatuvchi ilgak', 122, 108]],
  front: (J) => Disc([J.sh[0] - 1, J.sh[1] - 5], 9, COL.black, COL.plate),
  pose: u => {
    const s = rep(u, 0.45, 0.55), T = mix(2, 38, s), hy = mix(87.5, 117, s);
    const hip = [112 - 34 * Math.sin(rad(T)), hy];
    const sh = [112, hy - 34 * Math.cos(rad(T))];
    return { hip, T, hd: -6, A: { an: [118, 143], ft: 90, wr: [sh[0] + 2, sh[1] - 3] } };
  },
  eb: -1,
});

// --- Gantel bilan squat (goblet) ---
scene('goblet', {
  dur: 3400, alt: 'Gantel bilan squat (goblet) qilayotgan odam', hl: ['legs'],
  bg: R(40, 142, 130, 5, COL.frame, 2) + dbRack(168, 96),
  labels: [[46, 52, 'Gantel (ko‘krak oldida)', 114, 66], [196, 90, 'Gantel tokchasi', 196, 100], [86, 157, 'Oyoqlar yelka kengligida', 108, 144]],
  front: J => { const w = J.A.wr; return R(w[0] - 3.2, w[1] - 10, 6.4, 20, COL.black, 3) + Ci(w[0], w[1] - 10, 4.6, COL.black) + Ci(w[0], w[1] + 10, 4.6, COL.black); },
  pose: u => {
    const s = rep(u, 0.45, 0.55), T = mix(4, 30, s), hip = [mix(111, 91, s), mix(88.5, 113, s)];
    const sh = [hip[0] + 34 * Math.sin(rad(T)), hip[1] - 34 * Math.cos(rad(T))];
    return { hip, T, hd: -4, A: { an: [113, 143], ft: 90, wr: [sh[0] + 11, sh[1] + 13] } };
  },
});

// --- Gantel bilan rumin tortishi (Romanian deadlift) ---
scene('dbrdl', {
  dur: 3800, alt: 'Gantel bilan rumin tortishi (Romanian deadlift) bajarayotgan odam', hl: ['thigh', 'torso'],
  bg: R(40, 142, 130, 5, COL.frame, 2) + dbRack(168, 96),
  labels: [[46, 52, 'Gantellar sonlar oldida', 112, 92], [196, 90, 'Gantel tokchasi', 196, 100], [64, 150, 'Dumba orqaga suriladi', 92, 100]],
  front: J => Disc(J.A.wr, 6, COL.black, COL.mv),
  pose: u => {
    const s = rep(u, 0.5, 0.58), T = mix(0, 68, s), hip = [mix(112, 88, s), mix(87, 95, s)];
    const sh = [hip[0] + 34 * Math.sin(rad(T)), hip[1] - 34 * Math.cos(rad(T))];
    return { hip, T, hd: -mix(0, 48, s), A: { an: [116, 143], ft: 90, wr: [sh[0] + 2, sh[1] + 36] }, B: { an: [112, 143], ft: 90, wr: [sh[0] + 1, sh[1] + 36] } };
  },
});

// --- Gantel bilan lunge (qadam tashlab cho‘kish) ---
scene('dblunge', {
  dur: 3600, alt: 'Gantel bilan lunge bajarayotgan odam', hl: ['legs'],
  bg: R(40, 142, 130, 5, COL.frame, 2) + dbRack(168, 96),
  labels: [[46, 52, 'Gantellar yon tomonda', 100, 84], [196, 90, 'Gantel tokchasi', 196, 100], [66, 157, 'Orqadagi oyoq tovoni ko‘tarilgan', 88, 140]],
  front: J => Disc(J.A.wr, 6, COL.black, COL.mv),
  pose: u => {
    const s = rep(u, 0.45, 0.55), hip = [106, mix(90, 112, s)], T = 3;
    const sh = [hip[0] + 34 * Math.sin(rad(T)), hip[1] - 34 * Math.cos(rad(T))];
    return { hip, T, hd: 0, A: { an: [126, 143], ft: 90, wr: [sh[0] + 1, sh[1] + 36] }, B: { an: [86, 136], ft: 40, wr: [sh[0] - 1, sh[1] + 36] } };
  },
});

// --- Blokda dumba (oyoqni orqaga tepish, cable glute kickback) ---
scene('glutekick', {
  dur: 3200, alt: 'Blokda dumba mashqini (oyoqni orqaga tepish) bajarayotgan odam', hl: ['thigh'],
  bg: R(40, 142, 170, 5, COL.frame, 2) + Ln(180, 143, 180, 20, COL.frame, 7) + Ln(180, 70, 152, 70, COL.frame, 4) + Ci(172, 132, 4.5, COL.dark),
  labels: [[200, 12, 'Blok ustuni', 182, 20], [120, 156, 'Pastki g‘altak', 172, 135], [40, 100, 'To‘piq tasmasi', 70, 112], [100, 40, 'Tutqichdan ushlang', 150, 70]],
  back: (J, u) => {
    const off = 12 * rep(u, 0.45, 0.55), a = J.A.an;
    return Stack(190, 38, 20, 92, 12, 4, off) + L2([180, 40], [200, 38], COL.cable, 1.2) + L2(a, [172, 132], COL.cable, 1.5) + R(a[0] - 5, a[1] - 4, 10, 7, COL.mv, 3);
  },
  pose: u => {
    const s = rep(u, 0.45, 0.55), an = [mix(106, 64, s), mix(141, 111, s)];
    return { hip: [112, 89], T: 16, hd: -8, A: { an, ft: mix(90, 130, s), wr: [152, 72] }, B: { an: [114, 143], ft: 90, wr: [152, 72] } };
  },
});
