# گزارش راند ۶، بخش ۱ — یکپارچه‌سازی داده‌های شخصیت و روابط ثبت‌شده

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**Checkpoint والد immutable:** CP22 — `EGUNSENTIA-STAGE47-POST-CP21-ROUND5-CHARACTER-LORE-PARTIAL-CP22-2026-11-09.zip`  
**وضعیت:** `PARTIAL — CHARACTER / HOUSEHOLD / PRESENCE / EVENT-REPLAY SOURCE INTEGRATION IMPLEMENTED AND UNIT-TESTED; FULL RUNTIME / DB / BROWSER INTEGRATION BLOCKED`  
**دامنه:** Round 6 / Part 1؛ فقط اتصال اطلاعات تأییدشدهٔ Round 5 به کارت شخصیت، Household، projection حضور و زمینهٔ AL، به‌علاوهٔ آزمون مسیر Event Ledger تا Day Replay.

## 1. تصمیم و یافتهٔ اولیه

بازبینی CP22 نشان داد فیلدهای `RELATIONS` شش پروفایل Round 5 در منبع Canon وجود داشتند و Private Relations از آن‌ها استفاده می‌کرد، اما projection عمومی `CAST` فیلد `RELATIONS` را از `cards.json` یا household registry منتقل نمی‌کرد. در نتیجه CastPanel این اطلاعات را نشان نمی‌داد و جست‌وجوی Cast نیز آن‌ها را پیدا نمی‌کرد. Household registry هم فیلد توصیفی `relationships` را در کارت مدیریتی خود نمایش نمی‌داد.

## 2. تغییرات پیاده‌سازی‌شده

### 2.1 مدل و projection کارت شخصیت
- به `CastCard` فیلد اختیاری `relationships` اضافه شد.
- `kernel.ts` اکنون `raw.fields.RELATIONS` را برای کارت‌های Canon و `person.relationships` را برای کارت‌های توسعه‌ای/household به CAST منتقل می‌کند.
- هیچ رابطهٔ تازه‌ای ساخته نشد؛ منبع همان داده‌های ثبت‌شدهٔ Canon و registry است.

### 2.2 رابط Cast و Household
- CastPanel بخش `Recorded relationships` را نمایش می‌دهد.
- جست‌وجوی Cast متن روابط ثبت‌شده را نیز بررسی می‌کند.
- Household roster متن `Recorded relationships` را نمایش می‌دهد و صریحاً هشدار می‌دهد که این یادداشت‌ها state زندهٔ affection، consent، eligibility یا disclosure نیستند.
- وضعیت منبع/پیشنهادی بودن کارت‌ها با برچسب موجود `loreStatus` حفظ شده است.

### 2.3 زمینهٔ AL
- compact state برای شش پروفایل Round 5، یادداشت‌های رابطهٔ منبع‌دار را با شناسه و `sourceStatus` می‌فرستد.
- فیلد `interpretation` تصریح می‌کند این‌ها فقط lore مرجع‌اند و نباید به احساسات، رضایت، وضعیت رابطه یا افشای فعلی تعبیر شوند.
- شناسه‌های واقعی پروفایل در فیلتر حفظ شده‌اند: `dagmar-red`, `adelheid-von-moren`, `vera-grotsen`, `elara-red`, `hanne-brauer`, `wilhelmina-red`.
- این فقط اصلاح projection منبع است؛ اجرای واقعی درخواست AL در این محیط ممکن نشد، زیرا import مسیر `play.ts` به `@tanstack/react-start` وابسته است که نصب نیست.

### 2.4 حضور، Planner و پنل‌های متصل
- CAST همچنان منبع واحد حضور است و `castNow()` در CastPanel، Messages، Where They Are، Planner و Evening Hall استفاده می‌شود.
- تست جدید تأیید می‌کند هر شش شخصیت در projection حضور زنده وجود دارند.
- تست‌های موجود Planner و Gate 2 همچنان مسیر زمان‌بندی و حضور مشترک را پوشش می‌دهند.
- این بررسی unit/source-level است؛ حضور واقعی UI در مرورگر تأیید نشده است.

