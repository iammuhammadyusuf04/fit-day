'use strict';

// ---------- Kardio trenajorlar ----------

// --- Yugurish yo‘lagi (yon tomondan) ---
function treadmillBG(slope) {
  const x0 = 26, x1 = 188, yT = 137;
  const yAt = x => yT - (x - x0) * slope;
  const y1 = yAt(x1), cx = x1 - 4;
  let s = '';
  s += Ln(x1 - 16, y1 + 6, x1 - 16, FLOOR, COL.frame, 5) + Ln(x0 + 18, yT + 6, x0 + 18, FLOOR, COL.frame, 5);
  s += Poly([[x0, yT], [x1, y1], [x1, y1 + 9], [x0, yT + 9]], COL.black);
  s += Ci(x0 + 3, yT + 4.5, 4.5, COL.dark) + Ci(x1 - 3, y1 + 4.5, 4.5, COL.dark);
  s += Ln(cx, y1 + 2, cx + 8, y1 - 72, COL.frame, 5);
  s += R(cx - 6, y1 - 92, 42, 24, COL.dark, 4) + R(cx - 1, y1 - 87, 32, 12, COL.screen, 2);
  s += Ci(cx + 6, y1 - 71, 1.4, '#cbd5e1') + Ci(cx + 12, y1 - 71, 1.4, '#cbd5e1') + Ci(cx + 18, y1 - 71, 1.4, '#cbd5e1');
  const ry = y1 - 56, rx = cx - 52;
  s += Ln(cx + 5, ry, rx, ry + 6, COL.frame, 4) + Ln(rx, ry + 6, rx, yAt(rx), COL.frame, 3);
  return { svg: s, yAt, y1, cx, rx, ry };
}

function treadmillScene(id, o) {
  const m = treadmillBG(o.slope);
  const per = o.period, x0 = 26, x1 = 188;
  scene(id, Object.assign({
    bg: m.svg,
    labels: [
      [m.cx + 16, m.y1 - 98, 'Ekran', m.cx + 16, m.y1 - 88], [m.cx - 22, m.ry - 18, 'Tutqich', m.cx - 22, m.ry + 3],
      [88, 156, 'Tasma (orqaga yuradi)', 88, 143],
    ],
    back: (J, u) => Ln(x0 + 8, m.yAt(x0 + 8) + 1.8, x1 - 8, m.yAt(x1 - 8) + 1.8, '#94a3b8', 1.6,
      `stroke-dasharray="${f1(per * 0.45)} ${f1(per * 0.55)}" stroke-dashoffset="${f1(u * o.cycle)}"`),
    hl: ['legs'],
  }, o.extra, { pose: o.pose(m.yAt) }));
}

treadmillScene('tread_walk', {
  slope: 0, period: 16, cycle: 64, extra: { dur: 1300, alt: 'Yugurish yo‘lagida yurayotgan odam' },
  pose: yAt => u => {
    const hx = 106, S = 16, G = x => yAt(x) - 3;
    const foot = ph => ph < 0.5
      ? { x: hx + S - 2 * S * (ph / 0.5), lift: 0 }
      : { x: hx - S + 2 * S * ((ph - 0.5) / 0.5), lift: 8 * Math.sin(Math.PI * (ph - 0.5) / 0.5) };
    const a = foot(u), b = foot((u + 0.5) % 1), c = Math.cos(TAU * u);
    return {
      hip: [hx, G(hx) - 53 - 2.5 * Math.pow(Math.sin(TAU * u), 2)], T: 3,
      A: { an: [a.x, G(a.x) - a.lift], ft: 85 + 22 * Math.cos(TAU * u), ua: -22 * c, fa: -22 * c + 32 },
      B: { an: [b.x, G(b.x) - b.lift], ft: 85 - 22 * Math.cos(TAU * u), ua: 22 * c, fa: 22 * c + 32 },
    };
  },
});

