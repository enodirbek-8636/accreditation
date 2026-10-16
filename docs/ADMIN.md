# Admin panel va menyu koʻrinishini boshqarish — texnik hujjat

## 1. Arxitektura

| Qatlam | Texnologiya | Vazifa |
|---|---|---|
| Frontend | GitHub Pages (statik), `admin.js`, `acl-core.js`, `admin-config.js` | Reyestr, konfiguratsiyani yuklash va qoʻllash, marshrut/eksport nazorati, admin UI |
| Autentifikatsiya | Supabase Auth (email + parol) | Parollar faqat Supabase da; frontend/GitHub/localStorage da hech qachon saqlanmaydi |
| Rollar | `admin_roles` jadvali, `is_admin()` / `my_role()` funksiyalari | Rol server tomonida tekshiriladi; brauzerdagi qiymat ruxsat bermaydi |
| Konfiguratsiya | `menu_config` (versiyalar, bitta `is_current`), `menu_drafts`, `menu_items` | Barcha qurilmalar uchun yagona eʼlon qilingan holat; qoralama alohida |
| Audit | `audit_log` + `publish_config()` (security definer) | Har bir oʻzgarish: kim, qaysi element, eski/yangi qiymat, vaqt, versiya |
| Maʼlumot himoyasi (2-bosqich) | `datasets` jadvali + RLS `module_public()` | Yopiq modul maʼlumotini anon oʻqiy olmaydi |

Konfiguratsiya formati: `{"items": {"<id>": {"v": false}}}` — yozuvi yoʻq element ochiq. Samarali koʻrinish = elementning oʻzi VA barcha ajdodlari (`ACLCore.effective`).

### Reyestr (barqaror IDlar)
Asosiy boʻlimlar: `dashboard`, `tashkilot`, `grafik`, `kompleks`, `maxsus`, `xodim`.
Ichki boʻlimlar — navigatsiya `data-target` IDlari (`dsec-*`, `sec-*`, `ksec-*`, `hsec-*`), embed darajalari (`tashkilot.lvl.<slug>`, `grafik.lvl.<slug>`) va navigatsiyada boʻlmagan `.section-title[id]` bloklari. Reyestr DOM dan quriladi va admin kirganda `menu_items` ga sinxronlanadi (nom, tartib, tur, marshrut).

Dashboard bogʻliqlik siyosati: `dsec-orgs`, `dsec-kompleks`, `dsec-maxsus` yigʻma boʻlimlar alohida elementlar — modul yopilganda ularni ochiq qoldirish yoki yopish admin qaroridir (panelda eslatma koʻrsatiladi).

## 2. Oʻrnatish (bir martalik)

1. https://supabase.com da loyiha yarating (bepul tarif yetarli).
2. **SQL Editor** → `supabase/schema.sql` faylini toʻliq bajaring.
3. **Authentication → Providers → Email**: yoqilgan; **Confirm email** ni istasangiz oʻchiring (ichki foydalanuvchilar uchun).
4. **Authentication → Users → Add user**: birinchi administrator emaili va paroli (himoyalangan sozlash; ommaviy roʻyxatdan oʻtish yoʻq).
5. SQL Editor da rol bering:
   ```sql
   insert into public.admin_roles (user_id, role)
     select id, 'super_admin' from auth.users where email = 'admin@example.uz'
     on conflict (user_id) do update set role = excluded.role;
   ```
6. **Project Settings → API**: `Project URL` va `anon public` kalitni `admin-config.js` ga kiriting, faylni GitHub ga yuklang.
7. **Authentication → URL Configuration**: Site URL = `https://nqaae-monitoring.github.io/accreditation/` (parolni tiklash havolasi uchun).
8. Ixtiyoriy: **Database → Replication** da `menu_config` jadvali uchun Realtime yoqilsa, eʼlon qilingan oʻzgarish barcha ochiq sahifalarda darhol qoʻllanadi (aks holda sahifa yangilanganda).

Supabase sozlanmaguncha «Admin kirish» tugmasi sozlash eslatmasini koʻrsatadi va barcha boʻlimlar hozirgidek ochiq qoladi.

## 3. Foydalanish

