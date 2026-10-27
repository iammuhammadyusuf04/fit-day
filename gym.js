'use strict';

// ---------- Trenajor zali: bo‘limlar, trenajorlar, mashqlar, reja va kardio seanslari ----------
// Har bir mashqning id si uning animatsiya sahnasi (scenes-*.js) bilan bir xil.

const CATS = {
  cardio: 'Kardio', legs: 'Oyoq va dumba', chest: 'Ko‘krak', back: 'Orqa',
  shoulder: 'Yelka', arms: 'Qo‘l', core: 'Qorin', stretch: 'Cho‘zilish',
};

// Trenajorlar: nomi, ustida yozilgan inglizcha nomi, zalda qayerda turishi, qanday ko‘rinishi
const EQUIP = {
  treadmill: {
    name: 'Yugurish yo‘lagi', en: 'Treadmill', zone: 'Kardio zonasi',
    look: 'Harakatlanuvchi tasmali uzun trenajor. Old tomonida ekran (tezlik, qiyalik, vaqt), ikki yonida ushlash uchun tutqichlar bor. Qizil kalit (shnur) favqulodda to‘xtatish uchun.',
  },
  elliptical: {
    name: 'Ellips trenajor (orbitrek)', en: 'Elliptical', zone: 'Kardio zonasi',
    look: 'Ikkita pedal va ikkita harakatlanuvchi tutqichli trenajor. Oyoqlar pedalda ellips shaklida yuradi, qo‘llar tutqichlarni itarib-tortadi. Yugurishdan farqli, tizzaga zarba tushmaydi.',
  },
  velo: {
    name: 'Velotrenajor', en: 'Stationary / Upright Bike', zone: 'Kardio zonasi',
    look: 'Joyida turadigan velosiped: o‘rindiq, rul va pedallar; old tomonda og‘irlik beruvchi g‘ildirak. Ekrandan qarshilik (resistance) darajasi tanlanadi.',
  },
  rower: {
    name: 'Eshkak trenajori', en: 'Rowing Machine', zone: 'Kardio zonasi',
    look: 'Uzun relsli trenajor: relsda surilib yuradigan o‘rindiq, tasmali oyoq tayanchi, old tomonda katta g‘ildirak va zanjir bilan bog‘langan tutqich.',
  },
  stairs: {
    name: 'Zinapoya trenajori', en: 'Stair Climber / Stepper', zone: 'Kardio zonasi',
    look: 'Ikkita pedalli (yoki aylanuvchi zinapoyali) trenajor: pedallar navbat bilan pastga botadi, siz esa zinapoyadan chiqayotgandek bo‘lasiz. Old tomonda tutqich va ekran.',
  },
  legpress: {
    name: 'Oyoq pressi', en: 'Leg Press', zone: 'Kuch mashinalari zonasi',
    look: 'Qiyshaygan o‘rindiq va sirpanuvchi platforma. Siz yarim yotgan holatda oyoqlaringiz bilan platformani itarasiz. Plastinalar (disklar) osiladigan yoki pin bilan og‘irlik tanlanadigan turi bor.',
  },
  legext: {
    name: 'Oyoqni to‘g‘rilash trenajori', en: 'Leg Extension', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tirib bajariladigan trenajor: boldir oldida rolik (yumshoq g‘altak) bor, oyoqni tizzadan ko‘tarib to‘g‘rilaysiz. Yon tomonda og‘irlik to‘plami (temir plastinalar ustuni) va pin bor.',
  },
  legcurl: {
    name: 'Oyoqni bukish trenajori', en: 'Seated Leg Curl', zone: 'Kuch mashinalari zonasi',
    look: 'O‘rindiq, son ustida tayanch yostiq va boldir orqasida rolik; tovonni dumbangizga qarab tortasiz.',
  },
  hipabd: {
    name: 'Oyoqni yon tomonga ochish trenajori', en: 'Hip Abduction', zone: 'Kuch mashinalari zonasi',
    look: 'O‘rindiq va tizzalarning tashqarisiga qo‘yiladigan ikkita yostiq; oyoqlarni yon tomonga ochasiz. Ko‘pincha ochish va yig‘ish bitta mashinada bo‘ladi.',
  },
  hipadd: {
    name: 'Oyoqni yig‘ish trenajori', en: 'Hip Adduction', zone: 'Kuch mashinalari zonasi',
    look: 'Ochish trenajoriga o‘xshaydi, lekin yostiqlar tizzalarning ichkarisida turadi; oyoqlarni birlashtirasiz.',
  },
  calf: {
    name: 'Boldir trenajori', en: 'Seated Calf Raise', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tirib bajariladi: tizza ustida yostiq, oyoq uchlari kichik platformada; tovonni ko‘tarasiz.',
  },
  smith: {
    name: 'Smit mashinasi', en: 'Smith Machine', zone: 'Erkin og‘irliklar zonasi',
    look: 'Shtanga ikki vertikal reyka (rels) bo‘ylab yuqoriga-pastga yuradi; ilgaklar yordamida istalgan balandlikda to‘xtatish mumkin. Shtanga yon tomonga yiqilmaydi — boshlovchi uchun xavfsizroq.',
  },
  dumbbell: {
    name: 'Gantellar', en: 'Dumbbells', zone: 'Erkin og‘irliklar zonasi',
    look: 'Qisqa dastali, ikki uchida og‘irligi bor temir tayoqchalar. Tokchada (stellaj) yengilidan og‘iriga qarab tartib bilan turadi, har birida kilogrammi yozilgan.',
  },
  bench: {
    name: 'Skameyka va gantellar', en: 'Flat Bench + Dumbbells', zone: 'Erkin og‘irliklar zonasi',
    look: 'Tekis, yumshoq skameyka: ustiga orqangiz bilan yotasiz. Gantellar yaqin atrofdagi tokchada turadi.',
  },
  chestpress: {
    name: 'Ko‘krak pressi trenajori', en: 'Chest Press', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tirib bajariladigan trenajor: orqangiz tayanchga yopishgan, ko‘krak oldidagi ikkita tutqichni oldinga itarasiz. Orqada og‘irlik to‘plami va pin bor.',
  },
  pecdeck: {
    name: 'Ko‘krakni yig‘ish trenajori (kapalak)', en: 'Pec Deck / Butterfly', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tirib, tirsaklar (yoki kaftlar) ikkita qanotsimon yostiqqa tayanadi; qo‘llarni ko‘kragingiz oldida bir-biriga yaqinlashtirasiz.',
  },
  latpull: {
    name: 'Yuqori blok (orqani tortish)', en: 'Lat Pulldown', zone: 'Kuch mashinalari zonasi',
    look: 'Tepada g‘altak va uzun tutqich (bar), pastda o‘rindiq va son tayanchi bor. Tutqichni tepadan ko‘kragingizga tortasiz.',
  },
  seatrow: {
    name: 'Pastki blok (gorizontal tortish)', en: 'Seated Cable Row', zone: 'Kuch mashinalari zonasi',
    look: 'Old tomonda pastki g‘altak va tutqich; skameykada o‘tirib, oyoqlarni tayanchga qo‘yib, tutqichni qorin tomon tortasiz.',
  },
  backext: {
    name: 'Bel trenajori (giperekstenziya)', en: 'Back Extension / Roman Chair', zone: 'Kuch mashinalari zonasi',
    look: 'Qiyshaygan yostiq va oyoq rolikli rama: yuzingiz pastga qarab yotib, tanangizni ko‘tarasiz.',
  },
  shpress: {
    name: 'Yelka pressi trenajori', en: 'Shoulder Press', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tirib, yelka balandligidagi tutqichlarni boshingiz ustiga itarasiz. Orqa tayanch va og‘irlik to‘plami bor.',
  },
  cable: {
    name: 'Blok ustuni (kabel)', en: 'Cable Machine', zone: 'Kuch mashinalari zonasi',
    look: 'Baland ustun: tepada va pastda g‘altaklar, ular orqali o‘tgan tros va unga ulanadigan tutqich (arqon, bar) yoki to‘piq tasmasi. Og‘irlik to‘plami ustun ichida turadi.',
  },
  assist: {
    name: 'Yordamchi turnik trenajori', en: 'Assisted Pull-up / Dip Machine', zone: 'Kuch mashinalari zonasi',
    look: 'Tepada tutqichlar, pastda tizza qo‘yiladigan harakatlanuvchi platforma va og‘irlik to‘plami. Platforma og‘irlik bilan qarama-qarshi ishlaydi: pin og‘irroq bo‘lsa, tortilish OSONROQ bo‘ladi.',
  },
  abmach: {
    name: 'Qorin trenajori', en: 'Ab Crunch Machine', zone: 'Kuch mashinalari zonasi',
    look: 'O‘tiriladigan, ko‘krak yostig‘i bor trenajor: tanangizni oldinga bukib, qorin mushaklarini qisasiz.',
  },
  captain: {
    name: 'Vertikal stul (Captain’s Chair)', en: 'Captain’s Chair / Vertical Knee Raise', zone: 'Kuch mashinalari zonasi',
    look: 'Orqa tayanch va tirsak yostiqlari bor rama: tirsaklar yostiqda, oyoqlar osilib turadi; tizzalarni ko‘kragingizga ko‘tarasiz.',
  },
  mat: {
    name: 'Gilam (mat) zonasi', en: 'Mat / Stretching Area', zone: 'Cho‘zilish zonasi',
    look: 'Yumshoq gilamlar yotqizilgan bo‘sh joy: qorin mashqlari va cho‘zilish shu yerda bajariladi. Ba’zida ko‘pik rolik va to‘plar ham bo‘ladi.',
  },
};

