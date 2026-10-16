# Davlat akkreditatsiyasi monitoringi

Davlat akkreditatsiyasi holati boʻyicha interaktiv dashbord (16.10.2026 holatiga).

Veb sahifa: https://nqaae-monitoring.github.io/accreditation/

Tillar: oʻzbek (lotin) · русский · English. Maxsus imkoniyatlar: shrift oʻlchami, yuqori kontrast, harakatni kamaytirish, soddalashtirilgan koʻrinish, klaviatura navigatsiyasi, ovozli oʻqish, diagrammalar uchun jadval va audio sharh.

Fayllar:
- `index.html` — asosiy platforma: Dashboard (rahbariyat paneli), Kompleks va Maxsus davlat akkreditatsiyasi, Xodimlar dinamikasi;
- `institutional.html` — taʼlim tashkilotlari reyestri va akkreditatsiya grafigi (asosiy platforma ichida ochiladi);
- `data-institutions.js` — taʼlim tashkilotlari reyestri maʼlumotlari (ikkala sahifa uchun yagona manba);
- `locales.js` — tarjima lugʻati (uz → ru / en), `i18n.js` — koʻp tillilik yadrosi, `access.js` — maxsus imkoniyatlar, ovozli oʻqish va diagramma muqobillari;
- `reports.js`, `reports-text.js` — avtomatlashtirilgan tahliliy hisobotlar (Word/PDF, uch tur + umumlashtirilgan, 4 til); texnik hujjat `docs/REPORTS.md`, namuna `examples/`;
- `mobile.css`, `mobile.js` — mobil va planshet moslashuvi (faqat ≤1023 px; desktop oʻzgarmaydi);
- `CHANGELOG.md` — oʻzgarishlar jurnali.
