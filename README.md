# FitDay

Trenajor zaliga boradigan boshlovchilar uchun vazn tashlash PWA ilovasi: haftalik zal rejasi, har bir trenajor va mashq uchun animatsiya, kardio seanslari taymeri, vazn kundaligi.
Barcha ma'lumotlar faqat telefonning o'zida (localStorage) saqlanadi.

## Haftalik reja
- **Dushanba, Juma** — Kuch A (butun tana): yo'lakda qizish, oyoq pressi, ko'krak pressi, yuqori blok, yelka pressi, plank, qiyalikda yurish, cho'zilish
- **Seshanba** — kardio: yo'lak intervali (tez/sekin yurish)
- **Chorshanba** — Kuch B (butun tana): velotrenajor, gantel bilan squat, pastki blok, kapalak, oyoqni bukish, triceps, qorin, ellips, cho'zilish
- **Payshanba** — kardio: yo'lakda qiyalikda yurish
- **Shanba** — kardio: velotrenajor + ellips + eshkak
- **Yakshanba** — dam

Har kuni faqat BITTA mashg'ulot bajariladi: "Bugun" bo'limida shu kunning mashg'uloti o'zi chiqadi ("Reja" bo'limi faqat butun haftani ko'rish uchun).
Boshqa kuni borsangiz yoki boshqa mashg'ulot xohlasangiz, "Bugun" sahifasidagi tugmalardan (Kuch A, Kuch B, Kardio…) tanlang. Haftada 3 marta borsangiz: Kuch A → Kuch B → Kuch A.
Yuklama har 2 haftada oshadi (yondashuvlar, vaqt, interval). Ilovaning ichida "Qanday foydalanish" qo'llanmasi bor (birinchi marta ochiq turadi).

## Animatsiyalar
Har bir mashq uchun trenajorning o'zi va unda mashq qilayotgan odam animatsiya bilan ko'rsatiladi (37 ta mashq, 25 ta trenajor).
Rasmni bossangiz: animatsiya (to'xtatish / sekin), trenajor nomi (inglizcha va ruscha nomi ham — zalda so'rash oson bo'lsin), zalda qayerda turishi,
qanday ko'rinishi, sozlash, bajarish, boshlovchi uchun tavsiya va ko'p uchraydigan xatolar chiqadi. Qizil — ishlayotgan mushaklar.
Trenajor band bo'lsa, oynaning pastida o'xshash mashqlar tugmalari turadi.

## Mashqlar bo'limi
- **Zalga birinchi marta** — nima olib borish, trenerdan nima so'rash, zal odobi, xavfsizlik
- **Kardio seanslari** — taymer qaysi trenajorda nima qilishni (tezlik, qiyalik, qarshilik) aytadi, har bosqichda animatsiya
- **37 ta mashq**: kardio, oyoq va dumba, ko'krak, orqa, yelka, qo'l, qorin, cho'zilish; qidiruv (o'zbekcha, inglizcha va ruscha nom bilan)
- "+" mashqni bugungi ro'yxatga qo'shadi; kuch mashqlarida oxirgi ishlatilgan og'irlik (kg) eslab qolinadi
- **Vazn** bo'limida vazn grafigi va "Vazn tashlash qoidalari" (sur'at, ovqatlanish, oqsil, harakat, uyqu)
- **Profil**: "Ekran o'chmasin" (mashq paytida telefon qorong'ilashmaydi; kardio taymerida har doim yoqiladi), taymer ovozi, zaxira nusxa

## Tuzilishi
- `index.html`, `style.css`, `app.js` — ilova
- `gym.js` — trenajorlar, mashqlar, reja, kardio seanslari, "birinchi marta" qo'llanmasi
- `scenes.js` — animatsiya dvigateli (odam skeleti: IK/FK, trenajor qismlari pozaga bog'lanadi), `scenes-*.js` — har bir trenajor sahnasi
- `sw.js`, `manifest.webmanifest` — PWA (internetsiz ishlaydi)

Sayt GitHub Pages orqali `gh-pages` branch'idan chiqadi; o'zgarishlar `main` va `gh-pages` ga birga yuboriladi.