treadmillScene('tread_incline', {
  slope: 0.13, period: 16, cycle: 64, extra: { dur: 1400, alt: 'Yugurish yo‘lagida qiyalikda yurayotgan odam' },
  pose: yAt => u => {
    const hx = 104, S = 15, G = x => yAt(x) - 3;
    const foot = ph => ph < 0.5
      ? { x: hx + S - 2 * S * (ph / 0.5), lift: 0 }
      : { x: hx - S + 2 * S * ((ph - 0.5) / 0.5), lift: 9 * Math.sin(Math.PI * (ph - 0.5) / 0.5) };
    const a = foot(u), b = foot((u + 0.5) % 1), c = Math.cos(TAU * u);
    return {
      hip: [hx, G(hx) - 52 - 2.5 * Math.pow(Math.sin(TAU * u), 2)], T: 10,
      A: { an: [a.x, G(a.x) - a.lift], ft: 82 + 22 * Math.cos(TAU * u), ua: -22 * c, fa: -22 * c + 35 },
      B: { an: [b.x, G(b.x) - b.lift], ft: 82 - 22 * Math.cos(TAU * u), ua: 22 * c, fa: 22 * c + 35 },
    };
  },
});

treadmillScene('tread_run', {
  slope: 0, period: 14, cycle: 84, extra: { dur: 800, alt: 'Yugurish yo‘lagida yengil yugurayotgan odam' },
  pose: yAt => u => {
    const hx = 104, G = x => yAt(x) - 3, F = 13.2, B0 = F - 33.6, f = 0.4;
    const foot = ph => ph < f
      ? { x: hx + F - 33.6 * (ph / f), lift: 0 }
      : { x: hx + B0 + (F - B0) * seg(ph, f, 1), lift: 17 * Math.pow(Math.sin(Math.PI * (ph - f) / (1 - f)), 0.9) };
    const a = foot(u), b = foot((u + 0.5) % 1), c = Math.cos(TAU * u);
    return {
      hip: [hx, G(hx) - 52 + 3 * Math.cos(2 * TAU * (u - 0.2)) * -1 - 0], T: 9,
      A: { an: [a.x, G(a.x) - a.lift], ft: 80 + 20 * Math.cos(TAU * u), ua: -38 * c, fa: -38 * c + 85 },
      B: { an: [b.x, G(b.x) - b.lift], ft: 80 - 20 * Math.cos(TAU * u), ua: 38 * c, fa: 38 * c + 85 },
    };
  },
});

// --- Ellips trenajor (orbitrek) ---
const ELL = { hx: 128, hy: 78, P: [152, 46], fr: 0.3 };
scene('elliptical', {
  dur: 2400, alt: 'Ellips trenajorda mashq qilayotgan odam',
  hl: ['legs'],
  bg: R(30, 142, 172, 5, COL.frame, 2) + Ci(58, 122, 22, COL.frame) + Ci(58, 122, 15, COL.frameD) + Ci(58, 122, 4, '#cbd5e1')
    + Ln(184, 142, 156, 50, COL.frame, 6) + R(146, 27, 40, 20, COL.dark, 4) + R(151, 31, 30, 11, COL.screen, 2),
  labels: [[58, 99, 'Gildirak', 58, 106], [172, 22, 'Ekran', 168, 31], [206, 84, 'Tutqich', 160, 66, 'middle'], [96, 150, 'Pedal', 112, 135, 'middle']],
  pose: u => {
    const th = TAU * u, hx = ELL.hx;
    const A = [hx - 2 + 13 * Math.cos(th), 127 + 4 * Math.sin(th)], B = [hx - 2 + 13 * Math.cos(th + Math.PI), 127 + 4 * Math.sin(th + Math.PI)];
    const P = ELL.P, grip = an => { const F = [an[0] + 14, an[1] + 5]; return [P[0] + (F[0] - P[0]) * ELL.fr, P[1] + (F[1] - P[1]) * ELL.fr]; };
    return { hip: [hx, ELL.hy], T: 3, A: { an: A, ft: 90, wr: grip(A) }, B: { an: B, ft: 90, wr: grip(B) } };
  },
  back: J => {
    const P = ELL.P, a = J.B.an, F = [a[0] + 14, a[1] + 5];
    return Ln(58, 122, a[0] - 14, a[1] + 5, COL.frameD, 4) + R(a[0] - 14, a[1] + 3.2, 30, 4.2, COL.plateD, 2)
      + L2(P, [P[0] + (F[0] - P[0]) * 0.62, P[1] + (F[1] - P[1]) * 0.62], '#c28a1a', 4.5);
  },
  front: J => {
    const P = ELL.P, a = J.A.an, F = [a[0] + 14, a[1] + 5];
    return Ln(58, 122, a[0] - 14, a[1] + 5, COL.dark, 4) + R(a[0] - 14, a[1] + 3.2, 30, 4.2, COL.black, 2)
      + L2(P, [P[0] + (F[0] - P[0]) * 0.62, P[1] + (F[1] - P[1]) * 0.62], COL.mv, 5);
  },
});

