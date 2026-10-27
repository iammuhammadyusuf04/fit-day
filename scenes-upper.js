'use strict';

// ---------- Ko‘krak, orqa, yelka va qo‘l trenajorlari ----------

// --- Chest Press (ko‘krak pressi) ---
scene('chestpress', {
  dur: 3200, alt: 'Chest Press trenajorida mashq qilayotgan odam', hl: ['torso', 'uarm'],
  bg: R(40, 142, 150, 5, COL.frame, 2) + R(78, 119, 46, 8, COL.pad, 3) + Ln(100, 127, 100, 143, COL.frame, 5) + Ln(88, 118, 86, 60, COL.pad, 10),
  labels: [[40, 40, 'Og‘irlik to‘plami', 40, 52], [150, 150, 'O‘rindiq (balandligi sozlanadi)', 104, 126], [160, 70, 'Tutqich', 128, 80]],
  back: (J, u) => {
    const off = 12 * rep(u);
    return Stack(30, 54, 20, 74, 10, 4, off) + Ci(40, 40, 4, COL.dark) + L2([40, 54 - off], [40, 40], COL.cable, 1.4) + L2([40, 40], [82, 40], COL.cable, 1.4) + L2([82, 40], [82, 88], COL.cable, 1.4);
  },
  front: J => {
    const w = J.A.wr;
    return L2([82, 90], w, COL.mv, 4.5) + R(w[0] - 2, w[1] - 8, 4, 16, COL.dark, 2) + Ci(82, 90, 3, COL.mvD);
  },
  pose: u => {
    const s = rep(u, 0.42, 0.55);
    return { hip: [96, 112], T: -4, hd: 3, A: { th: 90, sh: 0, ft: 90, wr: [mix(108, 130, s), 80] } };
  },
});

// --- Pec Deck / Butterfly (ko‘krakni yig‘ish), old tomondan ---
scene('pecdeck', {
  view: 'front', dur: 3200, alt: 'Pec Deck trenajorida mashq qilayotgan odam', hl: ['torso'],
  bg: R(94, 114, 52, 8, COL.pad, 3) + Ln(120, 122, 120, 143, COL.frame, 5) + R(60, 142, 120, 5, COL.frame, 2),
  labels: [[190, 58, 'Tirsak yostiqlari', 154, 70], [60, 150, 'O‘rindiq', 96, 120]],
  back: () => R(106, 56, 28, 56, COL.pad, 5),
  front: (J, u) => {
    const e = mix(34, -6, rep(u, 0.45, 0.55));
    let g = '';
    for (const sgn of [-1, 1]) {
      const sx = 120 + sgn * 11, ex = sx + sgn * e;
      g += L2([120 + sgn * 62, 96], [ex, 72], COL.dark, 3.5) + R(ex - 4.5, 52, 9, 30, COL.mv, 4) + Ci(120 + sgn * 62, 96, 3, COL.mvD);
    }
    return g;
  },
  pose: u => {
    const e = mix(34, -6, rep(u, 0.45, 0.55)), sy = 108 - 34 + 3;
    const arm = sgn => ({ el: [120 + sgn * (11 + e), sy + 1], wr: [120 + sgn * (11 + e), sy - 18], an: [120 + sgn * 10, 143], th: sgn * 4, sh: sgn * 4 });
    const a = arm(-1), b = arm(1);
    return { hip: [120, 108], T: 0, A: { el: a.el, wr: a.wr, kn: [120 - 12, 120], an: [120 - 13, 143] }, B: { el: b.el, wr: b.wr, kn: [120 + 12, 120], an: [120 + 13, 143] } };
  },
});