- Sahifa pastidagi **«Admin kirish»** (mobil: «⋯» menyusi) → email va parol. 5 ta notoʻgʻri urinishdan soʻng 1 daqiqa kutish; Supabase Auth oʻz limitlarini ham qoʻllaydi. Sessiya 60 daqiqa harakatsizlikda tugaydi (`sessionMinutes`), token avtomatik yangilanadi. «Parolni tiklash» — emailga havola.
- **ADMIN PANEL — MENYULARNI BOSHQARISH**: daraxt (asosiy boʻlim → ichki boʻlimlar), ON/OFF kalitlar, samarali holat (Ochiq/Yopiq), qidiruv, Hammasini ochish/yigʻish.
- **Saqlash** — qoralama (`menu_drafts`, faqat sizga). **Foydalanuvchi koʻrinishini tekshirish** — qoralama sozlamalar bilan platforma oddiy foydalanuvchi kabi koʻrsatiladi (eʼlon qilinmaydi), «Admin panelga qaytish» tugmasi. **Oʻzgarishlarni eʼlon qilish** — tasdiq (nechta asosiy/ichki boʻlim yopiladi/ochiladi; hammasi yopilsa ogohlantirish) → atomik `publish_config` → yangi versiya joriy boʻladi. **Bekor qilish** — qoralama eʼlon qilinganga qaytadi.
- **Oʻzgarishlar tarixi** — versiyalar roʻyxati (tiklash tugmasi bilan) va audit jurnali.
- Admin rejimida yopiq boʻlimlar toʻq sariq punktir va «Yopiq (faqat admin koʻradi)» yorligʻi bilan koʻrinadi; admin panel menyu sozlamalariga bogʻliq emas.

## 4. Nazorat nuqtalari (frontend)

- Navigatsiya: `.mode-group`, `.nav-item`, boʻlim bloklari (`data-sec`) `acl-hidden` sinfi bilan DOM dan ajratiladi.
- Marshrut: `switchMode`, `dbGo`, `dbOpenInst`, `loadEmbed` oʻralgan — yopiq boʻlimga oʻtish rad etiladi, birinchi ochiq boʻlimga yoʻnaltiriladi; hech biri ochiq boʻlmasa neytral «boʻlim ochiq emas» sahifasi.
- Eksport: `buildReportBody` (Word/PDF) yopiq modullarni tashlab ketadi; `dbReportData` (Dashboard Word/PDF/Excel) yopiq modul qatorlarini olib tashlaydi; tahliliy hisobotlar (`RP`) yopiq modul turini bloklaydi, umumlashtirilgan hisobotda «Boʻlim yopiq» qaydi.
- Yuklanish holati: konfiguratsiya kelguncha navigatsiya koʻrsatilmaydi (`acl-loading`). Backend sozlangan, lekin ishlamasa — oxirgi muvaffaqiyatli eʼlon qilingan nusxa (kesh) qoʻllanadi; kesh boʻlmasa barcha asosiy boʻlimlar yopiq (xavfsiz holat) va «Qayta urinish».

## 5. Muhim cheklov: statik maʼlumotlar (GitHub Pages)

Hozir maʼlumotlar toʻplamlari ommaviy statik fayllarda: `data-institutions.js`, `index.html` ichidagi `ACCR`, `APPDATA`, `KOMPLEKS_RAW`. Menyu yopilganda ular interfeysda, marshrutlarda va eksportlarda koʻrinmaydi, lekin faylni toʻgʻridan-toʻgʻri yuklab olgan kishi maʼlumotni oʻqiy oladi. **Menyu koʻrinishi maʼlumot himoyasi emas.**

Haqiqiy himoya (2-bosqich) uchun:
1. Toʻplamlarni `datasets` jadvaliga yuklash (`key`: `raw_data`, `kompleks`, `accr`, `appdata`; `module`: `tashkilot`/`kompleks`/`maxsus`).
2. Statik fayllardan maʼlumot satrlarini olib tashlash.
3. `admin-config.js` da `dataFromBackend: true` — yuklovchi toʻplamlarni Supabase dan (anon kalit bilan, RLS `module_public()` orqali) oladi; yopiq modul maʼlumoti ommaga qaytarilmaydi, admin sessiyasida toʻliq.
Bu bosqich alohida kelishiladi (ilovaning maʼlumot yuklash tartibi oʻzgaradi).

## 6. Testlar

- Sof mantiq: `tests/acl-tests.html` (brauzerda ochiladi) — A/B/C stsenariylari, ota-bola qoidasi, birinchi ochiq boʻlim, farq xulosasi, hisobot doiralari, normalizatsiya.
- Backend bilan qoʻlda tekshirish roʻyxati: admin kiradi; oddiy foydalanuvchi panelni ocha olmaydi (rol yoʻq → chiqarib yuboriladi); asosiy boʻlimni yopish/ochish; ichki boʻlimni yopish; ota yopilsa bolalar yopiq, qayta ochilsa bola sozlamalari saqlanadi; sahifa yangilangandan va boshqa qurilmadan koʻrinish bir xil; yopiq element desktop va mobil navigatsiyada yoʻq; toʻgʻridan-toʻgʻri `switchMode` rad etiladi; eksportlar filtrlanadi; koʻrinish tekshiruvi qoralamani aks ettiradi va eʼlon qilmaydi; audit yozuvlari; oldingi versiyani tiklash; admin toʻliq kirishga ega; mavjud tahlillar ishlaydi.

## 7. Rollar

`super_admin`, `admin` — panel va eʼlon qilish; `analyst`, `viewer` — kelgusi kengaytma uchun zaxiralangan (RLS funksiyalarida qoʻshimcha shartlar bilan). Ommaviy foydalanuvchi — kirishsiz, faqat eʼlon qilingan ochiq boʻlimlar.