// Mashqlar. kind: 'sets' (yondashuv × takror), 'min' (daqiqa), 'hold' (soniya ushlash), 'stretch' (cho‘zilish).
const EX = {
  // ===== KARDIO =====
  tread_walk: {
    eq: 'treadmill', name: 'Yo‘lakda tez yurish', cat: 'cardio', lvl: 1, kind: 'min', n: 20,
    muscles: 'Oyoq va dumba mushaklari, yurak va nafas tizimi.',
    tip: 'Gaplashsa bo‘ladi, lekin qo‘shiq aytib bo‘lmaydigan tezlikda yuring.',
    setup: [
      'Xavfsizlik shnurini (qizil kalit) kiyimingizga qistiring — yiqilsangiz, yo‘lak o‘zi to‘xtaydi.',
      'Yo‘lak to‘xtab turganda tasmaning ikki yonidagi qo‘zg‘almas taxtalarga turing.',
      'START (BOSHLASH) tugmasini bosing, tezlikni SPEED ▲ tugmasi bilan 3–4 km/soat (ekranda km/h) ga qo‘ying.',
      'Tasma yurib ketgach, oyoqlaringizni tasmaga o‘tkazing, keyin tezlikni asta oshiring.',
    ],
    how: [
      'Tik turing, ko‘z oldinga qarasin, yelkalar bo‘sh.',
      'Qadamlar tabiiy: tovondan oyoq uchiga yumshoq tushing.',
      'Qo‘llar tirsakdan bukilgan va erkin silkinadi — tutqichdan ushlab olmang (muvozanat yo‘qolsa, ushlang).',
      'Tezlikni 5–6 km/soat gacha oshiring: gaplasha olasiz, lekin qo‘shiq aytib bo‘lmaydi.',
      'Oxirida tezlikni sekin kamaytirib 2–3 daqiqa yuring, keyin STOP (TO‘XTATISH) bosing.',
    ],
    start: 'Boshlash: 4–5 km/soat, qiyalik 0%. Qizish uchun 5 daqiqa, asosiy mashq sifatida 20–30 daqiqa.',
    mistakes: [
      'Tutqichga og‘irlik bilan osilib yurish — kaloriya kam yoqiladi, holat buziladi.',
      'Tasmaning old qismiga juda yaqin turish yoki telefonga tikilib boshni egish.',
      'Tezlikni birdan keskin oshirish.',
      'Tizzada og‘riq sezsangiz — tezlikni kamaytiring yoki to‘xtating.',
    ],
  },
  tread_incline: {
    eq: 'treadmill', name: 'Yo‘lakda qiyalikda yurish', cat: 'cardio', lvl: 1, kind: 'min', n: 15,
    muscles: 'Dumba, son orqasi va boldir mushaklari; yurak-qon tomir tizimi (yog‘ yoqish uchun juda yaxshi).',
    tip: 'Tutqichdan ushlamang — qiyalik o‘zi yetarli yuk beradi.',
    setup: [
      'Avval 3–5 daqiqa tekis (0%) yurib qizining.',
      'INCLINE (qiyalik) ▲ tugmasi bilan qiyalikni 1–2% dan boshlab qo‘ying (ekranda %); mashq davomida asta oshirasiz.',
      'Tezlikni 4,5–5 km/soat ga sozlang: qiyalik oshganda yurish qiyinlashadi, shuning uchun tezlik past bo‘lsin.',
    ],
    how: [
      'Tanangizni tik tuting, oldinga sal engashing — lekin tutqichga suyanmang.',
      'Qadamlarni qisqaroq qiling, har qadamda dumbangiz ishlayotganini his qiling.',
      'Qo‘llar tirsakdan bukilib erkin silkinadi.',
      'Qiyalikni har 5 daqiqada 1% oshirishingiz mumkin, lekin nafas qiyinlashsa kamaytiring.',
      'Tugagach qiyalikni 0% ga qaytarib, 2–3 daqiqa sekin yuring.',
    ],
    start: 'Boshlash: qiyalik 2–3%, tezlik 4,5 km/soat, 10–15 daqiqa. Qiyalikni har safar faqat 1% ga oshiring: 8–10% — baland qiyalik, shoshilmang. Har 2 haftada qiyalik yoki vaqtni biroz oshiring.',
    mistakes: [
      'Qiyalik baland, tezlik yuqori bo‘lganda tutqichga yopishib olish — foydasi kamayadi, belga zarar.',
      'Belni egib, orqaga engashib yurish.',
      'Birdan 10–12% qiyalikdan boshlash.',
    ],
  },
  tread_run: {
    eq: 'treadmill', name: 'Yo‘lakda yengil yugurish', cat: 'cardio', lvl: 2, kind: 'min', n: 10,
    muscles: 'Oyoq, dumba va boldir mushaklari, yurak-qon tomir tizimi.',
    tip: 'Boshlovchi uchun: 1 daqiqa yengil yugurish + 2 daqiqa yurish.',
    setup: [
      'Shnurni qistiring, yo‘lakni 4–5 km/soat da ishga tushiring.',
      'Qizish: 5 daqiqa yurib, tezlikni 7–8 km/soat gacha asta oshiring.',
      'Yurishdan yugurishga o‘tganda tutqichni ushlamang; muvozanatni yo‘qotsangiz, yon taxtalarga turing.',
    ],
    how: [
      'Tanani sal oldinga egib, yengil va yumshoq qadamlar bilan yuguring.',
      'Oyoq o‘rta qismi bilan tushing (tovon bilan qattiq urmang), qadamlar tez va kichik.',
      'Qo‘llar 90° bukilgan, oldinga-orqaga silkinadi, yelkalar bo‘sh.',
      'Nafas qisilsa, yurishga o‘ting — interval (yugur-yur) boshlovchi uchun eng yaxshi usul.',
    ],
    start: 'Boshlash: 1 daqiqa yugurish (7–8 km/soat) + 2 daqiqa yurish (4,5 km/soat), 5–6 marta. Vazningiz ko‘p bo‘lsa, avval faqat qiyalikda yurishdan boshlang.',
    mistakes: [
      'Juda uzun qadamlar tashlab, tovon bilan qattiq tushish.',
      'Boshlovchi uchun uzluksiz 20 daqiqa yugurishga urinish.',
      'Tizza yoki boldirda o‘tkir og‘riq sezsa ham davom etish.',
    ],
  },
  elliptical: {
    eq: 'elliptical', name: 'Ellips trenajorda mashq', cat: 'cardio', lvl: 1, kind: 'min', n: 10,
    muscles: 'Oyoq, dumba, yelka va qo‘l mushaklari; butun tana bilan kardio.',
    tip: 'Tizzaga zarba bermaydi — ortiqcha vazn bor bo‘lsa, juda qulay.',
    setup: [
      'Pedallarga tutqichlarni ushlab turib chiqing (pedallardan biri pastda turadi).',
      'Oyoqlarni pedal o‘rtasiga qo‘ying, tovonlar pedalga bosilgan bo‘lsin.',
      'Ekrandan qarshilik (resistance) ni 3–5 ga, vaqtni belgilab START bosing.',
    ],
    how: [
      'Tik turing, ikki qo‘lingiz harakatlanuvchi tutqichlarda.',
      'Oyoqlar bilan “ellips” chizib pedallarni aylantiring; qo‘llar tutqichlarni navbat bilan itarib-tortadi.',
      'Tana tik, qorin tortilgan, tizzalar sal bukik.',
      'Ritm tekis bo‘lsin. Boshlovchi bo‘lsangiz, avval faqat oldinga aylantiring; orqaga aylantirish keyinroq (boshqa mushaklar ishlaydi).',
    ],
    start: 'Boshlash: qarshilik 3–4, 10 daqiqa. Qarshilikni asta 6–7 gacha oshiring.',
    mistakes: [
      'Tutqichga og‘irlik bilan osilib olish.',
      'Tovonlarni pedaldan ko‘tarib, faqat oyoq uchida turish.',
      'Orqani egib, oldinga engashib turish.',
    ],
  },
  velo: {
    eq: 'velo', name: 'Velotrenajorda mashq', cat: 'cardio', lvl: 1, kind: 'min', n: 10,
    muscles: 'Son (oldi va orqasi), dumba, boldir mushaklari; yurak-qon tomir tizimi.',
    tip: 'Pedal pastda turganda tizza deyarli to‘g‘ri bo‘lsin — o‘rindiq balandligini shunga sozlang.',
    setup: [
      'O‘rindiq balandligi: pedal eng pastda turganda oyoq deyarli to‘g‘ri (tizza sal bukik) bo‘lsin. O‘rindiq tagidagi tutqichni bo‘shatib, balandlikni sozlang.',
      'Oyoqlarni pedalga qo‘ying (tasmalar bo‘lsa, mahkamlang).',
      'Qarshilik (resistance) ni 3–5 ga qo‘yib, pedal aylantiring.',
    ],
    how: [
      'Bel tekis, yelkalar bo‘sh, qo‘llar rulda yengil.',
      'Pedalni tekis aylantiring: daqiqasiga 60–80 aylanish (RPM).',
      'Dumba o‘rindiqdan ko‘tarilmasin, tizzalar oldinga qarab yursin (ichkariga yoki tashqariga emas).',
      'Interval uchun: 30 soniya qarshilikni oshiring, keyin 90 soniya yengil aylantiring.',
    ],
    start: 'Boshlash: qarshilik 3–4, 10 daqiqa. Qizish uchun 5 daqiqa yengil aylantirish ham mos.',
    mistakes: [
      'O‘rindiq juda past — tizzalar zo‘riqadi.',
      'Rulga og‘irlik tashlab, yelkalarni ko‘tarib turish.',
      'Dumbani o‘rindiqda tebratib o‘tirish.',
    ],
  },
  rower: {
    eq: 'rower', name: 'Eshkak trenajorida mashq', cat: 'cardio', lvl: 2, kind: 'min', n: 5,
    muscles: 'Butun tana: oyoq, dumba, orqa, yelka va qo‘l mushaklari.',
    tip: 'Kuch oyoqdan: avval oyoqlar, keyin tana, oxirida qo‘llar.',
    setup: [
      'Oyoqlarni tayanchga qo‘yib, tasmalarni to‘piqqa yaqin qismdan mahkamlang.',
      'Damper (g‘ildirak yonidagi dastak) ni 3–5 ga qo‘ying — ko‘pchilik uchun eng mos; 10 ga qo‘ymang, tez charchatadi.',
      'Tutqichni ushlang va o‘rindiqda to‘g‘ri o‘tiring.',
    ],
    how: [
      '1) Boshlanish: tizzalar bukilgan, qo‘llar oldinga cho‘zilgan, tana sal oldinga egilgan.',
      '2) Oyoqlar bilan itaring (o‘rindiq orqaga suriladi) — qo‘llar hali to‘g‘ri.',
      '3) Keyin tanani sal orqaga og‘dirib, tutqichni ko‘krak ostiga (pastki qovurg‘a) torting.',
      '4) Qaytishda teskari tartibda: avval qo‘llar, keyin tana, oxirida tizzalar buklanadi.',
      'Ritm: itarish — 1 soniya, qaytish — 2 soniya, daqiqasiga 18–24 zarba.',
    ],
    start: 'Boshlash: avval faqat oyoqlar bilan itarishni mashq qiling (qo‘llar to‘g‘ri), keyin tanani, so‘ng qo‘llarni qo‘shing. 2–3 daqiqa yengil eshkak, keyin dam; jami 5–10 daqiqa. Texnikani birinchi marta trener bilan ko‘rib chiqing.',
    mistakes: [
      'Birinchi bo‘lib qo‘llar bilan tortish — kuch faqat qo‘ldan chiqadi.',
      'Belni dumaloqlab, orqaga haddan ortiq yotib ketish.',
      'Tizzalar qulflanib, damperni 10 ga qo‘yish.',
    ],
  },
  stairs: {
    eq: 'stairs', name: 'Zinapoya trenajorida chiqish', cat: 'cardio', lvl: 2, kind: 'min', n: 8,
    muscles: 'Son, dumba va boldir mushaklari; yurak va nafas tizimi.',
    tip: 'Tutqichga yengil tegib turing, og‘irlikni oyog‘ingizga tashlang.',
    setup: [
      'Pedallarga (yoki zinapoyaga) chiqib, tutqichni ushlang.',
      'Tezlik (SPEED/LEVEL) ni eng pastdan, 2–3 darajadan boshlang.',
    ],
    how: [
      'Tik turing, butun oyoq tagi pedal/zinaga tegsin.',
      'Navbat bilan “zinapoyadan chiqing”; tutqichni faqat muvozanat uchun ushlang.',
      'Qadamlar bir tekis, nafas ritmik bo‘lsin.',
    ],
    start: 'Boshlash: 5–8 daqiqa, past daraja. Bu trenajor juda zo‘riqtiradi — oson boshlang.',
    mistakes: [
      'Tutqichga osilib, oyoq uchida turish.',
      'Juda baland daraja bilan boshlash.',
      'Tizzalarni ichkariga burib qo‘yish.',
    ],
  },

  // ===== OYOQ VA DUMBA =====
  legpress: {
    eq: 'legpress', name: 'Oyoq pressi', cat: 'legs', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Son oldi, son orqasi va dumba mushaklari.',
    tip: 'Tizzalarni oxirigacha qulflamang, dumbani o‘rindiqdan ko‘tarmang.',
    setup: [
      'Pin bilan eng yengil og‘irlikni tanlang. (Plastinali mashinada platformaning o‘zi ham og‘ir — dastlab plastinasiz boshlang.)',
      'O‘rindiq tayanchini surib, tizzalaringiz bukilganda taxminan 90° bo‘ladigan joyni toping.',
      'Oyoqlarni platformaning o‘rtasiga, yelka kengligida yoki sal kengroq, oyoq uchlari sal tashqariga qaratib qo‘ying; dumba va bel o‘rindiqqa yopishsin.',
      'Yon tutqichlardan ushlang. Avval platformani oyoqlar bilan itarib ko‘taring, keyin xavfsizlik ilgaklarini (safety) bo‘shating.',
    ],
    how: [
      'Nafas oling va tizzalarni sekin bukib, platformani o‘zingizga yaqinlashtiring (2–3 soniya).',
      'Tizzalar ko‘kragingizga juda yaqinlashmasin; dumba o‘rindiqdan ko‘tarilmasin.',
      'Nafas chiqarib, tovonlar bilan itarib oyoqlarni to‘g‘rilang — tizzalarni oxirigacha qulflab yubormang.',
      'Yuqorida bir lahza to‘xtang va sekin qaytaring.',
      'Tugagach platformani to‘liq ko‘tarib, xavfsizlik ilgaklarini qaytarib ulang — shundan keyingina oyoqlarni olib qo‘ying.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 yondashuv × 12 takror, yondashuvlar orasida 60–90 soniya dam.',
    mistakes: [
      'Tizzalarni oxirigacha to‘g‘rilab qulflash — bo‘g‘imga zarar.',
      'Dumbani o‘rindiqdan ko‘tarib, belni dumaloqlash.',
      'Tizzalar ichkariga qulab kirishi.',
      'Og‘irlikni juda ko‘p qo‘yib, tez-tez urib bajarish.',
    ],
  },
  legext: {
    eq: 'legext', name: 'Oyoqni to‘g‘rilash', cat: 'legs', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Son oldi mushagi (kvadritseps).',
    tip: 'Yuqorida bir lahza ushlang, pastga sekin tushiring.',
    setup: [
      'Orqa tayanchni suring: tizzangiz mashinaning aylanish o‘qi (mil) bilan bir chiziqda bo‘lsin.',
      'Rolik (yostiq) to‘piq ustida, boldirning pastki qismida turishi kerak.',
      'Pin bilan yengil og‘irlik tanlang; yon tutqichlardan ushlang.',
    ],
    how: [
      'Nafas chiqarib, oyoqlarni tizzadan sekin to‘g‘rilang.',
      'Yuqorida 1 soniya ushlab, son oldi qisilishini his qiling.',
      'Nafas olib, 2–3 soniyada sekin tushiring — og‘irlikni “tashlab” yubormang.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12. Tizza bilan muammo bo‘lsa, trenerga ayting.',
    mistakes: [
      'Tizzani oxirigacha qulflab, urib to‘g‘rilash.',
      'Og‘irlikni tebratib, tana bilan yordam berish.',
      'Dumbani o‘rindiqdan ko‘tarish.',
    ],
  },
  legcurl: {
    eq: 'legcurl', name: 'Oyoqni bukish', cat: 'legs', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Son orqasi mushaklari.',
    tip: 'Tovonni dumbaga tortishda dumbani o‘rindiqdan ko‘tarmang.',
    setup: [
      'Tizzangiz mashina o‘qi bilan bir chiziqda bo‘lsin.',
      'Rolik to‘piq orqasida, tayanch yostiq son ustida turishi kerak.',
      'Yengil og‘irlik tanlang, tutqichlardan ushlang.',
    ],
    how: [
      'Nafas chiqarib, tovonlarni dumbangiz tomon sekin tortib oyoqlarni bukasiz.',
      'Pastda 1 soniya ushlang.',
      'Nafas olib, 2–3 soniyada oyoqlarni sekin to‘g‘rilang.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Dumbani ko‘tarib, belni egish.',
      'Oyoqlarni tez silkib tortish.',
      'Qaytishda og‘irlikni “tashlab” yuborish.',
    ],
  },
  hipabd: {
    eq: 'hipabd', name: 'Oyoqni yon tomonga ochish', cat: 'legs', lvl: 1, kind: 'sets', n: 15,
    muscles: 'Dumba (yon qismi) va tashqi son mushaklari.',
    tip: 'Sekin oching, qisqa to‘xtang, nazorat bilan qaytaring.',
    setup: [
      'O‘rindiqda orqangiz bilan tayanchga yopishib o‘tiring.',
      'Yostiqlar tizzalaringizning TASHQI tomonida bo‘lishi kerak; oyoqlar yaqin turgan boshlang‘ich holatni tanlang.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Nafas chiqarib, oyoqlarni yon tomonga sekin oching.',
      'Eng keng nuqtada 1 soniya to‘xtang.',
      'Nafas olib, sekin birlashtiring — yostiqlarni “urib” yubormang.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 15.',
    mistakes: [
      'Tanani oldinga egib, itarishga yordam berish.',
      'Juda og‘ir tanlash va jerk (silkitish) bilan bajarish.',
    ],
  },
  hipadd: {
    eq: 'hipadd', name: 'Oyoqni yig‘ish', cat: 'legs', lvl: 1, kind: 'sets', n: 15,
    muscles: 'Ichki son mushaklari.',
    tip: 'Boshlang‘ich kenglikni juda katta qilmang.',
    setup: [
      'Yostiqlar tizzalaringizning ICHKI tomonida bo‘lishi kerak (ochish mashinasi bilan bir xil bo‘lsa, yostiqlarni burib almashtiring).',
      'Boshlang‘ich kenglikni qulay (juda keng emas) qilib, tutqich bilan belgilang.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Nafas chiqarib, oyoqlarni sekin birlashtiring.',
      'Birlashgan joyda 1 soniya ushlang.',
      'Nafas olib, oyoqlarni sekin ochib qaytaring.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 15. Ichki sonda tortishish sezsangiz, kenglikni kamaytiring.',
    mistakes: [
      'Boshlang‘ich kenglikni juda katta qilib, mushakni zo‘riqtirish.',
      'Yostiqlarni tez urib yopish.',
    ],
  },
  calf: {
    eq: 'calf', name: 'Boldir ko‘tarish', cat: 'legs', lvl: 1, kind: 'sets', n: 15,
    muscles: 'Boldir mushaklari.',
    tip: 'To‘liq balandlikka ko‘taring va tovonni pastga to‘liq tushiring.',
    setup: [
      'Oyoq uchlarini platforma chetiga qo‘ying — tovonlar havoda qoladi.',
      'Tizza ustidagi yostiqni tizzaga yaqin joyga tushiring.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Tovonlarni imkon qadar baland ko‘taring.',
      'Yuqorida 1–2 soniya ushlang.',
      'Sekin pastga tushing, tovon platforma sathidan pastga tushib boldir cho‘zilsin.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 15.',
    mistakes: [
      'Tez-tez sakrab, amplitudani qisqa qilish.',
      'Tizzalarni oldinga-orqaga siljitish.',
    ],
  },
  smithsq: {
    eq: 'smith', name: 'Smit mashinasida squat', cat: 'legs', lvl: 2, kind: 'sets', n: 10,
    muscles: 'Son oldi, dumba va son orqasi mushaklari.',
    tip: 'Birinchi marta trener yoki sherik yordamida bajaring.',
    setup: [
      'Shtanga balandligini yelka balandligiga qo‘ying. Xavfsizlik ilgaklarini eng pastki holatingizdan sal pastroqqa (taxminan tizza balandligiga) qo‘ying — tushib qolsangiz, shtanga ilgakka tayanadi.',
      'Birinchi marta faqat bo‘sh shtanga bilan bajaring (shtanganing o‘zi ham og‘ir).',
      'Shtanganing tagiga kiring, uni bo‘yin emas, yelkaning yuqori orqa qismiga (trapetsiya) qo‘ying.',
      'Oyoqlarni shtangadan sal OLDINGA (taxminan 15–30 sm), yelka kengligida, oyoq uchlari sal tashqariga qaratib qo‘ying.',
      'Shtangani burib (bilaklar bilan) ilgakdan bo‘shating.',
    ],
    how: [
      'Nafas oling, dumbani orqaga surib, tizzalarni bukib sekin pastga tushing.',
      'Sonlar polga deyarli parallel bo‘lguncha tushing; ko‘krak ochiq, orqa tekis.',
      'Tovonlar bilan itarilib, nafas chiqarib tik turing.',
      'Tugagach shtangani ilgakka burab qo‘ying.',
    ],
    start: 'Boshlash: bo‘sh shtanga, 2–3 × 10. Tizzalar oyoq uchidan juda oshib ketmasin.',
    mistakes: [
      'Oyoqlarni shtanga tagiga qo‘yish — tizzaga yuk tushadi.',
      'Tizzalarning ichkariga qulashi.',
      'Og‘irlikni oshirib yuborib, ilgakni bo‘shatishni unutish.',
    ],
  },
  goblet: {
    eq: 'dumbbell', name: 'Gantel bilan squat', cat: 'legs', lvl: 1, kind: 'sets', n: 10,
    muscles: 'Son oldi, dumba, qorin va orqa mushaklari.',
    tip: 'Squatni o‘rganish uchun eng yaxshi mashq.',
    setup: [
      'Tokchadan 6–8 kg li gantelni oling (kilogrammi uchida yozilgan).',
      'Gantelni vertikal ushlab, uning tepa uchidan ikki qo‘llab ko‘kragingiz oldida ushlang.',
      'Oyoqlarni yelka kengligida, oyoq uchlari sal tashqariga qaratib qo‘ying.',
    ],
    how: [
      'Nafas oling, dumbani orqaga surib, tizzalarni bukib pastga tushing.',
      'Tirsaklar tizzalar orasidan o‘tsin, ko‘krak yuqoriga qaragan, orqa tekis.',
      'Sonlar polga parallel bo‘lguncha tushing (qiyin bo‘lsa, sayozroq).',
      'Tovonlar bilan itarilib, nafas chiqarib tik turing.',
    ],
    start: 'Boshlash: 6–8 kg, 2–3 × 10. Tovonlaringiz polga yopishib tursin.',
    mistakes: [
      'Tovonlarni polga ko‘tarish.',
      'Tizzalarni ichkariga qulatish.',
      'Belni dumaloqlab, ko‘krakni tushirib yuborish.',
    ],
  },

  dbrdl: {
    eq: 'dumbbell', name: 'Gantel bilan rumin tortishi (Romanian deadlift)', cat: 'legs', lvl: 2, kind: 'sets', n: 10,
    muscles: 'Son orqasi, dumba va bel mushaklari.',
    tip: 'Dumbani orqaga surib engashing, orqa to‘g‘ri bo‘lsin.',
    setup: [
      'Tokchadan 6–8 kg li ikkita gantelni oling.',
      'Tik turing: oyoqlar yelka kengligida, gantellar sonlaringiz oldida.',
    ],
    how: [
      'Tizzalarni sal bukib, dumbani ORQAGA surib tanani oldinga engashtiring — gantellar oyoqlaringiz bo‘ylab pastga sirpanadi.',
      'Orqa to‘g‘ri (dumaloq emas), nigoh oldinga-pastga. Son orqasida tortilish sezilganda to‘xtang (odatda tizza yoki boldir o‘rtasida).',
      'Tovonlar bilan itarib, dumbani oldinga surib tik turing.',
    ],
    start: 'Boshlash: 6–8 kg dan, 2 × 10. Birinchi marta trenerga ko‘rsating — orqaning tekis bo‘lishi juda muhim.',
    mistakes: [
      'Belni dumaloqlash.',
      'Tizzalarni ko‘p bukib, squatga aylantirish.',
      'Gantellarni tanadan uzoqda tutish.',
    ],
  },
  dblunge: {
    eq: 'dumbbell', name: 'Gantel bilan lunge (qadam tashlab cho‘kish)', cat: 'legs', lvl: 2, kind: 'sets', n: 8, side: true,
    muscles: 'Son oldi, dumba va son orqasi mushaklari.',
    tip: 'Birinchi marta gantelsiz bajarib ko‘ring.',
    setup: [
      'Tokchadan 4–6 kg li gantellarni oling (yoki gantelsiz boshlang).',
      'Oyoqlarni bir chiziq bo‘ylab uzoq masofada qo‘ying: biri oldinda, ikkinchisi orqada (orqa oyoq tovoni ko‘tarilgan).',
      'Yaqinda devor yoki trenajor bo‘lsa, muvozanat uchun ushlab turing.',
    ],
    how: [
      'Tanani tik tutib, ikkala tizzani bukib vertikal pastga tushing.',
      'Oldingi tizza 90° ga yaqin, oyoq uchidan oshmasin; orqa tizza polga yaqinlashadi.',
      'Oldingi oyoq tovoni bilan itarilib tik turing. Bir tomonni tugatib, oyoqlarni almashtiring.',
    ],
    start: 'Boshlash: gantelsiz yoki yengil gantel bilan, har oyoqqa 2 × 8.',
    mistakes: [
      'Qadam juda qisqa — oldingi tizza oyoq uchidan oshib ketadi.',
      'Tanani oldinga egib tashlash.',
      'Orqa tizzani polga urish.',
    ],
  },
  glutekick: {
    eq: 'cable', name: 'Blokda dumba (oyoqni orqaga tepish)', cat: 'legs', lvl: 2, kind: 'sets', n: 12, side: true,
    muscles: 'Dumba mushaklari.',
    tip: 'Oyoqni orqaga tepganda dumbani qisib ushlang, belni egmang.',
    setup: [
      'Pastki g‘altakka to‘piq tasmasini ulang va bir oyoqning to‘pig‘iga bog‘lang.',
      'Pin bilan eng yengil og‘irlikni tanlang.',
      'Ustunga yuzlanib turing, ikki qo‘lingiz bilan tutqichdan ushlang va tanani sal oldinga egib oling.',
    ],
    how: [
      'Tayanch oyoq tizzasini sal bukib turing.',
      'Nafas chiqarib, bog‘langan oyoqni to‘g‘ri holda orqaga va sal yuqoriga ko‘taring.',
      'Yuqorida dumbani 1 soniya qisib ushlang va sekin qaytaring (og‘irlik plastinalari yerga tegmasin).',
      'Bir tomonni tugatib, tasmani boshqa oyoqqa bog‘lang.',
    ],
    start: 'Boshlash: yengil og‘irlik, har oyoqqa 2 × 12.',
    mistakes: [
      'Belni egib, oyoqni haddan ortiq baland ko‘tarish.',
      'Tanani qimirlatib, oyoqni silkitib tepish.',
      'Og‘ir tanlab, harakatni qisqartirish.',
    ],
  },

  // ===== KO‘KRAK =====
  chestpress: {
    eq: 'chestpress', name: 'Ko‘krak pressi', cat: 'chest', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Ko‘krak, yelka oldi va triceps mushaklari.',
    tip: 'Yelkalar orqaga va pastga, bel yostiqqa yopishgan.',
    setup: [
      'O‘rindiq balandligini shunday sozlangki, tutqichlar ko‘krak o‘rtasi balandligida bo‘lsin.',
      'Orqangiz tayanchga yopishsin, oyoqlar polda.',
      'Yengil og‘irlik tanlang (pin bilan).',
    ],
    how: [
      'Tutqichlarni ushlab, yelkalarni orqaga va pastga tushiring.',
      'Nafas chiqarib, tutqichlarni oldinga itaring — qo‘llar deyarli to‘g‘ri (tirsaklarni qulflamang).',
      'Nafas olib, 2–3 soniyada sekin qaytaring: tirsaklar tanadan sal orqada bo‘lsin.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Yelkalarni quloqqa ko‘tarish.',
      'Belni yostiqdan ko‘tarib egish.',
      'Tirsaklarni oxirigacha qulflab yuborish.',
    ],
  },
  pecdeck: {
    eq: 'pecdeck', name: 'Ko‘krakni yig‘ish (kapalak)', cat: 'chest', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Ko‘krak mushaklari (ichki qismi) va yelka oldi.',
    tip: 'Qo‘llarni yig‘ganda ko‘krakni qisib ushlang.',
    setup: [
      'O‘rindiq balandligi: yuqori qo‘llaringiz yelka balandligida polga parallel bo‘lsin.',
      'Tirsaklar (yoki kaftlar) yostiq/tutqichga tayansin; orqa tayanchga yopishing.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Tirsaklar sal bukilgan holatda qotib tursin — butun harakat davomida burchakni o‘zgartirmang.',
      'Nafas chiqarib, yostiqlarni ko‘kragingiz oldida bir-biriga yaqinlashtiring.',
      'Birlashgan joyda 1 soniya ko‘krakni qisib ushlang.',
      'Nafas olib, sekin qaytaring — qo‘llarni yelka chizig‘idan ortiq orqaga ketkazmang.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Yelkalarni oldinga yumalatish.',
      'Qaytishda qo‘llarni haddan ortiq orqaga cho‘zish (yelka bo‘g‘imiga zarar).',
      'Og‘irlikni silkitib qaytarish.',
    ],
  },
  dbbench: {
    eq: 'bench', name: 'Skameykada gantel bilan press', cat: 'chest', lvl: 2, kind: 'sets', n: 10,
    muscles: 'Ko‘krak, yelka oldi va triceps mushaklari.',
    tip: 'Yengil gantellardan boshlang; og‘irroq bo‘lsa, sherik/trener so‘rang.',
    setup: [
      'Tokchadan 4–6 kg li ikkita gantelni oling.',
      'Skameykada o‘tirib, gantellarni tizzangizga qo‘ying.',
      'Orqaga yotib, gantellarni ko‘krak yoniga ko‘taring; oyoqlar polda.',
    ],
    how: [
      'Gantellarni ko‘krak ustiga to‘g‘ri tepaga itaring.',
      'Nafas olib, tirsaklarni tanadan taxminan 45° da bukib, gantellarni ko‘krak balandligigacha tushiring.',
      'Nafas chiqarib, tepaga itaring — qo‘llar to‘g‘ri, lekin tirsaklar qulflanmasin.',
      'Tugagach gantellarni tizzaga qo‘yib, o‘tirib oling; ularni polga tashlab yubormang.',
    ],
    start: 'Boshlash: 4–6 kg dan, 2–3 × 10. Gantellarni hech qachon qo‘ldan tashlab yubormang — tizzaga qo‘yib, keyin polga qo‘ying.',
    mistakes: [
      'Tirsaklarni juda yon tomonga (90°) yoyish.',
      'Belni skameykadan ko‘tarib egish.',
      'Gantellarni tizzaga qo‘ymasdan, yotgan holda polga tashlash.',
    ],
  },

  // ===== ORQA =====
  latpull: {
    eq: 'latpull', name: 'Yuqori blok (orqani tortish)', cat: 'back', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Orqa keng mushaklari, yelka orqasi va biceps.',
    tip: 'Tutqichni ko‘kragingizga tortib, tirsaklarni pastga yo‘naltiring.',
    setup: [
      'Son tayanchini shunday tushiringki, sonlaringiz uning ostida mahkam tursin.',
      'Pin bilan yengil og‘irlik tanlang.',
      'Tutqichni yelkadan sal keng, kaft pastga qaratib ushlang, keyin o‘tiring.',
    ],
    how: [
      'Tanani biroz orqaga og‘dirib, ko‘krakni oldinga chiqaring, nigoh tutqichda.',
      'Nafas chiqarib, tirsaklarni pastga va orqaga yo‘naltirib, tutqichni ko‘krakning yuqori qismiga torting.',
      'Pastda kurak suyaklaringizni qisib, 1 soniya ushlang.',
      'Nafas olib, tutqichni sekin tepaga qaytaring (qo‘llar to‘liq cho‘zilguncha).',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Tutqichni bosh orqasiga (ensaga) tortish — yelkaga zarar.',
      'Tanani oldinga-orqaga tebratib tortish.',
      'Yelkalarni quloqqa ko‘tarish.',
    ],
  },
  seatrow: {
    eq: 'seatrow', name: 'Pastki blok (gorizontal tortish)', cat: 'back', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Orqa o‘rta qismi, kurak atrofi va biceps.',
    tip: 'Orqa tekis; tortganda kurak suyaklarini qising.',
    setup: [
      'Oyoqlarni tayanchga qo‘ying, tizzalar sal bukik bo‘lsin.',
      'Yengil og‘irlik tanlang, tutqichni (V-bar) ushlang.',
      'Orqani tekislab o‘tiring, ko‘krak oldinga.',
    ],
    how: [
      'Nafas chiqarib, tutqichni qorin pastki qismi/qovurg‘a tomon torting.',
      'Tortganda tirsaklar tanaga yaqin, kurak suyaklari bir-biriga qisilsin.',
      'Nafas olib, 2–3 soniyada qo‘llarni sekin oldinga cho‘zing — orqani dumaloqlamang.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Belni dumaloqlab, tanani oldinga tashlash.',
      'Tanani orqaga qattiq yotqizib, momentum bilan tortish.',
      'Yelkalarni ko‘tarib tortish.',
    ],
  },
  backext: {
    eq: 'backext', name: 'Belni mustahkamlash (giperekstenziya)', cat: 'back', lvl: 2, kind: 'sets', n: 10,
    muscles: 'Bel, dumba va son orqasi mushaklari.',
    tip: 'Yuqorida tanani haddan ortiq egmang — faqat to‘g‘ri chiziqqacha.',
    setup: [
      'Yostiqni son suyagingiz (tos qirrasi) ostiga tushiring — shunda tana erkin bukila oladi.',
      'To‘piqlaringizni rolik ostiga qo‘ying; oyoqlar to‘g‘ri.',
      'Qo‘llarni ko‘krak ustida kesishtiring.',
    ],
    how: [
      'Orqani tekis tutib, tanani sekin pastga tushiring (taxminan 90° gacha).',
      'Dumba va bel mushaklari bilan tanani ko‘taring, bosh va tana bir chiziqda bo‘lguncha.',
      'Yuqorida bir lahza to‘xtab, sekin qaytaring.',
    ],
    start: 'Boshlash: qo‘shimcha og‘irliksiz, 2 × 10. Belda og‘riq bo‘lsa, trenerga ko‘rsating.',
    mistakes: [
      'Yuqorida orqani haddan ortiq egib yuborish.',
      'Tezlik bilan tebranish.',
      'Belda og‘riq bor paytda bajarish.',
    ],
  },

  assistpull: {
    eq: 'assist', name: 'Yordamchi turnik (Assisted Pull-up)', cat: 'back', lvl: 2, kind: 'sets', n: 8,
    muscles: 'Orqa keng mushaklari, yelka orqasi va biceps.',
    tip: 'Pin og‘irroq = yordam ko‘proq = osonroq.',
    setup: [
      'Pin bilan YORDAM og‘irligini tanlang: katta og‘irlik — ko‘p yordam (osonroq). Boshlovchi uchun odatda vazningizning yarmidan ko‘prog‘i yordam qilib qo‘yiladi.',
      'Tizzalaringizni platformaga qo‘ying (yoki oyoqlarni tayanchga qo‘ying).',
      'Tutqichlarni yelkadan sal keng, kaft oldinga qaratib ushlang.',
    ],
    how: [
      'Yelkalarni pastga tushirib, kurak suyaklarini qisib, tanani tepaga torting.',
      'Iyak tutqich balandligiga yetguncha tortib, 1 soniya ushlang.',
      'Sekin pastga tushing — qo‘llar to‘liq cho‘zilguncha (yelkani qulatmang).',
    ],
    start: 'Boshlash: 6–8 ta toza takror bajara oladigan yordamni tanlang (oxirgi takror qiyin bo‘lsin). 12 tadan ortiq oson bo‘lsa — yordamni kamaytiring; 3 ta toza takror ham bo‘lmasa — oshiring. Yelkangizda shikast bo‘lgan bo‘lsa, trener bilan maslahatlashing.',
    mistakes: [
      'Sakrab yoki silkib ko‘tarilish.',
      'Pastda yelkani qulatib, qo‘llarni sal bukib qo‘yish.',
      'Yordamni juda kam qo‘yib, harakatni to‘liq bajara olmaslik.',
    ],
  },

  // ===== YELKA =====
  shpress: {
    eq: 'shpress', name: 'Yelka pressi', cat: 'shoulder', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Yelka mushaklari va triceps.',
    tip: 'Bel tayanchga yopishgan, boshni oldinga cho‘zmang.',
    setup: [
      'O‘rindiq balandligi: tutqichlar yelka balandligida bo‘lsin.',
      'Orqangiz tayanchga yopishsin, oyoqlar polda.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Tutqichlarni ushlab, nafas chiqarib, boshingiz ustiga itaring — qo‘llar deyarli to‘g‘ri.',
      'Tirsaklarni qulflamang.',
      'Nafas olib, 2–3 soniyada yelka balandligigacha sekin tushiring.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Belni egib, ko‘krakni oldinga chiqarish.',
      'Yelkalarni quloqqa ko‘tarish.',
      'Tutqichlarni tez tashlab yuborish.',
    ],
  },
  latraise: {
    eq: 'dumbbell', name: 'Gantel bilan qo‘llarni yonga ko‘tarish', cat: 'shoulder', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Yelka yon qismi (deltoid).',
    tip: 'Juda yengil gantel oling — bu kichik mushak.',
    setup: [
      'Tokchadan 2–4 kg li gantellarni oling.',
      'Oyoqlar yelka kengligida, tik turing; gantellar tanangiz yonida.',
    ],
    how: [
      'Tirsaklarni sal bukib, qo‘llarni yon tomonga yelka balandligigacha ko‘taring.',
      'Harakatni tirsak boshlasin: bilaklar tirsakdan sal pastroqda yoki bir xil balandlikda tursin.',
      'Yuqorida 1 soniya ushlab, 2–3 soniyada sekin tushiring.',
    ],
    start: 'Boshlash: 2–4 kg dan, 2–3 × 12.',
    mistakes: [
      'Tanani silkitib, gantelni “otib” ko‘tarish.',
      'Qo‘llarni yelka chizig‘idan baland ko‘tarish.',
      'Juda og‘ir gantel olish.',
    ],
  },

  // ===== QO‘L =====
  tripush: {
    eq: 'cable', name: 'Blokda triceps (pastga itarish)', cat: 'arms', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Qo‘lning orqa qismi (triceps).',
    tip: 'Tirsaklar tanaga yopishgan va joyidan qimirlamaydi.',
    setup: [
      'Tepadagi g‘altakka arqon yoki to‘g‘ri tutqichni (bar) mahkamlang.',
      'Pin bilan yengil og‘irlik tanlang.',
      'Ustun oldida yaqin turing, oyoqlar yelka kengligida, tanani sal oldinga egib turing.',
    ],
    how: [
      'Tirsaklarni tanangizga yopishtiring.',
      'Nafas chiqarib, tutqichni pastga qarab qo‘llar to‘liq to‘g‘rilangunga qadar itaring.',
      'Pastda tricepsni qisib 1 soniya ushlang.',
      'Nafas olib, tutqichni sekin ko‘tarib, bilaklar polga parallel bo‘lguncha qaytaring.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 12.',
    mistakes: [
      'Tirsaklarni oldinga/yonga yurgizish.',
      'Tanani tutqich ustiga tashlab, og‘irlik bilan itarish.',
      'Qaytishda tutqichni juda baland ko‘tarish.',
    ],
  },
  bicurl: {
    eq: 'dumbbell', name: 'Gantel bilan biceps', cat: 'arms', lvl: 1, kind: 'sets', n: 12,
    muscles: 'Qo‘lning old qismi (biceps).',
    tip: 'Tirsaklar joyida, tanani silkitmang.',
    setup: [
      'Tokchadan 3–5 kg li gantellarni oling.',
      'Oyoqlar yelka kengligida tik turing, qo‘llar tana yonida, kaftlar oldinga.',
    ],
    how: [
      'Tirsaklarni tanaga yaqin ushlab, gantellarni yelkalarga qarab ko‘taring.',
      'Yuqorida 1 soniya qisib ushlang.',
      '2–3 soniyada sekin to‘liq tushiring.',
    ],
    start: 'Boshlash: 3–5 kg dan, 2–3 × 12.',
    mistakes: [
      'Tanani orqaga-oldinga tebratib ko‘tarish.',
      'Tirsaklarni oldinga surish.',
      'Pastda qo‘lni to‘liq to‘g‘rilamay, qisqa amplitudada bajarish.',
    ],
  },

  // ===== QORIN =====
  abmach: {
    eq: 'abmach', name: 'Qorin trenajori', cat: 'core', lvl: 1, kind: 'sets', n: 15,
    muscles: 'Qorin mushaklari (to‘g‘ri qorin).',
    tip: 'Tanani qorin bilan bukasiz, qo‘l bilan tortmaysiz.',
    setup: [
      'O‘rindiq balandligini sozlang: ko‘krak yostig‘i ko‘kragingizning yuqori qismiga tegsin.',
      'Oyoqlarni rolik tagiga qo‘ying (bo‘lsa), tutqichlardan yengil ushlang.',
      'Yengil og‘irlik tanlang.',
    ],
    how: [
      'Nafas chiqarib, qorin mushaklarini qisib, tanani oldinga buking.',
      'Pastda 1 soniya ushlang.',
      'Nafas olib, sekin boshlang‘ich holatga qayting.',
    ],
    start: 'Boshlash: yengil og‘irlik, 2–3 × 15.',
    mistakes: [
      'Qo‘l va yelka kuchi bilan tortish.',
      'Bel va sonlar bilan “urib” bajarish.',
      'Nafasni ushlab turish.',
    ],
  },
  legraise: {
    eq: 'captain', name: 'Vertikal stulda oyoq ko‘tarish', cat: 'core', lvl: 2, kind: 'sets', n: 10,
    muscles: 'Pastki qorin va son bukuvchi mushaklar.',
    tip: 'Oson variant: tizzalarni bukib ko‘taring.',
    setup: [
      'Orqangizni tayanchga yopishtiring, tirsaklarni yostiqlarga qo‘ying.',
      'Tutqichlarni ushlang; oyoqlar osilib turadi.',
    ],
    how: [
      'Nafas chiqarib, tizzalarni ko‘kragingizga qarab ko‘taring (orqa tayanchda qolsin).',
      'Yuqorida 1 soniya ushlang.',
      'Nafas olib, oyoqlarni sekin tushiring — tebranmang.',
    ],
    start: 'Boshlash: tizzani bukib, 2 × 8–10. Qiyinlashtirish uchun oyoqlarni to‘g‘ri ko‘taring.',
    mistakes: [
      'Tanani tebratib, oyoqlarni “silkib” ko‘tarish.',
      'Belni tayanchdan ajratib, egib yuborish.',
    ],
  },
  plankmat: {
    eq: 'mat', name: 'Plank (gilam ustida)', cat: 'core', lvl: 1, kind: 'hold', n: 20,
    muscles: 'Qorin, bel va yelka mushaklari.',
    tip: 'Tana boshdan tovongacha bir to‘g‘ri chiziq.',
    setup: [
      'Gilamni oling, bo‘sh joyga yoying.',
      'Qorin bilan yoting, tirsaklarni yelka ostiga qo‘ying.',
    ],
    how: [
      'Bilaklarga va oyoq uchlariga tayanib, tanani yerdan ko‘taring.',
      'Boshdan tovongacha bir to‘g‘ri chiziq: dumba tushib ketmasin va juda baland ham bo‘lmasin.',
      'Qorinni tortib, nafasni ushlamay turing.',
    ],
    start: 'Boshlash: 20 soniya × 2–3 marta. Qiyin bo‘lsa, tizzalarda turib bajaring.',
    mistakes: [
      'Belni cho‘ktirib yuborish.',
      'Dumbani baland ko‘tarish.',
      'Nafasni ushlab turish.',
    ],
  },
  crunchmat: {
    eq: 'mat', name: 'Qorin buklash (gilamda)', cat: 'core', lvl: 1, kind: 'sets', n: 12,
    muscles: 'To‘g‘ri qorin mushaklari.',
    tip: 'Bo‘yinni qo‘l bilan tortmang — ko‘z shiftga qarasin.',
    setup: [
      'Gilamga orqangiz bilan yoting, tizzalar bukilgan, tovonlar polda.',
      'Qo‘llarni quloq yoniga yoki ko‘krak ustiga qo‘ying.',
    ],
    how: [
      'Nafas chiqarib, qorinni qisib, yelka pichoqlarini yerdan ko‘taring.',
      'Yuqorida 1 soniya ushlang.',
      'Nafas olib, sekin yoting.',
    ],
    start: 'Boshlash: 2–3 × 12. Belni gilamdan uzmang.',
    mistakes: [
      'Qo‘l bilan bo‘yinni oldinga tortish.',
      'Butunlay o‘tirib olish (bu boshqa mashq).',
      'Tez-tez silkib bajarish.',
    ],
  },

  // ===== CHO‘ZILISH =====
  st_quad: {
    eq: 'mat', name: 'Son oldi cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'stretch', n: 30, side: true,
    muscles: 'Son oldi mushaklari.',
    tip: 'Har oyoqda 30 soniya, bo‘g‘imlarni silkimang.',
    setup: ['Devor yoki trenajor tutqichidan ushlab, tik turing.'],
    how: [
      'Bir oyoqni orqaga bukib, tovonni qo‘lingiz bilan dumbaga qarab torting.',
      'Tizzalar yonma-yon, chanoq sal oldinga.',
      'Son oldida tortilishni sezib, 30 soniya ushlang; keyin oyoqni almashtiring.',
    ],
    start: '2 × 30 soniya har tomonga, mashqdan keyin.',
    mistakes: ['Belni egib yuborish.', 'Tizzani yon tomonga ochib yuborish.', 'Qo‘l bilan haddan ortiq tortish.'],
  },
  st_ham: {
    eq: 'mat', name: 'Oyoq orqasi cho‘zilishi', cat: 'stretch', lvl: 1, kind: 'stretch', n: 30,
    muscles: 'Son orqasi mushaklari.',
    tip: 'Orqa tekis, oldinga egilishda tizzalarni sal bukib turing.',
    setup: ['Gilamga o‘tirib, oyoqlarni oldinga cho‘zing.'],
    how: [
      'Orqani tekis tutib, qo‘llar bilan oyoq uchiga qarab cho‘zing.',
      'Yengil tortilishni sezganda to‘xtang va 30 soniya ushlang.',
      'Nafas tekis; asta-sekin chuqurroq egilishga harakat qiling.',
    ],
    start: '2 × 30 soniya, mashqdan keyin.',
    mistakes: ['Orqani dumaloqlab egilish.', 'Silkitib (tebranib) cho‘zish.', 'Og‘riq sezilguncha tortish.'],
  },
  st_chest: {
    eq: 'mat', name: 'Ko‘krak cho‘zilishi (eshik/ustun)', cat: 'stretch', lvl: 1, kind: 'stretch', n: 30, side: true,
    muscles: 'Ko‘krak va yelka oldi mushaklari.',
    tip: 'Ko‘krakni oldinga chiqarib, yelkalarni pastga tushiring.',
    setup: ['Eshik tavaqasi yoki mustahkam ustun yonida turing.'],
    how: [
      'Bilagingizni ustunga qo‘ying, tirsak yelka balandligida 90° bukilgan.',
      'Bir qadam oldinga tashlab, tanani sekin oldinga suring — ko‘krakda tortilish sezilsin.',
      '30 soniya ushlang; keyin ikkinchi qo‘l bilan.',
    ],
    start: '2 × 30 soniya har tomonga.',
    mistakes: ['Yelkani quloqqa ko‘tarish.', 'Belni egish.', 'Juda qattiq tortish.'],
  },
  st_child: {
    eq: 'mat', name: 'Bola holati (orqa cho‘zilishi)', cat: 'stretch', lvl: 1, kind: 'stretch', n: 40,
    muscles: 'Orqa, bel va yelka mushaklari.',
    tip: 'Chuqur nafas oling — har nafas chiqarganda yengillashing.',
    setup: ['Gilamga tiz cho‘king.'],
    how: [
      'Dumbani tovonlaringizga tushiring.',
      'Tanani oldinga egib, qo‘llarni oldinga cho‘zing, peshonani gilamga yaqinlashtiring.',
      'Chuqur nafas olib, 40 soniya dam oling.',
    ],
    start: '1–2 × 40 soniya, mashq oxirida.',
    mistakes: ['Tizzada og‘riq bo‘lsa ham turish (ostiga yostiq qo‘ying).', 'Nafasni ushlab turish.'],
  },
};

// Haftalik reja: A/B — kuch (butun tana), C/D/W — kardio seanslari. min — daqiqa (daraja bo‘yicha), session — taymer seansi.
const PLAN = {
  A: [
    { ex: 'tread_walk', min: 5, tip: 'Qizish: yengil tezlikda yuring.' },
    { ex: 'legpress' }, { ex: 'chestpress' }, { ex: 'latpull' }, { ex: 'shpress' }, { ex: 'plankmat' },
    { ex: 'tread_incline', min: [10, 12, 14, 15], tip: 'Yog‘ yoqish: qiyalik 2–4%, tutqichdan ushlamang.' },
    { ex: 'st_quad' }, { ex: 'st_ham' },
  ],
  B: [
    { ex: 'velo', min: 5, tip: 'Qizish: qarshilik 3, yengil aylantiring.' },
    { ex: 'goblet' }, { ex: 'seatrow' }, { ex: 'pecdeck' }, { ex: 'legcurl' }, { ex: 'tripush' }, { ex: 'abmach' },
    { ex: 'elliptical', min: [10, 12, 14, 15], tip: 'Yog‘ yoqish: qarshilik 4–5.' },
    { ex: 'st_chest' }, { ex: 'st_child' },
  ],
  C: [{ session: 'treadint' }, { ex: 'st_quad' }, { ex: 'st_ham' }],
  D: [{ session: 'mix' }, { ex: 'st_chest' }, { ex: 'st_child' }],
  W: [{ session: 'treadinc' }, { ex: 'st_quad' }, { ex: 'st_ham' }],
};

// Kardio seanslari: taymer bosqichma-bosqich yo‘l ko‘rsatadi, har bosqichda trenajor animatsiyasi chiqadi.
// l — daraja (0..3). kind: warm/work/rest/cool; phase — ekrandagi sarlavha; scene — animatsiya.
const SESSIONS = {
  treadint: {
    name: 'Yo‘lak: interval yurish', main: 'tread_walk', eqLabel: 'Yugurish yo‘lagi (Treadmill)', note: 'Tez va sekin yurishni almashtirish',
    steps: l => {
      const n = [6, 6, 7, 8][l], fast = [60, 75, 90, 120][l], slow = [120, 105, 90, 90][l], v = [6, 6.5, 7, 7.5][l];
      const run = l >= 2, sc = run ? 'tread_run' : 'tread_walk';
      const s = [
        { kind: 'ready', name: 'Yo‘lakka chiqing', tip: 'Shnurni kiyimingizga qistiring, yon taxtalarda turing', secs: 10, scene: 'tread_walk' },
        { kind: 'warm', phase: 'QIZISH', name: 'Yengil yurish — 4,5 km/soat', tip: 'Qiyalik 0%. Nafas va oyoqlar qizisin', secs: 300, scene: 'tread_walk' },
      ];
      for (let i = 1; i <= n; i++) {
        s.push({ kind: 'work', phase: run ? 'YUGURING' : 'TEZ YURING', name: `${run ? 'Yengil yugurish' : 'Tez yurish'} — ${v} km/soat`, tip: 'SPEED ▲ bilan tezlikni oshiring. Nafas tezlashsin, lekin gaplasha olasiz', secs: fast, meta: `Interval ${i}/${n}`, scene: sc });
        if (i < n) s.push({ kind: 'rest', phase: 'SEKIN YURING', name: 'Tezlikni kamaytiring — 4,5 km/soat', tip: 'SPEED ▼ bilan tezlikni tushiring, nafasni tiklang', secs: slow, meta: `Interval ${i}/${n}`, scene: 'tread_walk' });
      }
      s.push({ kind: 'cool', phase: 'SOVUTISH', name: 'Sekin yurish — 4 km/soat', tip: 'Nafas bosilguncha yuring, keyin STOP bosing', secs: 240, scene: 'tread_walk' });
      return s;
    },
  },
  treadinc: {
    name: 'Yo‘lak: qiyalikda yurish', main: 'tread_incline', eqLabel: 'Yugurish yo‘lagi (Treadmill)', note: 'Yog‘ yoqish uchun eng yaxshi tanlov',
    steps: l => {
      const inc = [[2, 3, 4, 3], [3, 4, 5, 4], [4, 5, 6, 5], [5, 6, 8, 6]][l];
      const s = [
        { kind: 'ready', name: 'Yo‘lakka chiqing', tip: 'Shnurni kiyimingizga qistiring', secs: 10, scene: 'tread_walk' },
        { kind: 'warm', phase: 'QIZISH', name: 'Tekis yurish — 4,5 km/soat', tip: 'Qiyalik 0%', secs: 240, scene: 'tread_walk' },
      ];
      inc.forEach((p, i) => s.push({ kind: 'work', phase: 'QIYALIK', name: `Qiyalikda yurish — ${p}%`, tip: 'Tezlik 4,5–5 km/soat. INCLINE ▲ tugmasi bilan qiyalikni qo‘ying. Tutqichdan ushlamang', secs: 300, meta: `Blok ${i + 1}/${inc.length}`, scene: 'tread_incline' }));
      s.push({ kind: 'cool', phase: 'SOVUTISH', name: 'Tekis sekin yurish', tip: 'Qiyalikni 0% ga qaytaring, tezlik 4 km/soat', secs: 180, scene: 'tread_walk' });
      return s;
    },
  },
  mix: {
    name: 'Aralash kardio: velo + ellips + eshkak', main: 'velo', eqLabel: 'Velotrenajor, ellips va eshkak trenajori', note: 'Har xil trenajor — zerikmaysiz',
    steps: l => {
      const m = [8, 10, 12, 12][l], r = [4, 5, 6, 6][l];
      return [
        { kind: 'ready', name: 'Velotrenajorga o‘ting', tip: 'O‘rindiq balandligini sozlang', secs: 10, scene: 'velo' },
        { kind: 'work', phase: 'VELOTRENAJOR', name: 'Velotrenajor', tip: 'Qarshilik 4, daqiqasiga 60–80 aylanish', secs: m * 60, meta: '1/3', scene: 'velo' },
        { kind: 'rest', phase: 'O‘TISH', name: 'Ellips trenajorga o‘ting', tip: 'Suv iching, qarshilikni 3–4 ga qo‘ying', secs: 45, scene: 'elliptical' },
        { kind: 'work', phase: 'ELLIPS', name: 'Ellips trenajor', tip: 'Tik turing, qo‘llar tutqichlarni itarib-tortsin', secs: m * 60, meta: '2/3', scene: 'elliptical' },
        { kind: 'rest', phase: 'O‘TISH', name: 'Eshkak trenajoriga o‘ting', tip: 'Damperni 3–4 ga qo‘ying, tasmalarni mahkamlang', secs: 45, scene: 'rower' },
        { kind: 'work', phase: 'ESHKAK', name: 'Eshkak trenajori', tip: 'Avval oyoq, keyin tana, oxirida qo‘llar. Daqiqasiga 20 zarba', secs: r * 60, meta: '3/3', scene: 'rower' },
        { kind: 'cool', phase: 'SOVUTISH', name: 'Sekin yurish', tip: 'Yo‘lakda 4 km/soat da yuring', secs: 180, scene: 'tread_walk' },
      ];
    },
  },
};

// Zalga birinchi marta kelgan odam uchun qisqa qo‘llanma
const FIRST_TIME = [
  ['👟', 'Nima olib borish kerak', 'Tagi tekis sport poyabzali, qulay kiyim, kichik sochiq, suv shishasi va shkafcha uchun qulf. Zalda sochiq bilan o‘zingizni va trenajorni artasiz.'],
  ['🎯', 'Birinchi mashg‘ulot', '45–60 daqiqadan oshirmang. Mashinalardan boshlang — ular harakatni o‘rgatadi va xavfsizroq. Har mashqdan 1–2 yondashuv yetarli. Hamma o‘z mashg‘uloti bilan band, hech kim sizga qarab turmaydi.'],
  ['🙋', 'Trenerdan so‘rang', 'Birinchi kuni trener yoki ma’muriyatdan zalni ko‘rsatib, trenajorlarni tanishtirib berishini so‘rang — ko‘p zallarda bu bepul. So‘rashdan uyalmang, hamma birinchi marta kelgan.'],
  ['🔥', 'Avval qizining', 'Har mashg‘ulotdan oldin 5 daqiqa yo‘lakda yuring yoki velotrenajor aylantiring.'],
  ['🔧', 'Trenajorni o‘zingizga sozlang', 'O‘rindiq balandligi va tayanchlarni sozlang. Og‘irlikni pin (temir tayoqcha) bilan plastinalar ustunidan tanlang — har doim eng yengilidan boshlang.'],
  ['🐢', 'Sekin va nazorat bilan', 'Ko‘tarish 2 soniya, tushirish 3 soniya. Texnika og‘irlikdan muhim.'],
  ['🏋️', 'Og‘irlikni qanday tanlash', 'Shunday og‘irlik tanlangki, 12 takrorning oxirgi 2 tasi qiyin bo‘lsin, lekin texnika buzilmasin. 14–15 takrorni ham oson bajarsangiz — juda yengil; 6–8 takrordan ortiq bajara olmasangiz — juda og‘ir. Ketma-ket 2 mashg‘ulotda 12 takror oson bo‘lsa, keyingi safar eng kichik pog‘onaga (2–5 kg) oshiring.'],
  ['🌬', 'Nafas', 'Zo‘riqishda (itarish/tortishda) nafas chiqaring, qaytarishda nafas oling. Nafasni ushlab turmang.'],
  ['⏱', 'Dam olish', 'Yondashuvlar orasida 60–90 soniya dam oling, qiyin mashqdan keyin 2 daqiqagacha (ilovada taymer bor).'],
  ['🤝', 'Zal odobi', 'Trenajordan keyin sochiq bilan artib qo‘ying. Gantel va plastinalarni joyiga qaytaring. Band trenajorni kutib turing yoki “navbat necha?” deb so‘rang.'],
  ['⚠️', 'Xavfsizlik', 'O‘tkir og‘riq, bosh aylanishi yoki nafas qisilishi bo‘lsa — to‘xtang. Mushakda yengil charchoq va 1–2 kunlik og‘riq normal.'],
];

// Ilovadan qanday foydalanish (Bugun sahifasining tepasida; birinchi marta ochiq turadi)
const HOW_TO = [
  ['1️⃣', 'Har kuni faqat BITTA mashg‘ulot', 'Hamma mashg‘ulotni bir kunda bajarmaysiz. Zalga kelganingizda “Bugun” bo‘limini oching — shu kunning mashg‘uloti o‘zi chiqadi va tayyor turadi.'],
  ['2️⃣', 'Yuqoridagi tugmalar nima uchun?', '“Bugungi reja” — avtomatik tanlov, odatda aynan shuni bajarasiz, tugmalarni bosish shart emas. Boshqa tugmalar (Kuch A, Kuch B, Kardio…) faqat reja kunidan boshqa kuni kelsangiz yoki boshqa mashg‘ulot xohlasangiz kerak.'],
  ['3️⃣', 'Mashqni o‘rganing', 'Trenajor rasmini bossangiz — animatsiya, trenajorning o‘zbekcha, inglizcha va ruscha nomi, uni qanday sozlash va qanday bajarish chiqadi. Birinchi marta har bir trenajorni shu yerda ko‘rib oling, keyin zalda topasiz. Trenajor band bo‘lsa, shu oynaning pastida o‘xshash mashqlar turadi.'],
  ['4️⃣', 'Bajaring va belgilang', 'Odatda 2 yondashuv (set) × 12 takror. Yondashuvlar orasida 60–90 soniya dam oling (⏱ tugmalari). Mashq tugagach, chap tomondagi doirani bosing. Hammasi belgilansa, kun bajarilgan hisoblanadi va 🔥 seriya o‘sadi.'],
  ['5️⃣', 'Kardio kunlari', '“Taymer bilan boshlash” ni bosing — taymer tezlik, qiyalik va qarshilikni aytib boradi va animatsiya ko‘rsatadi. Taymer ishlayotganda ekran o‘chmaydi.'],
  ['🎯', 'Birinchi kun', 'Birinchi marta har mashqdan 1–2 yondashuv va eng yengil og‘irlik yetarli; butun mashg‘ulot 45–60 daqiqadan oshmasin. Imkon bo‘lsa, trenerdan zalni ko‘rsatib berishini so‘rang.'],
  ['🗓', 'Haftada 3 marta borsangiz', 'Hafta kunlariga bog‘lanib qolmang: har safar zalga kelganda tugmalardan ketma-ket tanlang — Kuch A → Kuch B → Kuch A (keyingi hafta: Kuch B → Kuch A → Kuch B). Imkoni bo‘lsa, orada 1–2 marta kardio qo‘shing.'],
  ['ℹ️', 'Boshqa bo‘limlar', '“Reja” — butun haftani ko‘rish uchun (mashq shu yerda bajarilmaydi). “Mashqlar” — barcha trenajorlarni o‘rganish va “Zalga birinchi marta” qo‘llanmasi. “Vazn” — vazningizni yozib boring va vazn tashlash qoidalarini o‘qing.'],
];

// Ruscha nomlar (lotin yozuvida): o‘zbek zallarida trenerlar ko‘pincha shunday atashadi
const RU = {
  treadmill: 'begovaya dorojka', elliptical: 'orbitrek (ellipticheskiy trenajor)', velo: 'velotrenajor', rower: 'grebnoy trenajor', stairs: 'stepper',
  legpress: 'jim nogami', legext: 'razgibanie nog', legcurl: 'sgibanie nog', hipabd: 'razvedenie nog', hipadd: 'svedenie nog',
  calf: 'ikry (podyom na noski)', smith: 'trenajor Smita', dumbbell: 'ganteli', bench: 'skameyka i ganteli',
  chestpress: 'jim ot grudi (v trenajore)', pecdeck: 'babochka', latpull: 'verxnyaya tyaga', seatrow: 'nijnyaya (gorizontalnaya) tyaga',
  backext: 'giperekstenziya', shpress: 'jim ot plech', cable: 'blok / krossover', abmach: 'press-trenajor',
  captain: 'podyom nog v uprore (brusya)', assist: 'gravitron', mat: 'kovrik (zona rastyajki)',
};
Object.entries(RU).forEach(([k, v]) => { EQUIP[k].ru = v; });

// Trenajor band bo‘lsa: xuddi shu mushaklarni ishlatadigan o‘xshash mashqlar
const ALT = {
  tread_walk: ['elliptical', 'velo', 'stairs'], tread_incline: ['stairs', 'elliptical', 'velo'], tread_run: ['elliptical', 'rower', 'velo'],
  elliptical: ['velo', 'tread_incline'], velo: ['elliptical', 'tread_walk'], rower: ['elliptical', 'velo'], stairs: ['tread_incline', 'elliptical'],
  legpress: ['goblet', 'smithsq'], calf: ['tread_incline', 'stairs'], legext: ['legpress', 'goblet'], legcurl: ['dbrdl', 'legpress'], hipabd: ['glutekick', 'hipadd'], hipadd: ['hipabd', 'dblunge'],
  smithsq: ['goblet', 'legpress'], goblet: ['legpress', 'smithsq'], dbrdl: ['legcurl', 'backext'], dblunge: ['legpress', 'goblet'], glutekick: ['hipabd', 'dbrdl'],
  chestpress: ['dbbench', 'pecdeck'], pecdeck: ['chestpress', 'dbbench'], dbbench: ['chestpress', 'pecdeck'],
  latpull: ['assistpull', 'seatrow'], seatrow: ['latpull', 'assistpull'], assistpull: ['latpull', 'seatrow'], backext: ['dbrdl', 'plankmat'],
  shpress: ['latraise'], latraise: ['shpress'], tripush: ['chestpress'], bicurl: ['seatrow'],
  abmach: ['crunchmat', 'legraise', 'plankmat'], legraise: ['abmach', 'crunchmat'], plankmat: ['crunchmat', 'abmach'], crunchmat: ['abmach', 'plankmat'],
  st_quad: ['st_ham'], st_ham: ['st_quad'], st_chest: ['st_child'], st_child: ['st_chest'],
};
Object.entries(ALT).forEach(([k, v]) => { EX[k].alt = v; });

// Vazn tashlash uchun asosiy qoidalar (qisqa, ehtiyotkor)
const WEIGHT_RULES = [
  ['⚖️', 'Sur’at', 'Sog‘lom sur’at — haftasiga taxminan 0,5–1 kg. Juda tez tushirish (och qolish) mushak yo‘qotishga va qaytib semirishga olib kelishi mumkin.'],
  ['🍽', 'Ovqatlanish hal qiluvchi', 'Vazn tashlash uchun sarflagandan kamroq kaloriya iste’mol qilish kerak. Mashq buni qo‘llab-quvvatlaydi, lekin bir bo‘lak shirinlik bir soatlik mashqni “qaytarib” yuboradi.'],
  ['🥚', 'Oqsil', 'Har ovqatda oqsil bo‘lsin (go‘sht, baliq, tuxum, tvorog, loviya) — uzoq to‘q tutadi va mushakni saqlaydi.'],
  ['🥤', 'Suyuq kaloriya', 'Gazli ichimlik, shirin choy va qadoqlangan sharbatni kamaytiring — eng oson tejaladigan kaloriya.'],
  ['🚶', 'Harakat', 'Haftasiga kamida 150 daqiqa o‘rtacha kardio va 2 kun kuch mashqlari tavsiya etiladi (CDC). Kundalik yurishni ham ko‘paytiring.'],
  ['😴', 'Uyqu va suv', '7–8 soat uxlang, kun davomida yetarlicha suv iching.'],
  ['🩺', 'Ehtiyot', 'Surunkali kasalligingiz bo‘lsa yoki dori ichsangiz, ovqatlanishni keskin o‘zgartirishdan oldin shifokor bilan maslahatlashing.'],
];
