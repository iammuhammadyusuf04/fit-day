'use strict';

// Mashqlar kutubxonasi.
//   cat  — bo‘lim (CATS), lvl — daraja (1 oson … 3 qiyin)
//   kind — qancha bajariladi: reps (takror), side (har tomonga takror), time (soniya),
//          timeside (har tomonga soniya), min (daqiqa); n — boshlang‘ich qiymat, sets — yondashuvlar (odatda 3)
//   how  — qanday bajariladi, easy/hard — yengil/qiyin variant, cue — taymerdagi qisqa eslatma
//   low  — sakramasdan bajariladigan variant (profildan yoqiladi)
const MOVES = {
  warm: {
    name: 'Qizish', cat: 'special',
    how: [
      '1 daqiqa joyida yuring, qo‘llarni erkin silkiting.',
      '1 daqiqa qo‘llarni katta doira qilib aylantiring: oldinga, keyin orqaga.',
      '1 daqiqa tizzalarni navbat bilan belgacha ko‘tarib, sekin yuring.',
    ],
    easy: 'Sekinroq tempda bajaring, kerak bo‘lsa nafasni rostlab oling.',
  },
  cool: {
    name: 'Cho‘zilish', cat: 'special',
    how: [
      'Har bir cho‘zilishni 30–45 soniya ushlab turing, nafasni ushlamang.',
      'Son oldi: tik turib, bir oyoqni orqaga bukib, tovonni dumbaga torting.',
      'Oyoq orqasi: oldinga engashib, qo‘llar bilan oyoq uchiga cho‘zing.',
      'Yelka: bir qo‘lni ko‘krak oldidan ikkinchi qo‘l bilan o‘zingizga torting.',
    ],
    easy: 'Og‘riq emas, yengil tortilish sezilsin.',
  },

  // ==================== OYOQ VA DUMBA ====================
  squat: {
    name: 'Stulga o‘tirib-turish (squat)', cat: 'legs', lvl: 1, kind: 'reps', n: 10,
    how: [
      'Stul oldida, oyoqlar yelka kengligida turing.',
      'Dumbani orqaga surib, stulga o‘tirgandek pastga tushing.',
      'Tovonlarga tayanib turing. Orqa to‘g‘ri, ko‘krak ochiq.',
    ],
    easy: 'Stulga to‘liq o‘tirib, qo‘l bilan yordam bering.',
    hard: 'Stulsiz, chuqurroq cho‘kib bajaring.',
  },
  sumosq: {
    name: 'Sumo squat (keng oyoqda)', cat: 'legs', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Oyoqlarni yelkadan keng qo‘ying, oyoq uchlari tashqariga qaragan bo‘lsin.',
      'Dumbani pastga tushirib, tizzalarni oyoq uchlari yo‘nalishida buking.',
      'Tovonlarga tayanib turing va dumbani qisib qo‘ying.',
    ],
    easy: 'Sayoz cho‘king.',
    hard: 'Qo‘lingizda yuk (suv shishasi) ushlang.',
  },
  goblet: {
    name: 'Ryukzak bilan squat', cat: 'legs', lvl: 2, kind: 'reps', n: 12,
    how: [
      'Ryukzakka kitob yoki suv solib, ikki qo‘lda ko‘krak oldida ushlang.',
      'Oyoqlar yelka kengligida, dumbani orqaga surib cho‘king.',
      'Tovonlarga tayanib turing; ko‘krak ochiq bo‘lsin.',
    ],
    easy: 'Yuksiz oddiy squat bajaring.',
    hard: 'Ryukzakni og‘irroq qiling.',
  },
  pulsesq: {
    name: 'Pulsatsiyali squat', cat: 'legs', lvl: 2, kind: 'reps', n: 15,
    how: [
      'Squat holatiga cho‘king (sonlar polga deyarli parallel).',
      'Pastda qolib, kichik amplituda bilan 2–3 sm ko‘tarilib-tushing.',
      'Mushaklar charchaguncha nazorat bilan davom eting.',
    ],
    easy: 'Sayoz cho‘kib bajaring.',
    hard: 'Har bir pulsatsiyani sekinroq bajaring.',
  },
  wallsit: {
    name: 'Devorga suyanib o‘tirish (wall sit)', cat: 'legs', lvl: 2, kind: 'time', n: 20,
    how: [
      'Devorga orqangiz bilan suyaning, oyoqlar yelka kengligida.',
      'Devor bo‘ylab sirpanib, tizzalar taxminan 90° bo‘lguncha tushing.',
      'Shu holatda ushlab turing, nafasni ushlamang.',
    ],
    easy: 'Sayozroq tushing.',
    hard: 'Vaqtni 10 soniyaga oshiring.',
  },
  lunge: {
    name: 'Oldinga qadam tashlab cho‘kish (lunge)', cat: 'legs', lvl: 2, kind: 'side', n: 8,
    how: [
      'Tik turing va bir oyoq bilan katta qadam oldinga tashlang.',
      'Ikkala tizza taxminan 90° bo‘lguncha pastga tushing.',
      'Oldingi oyoq tovoni bilan itarilib, boshlang‘ich holatga qayting.',
    ],
    easy: 'Devorga yoki stulga suyaning, qadamni kichikroq qiling.',
    hard: 'Qo‘lingizda yuk (suv shishasi) ushlang.',
  },
  revlunge: {
    name: 'Orqaga qadam tashlab cho‘kish (reverse lunge)', cat: 'legs', lvl: 1, kind: 'side', n: 8,
    how: [
      'Tik turing, bir oyoq bilan orqaga katta qadam tashlang.',
      'Ikkala tizzani bukib, orqa tizzani polga yaqinlashtiring.',
      'Oldingi oyoq tovoni bilan itarilib, boshlang‘ich holatga qayting.',
    ],
    easy: 'Devor yoki stulga suyaning. Oldinga lunge’ga qaraganda tizzaga yengil.',
    hard: 'Qo‘lda yuk ushlang yoki turganda tizzani ko‘taring.',
  },
  sidelunge: {
    name: 'Yon tomonga cho‘kish (side lunge)', cat: 'legs', lvl: 2, kind: 'side', n: 8,
    how: [
      'Tik turing, bir oyoq bilan yon tomonga katta qadam tashlang.',
      'Qadam tashlagan oyoq tizzasini bukib, dumbani orqaga suring; ikkinchi oyoq to‘g‘ri qoladi.',
      'Itarilib, boshlang‘ich holatga qayting.',
    ],
    easy: 'Qadamni kichikroq qiling.',
    hard: 'Qo‘lingizda yuk ushlang.',
  },
  curtsy: {
    name: 'Reverans cho‘kish (curtsy lunge)', cat: 'legs', lvl: 2, kind: 'side', n: 8,
    how: [
      'Tik turing, bir oyoqni ikkinchisining orqasidan diagonal bo‘ylab orqaga qo‘ying.',
      'Ikkala tizzani bukib pastga tushing, ko‘krak ochiq.',
      'Turib, boshlang‘ich holatga qayting.',
    ],
    easy: 'Devorga suyanib, sayoz cho‘king.',
    hard: 'Turganda tizzani ko‘taring.',
  },
  calf: {
    name: 'Boldir ko‘tarish (calf raise)', cat: 'legs', lvl: 1, kind: 'reps', n: 15,
    how: [
      'Oyoqlar yelka kengligida turing, kerak bo‘lsa devordan tayaning.',
      'Tovonlarni baland ko‘tarib, oyoq uchida turing.',
      'Yuqorida 1 soniya ushlab, sekin tushing.',
    ],
    easy: 'Ikki qo‘l bilan tayaning.',
    hard: 'Bitta oyoqda bajaring.',
  },
  stepup: {
    name: 'Zinapoyaga chiqish-tushish', cat: 'legs', lvl: 1, kind: 'reps', n: 10,
    how: [
      'Past zinapoya yoki mustahkam stul oldida turing.',
      'Bir oyoq bilan chiqing, ikkinchisini yoniga qo‘ying.',
      'Pastga tushing. Har safar oyoqni almashtiring.',
    ],
    easy: 'Pastroq pog‘onadan foydalaning, qo‘l bilan tayaning.',
    hard: 'Yuqoriga chiqishda tizzani baland ko‘taring.',
  },
  bridge: {
    name: 'Dumba ko‘tarish (glute bridge)', cat: 'legs', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Orqangiz bilan yoting: tizzalar bukilgan, tovonlar dumbaga yaqin.',
      'Dumbani ko‘tarib, yelkadan tizzagacha to‘g‘ri chiziq hosil qiling.',
      'Yuqorida 1 soniya ushlab, sekin tushing.',
    ],
    easy: 'Ko‘tarish balandligini kamaytiring.',
    hard: 'Bitta oyoqda bajaring.',
  },
  hipthrust: {
    name: 'Divanga tayanib dumba ko‘tarish (hip thrust)', cat: 'legs', lvl: 2, kind: 'reps', n: 12,
    how: [
      'Yelka pichoqlarini divan chetiga tirab o‘tiring: tizzalar bukilgan, tovonlar polda.',
      'Dumbani yuqoriga itarib, tanani tizzadan yelkagacha to‘g‘ri chiziqqa keltiring.',
      'Yuqorida dumbani qisib 1 soniya ushlang, sekin tushing.',
    ],
    easy: 'Polda oddiy dumba ko‘tarish (glute bridge) bajaring.',
    hard: 'Tizzalaringiz ustiga yuk qo‘ying yoki bitta oyoqda bajaring.',
  },
  slbridge: {
    name: 'Bir oyoqli ko‘prik', cat: 'legs', lvl: 3, kind: 'side', n: 8,
    how: [
      'Orqangiz bilan yoting: bir oyoq bukilgan, ikkinchisi to‘g‘ri holda havoda.',
      'Tayanch oyoq tovoni bilan itarilib, dumbani ko‘taring.',
      'Chanoq tekis tursin; sekin tushing.',
    ],
    easy: 'Ikki oyoqda dumba ko‘tarish (glute bridge) bajaring.',
    hard: 'Yuqorida 3 soniya ushlang.',
  },
  donkey: {
    name: 'Eshak tepishi (donkey kick)', cat: 'legs', lvl: 1, kind: 'side', n: 12,
    how: [
      'To‘rt oyoqlab turing: qo‘llar yelka ostida, tizzalar son ostida.',
      'Bir oyoqni tizzadan bukkan holda tepaga, shiftga qarab ko‘taring.',
      'Dumbani qisib, sekin tushiring. Bel egilmasin.',
    ],
    easy: 'Kichikroq balandlikda bajaring.',
    hard: 'Yuqorida 2 soniya ushlang.',
  },
  hydrant: {
    name: 'Hydrant (oyoqni yonga ko‘tarish)', cat: 'legs', lvl: 1, kind: 'side', n: 12,
    how: [
      'To‘rt oyoqlab turing: qo‘llar yelka ostida, tizzalar son ostida.',
      'Bir oyoqni bukkan holda yon tomonga, son balandligigacha ko‘taring.',
      'Sekin tushiring. Tana joyidan qimirlamasin.',
    ],
    easy: 'Kichikroq balandlikda bajaring.',
    hard: 'Yuqorida 2 soniya ushlang.',
  },
  sidelift: {
    name: 'Yonboshda oyoq ko‘tarish', cat: 'legs', lvl: 1, kind: 'side', n: 12,
    how: [
      'Yonboshingiz bilan yoting, oyoqlar bir chiziqda.',
      'Yuqoridagi oyoqni to‘g‘ri holda sekin yuqoriga ko‘taring.',
      'Sekin tushiring. Tana oldinga-orqaga aylanmasin.',
    ],
    easy: 'Pastki oyoqni bukib, tayanch qiling.',
    hard: 'Yuqorida 2 soniya ushlang.',
  },

  // ==================== KARDIO (YOG‘ YOQISH) ====================
  jack: {
    name: 'Jumping jack (qo‘l-oyoq ochib sakrash)', cat: 'cardio', lvl: 1, kind: 'time', n: 30,
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
    name: 'Baland tizza bilan yugurish (high knees)', cat: 'cardio', lvl: 1, kind: 'time', n: 30,
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
    name: 'Sakrab o‘tirib-turish (squat jump)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
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
    name: 'Tog‘ chiqish (mountain climbers)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
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
    name: 'Konkichi sakrashi (skater)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
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
    name: 'Soyaga musht urish (boks)', cat: 'cardio', lvl: 1, kind: 'time', n: 30,
    cue: 'Navbat bilan kuchli musht uring, tizzalar bukik',
    how: [
      'Oyoqlar yelka kengligida, tizzalar sal bukilgan.',
      'Qo‘llarni navbat bilan oldinga, kuch bilan musht qilib uring.',
      'Vaqti-vaqti bilan egilib, yon tomonga burilib turing — butun tana ishlasin.',
    ],
    easy: 'Sekinroq uring, oyoqlar joyida tursin.',
    hard: 'Musht urish bilan birga tez-tez cho‘kib turing.',
  },
  burpee: {
    name: 'Burpee', cat: 'cardio', lvl: 3, kind: 'time', n: 30,
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
    name: 'Tovonni dumbaga tegizib yugurish (butt kicks)', cat: 'cardio', lvl: 1, kind: 'time', n: 30,
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
    name: 'Yon tomonga yugurish (lateral shuffle)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
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
    name: 'Plank-jek (plankda oyoq ochish)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
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
    name: 'Sakrab almashtiriladigan lunge', cat: 'cardio', lvl: 3, kind: 'time', n: 30,
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
  sprint: {
    name: 'Joyida tez yugurish (sprint)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
    cue: 'Qo‘llar va oyoqlar tez almashsin',
    how: [
      'Joyida yuguring, qo‘llarni tirsakdan bukib tez harakatlantiring.',
      'Oyoq uchida yengil tushing, tizzalar sal ko‘tarilsin.',
      'Oxirgi 5 soniyada eng tez tezlikka chiqing.',
    ],
    low: {
      name: 'Joyida tez yurish',
      cue: 'Qadamlar tez, qo‘llar faol',
      how: [
        'Joyida tez qadam tashlab yuring.',
        'Qo‘llarni tirsakdan bukib, kuchli silkiting.',
        'Tizzalarni belgacha ko‘tarmasdan, ritmni tez ushlang.',
      ],
    },
  },
  tuck: {
    name: 'Tizzani tortib sakrash (tuck jump)', cat: 'cardio', lvl: 3, kind: 'time', n: 20,
    cue: 'Sakrab, tizzalarni ko‘kragga torting',
    how: [
      'Oyoqlar yelka kengligida, yengil cho‘kib turing.',
      'Yuqoriga sakrab, tizzalarni ko‘kragingizga torting.',
      'Yumshoq tushib, darhol keyingisiga o‘ting.',
    ],
    low: {
      name: 'Tizzani ko‘kragga tortish (sakramasdan)',
      cue: 'Qo‘llar tepada, tizzani ko‘kragga torting',
      how: [
        'Tik turing, qo‘llarni tepaga cho‘zing.',
        'Bir tizzani ko‘kragingizga tortib, qo‘llarni pastga tushiring.',
        'Oyoqni almashtirib, ritmni ushlang.',
      ],
    },
  },
  inchworm: {
    name: 'Qurt yurishi (inchworm)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
    cue: 'Qo‘llar bilan plankka yuring va qayting',
    how: [
      'Tik turing, oldinga engashib qo‘llarni polga qo‘ying.',
      'Qo‘llar bilan oldinga yurib, baland plank holatiga o‘ting.',
      'Qo‘llar bilan oyoqqa yaqin yurib, qaytib turing.',
    ],
    easy: 'Tizzalarni sal bukib bajaring.',
    hard: 'Plankda bitta turtib-itarilish qo‘shing.',
  },
  dance: {
    name: 'Musiqa bilan raqs', cat: 'cardio', lvl: 1, kind: 'min', n: 5, step: 2,
    cue: 'Butun tana bilan harakatlaning, to‘xtamang',
    how: [
      'Sevimli ritmik musiqangizni qo‘ying.',
      'Butun tana bilan harakatlaning: qo‘llar, yelka, bel, oyoqlar.',
      'To‘xtamasdan, ritmni ushlab davom eting.',
    ],
    easy: 'Sekinroq ritmdagi musiqani tanlang.',
    hard: 'Qo‘llarni tepaga ko‘tarib, tezroq harakatlaning.',
  },
  squatpunch: {
    name: 'Cho‘kib musht urish (squat + boks)', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
    cue: 'Cho‘kib, navbat bilan musht uring',
    how: [
      'Oyoqlar yelka kengligida, squat holatiga cho‘king.',
      'Cho‘kkan holda oldinga navbat bilan 4 ta musht uring.',
      'Turib, yana cho‘king va takrorlang. Tizzalar oyoq uchidan oshmasin.',
    ],
    easy: 'Sayoz cho‘king.',
    hard: 'Turganda tizzani ko‘taring.',
  },
  bearcrawl: {
    name: 'Ayiq yurishi (bear crawl)', cat: 'cardio', lvl: 3, kind: 'time', n: 20,
    cue: 'Tizzalar polga yaqin, qarama-qarshi qo‘l-oyoq',
    how: [
      'Qo‘llar va oyoq uchlariga tayaning, tizzalar poldan 5 sm ko‘tarilgan bo‘lsin.',
      'Qarama-qarshi qo‘l va oyoqni bir vaqtda oldinga siljiting.',
      'Orqa tekis, dumba past; sekin va nazoratli harakatlaning.',
    ],
    easy: 'Tizzalar polda, emaklab bajaring.',
    hard: 'Tezlikni oshiring yoki orqaga ham yuring.',
  },
  stairs: {
    name: 'Zinapoyadan tez chiqish', cat: 'cardio', lvl: 2, kind: 'min', n: 5, step: 2,
    cue: 'Tez chiqing, sekin tushing',
    how: [
      'Zinapoyadan tez qadamlar bilan yuqoriga chiqing.',
      'Sekin tushing, oyoq uchiga yumshoq tayaning.',
      'Qo‘llar faol harakatlansin, tana tik.',
    ],
    easy: 'Har pog‘onada to‘xtab, nafasni rostlang.',
    hard: 'Ikki pog‘onadan chiqing.',
  },
  kickfront: {
    name: 'Oldinga tepish (boks tepishi)', cat: 'cardio', lvl: 1, kind: 'time', n: 30,
    cue: 'Oyoqni navbat bilan belgacha tepib qaytaring',
    how: [
      'Oyoqlar yelka kengligida, qo‘llar musht holatida yuz oldida.',
      'Bir oyoq bilan oldinga belgacha tepib, qaytaring.',
      'Oyoqlarni almashtiring; tayanch oyoq tizzasi sal bukik bo‘lsin.',
    ],
    easy: 'Past balandlikda, sekin tepib bajaring.',
    hard: 'Tepish bilan birga qo‘llar bilan musht uring.',
  },
  ropeless: {
    name: 'Arqonsiz sakrash', cat: 'cardio', lvl: 2, kind: 'time', n: 30,
    cue: 'Oyoq uchida yengil sakrang, bilaklar aylansin',
    how: [
      'Qo‘llarni belda arqon ushlagandek ushlang.',
      'Oyoq uchlarida past sakrab, bilaklarni aylantiring.',
      'Yengil, ritmik sakrang; tizzalar sal bukik bo‘lsin.',
    ],
    low: {
      name: 'Oyoq uchida tebranish',
      cue: 'Tovonlarni navbat bilan ko‘taring, bilaklar aylansin',
      how: [
        'Qo‘llarni belda arqon ushlagandek ushlang.',
        'Tovonlarni navbat bilan ko‘tarib, oyoq uchlarida tebranib turing.',
        'Sakramang — faqat yengil ritm bilan harakatlaning.',
      ],
    },
  },

  // ==================== KO‘KRAK, YELKA, QO‘L ====================
  pushwall: {
    name: 'Devordan turtib-itarilish', cat: 'upper', lvl: 1, kind: 'reps', n: 10,
    how: [
      'Devordan bir qadam narida turib, qo‘llarni yelka kengligida devorga tirang.',
      'Tirsaklarni bukib, ko‘krakni devorga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, orqaga itaring. Tana bir chiziqda qolsin.',
    ],
    easy: 'Devorga yaqinroq turing.',
    hard: 'Stol yoki divan chetidan, keyin polga o‘ting.',
  },
  pushinc: {
    name: 'Stol/divan chetidan turtib-itarilish', cat: 'upper', lvl: 1, kind: 'reps', n: 8,
    how: [
      'Qo‘llarni mustahkam stol yoki divan chetiga yelka kengligida qo‘ying.',
      'Tanani boshdan tovongacha to‘g‘ri ushlab, ko‘krakni chetga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Balandroq joydan (devordan) bajaring.',
    hard: 'Pastroq joydan, keyin polda bajaring.',
  },
  kneepush: {
    name: 'Tizzada turtib-itarilish', cat: 'upper', lvl: 1, kind: 'reps', n: 8,
    how: [
      'Qo‘llar yelkadan sal keng, tizzalar polda; tana boshdan tizzagacha to‘g‘ri bo‘lsin.',
      'Tirsaklarni bukib, ko‘krakni polga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring. Bel egilmasin.',
    ],
    easy: 'Stol yoki divan chetidan bajaring.',
    hard: 'Oyoqlarni ko‘tarib, klassik turtib-itarilishga o‘ting.',
  },
  pushup: {
    name: 'Klassik turtib-itarilish', cat: 'upper', lvl: 2, kind: 'reps', n: 8,
    how: [
      'Baland plank holatida turing: qo‘llar yelkadan sal keng, tana to‘g‘ri chiziqda.',
      'Tirsaklarni tanaga taxminan 45° da bukib, ko‘krak polga yaqinlashguncha tushing.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Tizzada yoki stol chetidan bajaring.',
    hard: 'Oyoqlarni stulga qo‘yib bajaring.',
  },
  widepush: {
    name: 'Keng turtib-itarilish', cat: 'upper', lvl: 2, kind: 'reps', n: 8,
    how: [
      'Qo‘llarni yelkadan ancha keng qo‘yib, plank holatiga o‘ting.',
      'Tirsaklarni yon tomonga bukib, ko‘krakni polga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Tizzada bajaring.',
    hard: 'Pastda 2 soniya ushlab turing.',
  },
  diamond: {
    name: 'Olmos turtib-itarilish (triceps)', cat: 'upper', lvl: 3, kind: 'reps', n: 6,
    how: [
      'Qo‘llarni ko‘krak ostida bosh va ko‘rsatkich barmoqlar bilan olmos shaklida qo‘ying.',
      'Tirsaklarni tanaga yaqin buking, ko‘krakni qo‘llarga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Tizzada bajaring yoki qo‘llarni tor qo‘yib oddiy turtib-itarilish qiling.',
    hard: 'Tushishni sekinroq (3 soniya) bajaring.',
  },
  tricdip: {
    name: 'Stuldan turtib-itarilish (triceps dips)', cat: 'upper', lvl: 2, kind: 'reps', n: 10,
    how: [
      'Devorga tiralgan mustahkam stul chetini orqangizda ushlang: oyoqlar oldinda, tovonlar polda.',
      'Tirsaklarni orqaga bukib, dumbani stul oldida pastga tushiring.',
      'Qo‘llarni to‘g‘rilab, yuqoriga ko‘tariling. Yelkalar quloqdan uzoq bo‘lsin.',
    ],
    easy: 'Tizzalarni bukib, oyoqlarni stulga yaqin qo‘ying.',
    hard: 'Oyoqlarni uzoqroq cho‘zing.',
  },
  pike: {
    name: 'Pike turtib-itarilish (yelka)', cat: 'upper', lvl: 3, kind: 'reps', n: 6,
    how: [
      'Dumbani yuqoriga ko‘tarib, teskari “V” holatiga o‘ting; qo‘llar va oyoqlar polda.',
      'Tirsaklarni bukib, bosh tepasini polga yaqinlashtiring.',
      'Qo‘llarni to‘g‘rilab, qaytib itaring.',
    ],
    easy: 'Qo‘llarni stulga qo‘yib, kichik amplituda bilan bajaring.',
    hard: 'Oyoqlarni stulga ko‘taring.',
  },
  shouldertap: {
    name: 'Plankda yelkaga tegish', cat: 'upper', lvl: 2, kind: 'time', n: 30,
    how: [
      'Baland plank holatiga o‘ting, oyoqlar yelkadan sal keng.',
      'Bir qo‘l bilan qarama-qarshi yelkaga tegib, qaytaring.',
      'Qo‘llarni almashtiring; chanoq o‘ngga-chapga tebranmasin.',
    ],
    easy: 'Tizzada yoki stulga tayanib bajaring.',
    hard: 'Oyoqlarni yaqin qo‘yib bajaring.',
  },
  armcircle: {
    name: 'Qo‘llarni aylantirish', cat: 'upper', lvl: 1, kind: 'time', n: 30,
    how: [
      'Qo‘llarni yon tomonga yelka balandligida cho‘zing.',
      'Kichik doiralar bilan oldinga aylantiring, keyin orqaga.',
      'Qo‘llar to‘g‘ri, yelkalar bo‘sh bo‘lsin.',
    ],
    easy: 'Doiralarni kichikroq qiling.',
    hard: 'Qo‘lingizda yengil yuk (shisha) ushlang.',
  },
  latraise: {
    name: 'Shisha bilan qo‘llarni yonga ko‘tarish', cat: 'upper', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Har qo‘lda suv to‘la shisha ushlab, tik turing.',
      'Qo‘llarni yon tomonga yelka balandligigacha ko‘taring.',
      'Sekin tushiring. Yelkalarni quloqqa tortmang.',
    ],
    easy: 'Shishasiz bajaring.',
    hard: 'Kattaroq shisha (1,5 litr) oling.',
  },
  bottlepress: {
    name: 'Shisha bilan yelka pressi', cat: 'upper', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Har qo‘lda suv to‘la shisha ushlab, yelka balandligida tirsaklarni buking.',
      'Shishalarni to‘g‘ri tepaga itaring.',
      'Sekin yelka balandligigacha tushiring; bel egilmasin.',
    ],
    easy: 'Shishasiz bajaring.',
    hard: 'Kattaroq shisha oling.',
  },
  bottlecurl: {
    name: 'Shisha bilan biceps', cat: 'upper', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Har qo‘lda shisha ushlab tik turing: qo‘llar tana yonida, kaftlar oldinga.',
      'Tirsaklarni joyidan qimirlatmay, shishalarni yelkaga ko‘taring.',
      'Sekin tushiring. Tanani tebratmang.',
    ],
    easy: 'Bir qo‘lda navbat bilan bajaring.',
    hard: 'Kattaroq shisha oling yoki tushishni sekinlashtiring.',
  },

  // ==================== ORQA ====================
  superman: {
    name: 'Superman (qorin bilan yotib)', cat: 'back', lvl: 1, kind: 'reps', n: 10,
    how: [
      'Qorin bilan yoting, qo‘llar oldinga cho‘zilgan.',
      'Qo‘l va oyoqlarni bir vaqtda polda 10–15 sm ko‘taring.',
      '1–2 soniya ushlab, sekin tushiring.',
    ],
    easy: 'Faqat qo‘llarni yoki faqat oyoqlarni ko‘taring.',
    hard: 'Tepada 3–5 soniya ushlab turing.',
  },
  birddog: {
    name: 'Qush-it (bird-dog)', cat: 'back', lvl: 1, kind: 'side', n: 8,
    how: [
      'To‘rt oyoqlab turing: qo‘llar yelka ostida, tizzalar son ostida.',
      'Bir qo‘lni va qarama-qarshi oyoqni bir vaqtda to‘g‘ri chiziqqa cho‘zing.',
      'Sekin qaytaring va almashtiring. Bel tekis qolsin.',
    ],
    easy: 'Faqat oyoqni yoki faqat qo‘lni cho‘zing.',
    hard: 'Cho‘zilgan holatda 3 soniya ushlab turing.',
  },
  wallangel: {
    name: 'Devorda farishta (wall angel)', cat: 'back', lvl: 1, kind: 'reps', n: 10,
    how: [
      'Devorga orqangiz bilan suyaning, oyoqlar devordan bir qadam narida.',
      'Tirsaklarni 90° bukib, qo‘llarni devorga tekkizing.',
      'Qo‘llarni devor bo‘ylab tepaga va pastga sirpantiring.',
    ],
    easy: 'Kichikroq amplituda bilan bajaring.',
    hard: 'Qo‘llarni to‘liq to‘g‘rilab tepaga cho‘zing.',
  },
  swimmer: {
    name: 'Suzuvchi (qorin bilan yotib)', cat: 'back', lvl: 2, kind: 'time', n: 30,
    how: [
      'Qorin bilan yoting, qo‘llar oldinga cho‘zilgan.',
      'Qo‘l va oyoqlarni poldan sal ko‘taring.',
      'Qarama-qarshi qo‘l va oyoqni navbat bilan tez-tez tepaga-pastga siltang.',
    ],
    easy: 'Faqat qo‘llarni harakatlantiring.',
    hard: 'Harakatni tezlashtiring.',
  },
  reversefly: {
    name: 'Shisha bilan orqaga yoyish (reverse fly)', cat: 'back', lvl: 2, kind: 'reps', n: 12,
    how: [
      'Har qo‘lda shisha ushlab, oldinga engashing: orqa tekis, tizzalar sal bukik.',
      'Qo‘llarni yon tomonga yelka balandligigacha, kurak suyaklarini qisib ko‘taring.',
      'Sekin tushiring. Bo‘yin tekis qolsin.',
    ],
    easy: 'Shishasiz bajaring.',
    hard: 'Kattaroq shisha oling.',
  },
  bottlerow: {
    name: 'Shisha bilan eshkak tortish (row)', cat: 'back', lvl: 2, kind: 'reps', n: 12,
    how: [
      'Har qo‘lda shisha ushlab, oldinga engashing: orqa tekis, tizzalar sal bukik.',
      'Tirsaklarni orqaga tortib, shishalarni qovurg‘a tomon ko‘taring.',
      'Kurak suyaklarini qisib, sekin tushiring.',
    ],
    easy: 'Bir qo‘l stolga tayanib, navbat bilan bajaring.',
    hard: 'Kattaroq shisha yoki ryukzak ishlating.',
  },

  // ==================== QORIN ====================
  plank: {
    name: 'Plank (tirsakda)', cat: 'core', lvl: 1, kind: 'time', n: 20, step: 10,
    how: [
      'Tirsaklarni yelka ostiga qo‘ying, oyoq uchlari polda.',
      'Tanani boshdan tovongacha to‘g‘ri chiziqda ushlang.',
      'Qorinni tortib, dumbani ko‘tarmay va tushirmay, nafas oling.',
    ],
    easy: 'Tizzada turib bajaring.',
    hard: 'Vaqtni 10 soniyaga oshiring.',
  },
  crunch: {
    name: 'Qorin buklash (crunch)', cat: 'core', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Orqangiz bilan yoting: tizzalar bukilgan, qo‘llar quloq yonida yoki ko‘krakda.',
      'Qorinni tortib, yelka pichoqlarini poldan ko‘taring.',
      'Yuqorida 1 soniya ushlang, sekin tushing. Bo‘yinni tortmang.',
    ],
    easy: 'Qo‘llarni oldinga cho‘zib, kichik amplituda bilan bajaring.',
    hard: 'Yuqorida 3 soniya ushlang.',
  },
  heeltouch: {
    name: 'Tovonga tegish (heel touches)', cat: 'core', lvl: 1, kind: 'reps', n: 16,
    how: [
      'Orqangiz bilan yoting: tizzalar bukilgan, tovonlar polda, qo‘llar tana yonida.',
      'Yelkalarni sal ko‘tarib, chap qo‘l bilan chap tovonga tegining.',
      'Keyin o‘ng qo‘l bilan o‘ng tovonga tegining; navbat bilan davom eting.',
    ],
    easy: 'Kichikroq ko‘tarilib bajaring.',
    hard: 'Harakatni tezlashtiring.',
  },
  standcrunch: {
    name: 'Tik turib tizza-tirsak (standing crunch)', cat: 'core', lvl: 1, kind: 'reps', n: 16,
    how: [
      'Tik turing, qo‘llar boshning orqasida.',
      'Chap tizzani ko‘tarib, o‘ng tirsakni unga yaqinlashtiring.',
      'Qaytib, o‘ng tizza va chap tirsak bilan takrorlang.',
    ],
    easy: 'Sekin tempda bajaring.',
    hard: 'Tempni tezlashtiring.',
  },
  deadbug: {
    name: 'Dead bug (o‘lik qo‘ng‘iz)', cat: 'core', lvl: 1, kind: 'side', n: 8,
    how: [
      'Orqangiz bilan yoting: qo‘llar tepaga, tizzalar 90° bukilib havoda.',
      'Bir qo‘lni boshingiz ortiga va qarama-qarshi oyoqni pastga cho‘zing.',
      'Bel polga yopishgan holda qaytaring va almashtiring.',
    ],
    easy: 'Faqat oyoqlarni almashtiring, qo‘llar tepada tursin.',
    hard: 'Qo‘lingizda yengil yuk ushlang.',
  },
  bike: {
    name: 'Velosiped (qorin mushaklari)', cat: 'core', lvl: 1, kind: 'reps', n: 12,
    how: [
      'Orqangiz bilan yoting, qo‘llar boshning orqasida, oyoqlar poldan ko‘tarilgan.',
      'Chap tirsakni o‘ng tizzaga yaqinlashtiring, o‘ng oyoq cho‘ziladi.',
      'Navbat bilan almashtiring. Bo‘yinni qo‘l bilan tortmang.',
    ],
    easy: 'Oyoqlarni polga yaqinroq tutib, sekin bajaring.',
    hard: 'Tezlikni oshiring.',
  },
  revcrunch: {
    name: 'Teskari crunch', cat: 'core', lvl: 2, kind: 'reps', n: 10,
    how: [
      'Orqangiz bilan yoting: qo‘llar tana yonida, tizzalar bukilib havoda.',
      'Qorin pastini tortib, dumbani poldan ko‘tarib, tizzalarni ko‘kragga yaqinlashtiring.',
      'Sekin boshlang‘ich holatga qayting. Tebranmang.',
    ],
    easy: 'Oyoqlarni polga yaqin tutib, kichik amplituda bilan bajaring.',
    hard: 'Oyoqlarni to‘g‘rilab tepaga ko‘taring.',
  },
  legraise: {
    name: 'Oyoq ko‘tarish (leg raise)', cat: 'core', lvl: 2, kind: 'reps', n: 10,
    how: [
      'Orqangiz bilan yoting, qo‘llar tana yonida yoki dumba ostida.',
      'To‘g‘ri oyoqlarni vertikal holatgacha ko‘taring.',
      'Sekin tushiring, lekin polga tegizmang. Bel polga yopishib tursin.',
    ],
    easy: 'Tizzalarni bukib bajaring.',
    hard: 'Oyoqlarni polga yaqin joyda 2 soniya ushlang.',
  },
  flutter: {
    name: 'Qaychi (flutter kicks)', cat: 'core', lvl: 2, kind: 'time', n: 30,
    how: [
      'Orqangiz bilan yoting, qo‘llar dumba ostida, oyoqlar to‘g‘ri.',
      'Oyoqlarni poldan 15–20 sm ko‘taring.',
      'Navbat bilan kichik harakatlar bilan tepaga-pastga siltang. Bel polga yopishsin.',
    ],
    easy: 'Oyoqlarni balandroq tutib, sekin bajaring.',
    hard: 'Oyoqlarni polga yaqinroq tushiring.',
  },
  twist: {
    name: 'Rus burilishi (Russian twist)', cat: 'core', lvl: 2, kind: 'reps', n: 16,
    cue: 'Tanani chapga-o‘ngga buring',
    how: [
      'Polda o‘tiring, tizzalar bukilgan, tana sal orqaga egilgan.',
      'Qo‘llarni ko‘krak oldida birlashtirib, tanani chapga-o‘ngga buring.',
      'Orqa dumaloqlanmasin; qiyin bo‘lsa tovonlarni polga tirang.',
    ],
    easy: 'Tovonlar polda qolsin, burilish kichikroq bo‘lsin.',
    hard: 'Oyoqlarni poldan ko‘tarib yoki qo‘lda yuk ushlab bajaring.',
  },
  toetouch: {
    name: 'Oyoq uchiga cho‘zilib buklash', cat: 'core', lvl: 2, kind: 'reps', n: 12,
    how: [
      'Orqangiz bilan yoting, oyoqlar vertikal tepaga ko‘tarilgan.',
      'Qorinni tortib, qo‘llar bilan oyoq uchlariga cho‘ziling.',
      'Sekin tushing; bo‘yinni tortmang.',
    ],
    easy: 'Tizzalarni bukib bajaring.',
    hard: 'Yuqorida 2 soniya ushlab turing.',
  },
  sideplank: {
    name: 'Yon plank', cat: 'core', lvl: 2, kind: 'timeside', n: 15,
    how: [
      'Yonboshingiz bilan yoting: tirsak yelka ostida, oyoqlar to‘g‘ri.',
      'Chanoqni ko‘tarib, tanani boshdan tovongacha to‘g‘ri chiziqqa keltiring.',
      'Ushlab turing, nafasni ushlamang; keyin boshqa tomonga o‘ting.',
    ],
    easy: 'Tizzalarni bukib, tizzada tayanib bajaring.',
    hard: 'Yuqoridagi qo‘lni tepaga cho‘zing.',
  },
  plankup: {
    name: 'Plankda yuqoriga-pastga (up-down)', cat: 'core', lvl: 3, kind: 'reps', n: 8,
    how: [
      'Tirsakdagi plank holatidan boshlang.',
      'Birin-ketin qo‘llarni to‘g‘rilab, baland plankka ko‘tariling.',
      'Birin-ketin tirsaklarga qayting; har safar boshlovchi qo‘lni almashtiring.',
    ],
    easy: 'Tizzada bajaring.',
    hard: 'Chanoqni qimirlatmay, tezroq bajaring.',
  },
  vup: {
    name: 'V-buklanish (V-up)', cat: 'core', lvl: 3, kind: 'reps', n: 8,
    how: [
      'Orqangiz bilan yoting, qo‘llar boshning orqasida cho‘zilgan.',
      'Bir vaqtda to‘g‘ri oyoqlar va tanani ko‘tarib, qo‘llar bilan oyoq uchiga cho‘ziling.',
      'Sekin boshlang‘ich holatga qayting.',
    ],
    easy: 'Tizzalarni bukib, tizzani ko‘kragga tortib bajaring.',
    hard: 'Tezroq va to‘liq amplituda bilan bajaring.',
  },

  // ==================== CHO‘ZILISH ====================
  quadst: {
    name: 'Son oldi cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Tik turing (kerak bo‘lsa devordan tayaning), bir oyoqni orqaga bukib tovondan ushlang.',
      'Tovonni dumbaga yaqinlashtiring, tizzalar bir-biriga yaqin tursin.',
      'Chanoqni oldinga sal surib, 30 soniya ushlang; keyin boshqa oyoq.',
    ],
    easy: 'Devordan tayaning.',
    hard: 'Qarama-qarshi qo‘lni tepaga cho‘zing.',
  },
  hipflex: {
    name: 'Son bukuvchi cho‘zilishi (hip flexor)', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Bir tizzada turing (tizza ostiga yostiq qo‘ying), ikkinchi oyoq oldinda 90° bukilgan.',
      'Chanoqni sekin oldinga suring, tana tik tursin.',
      'Orqadagi oyoq sonining old qismida tortilishni sezib, 30 soniya ushlang.',
    ],
    easy: 'Chanoqni kamroq oldinga suring.',
    hard: 'Orqadagi oyoq tomonidagi qo‘lni tepaga cho‘zing.',
  },
  hamst: {
    name: 'Oyoq orqasi cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'time', n: 30, sets: 2,
    how: [
      'Polda o‘tiring, oyoqlarni oldinga cho‘zing.',
      'Orqani tekis tutib, qo‘llar bilan oyoq uchiga cho‘ziling.',
      'Og‘riqsiz tortilishni sezib, 30 soniya ushlang.',
    ],
    easy: 'Tizzalarni sal buking.',
    hard: 'Oyoq uchlarini o‘zingizga torting.',
  },
  figure4: {
    name: 'To‘rtlik (dumba cho‘zilishi)', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Orqangiz bilan yoting: tizzalar bukilgan, tovonlar polda.',
      'Bir oyoq to‘pig‘ini ikkinchi oyoq tizzasiga qo‘ying (“4” raqami shaklida).',
      'Ikkinchi oyoqni ko‘kragingizga torting va 30 soniya ushlang.',
    ],
    easy: 'Oyoqni kamroq torting.',
    hard: 'Tizzani qo‘l bilan sekin itaring.',
  },
  chestst: {
    name: 'Ko‘krak cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Eshik yoki devor yonida turing, bir bilagingizni devorga tirang (tirsak 90°).',
      'Tanani sekin qarama-qarshi tomonga buring.',
      'Ko‘krak oldida tortilish sezganda 30 soniya ushlang.',
    ],
    easy: 'Kamroq buriling.',
    hard: 'Qo‘lni yuqoriroq qo‘ying.',
  },
  shouldst: {
    name: 'Yelka cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Bir qo‘lni ko‘krak oldidan qarama-qarshi tomonga cho‘zing.',
      'Ikkinchi qo‘l bilan tirsakdan o‘zingizga torting.',
      'Yelkada tortilishni sezib, 30 soniya ushlang.',
    ],
    easy: 'Kamroq torting.',
    hard: 'Boshni teskari tomonga buring.',
  },
  tricst: {
    name: 'Triceps cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Bir qo‘lni tepaga ko‘tarib, tirsakni bukib, kaftni yelka orqasiga qo‘ying.',
      'Ikkinchi qo‘l bilan tirsakni sekin bosh tomonga torting.',
      'Qo‘l orqasida tortilishni sezib, 30 soniya ushlang.',
    ],
    easy: 'Kamroq torting.',
    hard: 'Tanani yon tomonga sal egib torting.',
  },
  calfst: {
    name: 'Boldir cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Devorga yuzlanib turing, qo‘llar devorda.',
      'Bir oyoqni orqaga qo‘yib, tovonni polga bosing, oyoq to‘g‘ri.',
      'Oldingi tizzani bukib, boldirda tortilishni sezib 30 soniya ushlang.',
    ],
    easy: 'Qadamni kichikroq qiling.',
    hard: 'Qadamni kattaroq qiling.',
  },
  catcow: {
    name: 'Mushuk-sigir (orqa harakatchanligi)', cat: 'stretch', lvl: 1, kind: 'reps', n: 10, sets: 2,
    how: [
      'To‘rt oyoqlab turing: qo‘llar yelka ostida, tizzalar son ostida.',
      'Nafas chiqarib, orqani yuqoriga dumaloqlang, bosh pastga (mushuk).',
      'Nafas olib, belni pastga egib, boshni ko‘taring (sigir). Sekin almashtiring.',
    ],
    easy: 'Kichik amplituda bilan bajaring.',
    hard: 'Har holatda 3 soniya ushlab turing.',
  },
  childpose: {
    name: 'Bola holati (child pose)', cat: 'stretch', lvl: 1, kind: 'time', n: 40, sets: 1,
    how: [
      'To‘rt oyoqlab turing, dumbani tovonlarga tushiring.',
      'Qo‘llarni oldinga cho‘zib, peshonani polga qo‘ying.',
      'Chuqur nafas olib, 40 soniya dam oling.',
    ],
    easy: 'Tizzalarni keng qo‘ying yoki ostiga yostiq qo‘ying.',
    hard: 'Qo‘llarni yanada uzoqqa cho‘zing.',
  },
  suptwist: {
    name: 'Yotib burilish (orqa cho‘zilishi)', cat: 'stretch', lvl: 1, kind: 'timeside', n: 30, sets: 2,
    how: [
      'Orqangiz bilan yoting: qo‘llar yon tomonga cho‘zilgan, tizzalar bukilgan.',
      'Tizzalarni bir tomonga sekin tushiring, yelkalar polda qolsin.',
      'Chuqur nafas oling, 30 soniya ushlang; keyin boshqa tomonga.',
    ],
    easy: 'Tizzalarni kamroq tushiring.',
    hard: 'Boshni teskari tomonga buring.',
  },

  // ==================== YURISH ====================
  walk: {
    name: 'Tez yurish', cat: 'walk', lvl: 1, kind: 'min', n: 30,
    how: [
      'Yelkalar bo‘sh, qo‘llar tirsakdan bukilgan va erkin silkinadi.',
      'Tezlik: gaplasha olasiz, lekin qo‘shiq aytib bo‘lmaydi.',
      'Qadamlarni uzun va tez tashlang, tik yuring.',
    ],
    easy: 'Tezlikni kamaytiring yoki vaqtni 5 daqiqaga qisqartiring.',
    hard: 'Har 5 daqiqada 1 daqiqa juda tez yuring (interval) yoki qiyalikdan chiqing.',
  },
  walkint: {
    name: 'Interval yurish', cat: 'walk', lvl: 1, kind: 'min', n: 20,
    how: [
      '1 daqiqa juda tez yuring (nafasingiz tezlashsin).',
      '2 daqiqa sekin yuring, nafasni tiklang.',
      'Shu tartibni butun vaqt davomida takrorlang.',
    ],
    easy: '30 soniya tez, 2 daqiqa sekin yuring.',
    hard: '2 daqiqa tez, 1 daqiqa sekin yuring.',
  },
  powerwalk: {
    name: 'Qo‘llarni silkitib tez yurish (power walk)', cat: 'walk', lvl: 2, kind: 'min', n: 20,
    how: [
      'Qo‘llarni tirsakdan 90° bukib, qadam bilan birga faol silkiting.',
      'Qadamlarni tez, lekin oddiy tashlang (yugurmang).',
      'Nafas tez, ammo gaplasha oladigan tezlikda bo‘ling.',
    ],
    easy: 'Qo‘llarni kamroq silkiting.',
    hard: 'Tezlikni oshiring.',
  },
  hillwalk: {
    name: 'Qiyalikda yurish', cat: 'walk', lvl: 2, kind: 'min', n: 20,
    how: [
      'Yengil qiyalik yoki ko‘prik/zinapoyali yo‘lni tanlang.',
      'Chiqishda qadamlarni kichik qilib, tanani sal oldinga egib yuring.',
      'Tushishda tizzalarni sal bukib, yumshoq qadam tashlang.',
    ],
    easy: 'Kam qiyalikli yo‘lni tanlang.',
    hard: 'Qiyalikda tezroq yuring.',
  },
  homewalk: {
    name: 'Uyda joyida yurish (yomg‘irli kunlar uchun)', cat: 'walk', lvl: 1, kind: 'min', n: 15,
    how: [
      'Televizor yoki musiqa bilan joyida yuring.',
      'Tizzalarni belgacha ko‘tarib, qo‘llarni erkin silkiting.',
      'Har 5 daqiqada tezlikni biroz oshiring.',
    ],
    easy: 'Sekin tempda, 10 daqiqadan boshlang.',
    hard: 'Tizzalarni baland ko‘tarib, tempni tez qiling.',
  },
};

