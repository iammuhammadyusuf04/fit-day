# FitDay

Boshlovchilar uchun vazn tashlash PWA ilovasi: mashqlar rejasi, avtomatik interval taymer, vazn kundaligi.
Barcha ma'lumotlar faqat telefonning o'zida (localStorage) saqlanadi.

## Haftalik reja
- **Dushanba, Juma** — kuch mashqlari A
- **Seshanba** — yog' yoqish kardio 1 (butun tana, interval)
- **Chorshanba** — kuch mashqlari B
- **Payshanba** — tez yurish
- **Shanba** — yog' yoqish kardio 2 (qorin va oyoq, interval)
- **Yakshanba** — dam

Yuklama har 2 haftada oshadi. Kardio kunlarida ish/dam vaqti 20/40 s dan 45/15 s gacha o'zgaradi.
Istalgan kuni "Bugun" sahifasidagi tugmalar bilan boshqa mashg'ulotni tanlash mumkin.

## Imkoniyatlar
- Har mashq uchun "qanday bajariladi", yengil va qiyin variantlar (ⓘ tugmasi)
- Kardio kunlarida avtomatik taymer: qizish → ish/dam raundlari → cho'zilish, ovoz, tebranish, ekran o'chmaydi
- Sakrashsiz (past zarbali) variantlar — profildan yoqiladi
- Vazn kundaligi, grafik, maqsadgacha qolgan kg, BMI
- Internetsiz ishlaydi, zaxira nusxa (eksport/import)

## Tuzilishi
- `index.html`, `style.css`, `app.js` — ilova
- `moves.js` — mashqlar kutubxonasi va kardio aylanalar
- `sw.js`, `manifest.webmanifest` — PWA

Sayt GitHub Pages orqali `gh-pages` branch'idan chiqadi; o'zgarishlar `main` va `gh-pages` ga birga yuboriladi.