### 2.5 Event Ledger و Day Replay
- تست جدید یک درخواست Private Relations را از موتور رابطه به رویداد `PRIVATE_RELATIONSHIP` تبدیل می‌کند، به Event Ledger می‌افزاید و از projection روزانهٔ Day Replay بازیابی می‌کند.
- رویداد با knowledge=`player` ثبت می‌شود و وضعیت pending را به‌عنوان پذیرش/رضایت تفسیر نمی‌کند.
- این تست pure-function integration است؛ handler واقعی Store، ذخیرهٔ backend و نمایش مرورگری Day Replay در این محیط اجرا نشدند.

## 3. ماتریس اتصال Round 6

- Private Relations & Dynastic: مدل و state موجود حفظ شد؛ اطلاعات ثابت پروفایل در profile projection و زمینهٔ AL اضافه شد. تست‌های واحد Private Relations موفق‌اند.
- Character cards / CAST: یادداشت‌های ثبت‌شده به CastCard متصل و در UI قابل مشاهده/جست‌وجو شدند.
- Household administration: یادداشت‌های ثبت‌شده در roster مدیریتی قابل مشاهده شدند؛ state زندهٔ household جدا باقی ماند.
- NPC scheduling / Planner / Personnel / CAST: CAST و `castNow()` منبع مشترک باقی ماندند؛ شش شخصیت در projection حضور موجودند. تست‌های زمان‌بندی موجود و جدید پاس شدند.
- Messages / Evening Hall / Calendar: پنل‌های متصل همچنان از presence/planner مشترک استفاده می‌کنند؛ اتصال منبعی بررسی شد، Browser QA اجرا نشد.
- Event Ledger / Day Replay: pure event-to-replay path تست شد؛ backend persistence و UI runtime هنوز تأیید نشده.
- Investigation Register: هیچ پرونده‌ای به‌طور خودکار از روابط یا غیبت NPC ساخته نشد. Missing-person inquiry همچنان فقط با نام و منبعی که بازیکن وارد می‌کند، به‌صورت unverified باز می‌شود؛ هیچ غیبتی به ناپدیدشدن ارتقا نیافت.
- Resource / Inventory: داده‌های روابط شخصیت‌ها به اقتصاد یا inventory متصل نشدند، زیرا منبع Round 5 چنین رابطهٔ مکانیکی‌ای را تعریف نمی‌کند.
- Save / reload: داده‌های ثابت Canon در فایل‌های پروژه باقی می‌مانند و به schema ذخیره‌سازی اضافه نشدند. state زندهٔ Private Relations در Save Snapshot موجود باقی است؛ commit/reload واقعی به علت نبود backend اجرا نشد.
- AL response validation: فقط زمینهٔ منبع‌دار افزوده شد؛ validator و مرزهای delta تغییر نکردند. اجرای واقعی AL blocked است.

## 4. آزمون و راستی‌آزمایی

### موفق
- `node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/round6-character-integration.test.mjs`: **5/5 PASS**.
- مجموعهٔ متمرکز Round 6 + Private Relations + Household + Gate 2 Round 3 + Gameplay Integration: **62/62 PASS**.
- تمام اسکریپت‌های `scripts/**/*.test.mjs` به‌جز `scripts/game.test.mjs`: **467/467 PASS در 57 فایل**. برای تست‌های app-env یک فایل موقت و غیرمحرمانهٔ `.grok/app-env.json` با `VITE_AUTH_ENABLED=true` ساخته و بلافاصله پس از اجرا حذف شد.
- `node scripts/verify-canon.mjs`: **PASS**.
- `node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-red-claw-household.mjs`: **PASS با 14 هشدار موجود**؛ هشدارهای DOB، Family Ledger طبقهٔ هفتم و chronology Elara/Luka/Christian حفظ شدند.

