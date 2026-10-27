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

Yuklama har 2 haftada oshadi (yondashuvlar, vaqt, interval). Istalgan kuni "Bugun" sahifasida boshqa mashg'ulotni tanlash mumkin.

## Animatsiyalar
Har bir mashq uchun trenajorning o'zi va unda mashq qilayotgan odam animatsiya bilan ko'rsatiladi (37 ta mashq, 25 ta trenajor).
Rasmni bossangiz: animatsiya (to'xtatish / sekin), trenajor nomi (ustida yozilgan inglizcha nomi ham), zalda qayerda turishi,
qanday ko'rinishi, sozlash, bajarish, boshlovchi uchun tavsiya va ko'p uchraydigan xatolar chiqadi. Qizil — ishlayotgan mushaklar.

## Mashqlar bo'limi
- **Zalga birinchi marta** — nima olib borish, trenerdan nima so'rash, zal odobi, xavfsizlik
- **Kardio seanslari** — taymer qaysi trenajorda nima qilishni (tezlik, qiyalik, qarshilik) aytadi, har bosqichda animatsiya
- **37 ta mashq**: kardio, oyoq va dumba, ko'krak, orqa, yelka, qo'l, qorin, cho'zilish; qidiruv (o'zbekcha va inglizcha nom bilan)
- "+" mashqni bugungi ro'yxatga qo'shadi; kuch mashqlarida oxirgi ishlatilgan og'irlik (kg) eslab qolinadi

## Tuzilishi
- `index.html`, `style.css`, `app.js` — ilova
- `gym.js` — trenajorlar, mashqlar, reja, kardio seanslari, "birinchi marta" qo'llanmasi
- `scenes.js` — animatsiya dvigateli (odam skeleti: IK/FK, trenajor qismlari pozaga bog'lanadi), `scenes-*.js` — har bir trenajor sahnasi
- `sw.js`, `manifest.webmanifest` — PWA (internetsiz ishlaydi)

Sayt GitHub Pages orqali `gh-pages` branch'idan chiqadi; o'zgarishlar `main` va `gh-pages` ga birga yuboriladi.