// --- Velotrenajor (stasionar velosiped) ---
scene('velo', {
  dur: 1800, alt: 'Velotrenajorda mashq qilayotgan odam',
  hl: ['legs'],
  bg: Ln(64, 144, 160, 144, COL.frame, 5) + Ln(84, 144, 110, 122, COL.frame, 5) + Ln(148, 144, 150, 124, COL.frame, 5)
    + Ci(150, 124, 17, '#dbe4ef', `stroke="${COL.frameD}" stroke-width="3"`) + Ci(150, 124, 5, COL.frameD)
    + Ln(110, 122, 93, 90, COL.frame, 5) + Ln(110, 122, 146, 78, COL.frame, 5) + Ln(150, 124, 147, 78, COL.frame, 5)
    + Ln(146, 78, 149, 68, COL.frame, 4) + Ln(142, 68, 158, 68, COL.dark, 4)
    + R(80, 82, 24, 6, COL.black, 3) + Ln(93, 88, 93, 92, COL.frame, 4) + Ci(110, 122, 4, COL.dark),
  labels: [[98, 74, 'O‘rindiq', 92, 82], [172, 62, 'Rul', 158, 68, 'start'], [186, 112, 'Gildirak', 160, 120, 'start']],
  pose: u => {
    const th = TAU * u, C = [110, 122], r = 14;
    const pa = [C[0] + r * Math.cos(th), C[1] + r * Math.sin(th)], pb = [C[0] - r * Math.cos(th), C[1] - r * Math.sin(th)];
    const foot = p => [p[0] - 3, p[1] - 4];
    return { hip: [93, 84], T: 36, A: { an: foot(pa), ft: 88 + 8 * Math.sin(th), wr: [147, 71] }, B: { an: foot(pb), ft: 88 - 8 * Math.sin(th) } };
  },
  back: (J, u) => {
    const th = TAU * u, C = [110, 122], r = 14, pb = [C[0] - r * Math.cos(th), C[1] - r * Math.sin(th)];
    return L2(C, pb, COL.dark, 3.5) + R(pb[0] - 6, pb[1] - 1.5, 12, 3.4, COL.plateD, 1.5);
  },
  front: (J, u) => {
    const th = TAU * u, C = [110, 122], r = 14, pa = [C[0] + r * Math.cos(th), C[1] + r * Math.sin(th)];
    return L2(C, pa, COL.black, 3.5) + R(pa[0] - 6, pa[1] - 1.5, 12, 3.4, COL.mv, 1.5) + Ci(110, 122, 3, COL.mvD);
  },
});

