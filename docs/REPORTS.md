# Tahliliy hisobotlar dvigateli — texnik hujjat

Platforma: https://nqaae-monitoring.github.io/accreditation/ (statik GitHub Pages, server kodi yoʻq).
Dvigatel toʻliq brauzerda ishlaydi: maʼlumotlar platforma holatidan olinadi, hisobot bitta hujjat modelidan Word (.docx) va PDF (brauzer chop etishi) koʻrinishida chiqariladi.

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `reports.js` | Dizayn standarti (`RP.DS`), til yordamchilari (kirill ↔ lotin transliteratsiya, atamalar lugʻati), hujjat modeli (`RP.doc/p/h/box/chart/table`), ECharts → PNG diagramma generatori, DOCX (OOXML) render, HTML koʻrish (A4 sahifalash) va PDF (chop etish), maʼlumot sifati tekshiruvi (`RP.validate`), sozlamalar (`RP.cfg`). |
| `reports-text.js` | Koʻrsatkichlarni hisoblash (`RP.calcInst`, `RP.calcKomp`, `RP.calcMx`), uchta hisobot tuzilmasi (`RP.buildR1/R2/R3`), umumlashtirilgan hisobot (`RP.buildAll`), yakuniy blok (metodika, maʼlumot sifati), `RP.generate`, foydalanuvchi paneli (`RP.UI`). |
| `index.html` | Skriptlar ulanishi, panel CSS (`#rpModal`, `.rp-*`). |

## Dizayn standarti (namuna: «Сертификатлаш ДЗ 14.10.26_1.docx»)

Namunadan dasturiy ajratib olingan va `RP.DS` da saqlanadi:

- Sahifa A4 (11906 × 16838 twip), maydonlar: yuqori/oʻng/past 850 twip (1,5 sm), chap 1417 twip (2,5 sm), kolontitul 454; birinchi sahifada raqam yoʻq (`titlePg`), 2-sahifadan markazda PAGE maydoni, 13 pt.
- Shrift Calibri; asosiy matn 15 pt (`sz 30`), «Маълумот учун» bloklari 13 pt kursiv (`sz 26`), fon `E2EFDA`, qator oraligʻi 252; asosiy abzatslar — eni boʻyicha, birinchi qator 709 twip, qator oraligʻi 259.
- Sarlavha markazda qalin, «МАЪЛУМОТ» alohida abzats (after 200). Boʻlim sarlavhalari: rim raqami qizil (`C00000`) + nomi toʻq koʻk (`1F3864`), qalin.
- Raqamlangan masalalar/takliflar: «1.» qizil qalin, tezis qora qalin, davomi oddiy.
- Sonlar qizil qalin, birliklar (та, фоиз, нафар) koʻk qalin (`0070C0`); qavs ichidagi foiz — 13 pt kursiv (son qizil, birlik koʻk).
- Diagrammalar PNG, 16,5 sm eni, markazda, ≈380 dpi; palitra: `C00000`, `0070C0`, `1F3864`, `D9D9D9`, `FFC000`, yashil; fon oq, oʻq chiziqlari minimal, qiymatlar ustun yonida, respublika oʻrtachasi punktir chiziq.
- Yakuniy satr: «Ахборот учун киритилмоқда.»

## Hisobotlar

| Tur | Sarlavha | Birlik | Manba |
|---|---|---|---|
| r1 | Таълим ташкилотларининг давлат аккредитациясидан ўтиш ҳолати тўғрисида МАЪЛУМОТ | tashkilot | `dbInst(ref)` (reyestr, `data-institutions.js`) |
| r2 | Таълим ташкилотларини комплекс давлат аккредитациясидан ўтказиш ҳолати тўғрисида МАЪЛУМОТ | ariza | `KOMPLEKS` |
| r3 | Таълим дастурларини махсус давлат аккредитациясидан ўтказиш натижалари тўғрисида МАЪЛУМОТ | taʼlim dasturi | `PROGRAMS`, `APPS` |
| all | Умумлаштирилган маълумот | uchalasi, qoʻshilmaydi | uchala manba |