// --- Dumbbell Bench Press (gantel bilan skameykada yotib press) ---
scene('dbbench', {
  dur: 3200, alt: 'Skameykada gantel bilan press qilayotgan odam', hl: ['torso', 'uarm'],
  bg: R(40, 142, 160, 5, COL.frame, 2) + R(52, 116, 112, 8, COL.pad, 4) + Ln(66, 124, 66, 143, COL.frame, 5) + Ln(150, 124, 150, 143, COL.frame, 5) + dbRack(178, 96),
  labels: [[44, 98, 'Skameyka', 62, 114], [60, 52, 'Gantellar', 78, 72], [206, 90, 'Gantel tokchasi', 206, 100]],
  front: J => Disc(J.A.wr, 6.5, COL.black, COL.plate),
  pose: u => {
    const s = rep(u, 0.42, 0.55);
    return { hip: [114, 109], T: -90, hd: 0, A: { an: [142, 141], ft: 90, wr: [mix(86, 80, s), mix(97, 72, s)] } };
  },
  eb: 1, kb: -1,
});

// --- Lat Pulldown (yuqori blok) ---
scene('latpull', {
  dur: 3400, alt: 'Lat Pulldown trenajorida mashq qilayotgan odam', hl: ['torso', 'uarm'],
  bg: R(40, 142, 170, 5, COL.frame, 2) + Ln(158, 143, 158, 12, COL.frame, 7) + Ln(112, 12, 158, 12, COL.frame, 6) + R(80, 120, 50, 8, COL.pad, 3) + Ln(104, 128, 104, 143, COL.frame, 5)
    + R(100, 101, 36, 7, COL.pad, 3) + Ln(136, 104, 148, 104, COL.frame, 4),
  labels: [[44, 24, 'Og‘irlik to‘plami', 42, 40], [184, 40, 'Yuqori blok (g‘altak)', 114, 14], [190, 112, 'Son tayanchi', 120, 103], [190, 82, 'Tortiladigan tutqich', 112, 44]],
  back: (J, u) => {
    const off = 14 * rep(u, 0.45, 0.55), w = J.A.wr;
    return Stack(30, 40, 22, 84, 10, 3, off) + Ci(112, 12, 4, COL.dark) + L2([41, 40 - off], [41, 26], COL.cable, 1.4) + L2([41, 26], [112, 12], COL.cable, 1.4) + L2([112, 12], w, COL.cable, 1.5);
  },
  front: J => { const w = J.A.wr; return L2([w[0] - 7, w[1]], [w[0] + 7, w[1]], COL.mv, 3.5) + Ci(w[0], w[1], 3.5, COL.mv); },
  pose: u => {
    const s = rep(u, 0.45, 0.55), hip = [100, 113];
    return { hip, T: -8, hd: 4, A: { th: 90, sh: 0, ft: 90, wr: [mix(108, 110, s), mix(43, 83, s)] } };
  },
});

// --- Seated Cable Row (pastki blok, gorizontal tortish) ---
scene('seatrow', {
  dur: 3400, alt: 'Seated Row trenajorida mashq qilayotgan odam', hl: ['torso', 'uarm'],
  bg: R(40, 142, 190, 5, COL.frame, 2) + R(68, 120, 54, 8, COL.pad, 3) + Ln(90, 128, 90, 143, COL.frame, 5) + R(130, 133, 30, 9, COL.frameD, 2) + Ln(166, 143, 166, 64, COL.frame, 6),
  labels: [[70, 150, 'Skameyka', 96, 124], [118, 156, 'Oyoq tayanchi', 144, 138], [200, 40, 'Og‘irlik to‘plami', 196, 52], [150, 82, 'Tutqich (V-bar)', 112, 93]],
  back: (J, u) => {
    const off = 12 * rep(u, 0.45, 0.55), w = J.A.wr;
    return Stack(186, 52, 20, 76, 10, 4, off) + Ci(172, 93, 4, COL.dark) + L2(w, [172, 93], COL.cable, 1.5) + L2([172, 93], [172, 52 - off + 6], COL.cable, 1.2);
  },
  front: J => { const w = J.A.wr; return R(w[0] - 3, w[1] - 6, 6, 12, COL.mv, 3); },
  pose: u => {
    const s = rep(u, 0.45, 0.55), T = mix(9, -11, s), hip = [92, 113];
    const sh = [hip[0] + 34 * Math.sin(rad(T)), hip[1] - 34 * Math.cos(rad(T))];
    return { hip, T, hd: -3, A: { an: [142, 131], ft: 90, wr: [mix(sh[0] + 35, sh[0] + 16, s), 93] } };
  },
});