### مسدود / اجرا نشده
- `npm test`: **467 PASS / 1 suite load failure**؛ `scripts/game.test.mjs` پیش از assertion به علت `ERR_MODULE_NOT_FOUND: zod` بارگذاری نشد.
- `npm run typecheck`: BLOCKED؛ `@types/node` و `vite/client` موجود نیستند.
- `npm run build`: BLOCKED؛ `spawn vite ENOENT`.
- `npm run lint`: BLOCKED؛ `eslint: not found`.
- import/runtime مستقیم `play.ts` برای آزمون compact state: BLOCKED؛ `@tanstack/react-start` موجود نیست.
- PostgreSQL / Save commit-reload-restart: NOT RUN؛ هیچ `DATABASE_URL` یا سرویس PostgreSQL در دسترس نیست.
- Browser QA / responsive UI: NOT RUN؛ Vite و وابستگی‌های برنامه حاضر نیستند.
- Production verification: NOT RUN.

## 5. وضعیت Canon و ایمنی

- شش یادداشت رابطه‌ای Round 5 بدون تغییر معنایی منتقل شدند.
- `RELATIONS` صرفاً توضیح روابط ثبت‌شده است؛ affection، consent، eligibility، disclosure یا پاسخ NPC از آن نتیجه‌گیری نمی‌شود.
- proposalها همچنان proposal/read-only باقی می‌مانند.
- هیچ نام، عضو Iron Guard، نسبت خونی، تاریخ، فرزند، ازدواج یا رخداد جدیدی اضافه نشد.
- Save schema، migration، package manifest، lockfile، economy و event semantics تغییر نکردند.

## 6. فایل‌های تغییرکرده

- `src/lib/game/types.ts`
- `src/lib/game/kernel.ts`
- `src/lib/game/play.ts`
- `src/components/game/CastPanel.tsx`
- `src/components/game/V45PanelBody.tsx`
- `scripts/round6-character-integration.test.mjs`
- `STAGE47_REPAIR_ROADMAP_2026-11-09.md`
- `RECOVERY_PROGRESS.md`
- `EGUNSENTIA_RELEASE_CHECKPOINTS.md`
- `WORKLOG-70.md`

فایل حذف‌شده: صفر. Schema/migration تغییرکرده: صفر.

## 7. تصمیم نهایی

Round 6 / Part 1 از نظر اتصال source-level و unit tests موفق است، اما Round 6 کامل نیست. اتصال واقعی AL، DB commit/reload، Browser UI، و ادغام‌های کامل investigation/persistence هنوز باقی‌اند یا به منبع/محیط معتبر نیاز دارند. CP22 immutable باقی مانده است. Round 7 و راندهای بعدی شروع نشده‌اند.

## 8. فهرست کامل تغییرات فایل‌به‌فایل

**افزوده‌شده (۷ فایل):**
- `WORKLOG-70.md`
- `scripts/round6-character-integration.test.mjs`
- `docs/round6-integration/STAGE47_ROUND6_PART1_EVIDENCE_2026-11-09.json`
- `docs/round6-integration/STAGE47_ROUND6_PART1_HANDOFF_2026-11-09.md`
- `docs/round6-integration/STAGE47_ROUND6_PART1_INTEGRATION_REPORT_2026-11-09.md`
- `docs/round6-integration/STAGE47_ROUND6_PART1_MATRIX_2026-11-09.csv`
- `docs/round6-integration/STAGE47_ROUND6_PART1_VERIFICATION_LOG_2026-11-09.txt`

**اصلاح‌شده (۸ فایل):**
- `RECOVERY_PROGRESS.md`
- `STAGE47_REPAIR_ROADMAP_2026-11-09.md`
- `EGUNSENTIA_RELEASE_CHECKPOINTS.md`
- `src/lib/game/types.ts`
- `src/lib/game/kernel.ts`
- `src/lib/game/play.ts`
- `src/components/game/V45PanelBody.tsx`
- `src/components/game/CastPanel.tsx`

**حذف‌شده:** صفر.