// --- Eshkak trenajori ---
const rowY = x => 134 - (x - 24) * 0.0395;
scene('rower', {
  dur: 3600, alt: 'Eshkak trenajorida mashq qilayotgan odam', hl: ['legs', 'torso'],
  bg: Ln(24, 134, 190, 127.5, COL.frame, 5) + Ln(64, 146, 64, 134, COL.frame, 4) + Ln(176, 146, 176, 128, COL.frame, 5)
    + Ci(208, 102, 25, '#dbe4ef', `stroke="${COL.frameD}" stroke-width="4"`) + Ci(208, 102, 12, COL.frameD) + Ci(208, 102, 4, '#cbd5e1')
    + R(196, 118, 24, 28, COL.frameD, 4) + R(176, 96, 14, 6, COL.dark, 3),
  labels: [[208, 70, 'Gildirak', 208, 78], [40, 124, 'Surilma o‘rindiq yo‘li', 80, 131], [162, 98, 'Oyoq', 160, 112, 'end'], [162, 106, 'tayanchi', 160, 112, 'end']],
  pose: u => {
    const legs = u < 0.5 ? seg(u, 0, 0.22) : 1 - seg(u, 0.7, 0.98);
    const torso = u < 0.5 ? seg(u, 0.1, 0.32) : 1 - seg(u, 0.58, 0.78);
    const arms = u < 0.5 ? seg(u, 0.28, 0.42) : 1 - seg(u, 0.5, 0.6);
    const xs = mix(136, 105, legs), hip = [xs, rowY(xs) - 17], T = mix(38, -20, torso);
    const shx = hip[0] + 34 * Math.sin(rad(T)), shy = hip[1] - 34 * Math.cos(rad(T));
    const wrCatch = [shx + 36, shy + 8], wrFin = [shx + 17, shy + 12];
    return { hip, T, hd: -8, A: { an: [159, 119], ft: 135, wr: [mix(wrCatch[0], wrFin[0], arms), mix(wrCatch[1], wrFin[1], arms)] } };
  },
  back: J => {
    const xs = J.hip[0], y = rowY(xs);
    return R(xs - 14, y - 9, 28, 5, COL.black, 3) + Ci(xs - 8, y - 1.5, 3, COL.dark) + Ci(xs + 8, y - 1.5, 3, COL.dark);
  },
  front: J => {
    const w = J.A.wr, an = J.A.an, d = dv(135);
    const plate = L2(add(an, [2.8, 2.8], 1), add(add(an, [2.8, 2.8], 1), d, 17), COL.dark, 4) + L2(add(an, [2.8, 2.8], 1), add(add(an, [2.8, 2.8], 1), d, -10), COL.dark, 4);
    return plate + Ln(w[0], w[1], 196, 100, COL.cable, 1.3) + R(w[0] - 2, w[1] - 3, 4, 9, COL.mv, 2);
  },
});

// --- Zinapoya trenajori (stepper): pedallar navbat bilan pastga-yuqoriga ---
const stairTop = (u, k) => 121 + 9 * Math.sin(TAU * u + (k ? Math.PI : 0));
scene('stairs', {
  dur: 2000, alt: 'Zinapoya trenajorida chiqayotgan odam', hl: ['legs'],
  bg: R(58, 118, 108, 28, COL.frame, 6) + R(88, 100, 56, 40, '#dbe4ef', 6, `stroke="${COL.frameD}" stroke-width="2"`)
    + Ln(178, 142, 176, 54, COL.frame, 6) + R(160, 36, 40, 20, COL.dark, 4) + R(165, 40, 30, 10, COL.screen, 2)
    + Ln(176, 66, 138, 62, COL.frame, 4) + Ln(138, 62, 136, 68, COL.frame, 3),
  labels: [[184, 28, 'Ekran', 182, 38], [118, 156, 'Pedallar (navbat bilan botadi)', 112, 138], [152, 80, 'Tutqich', 152, 65]],
  pose: u => ({
    hip: [112, 72], T: 6,
    A: { an: [111, stairTop(u, 0) - 3], ft: 90, wr: [138, 63] },
    B: { an: [107, stairTop(u, 1) - 3], ft: 90, wr: [138, 63] },
  }),
  back: (J, u) => R(90, stairTop(u, 1), 34, 6, '#c9a14a', 2.5),
  front: (J, u) => R(94, stairTop(u, 0), 34, 6, COL.mv, 2.5),
});