// --- Back Extension (belni mustahkamlash, giperekstenziya) ---
scene('backext', {
  dur: 3400, alt: 'Back Extension trenajorida mashq qilayotgan odam', hl: ['torso'],
  bg: R(40, 142, 150, 5, COL.frame, 2) + L2([58, 139], [126, 97], COL.frame, 7) + Ln(100, 143, 100, 110, COL.frame, 5) + Ln(146, 143, 126, 100, COL.frame, 5),
  labels: [[48, 100, 'Oyoq rolikleri', 70, 126], [168, 92, 'Son yostig‘i', 128, 98], [182, 134, 'Qiyshiq o‘rindiq', 120, 112]],
  back: () => L2([116, 104], [134, 90], COL.pad, 9),
  front: J => Ci(J.A.an[0] - 4, J.A.an[1] - 5, 4.5, COL.padD),
  pose: u => {
    const s = rep(u, 0.45, 0.55), T = mix(125, 52, s), H = [112, 92];
    const sh = add(H, [Math.sin(rad(T)), -Math.cos(rad(T))], 34), head = add(sh, [Math.sin(rad(T)), -Math.cos(rad(T))], 12);
    return { hip: H, T, hd: -6, A: { th: -45, sh: -45, ft: 20, wr: [head[0] - 1, head[1] + 4] } };
  },
  eb: -1,
});

// --- Shoulder Press (yelka pressi) ---
scene('shpress', {
  dur: 3200, alt: 'Shoulder Press trenajorida mashq qilayotgan odam', hl: ['uarm'],
  bg: R(40, 142, 150, 5, COL.frame, 2) + R(78, 119, 46, 8, COL.pad, 3) + Ln(100, 127, 100, 143, COL.frame, 5) + Ln(88, 118, 86, 58, COL.pad, 10),
  labels: [[40, 40, 'Og‘irlik to‘plami', 40, 52], [160, 56, 'Tutqichlar', 104, 52], [150, 150, 'O‘rindiq', 104, 126]],
  back: (J, u) => {
    const off = 12 * rep(u);
    return Stack(30, 54, 20, 74, 10, 4, off) + Ci(40, 40, 4, COL.dark) + L2([40, 54 - off], [40, 40], COL.cable, 1.4) + L2([40, 40], [80, 40], COL.cable, 1.4) + L2([80, 40], [80, 60], COL.cable, 1.4);
  },
  front: J => { const w = J.A.wr; return L2([80, 62], w, COL.mv, 4.5) + R(w[0] - 7, w[1] - 2, 14, 4, COL.dark, 2) + Ci(80, 62, 3, COL.mvD); },
  pose: u => {
    const s = rep(u, 0.45, 0.55);
    return { hip: [96, 112], T: -4, hd: 3, A: { th: 90, sh: 0, ft: 90, wr: [mix(108, 100, s), mix(72, 41, s)] } };
  },
});

// --- Dumbbell Lateral Raise (gantel bilan yon tomonga ko‘tarish), old tomondan ---
scene('latraise', {
  view: 'front', dur: 3000, alt: 'Gantel bilan qo‘llarni yon tomonga ko‘tarayotgan odam', hl: ['arms'],
  bg: R(40, 142, 134, 5, COL.frame, 2) + dbRack(182, 96),
  labels: [[40, 52, 'Gantellar', 70, 68], [212, 90, 'Gantel tokchasi', 212, 100], [120, 24, 'Tirsaklar sal bukik', 70, 70]],
  front: J => Disc(J.A.wr, 5.5, COL.black, COL.mv) + Disc(J.B.wr, 5.5, COL.black, COL.mv),
  pose: u => {
    const s = rep(u, 0.45, 0.55), a = mix(7, 86, s);
    return { hip: [120, 87], T: 0, A: { ua: -a, fa: -a * 0.86, th: -7, sh: -7 }, B: { ua: a, fa: a * 0.86, th: 7, sh: 7 } };
  },
});

