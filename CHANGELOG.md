# Oʻzgarishlar jurnali — Davlat akkreditatsiyasi monitoringi

## 2026-10-17 — Koʻp tillilik va maxsus imkoniyatlar

### Qoʻshildi
- **Uch tilli interfeys** (oʻzbek lotin · rus · ingliz-britan). Sarlavhadagi bayroqli tanlagich (UZ / RU / EN), matnli yorliqlar va `aria-pressed` holati bilan. Tanlov `localStorage` da saqlanadi, birinchi tashrifda brauzer tili aniqlanadi (qoʻllab-quvvatlanmasa — oʻzbek lotin). `<html lang>` dinamik oʻzgaradi. Til almashganda sahifa qayta yuklanmaydi; faol boʻlim, filtrlar va tanlovlar saqlanadi.
- **Markazlashgan tarjima tizimi**: `locales.js` (lugʻat, ≈900 kalit, sonlar uchun `#`, ismlar uchun `@`, iqtiboslar uchun `«@»` oʻrin egallovchilari) va `i18n.js` (yadro). Tarjima koʻrsatish qatlamida bajariladi: DOM matnlari va atributlari (MutationObserver), ECharts yozuvlari (oʻq, legenda, tultip, belgilar), Word/PDF/Excel/CSV hisobotlar, bildirishnomalar. Hisob-kitob mantigʻi va maʼlumotlar oʻzgartirilmagan.
- **Tilga mos son va sana formati**: EN — `1,125` / `83.6%`; RU — `1 125` / `83,6%`; UZ — avvalgidek. Sarlavhadagi sana va diagramma oylari tarjima qilinadi.
- **Ichki oynalar (Taʼlim tashkilotlari, Akkreditatsiya grafigi)** asosiy platforma tili bilan sinxron (`postMessage`), maxsus imkoniyatlar sozlamalari ham uzatiladi.
- **Maxsus imkoniyatlar paneli** (sarlavhadagi universal belgi): shrift oʻlchami (90–200 %), standart / yuqori kontrast (och, toʻq), harakatni kamaytirish (tizim `prefers-reduced-motion` hurmat qilinadi, diagramma animatsiyasi oʻchadi), soddalashtirilgan koʻrinish (diagrammalar oʻrniga jadvallar), fokusni ajratib koʻrsatish. Sozlamalar `localStorage` da saqlanadi.
- **Klaviatura**: «Asosiy mazmunga oʻtish» havolasi, koʻrinadigan fokus (`:focus-visible`), `Esc` bilan modal oynalar va panel yopiladi, jadval ustunlari klaviaturadan saralanadi.
- **Ovozli oʻqish (Web Speech API)**: har bir boʻlim uchun «Qisqacha audio sharh» (Dashboard, Taʼlim tashkilotlari, Akkreditatsiya grafigi, Kompleks, Maxsus, Xodimlar) — joriy filtrlangan maʼlumotdan tuziladi. Boshqaruv: tinglash / pauza / davom / toʻxtatish, tezlik 0.75–1.5×, ovoz tanlash. Ovoz topilmasa foydalanuvchiga aniq xabar beriladi va matnli variant koʻrsatiladi; boshqa tildagi ovoz avtomatik ishlatilmaydi. Avtomatik ijro yoʻq.
- **Diagrammalarning uch koʻrinishi**: Diagramma | Jadval | Audio sharh — har bir diagramma panelida. Jadval: ekran oʻquvchilari uchun semantik, saralanadigan, nusxalash va CSV eksport bilan. Audio sharh diagramma maʼlumotidan (eng katta / eng kichik toifa, ulushlar) hosil qilinadi va filtr oʻzgarganda yangilanadi.
- **Koʻrsatkich izohlari**: Dashboard KPI kartalarida ⓘ belgisi (hisoblash qoidasi va manba, uch tilda).
- **Koʻp tilli eksport**: Word, PDF, Excel va CSV tanlangan tilda; PNG diagrammalarda legenda va oʻqlar tarjimada. Sonlar oʻzgartirilmaydi.

### Oʻzgartirildi
- `index.html`: `fmtNum`/`fmtPct` tilga mos; `embedSrc` ichki oynaga tilni uzatadi; Dashboard eksportida matnlar tarjima qatlamidan oʻtadi; maxsus imkoniyatlar va til tanlagich uchun CSS; yangi skriptlar ulandi (`locales.js`, `i18n.js`, `access.js`).
- `institutional.html`: `postMessage` orqali til va maxsus imkoniyatlar sinxroni.
- Maxsus hisobot 1.3-boʻlim jumlasi tarjima uchun biroz tahrirlandi («…esa X zimmasida — N ta dastur»).

### Cheklovlar va keyingi tekshiruv
- Oʻzbek tili uchun brauzerlarda odatda tayyor ovoz mavjud emas (Windows/Chrome/Edge). Bu holda matnli sharh koʻrsatiladi; ovoz boshqa tilga almashtirilmaydi.
- Tashkilot, dastur va xodim nomlari rasmiy manbada faqat oʻzbek tilida; ular tarjima qilinmaydi (transliteratsiya ixtiro qilinmaydi).
- Sana formati barcha tillarda `dd.mm.yyyy`.
- WCAG 2.2 AA muvofiqligi avtomatik (Lighthouse/axe) va qoʻlda tekshiruvlardan keyin tasdiqlanishi kerak; ekran oʻquvchilari (NVDA/JAWS/VoiceOver) bilan toʻliq sinov alohida oʻtkazilishi lozim.
- Hisobotlardagi ayrim dinamik jumlalar (ism yoki holat nomi oʻzgaruvchan) lugʻatdagi shablon boʻyicha tarjima qilinadi; yangi jumla qoʻshilsa, lugʻatga kalit qoʻshish kerak.
