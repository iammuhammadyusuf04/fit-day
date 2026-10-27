'use strict';

// ---------- Cho‘zilish (gilam yoki bo‘sh joyda) ----------

// --- Son oldi (kvadritseps) cho‘zilishi ---
scene('st_quad', {
  dur: 3600, alt: 'Son oldi mushagini cho‘zayotgan odam', hl: ['thigh'],
  bg: R(70, 142, 120, 5, COL.frame, 2) + Ln(150, 143, 150, 20, COL.frame, 6) + Ln(142, 60, 150, 60, COL.frame, 4),
  labels: [[184, 48, 'Devor/tayanch', 152, 60], [66, 74, 'Tovonni dumbaga torting', 96, 92]],
  pose: u => {
    const s = rep(u, 0.4, 0.7);
    const hip = [112, 88];
    return { hip, T: mix(0, 3, s), hd: 0, A: { an: [mix(98, 96, s), mix(88, 89, s)], wr: [mix(98, 96, s) - 0.5, mix(88, 89, s) - 0.5], ft: 200 }, B: { an: [112, 143], ft: 90, ua: 22, fa: 40 } };
  },
});

// --- Oyoq orqasi (hamstring) cho‘zilishi ---
scene('st_ham', {
  dur: 4000, alt: 'Polda o‘tirib oyoq orqasini cho‘zayotgan odam', hl: ['thigh', 'shin'],
  bg: R(40, 139, 170, 7, COL.mat, 3),
  labels: [[60, 110, 'Orqa to‘g‘ri', 94, 128], [178, 110, 'Oyoqlar to‘g‘ri', 150, 135]],
  pose: u => {
    const s = rep(u, 0.5, 0.7), T = mix(40, 62, s), hip = [92, 132];
    const sh = add(hip, [Math.sin(rad(T)), -Math.cos(rad(T))], 34);
    return { hip, T, hd: -4, A: { th: 90, sh: 90, ft: 170, wr: [Math.min(sh[0] + 30, 152), Math.min(sh[1] + 20, 134)] } };
  },
  eb: 1,
});

// --- Ko‘krak (eshik oralig‘ida) cho‘zilishi ---
scene('st_chest', {
  dur: 3600, alt: 'Eshik oralig‘ida ko‘krakni cho‘zayotgan odam', hl: ['torso', 'uarm'],
  bg: R(50, 142, 150, 5, COL.frame, 2) + R(134, 14, 10, 130, COL.frame, 3) + R(144, 14, 3, 130, COL.frameD, 1),
  labels: [[176, 44, 'Eshik tavaqasi', 144, 56], [60, 60, 'Tirsak 90°, bilak tayanchda', 118, 54], [80, 150, 'Bir oyoq oldinda', 108, 143]],
  pose: u => {
    const s = rep(u, 0.45, 0.7), T = mix(2, 10, s), hip = [mix(112, 114, s), 90];
    return { hip, T, hd: 4, A: { wr: [133, 39], an: [mix(122, 124, s), 143], ft: 90 }, B: { wr: [133, 39], an: [94, 143], ft: 70 } };
  },
  eb: 1,
});

// --- Bola holati (child pose) ---
scene('st_child', {
  dur: 4200, alt: 'Bola holatida cho‘zilayotgan odam', hl: ['torso'],
  bg: R(40, 139, 170, 7, COL.mat, 3),
  labels: [[70, 108, 'Dumba tovonlarda', 96, 126], [176, 108, 'Qo‘llar oldinga', 150, 134]],
  pose: u => {
    const s = rep(u, 0.5, 0.7), T = mix(82, 96, s), hip = [86, 127];
    return { hip, T, hd: 40, A: { an: [81, 140], ft: -90, wr: [mix(148, 154, s), 139] } };
  },
  eb: 1,
});