// --- Cable Triceps Pushdown (blokda triceps) ---
scene('tripush', {
  dur: 2800, alt: 'Blokda triceps mashqini bajarayotgan odam', hl: ['uarm', 'farm'],
  bg: R(60, 142, 150, 5, COL.frame, 2) + Ln(168, 143, 168, 10, COL.frame, 8) + Ln(168, 14, 138, 14, COL.frame, 5) + Ci(138, 14, 4.5, COL.dark),
  labels: [[200, 8, 'Yuqori blok', 140, 14], [50, 56, 'Tirsaklar tanaga', 94, 72], [60, 100, 'Tutqich (arqon/bar)', 106, 84]],
  back: (J, u) => {
    const off = 14 * rep(u, 0.45, 0.55), w = J.A.wr;
    return Stack(184, 32, 20, 90, 12, 5, off) + L2([168, 14], [194, 14], COL.cable, 1.3) + L2([194, 14], [194, 32 - off], COL.cable, 1.3) + L2([138, 14], w, COL.cable, 1.5);
  },
  front: J => { const w = J.A.wr; return L2([w[0] - 7, w[1]], [w[0] + 7, w[1]], COL.mv, 3.5) + Ci(w[0], w[1], 3.5, COL.mv); },
  pose: u => {
    const s = rep(u, 0.45, 0.55), fa = mix(102, 4, s);
    return { hip: [94, 87], T: 6, hd: -2, A: { ua: 5, fa, an: [102, 143], ft: 90 }, B: { ua: 5, fa, an: [86, 143], ft: 90 } };
  },
});

// --- Dumbbell Biceps Curl (gantel bilan biceps) ---
scene('bicurl', {
  dur: 2800, alt: 'Gantel bilan biceps mashqini bajarayotgan odam', hl: ['uarm'],
  bg: R(40, 142, 130, 5, COL.frame, 2) + dbRack(168, 96),
  labels: [[50, 48, 'Gantel', 108, 62], [50, 66, 'Tirsak joyida', 92, 74], [196, 90, 'Gantel tokchasi', 196, 100]],
  front: J => Disc(J.A.wr, 5.5, COL.black, COL.mv),
  pose: u => {
    const s = rep(u, 0.42, 0.55);
    return { hip: [100, 87], T: 0, hd: 0, A: { ua: 3, fa: mix(0, 152, s), an: [104, 143], ft: 90 }, B: { ua: 3, fa: mix(0, 152, s), an: [98, 143], ft: 90 } };
  },
});

// --- Yordamchi turnik trenajori (Assisted Pull-up) ---
scene('assistpull', {
  dur: 3800, alt: 'Yordamchi turnik trenajorida tortilayotgan odam', hl: ['torso', 'uarm'],
  bg: R(30, 142, 180, 5, COL.frame, 2) + Ln(150, 143, 150, 14, COL.frame, 7) + Ln(128, 30, 150, 30, COL.frame, 4) + Ln(92, 143, 92, 44, COL.frame, 5),
  labels: [[40, 24, 'Yordam og‘irligi', 42, 40], [176, 24, 'Tutqich', 130, 30], [182, 118, 'Tizza platformasi', 146, 112], [176, 64, 'Platforma yuqoriga ko‘tariladi', 150, 90]],
  back: (J, u) => {
    const s = rep(u, 0.45, 0.58), off = 14 * (1 - s), k = J.A.kn;
    return Stack(30, 44, 22, 86, 12, 4, off) + Ci(41, 28, 4, COL.dark) + L2([41, 44 - off], [41, 28], COL.cable, 1.4) + L2([41, 28], [92, 28], COL.cable, 1.4) + L2([92, 28], [92, k[1] + 4], COL.cable, 1.4)
      + R(88, k[1] + 3, 66, 6, COL.pad, 3);
  },
  front: () => Ci(128, 30, 4, COL.mv),
  pose: u => {
    const s = rep(u, 0.45, 0.58), hip = [mix(126, 124, s), mix(102, 78, s)], T = mix(-4, 6, s);
    return { hip, T, hd: -4, A: { th: 0, sh: -90, ft: -90, wr: [128, 30] }, B: { th: 2, sh: -90, ft: -90, wr: [127, 30] } };
  },
  eb: -1,
});
