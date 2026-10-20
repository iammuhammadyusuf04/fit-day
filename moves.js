'use strict';

// Mashqlar kutubxonasi: `how` — qanday bajariladi, `easy`/`hard` — yengil/qiyin variant.
// Kardio mashqlarida `cue` — qisqa eslatma, `low` — sakramasdan bajariladigan variant (profildan yoqiladi).
const MOVES = {
  warm: {
    name: 'Qizish',
    how: [
      '1 daqiqa joyida yuring, qo‘llarni erkin silkiting.',
      '1 daqiqa qo‘llarni katta doira qilib aylantiring: oldinga, keyin orqaga.',
      '1 daqiqa tizzalarni navbat bilan belgacha ko‘tarib, sekin yuring.',
    ],
    easy: 'Sekinroq tempda bajaring, kerak bo‘lsa nafasni rostlab oling.',
  },
  cool: {
    name: 'Cho‘zilish',
    how: [
      'Har bir cho‘zilishni 30–45 soniya ushlab turing, nafasni ushlamang.',
      'Son oldi: tik turib, bir oyoqni orqaga bukib, tovonni dumbaga torting.',
      'Oyoq orqasi: oldinga engashib, qo‘llar bilan oyoq uchiga cho‘zing.',
      'Yelka: bir qo‘lni ko‘krak oldidan ikkinchi qo‘l bilan o‘zingizga torting.',
    ],
    easy: 'Og‘riq emas, yengil tortilish sezilsin.',
  },

  // --- Kuch mashqlari (A va B kunlari) ---
  squat: {
    name: 'Stulga o‘tirib-turish (squat)',
    how: [
      'Stul oldida, oyoqlar yelka kengligida turing.',
      'Dumbani orqaga surib, stulga o‘tirgandek pastga tushing.',
      'Tovonlarga tayanib turing. Orqa to‘g‘ri, ko‘krak ochiq.',
    ],
    easy: 'Stulga to‘liq o‘tirib, qo‘l bilan yordam bering.',
    hard: 'Stulsiz, chuqurroq cho‘kib bajaring.',
  },
  pushwall: {
    name: 'Devordan turtib-itarilish',
    how: [
      'Devordan bir qadam narida turib, qo‘llarni yelka kengligida devorga tirang.',
      'Tirsaklarni bukib, ko‘krakni devorga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, orqaga itaring. Tana bir chiziqda qolsin.',
    ],
    easy: 'Devorga yaqinroq turing.',
    hard: 'Stol yoki divan chetidan, keyin polga o‘ting.',
  },
  bridge: {
    name: 'Dumba ko‘tarish (glute bridge)',
    how: [
      'Orqangiz bilan yoting: tizzalar bukilgan, tovonlar dumbaga yaqin.',
      'Dumbani ko‘tarib, yelkadan tizzagacha to‘g‘ri chiziq hosil qiling.',
      'Yuqorida 1 soniya ushlab, sekin tushing.',
    ],
    easy: 'Ko‘tarish balandligini kamaytiring.',
    hard: 'Bitta oyoqda bajaring.',
  },
  plank: {
    name: 'Plank (tirsakda)',
    how: [
      'Tirsaklarni yelka ostiga qo‘ying, oyoq uchlari polda.',
      'Tanani boshdan tovongacha to‘g‘ri chiziqda ushlang.',
      'Qorinni tortib, dumbani ko‘tarmay va tushirmay, nafas oling.',
    ],
    easy: 'Tizzada turib bajaring.',
    hard: 'Vaqtni 10 soniyaga oshiring.',
  },
  lunge: {
    name: 'Oldinga qadam tashlab cho‘kish (lunge)',
    how: [
      'Tik turing va bir oyoq bilan katta qadam oldinga tashlang.',
      'Ikkala tizza taxminan 90° bo‘lguncha pastga tushing.',
      'Oldingi oyoq tovoni bilan itarilib, boshlang‘ich holatga qayting.',
    ],
    easy: 'Devorga yoki stulga suyaning, qadamni kichikroq qiling.',
    hard: 'Qo‘lingizda yuk (suv shishasi) ushlang.',
  },
  pushinc: {
    name: 'Stol/divan chetidan turtib-itarilish',
    how: [
      'Qo‘llarni mustahkam stol yoki divan chetiga yelka kengligida qo‘ying.',
      'Tanani boshdan tovongacha to‘g‘ri ushlab, ko‘krakni chetga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Balandroq joydan (devordan) bajaring.',
    hard: 'Pastroq joydan, keyin polda bajaring.',
  },
  superman: {
    name: 'Superman (qorin bilan yotib)',
    how: [
      'Qorin bilan yoting, qo‘llar oldinga cho‘zilgan.',
      'Qo‘l va oyoqlarni bir vaqtda polda 10–15 sm ko‘taring.',
      '1–2 soniya ushlab, sekin tushiring.',
    ],
    easy: 'Faqat qo‘llarni yoki faqat oyoqlarni ko‘taring.',
    hard: 'Tepada 3–5 soniya ushlab turing.',
  },
  bike: {
    name: 'Velosiped (qorin mushaklari)',
    how: [
      'Orqangiz bilan yoting, qo‘llar boshning orqasida, oyoqlar poldan ko‘tarilgan.',
      'Chap tirsakni o‘ng tizzaga yaqinlashtiring, o‘ng oyoq cho‘ziladi.',
      'Navbat bilan almashtiring. Bo‘yinni qo‘l bilan tortmang.',
    ],
    easy: 'Oyoqlarni polga yaqinroq tutib, sekin bajaring.',
    hard: 'Tezlikni oshiring.',
  },
  stepup: {
    name: 'Zinapoyaga chiqish-tushish',
    how: [
      'Past zinapoya yoki mustahkam stul oldida turing.',
      'Bir oyoq bilan chiqing, ikkinchisini yoniga qo‘ying.',
      'Pastga tushing. Har safar oyoqni almashtiring.',
    ],
    easy: 'Pastroq pog‘onadan foydalaning, qo‘l bilan tayaning.',
    hard: 'Yuqoriga chiqishda tizzani baland ko‘taring.',
  },
  walk: {
    name: 'Tez yurish',
    how: [
      'Yelkalar bo‘sh, qo‘llar tirsakdan bukilgan va erkin silkinadi.',
      'Tezlik: gaplasha olasiz, lekin qo‘shiq aytib bo‘lmaydi.',
      'Qadamlarni uzun va tez tashlang, tik yuring.',
    ],
    easy: 'Tezlikni kamaytiring yoki vaqtni 5 daqiqaga qisqartiring.',
    hard: 'Har 5 daqiqada 1 daqiqa juda tez yuring (interval) yoki qiyalikdan chiqing.',
  },

  // --- Kardio 1: butun tana ---
  jack: {
    name: 'Jumping jack (qo‘l-oyoq ochib sakrash)',
    cue: 'Qo‘llar tepaga, oyoqlar yon tomonga',
    how: [
      'Oyoqlar birga, qo‘llar yonda turing.',
      'Sakrab oyoqlarni yelkadan keng oching, qo‘llarni tepaga ko‘taring.',
      'Yana sakrab boshlang‘ich holatga qayting. Yengil va ritmik sakrang.',
    ],
    low: {
      name: 'Qadam bilan jek (sakramasdan)',
      cue: 'Oyoqni yon tomonga qo‘ying, qo‘llar tepaga',
      how: [
        'Oyoqlar birga turing.',
        'O‘ng oyoqni yon tomonga qadam tashlab, qo‘llarni tepaga ko‘taring.',
        'Oyoqni qaytarib, qo‘llarni tushiring. Keyin chap oyoq bilan takrorlang.',
      ],
    },
  },
  knees: {
    name: 'Baland tizza bilan yugurish (high knees)',
    cue: 'Tizzani belgacha ko‘taring',
    how: [
      'Joyida yuguring, tizzani belgacha ko‘taring.',
      'Qo‘llar tirsakdan bukilgan va oyoqqa qarama-qarshi harakatlanadi.',
      'Oyoq uchida yengil tushing, qorinni tortib turing.',
    ],
    low: {
      name: 'Baland tizza bilan yurish',
      cue: 'Joyida yuring, tizzalar baland',
      how: [
        'Joyida yuring, har qadamda tizzani belgacha ko‘taring.',
        'Qo‘llarni ham baland va faol harakatlantiring.',
        'Oyoq tovondan oyoq uchiga yumshoq tushsin.',
      ],
    },
  },
  fastsq: {
    name: 'Sakrab o‘tirib-turish (squat jump)',
    cue: 'Kuch bilan sakrang, yumshoq tushing',
    how: [
      'Oyoqlar yelka kengligida, squat holatiga tushing.',
      'Kuch bilan yuqoriga sakrang, qo‘llar yordam beradi.',
      'Yumshoq tushib, darhol keyingi takrorga o‘ting.',
    ],
    low: {
      name: 'Tez o‘tirib-turish (sakramasdan)',
      cue: 'Tez o‘tirib-turing, qo‘llar tepaga',
      how: [
        'Oyoqlar yelka kengligida turing.',
        'Tez tempda o‘tiring va turing; turganda qo‘llarni tepaga cho‘zing.',
        'Tizzalar oyoq uchidan oshmasin.',
      ],
    },
  },
  climber: {
    name: 'Tog‘ chiqish (mountain climbers)',
    cue: 'Tizzalarni navbat bilan ko‘krakka torting',
    how: [
      'Qo‘llar polda, yelka ostida — baland plank holati.',
      'Tizzalarni navbat bilan ko‘krakka tortib, tez almashtiring.',
      'Dumba yuqoriga chiqib ketmasin, qorin tortilgan bo‘lsin.',
    ],
    low: {
      name: 'Stuldan tizza tortish',
      cue: 'Qo‘llar stulda, tizzalarni navbat bilan torting',
      how: [
        'Qo‘llarni mustahkam stul yoki divan chetiga qo‘ying.',
        'Tizzani navbat bilan ko‘krakka torting, tezlikni asta oshiring.',
        'Tana to‘g‘ri chiziqda qolsin.',
      ],
    },
  },
  skater: {
    name: 'Konkichi sakrashi (skater)',
    cue: 'Yon tomonga sakrab, qo‘l bilan polga cho‘ziling',
    how: [
      'Bir oyoqda turing, ikkinchisini orqaga qo‘ying.',
      'Yon tomonga sakrab, ikkinchi oyoqqa tushing; qo‘l bilan polga cho‘ziling.',
      'Navbat bilan chapga-o‘ngga harakatlaning.',
    ],
    low: {
      name: 'Yon qadam (konkichi qadami)',
      cue: 'Yon tomonga qadam, yengil cho‘kib cho‘ziling',
      how: [
        'Bir oyoq bilan yon tomonga katta qadam tashlab, yengil cho‘king.',
        'Qo‘llar bilan polga qarab cho‘ziling.',
        'Qaytib, boshqa tomonga takrorlang.',
      ],
    },
  },
  box: {
    name: 'Soyaga musht urish (boks)',
    cue: 'Navbat bilan kuchli musht uring, tizzalar bukik',
    how: [
      'Oyoqlar yelka kengligida, tizzalar sal bukilgan.',
      'Qo‘llarni navbat bilan oldinga, kuch bilan musht qilib uring.',
      'Vaqti-vaqti bilan egilib, yon tomonga burilib turing — butun tana ishlasin.',
    ],
    easy: 'Sekinroq uring, oyoqlar joyida tursin.',
    hard: 'Musht urish bilan birga tez-tez cho‘kib turing.',
  },

  // --- Kardio 2: qorin va oyoq ---
  burpee: {
    name: 'Burpee',
    cue: 'Plankka o‘ting, sakrab turing',
    how: [
      'Tik turing, qo‘llarni polga qo‘yib, oyoqlarni orqaga sakrab plankka o‘ting.',
      'Oyoqlarni qaytarib, turing va tepaga sakrang.',
      'Orqa to‘g‘ri, nafasni ushlamang.',
    ],
    low: {
      name: 'Qadam bilan burpee (sakramasdan)',
      cue: 'Qadam bilan plankka o‘ting va turing',
      how: [
        'Qo‘llarni polga (yoki stulga) qo‘ying.',
        'Oyoqlarni birin-ketin orqaga qadam tashlab, plankka o‘ting.',
        'Oyoqlarni birin-ketin qaytarib turing va qo‘llarni tepaga cho‘zing.',
      ],
    },
  },
  kicks: {
    name: 'Tovonni dumbaga tegizib yugurish (butt kicks)',
    cue: 'Tovonni dumbaga tegizing',
    how: [
      'Joyida yuguring, tovonlarni dumbaga yaqinlashtiring.',
      'Tizzalar pastga qarab tursin, tana tik.',
      'Qo‘llar yugurishdagidek harakatlanadi.',
    ],
    low: {
      name: 'Tovonni ko‘tarib yurish',
      cue: 'Tovonni orqaga ko‘tarib yuring',
      how: [
        'Joyida yuring, har qadamda tovonni orqaga ko‘tarib, dumbaga yaqinlashtiring.',
        'Qo‘llar erkin silkinadi.',
        'Sekin va nazoratli bajaring.',
      ],
    },
  },
  shuffle: {
    name: 'Yon tomonga yugurish (lateral shuffle)',
    cue: 'Past turib, yon tomonga tez siljing',
    how: [
      'Yengil cho‘kib (squat holatida) turing.',
      'Yon tomonga 3–4 tez qadam tashlang, keyin teskari tomonga.',
      'Oyoqlar bir-biriga tegmasin, tana past qolsin.',
    ],
    low: {
      name: 'Yon tomonga yurish',
      cue: 'Past turib, yon tomonga yuring',
      how: [
        'Yengil cho‘kib turing.',
        'Yon tomonga 3 qadam yuring, keyin teskari tomonga.',
        'Sekin tempda, tana past qolsin.',
      ],
    },
  },
  plankjack: {
    name: 'Plank-jek (plankda oyoq ochish)',
    cue: 'Plankda oyoqlarni sakrab oching-yoping',
    how: [
      'Qo‘llarda baland plank holatiga o‘ting.',
      'Oyoqlarni sakrab yon tomonga oching, yana birlashtiring.',
      'Dumba tushmasin, qo‘llar yelka ostida bo‘lsin.',
    ],
    low: {
      name: 'Plankda yon qadam',
      cue: 'Plankda oyoqni navbat bilan yon tomonga oching',
      how: [
        'Qo‘llarda baland plank holatiga o‘ting (yoki stulga tayaning).',
        'Bir oyoqni yon tomonga qadam bilan oching va qaytaring.',
        'Navbat bilan chap va o‘ng oyoqda bajaring.',
      ],
    },
  },
  jlunge: {
    name: 'Sakrab almashtiriladigan lunge',
    cue: 'Sakrab oyoqlarni almashtiring',
    how: [
      'Lunge holatiga tushing (bir oyoq oldinda).',
      'Sakrab, havoda oyoqlarni almashtiring.',
      'Yumshoq tushing, tizza oyoq uchidan oshmasin.',
    ],
    low: {
      name: 'Yurib lunge (almashtirib qadam)',
      cue: 'Navbat bilan oldinga qadam tashlab cho‘ming',
      how: [
        'Bir oyoq bilan oldinga katta qadam tashlab, pastga tushing.',
        'Turib, ikkinchi oyoq bilan oldinga qadam tashlang va yana pastga tushing.',
        'Xonada oldinga yuring yoki joyida almashtiring.',
      ],
    },
  },
  twist: {
    name: 'Rus burilishi (Russian twist)',
    cue: 'Tanani chapga-o‘ngga buring',
    how: [
      'Polda o‘tiring, tizzalar bukilgan, tana sal orqaga egilgan.',
      'Qo‘llarni ko‘krak oldida birlashtirib, tanani chapga-o‘ngga buring.',
      'Orqa dumaloqlanmasin; qiyin bo‘lsa tovonlarni polga tirang.',
    ],
    easy: 'Tovonlar polda qolsin, burilish kichikroq bo‘lsin.',
    hard: 'Oyoqlarni poldan ko‘tarib yoki qo‘lda yuk ushlab bajaring.',
  },
};

// Yog‘ yoqish uchun interval aylanalar (HIIT uslubida): ish/dam vaqti darajaga qarab o‘zgaradi.
const CIRCUITS = {
  C: { label: 'Yog‘ yoqish kardio — 1', moves: ['jack', 'knees', 'fastsq', 'climber', 'skater', 'box'] },
  D: { label: 'Yog‘ yoqish kardio — 2', moves: ['burpee', 'kicks', 'shuffle', 'plankjack', 'jlunge', 'twist'] },
};

// Avtomatik taymerdagi qizish va cho‘zilish bosqichlari (har biri 3 daqiqa).
const WARM_STEPS = [
  { name: 'Joyida yurish', secs: 60, tip: 'Qo‘llarni erkin silkiting' },
  { name: 'Qo‘llarni katta aylantirish', secs: 60, tip: 'Oldinga va orqaga' },
  { name: 'Tizzani ko‘tarib yurish', secs: 60, tip: 'Sekin, nafasni rostlang' },
];
const COOL_STEPS = [
  { name: 'Chap son cho‘zilishi', secs: 45, tip: 'Tovonni dumbaga torting' },
  { name: 'O‘ng son cho‘zilishi', secs: 45, tip: 'Tovonni dumbaga torting' },
  { name: 'Oyoq orqasi cho‘zilishi', secs: 45, tip: 'Oldinga engashing, tizza sal bukik' },
  { name: 'Yelka cho‘zilishi', secs: 45, tip: 'Qo‘lni ko‘krak oldidan torting' },
];