Har bir hisobot: I. Амалдаги ҳолат → II. Тизимли масалалар → III. Таклифлар (raqamlangan, masʼul / muddat / natija koʻrsatkichi bilan; «taxliliy taklif» deb belgilangan). Diagrammalar tegishli abzatsdan keyin joylashadi.

## Hisoblash metodikasi

- **Qamrov (r1)**: `(amalda + muddati yaqin) / (jami − tugatilgan)`. Holatlar `dbInst` qoidalari: qayta tashkil +2 yil, aks holda akkreditatsiya/tashkil etish +5 yil; ariza bergan va yangi akkreditatsiyasi yoʻq → jarayonda; sana yoʻq → maʼlumot yetarli emas.
- **Kutish muddati (r2)**: ariza sanasidan hisobot sanasigacha; yakunlanganlar uchun komissiya bayoni sanasigacha. Chegaralar sozlanadi: `waitWarn` (120), `waitCrit` (180).
- **Muvaffaqiyat (r3)**: `oʻtgan / (oʻtgan + oʻtmagan)`; jarayondagilar maxrajga kirmaydi. Umumiy ulush: `oʻtgan / jami`. Kichik tanlov (`smallSample`, 10) alohida belgilanadi.
- Tizimli masala sifatida belgilash chegarasi: respublika oʻrtachasidan `lowCoverageGap` (10) f.b. dan ortiq past.
- Hudud (r2, r3): muassasa nomini reyestr bilan moslashtirish orqali; moslashish ulushi hisobotda koʻrsatiladi.

Barcha sonlar matn va diagrammalar uchun bitta `calc*` natijasidan olinadi.

## Filtrlar va davr

Taʼlim turi, hudud, mulkchilik (hammasi), daraja va bilim sohasi (faqat r3/all), davr — ariza sanasi boʻyicha (r2, r3). Hisobot sanasi `ref` — holat va muddatlar shu sanaga hisoblanadi. Filtrlar hisobot boshida «Қўлланилган филтрлар» sifatida yoziladi.

## Tillar

Rasmiy hujjatlar uchun standart — oʻzbek (kirill). Lotin — kirilldan avtomatik transliteratsiya (`RP.translit`), rus va ingliz — alohida shablonlar. Tashkilot va dastur nomlari manbadagi koʻrinishda qoladi.

## Maʼlumot sifati tekshiruvi (`RP.validate`)

Takror ID, sana yoʻq yozuvlar, qabul sanasi ariza sanasidan oldin, natijasiz yakunlangan arizalar, daraja/soha/mulkchilik koʻrsatilmagan dastturlar, ariza boʻyicha dastur soni mosligi, holatlar yigʻindisi. Natija panelda va hisobot yakunidagi metodika qaydida koʻrsatiladi.

## Yangi hisobot turi qoʻshish

1. `RP.calcX(f)` — filtrlangan maʼlumotdan koʻrsatkichlar.
2. `RP.buildX(f, doc, part)` — `RP.p / RP.np / RP.box / RP.chart` bilan tuzilma; matnlar `S(lang,{uc,ru,en})`.
3. `RP.generate` ga tur qoʻshish, `RP.UI` roʻyxatiga variant qoʻshish.

## Cheklovlar

- PDF brauzerning chop etish oynasi orqali (foydalanuvchi «PDF sifatida saqlash»ni tanlaydi); server tomonidagi konvertatsiya yoʻq.
- Word diagrammalari rasm sifatida (tahrirlanmaydi); matn va jadvallar tahrirlanadi.
- Yillik dinamika faqat mavjud tarixiy maydonlar (akkreditatsiya sanasi, hisoblangan muddat yillari) boʻyicha; ixtiro qilinmaydi.
- Namuna hujjatdagi Calibri shrifti foydalanuvchi kompyuterida boʻlishi kerak (Word uchun); brauzer koʻrinishida Calibri/Carlito/Segoe UI.