// Bo‘limlar (kutubxonada shu tartibda ko‘rsatiladi).
const CATS = {
  cardio: 'Kardio',
  legs: 'Oyoq va dumba',
  upper: 'Ko‘krak, yelka, qo‘l',
  back: 'Orqa',
  core: 'Qorin',
  stretch: 'Cho‘zilish',
  walk: 'Yurish',
};

// Yog‘ yoqish uchun interval aylanalar (HIIT uslubida): ish/dam vaqti darajaga qarab o‘zgaradi.
const CIRCUITS = {
  C: { label: 'Yog‘ yoqish kardio — 1', moves: ['jack', 'knees', 'fastsq', 'climber', 'skater', 'box'] },
  D: { label: 'Yog‘ yoqish kardio — 2', moves: ['burpee', 'kicks', 'shuffle', 'plankjack', 'jlunge', 'twist'] },
};

// Tayyor mashg‘ulotlar: bir bosishda boshlanadi. work/rest — 1-darajadagi sekundlar (daraja oshgan sari
// ish ko‘payadi, dam qisqaradi); fixed — vaqt o‘zgarmaydi (cho‘zilish).
const PRESETS = [
  { id: 'morning', name: 'Ertalabki uyg‘onish', note: 'Butun tana, yengil', ids: ['knees', 'sumosq', 'kneepush', 'bridge', 'standcrunch', 'armcircle'], work: 30, rest: 20, rounds: 2 },
  { id: 'cardio', name: 'Kardio — yog‘ yoqish', note: 'Yurak urishini oshiradi', ids: ['knees', 'jack', 'kickfront', 'skater', 'climber', 'box', 'shuffle', 'sprint'], work: 30, rest: 15, rounds: 2 },
  { id: 'legs', name: 'Oyoq va dumba', note: 'Katta mushaklar ishlaydi', ids: ['squat', 'sumosq', 'revlunge', 'donkey', 'bridge', 'calf'], work: 30, rest: 20, rounds: 2 },
  { id: 'abs', name: 'Qorin', note: 'Qorin va bel mushaklari', ids: ['crunch', 'revcrunch', 'bike', 'heeltouch', 'flutter', 'deadbug'], work: 25, rest: 20, rounds: 2 },
  { id: 'upper', name: 'Yuqori tana', note: 'Ko‘krak, yelka, qo‘l, orqa (2 ta suv shishasi kerak)', ids: ['kneepush', 'tricdip', 'shouldertap', 'latraise', 'bottlerow', 'superman'], work: 30, rest: 20, rounds: 2 },
  { id: 'stretch', name: 'Cho‘zilish', note: 'Mashqdan keyin yoki kechqurun', ids: ['quadst', 'hipflex', 'hamst', 'figure4', 'chestst', 'shouldst', 'catcow', 'childpose'], work: 30, rest: 5, rounds: 1, fixed: true, restName: 'Keyingi holatga o‘ting', restTip: 'Tanani bo‘shating, chuqur nafas oling', restPhase: 'KEYINGISI' },
];

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
