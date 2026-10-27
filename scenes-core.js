'use strict';

// ---------- Qorin mashqlari va gilam (mat) mashqlari ----------

// --- Ab Crunch trenajori (qorin mashinasi) ---
scene('abmach', {
  dur: 3000, alt: 'Qorin trenajorida mashq qilayotgan odam', hl: ['torso'],
  bg: R(40, 142, 150, 5, COL.frame, 2) + R(80, 119, 46, 8, COL.pad, 3) + Ln(102, 127, 102, 143, COL.frame, 5) + Ln(86, 118, 82, 74, COL.pad, 9)
    + Ci(133, 136, 5, COL.padD) + Ci(133, 136, 2, COL.pad) + Ln(133, 141, 133, 143, COL.frame, 4),
  labels: [[40, 40, 'Og‘irlik to‘plami', 40, 52], [176, 76, 'Ko‘krak yostig‘i', 118, 86], [176, 128, 'Oyoq rolikleri', 138, 136]],
  back: (J, u) => {
    const off = 12 * rep(u), T = mix(-4, 34, rep(u, 0.45, 0.55)), dT = [Math.sin(rad(T)), -Math.cos(rad(T))];
    const c = add(add(J.hip, dT, 25), [Math.cos(rad(T)), Math.sin(rad(T))], 9);
    return Stack(30, 54, 20, 74, 10, 4, off) + Ci(40, 40, 4, COL.dark) + L2([40, 54 - off], [40, 40], COL.cable, 1.4) + L2([40, 40], [76, 40], COL.cable, 1.4) + L2([76, 40], [76, 108], COL.cable, 1.4)
      + L2([76, 110], c, COL.mv, 4);
  },
  front: (J, u) => {
    const T = mix(-4, 34, rep(u, 0.45, 0.55)), dT = [Math.sin(rad(T)), -Math.cos(rad(T))], c = add(add(J.hip, dT, 25), [Math.cos(rad(T)), Math.sin(rad(T))], 9);
    return L2(add(c, dT, -9), add(c, dT, 9), COL.mv, 7) + Ci(76, 110, 3, COL.mvD);
  },
  pose: u => {
    const T = mix(-4, 34, rep(u, 0.45, 0.55)), hip = [98, 113], dT = [Math.sin(rad(T)), -Math.cos(rad(T))];
    const c = add(add(hip, dT, 25), [Math.cos(rad(T)), Math.sin(rad(T))], 9);
    return { hip, T, hd: 6, A: { th: 90, sh: 0, ft: 90, wr: add(c, dT, -9) } };
  },
});

// --- Captain's Chair (vertikal stul: oyoqni ko‘tarish) ---
scene('legraise', {
  dur: 3200, alt: 'Vertikal stulda oyoq ko‘tarayotgan odam', hl: ['thigh', 'torso'],
  bg: R(50, 142, 80, 5, COL.frame, 2) + Ln(78, 143, 78, 18, COL.frame, 6) + Ln(87, 24, 87, 106, COL.pad, 10) + R(94, 76, 30, 7, COL.pad, 3) + Ln(124, 66, 124, 84, COL.dark, 4),
  labels: [[44, 34, 'Sirt tayanchi', 82, 50], [164, 76, 'Tirsak yostiqlari', 108, 78], [158, 66, 'Tutqich', 124, 70]],
  pose: u => {
    const s = rep(u, 0.45, 0.58);
    return { hip: [92, 88], T: 0, hd: 0, A: { ua: 5, fa: 96, th: mix(2, 100, s), sh: mix(0, 14, s), ft: 90 }, B: { ua: 5, fa: 96, th: mix(-2, 94, s), sh: mix(-3, 8, s), ft: 90 } };
  },
});

// --- Plank (gilam ustida) ---
scene('plankmat', {
  dur: 4000, alt: 'Gilam ustida plank holatida turgan odam', hl: ['torso'],
  bg: R(52, 139, 150, 7, COL.mat, 3),
  labels: [[60, 100, 'Tirsaklar yelka ostida', 80, 118], [176, 100, 'Tana — bir to‘g‘ri chiziq', 130, 126, 'middle'], [118, 158, 'Yoga gilami (mat)', 118, 144]],
  pose: u => {
    const ph = Math.sin(TAU * u) * 2.2, sh = [80, 123];
    const phi = rad(12.4 + ph), hip = [sh[0] + 34 * Math.cos(phi), sh[1] + 34 * Math.sin(phi)];
    return { hip, T: -(90 - (12.4 + ph)), hd: 8, A: { wr: [100, 143], an: [166, 143], ft: 35 } };
  },
});

// --- Crunch (qorin buklash, gilamda) ---
scene('crunchmat', {
  dur: 3000, alt: 'Gilamda qorin buklash mashqini bajarayotgan odam', hl: ['torso'],
  bg: R(48, 139, 160, 7, COL.mat, 3),
  labels: [[62, 100, 'Qo‘llar bosh orqasida', 86, 122], [172, 100, 'Oyoqlar bukilgan', 150, 125]],
  pose: u => {
    const s = rep(u, 0.45, 0.55), T = mix(-90, -64, s), hip = [124, 133];
    const sh = add(hip, [Math.sin(rad(T)), -Math.cos(rad(T))], 34), head = add(sh, [Math.sin(rad(T + 14 * s)), -Math.cos(rad(T + 14 * s))], 12);
    return { hip, T, hd: 14 * s, A: { an: [154, 139], ft: 90, wr: [head[0] - 1, head[1] - 4] } };
  },
  eb: -1,
});
