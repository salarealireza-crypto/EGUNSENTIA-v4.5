# گزارش Round 1 — ممیزی و سخت‌سازی Private Relations & Dynastic

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**مرحله:** Stage 47 — پس از CP9 Staged Extension  
**بستهٔ تحویلی:** `EGUNSENTIA-STAGE47-POST-CP9-PRIVATE-RELATIONS-ROUND1-PARTIAL-CP10-2026-11-09.zip`  
**وضعیت این بسته:** Partial source checkpoint؛ Round 1 در سطح کد و آزمون واحد سخت‌سازی شده، اما Workstream A و پذیرش یکپارچه‌سازی/مرورگر کامل نیستند.

## خلاصهٔ اجرایی

سیستم موجود CP9 بازنویسی نشد. در working copy جداگانه، ممیزی انتقال وضعیت‌ها، درخواست/پاسخ، رضایت، نقش‌های وابسته، ازدواج، افشا، ثبت مرز، بارداری، Save normalization، Event Ledger و ورودی AL انجام شد. هشت فایل کد/آزمون موجود اصلاح شدند؛ هیچ فایل Canon یا تاریخچهٔ اصلی حذف نشد.

مهم‌ترین شکاف‌های اصلاح‌شده عبارت بودند از: امکان دست‌کاری وضعیت ازدواج از Save یا درخواست قدیمی؛ نداشتن پیوند معتبر میان پیشنهاد ازدواج پذیرفته‌شده و نهایی‌سازی؛ تنزل سطح افشای قبلی در جریان گفت‌وگوی عادی؛ ساخت رویداد Canon برای پرونده‌های PROPOSED_EXPANSION؛ برخورد شناسهٔ درخواست پس از عبور از سقف تاریخچه؛ اعمال چندبارهٔ اثر Reputation برای تکرار همان نقض مرز؛ بازگشت وضعیت بارداری از تأییدشده به مشکوک؛ پذیرش فرزند قدیمی به‌عنوان شاهد تولد جدید؛ و توقف نرمال‌سازی در برابر برخی رکوردهای ناقص اختیاری.

## A. کار انجام‌شده

### A1 — مدل رابطه و گذارها
- پاسخ به درخواست، eligibility و وضعیت فعلی رابطه را در لحظهٔ ثبت نتیجه دوباره بررسی می‌کند؛ درخواست قدیمی/جعلی نمی‌تواند محدودیت همسر رسمی یا وضعیت فعلی را دور بزند.
- گفت‌وگوی پذیرفته‌شده وضعیت رابطه یا سطح افشا را تغییر نمی‌دهد.
- سطح دانش/افشای رابطه در نرمال‌سازی نمی‌تواند پایین‌تر از حداقل ثبت‌شده در دادهٔ پایهٔ Canon قرار گیرد.
- شناسهٔ درخواست جدید با UUID تولید می‌شود؛ اتکا به طول آرایه حذف شد.
- هنگام چرخش تاریخچهٔ ۱۰۰‌تایی، پیشنهاد ازدواج پذیرفته‌شدهٔ مربوط به نامزدی فعال حفظ می‌شود تا زنجیرهٔ شواهد ازدواج از بین نرود.

### A2 — رضایت، اختیار فردی و اختلاف قدرت
- رد/withdrawal بدون مجازات یا تغییر خودکار وضعیت رابطه باقی می‌ماند.
- برای نقش‌های دارای وابستگی یا تضاد منافع، مدرک مستقل حفاظت در برابر تلافی و مسیر گزارش مستقل همچنان لازم است.
- رکورد ازدواج نهایی فقط با وضعیت engagement-pending، پیشنهاد ازدواج پذیرفته‌شدهٔ قابل ردیابی، شواهد رضایت فعلی و مدرک معتبر مراسم/ثبت قانونی می‌پذیرد.
- همسران رسمی و نقش‌های غیرواجد شرایط از طریق رکورد دست‌کاری‌شده یا انتقال عمومی قابل تبدیل به رابطهٔ جدید نیستند.

### A3 — همسران رسمی و روابط پیشین
- تمایز Canon سه همسر رسمی — Dagmar Red، Adelheid von Moren و Vera Grotsen — و Elara Red به‌عنوان شریک سابق و فرمانده Iron Guard حفظ شد.
- ۱۲ پروندهٔ former-partner با وضعیت PROPOSED_EXPANSION از رخدادهای رابطه‌ای، افشا، پزشکی، مرزی و تبارشناختی Canon جدا شدند.
- رفتار قبلی پروژه برای گفت‌وگوی خنثی با پروندهٔ پیشنهادی حفظ شد؛ گفت‌وگو هیچ‌گونه رابطهٔ تاریخی، رضایت، آشتی یا تغییر وضعیت عاشقانه را اثبات نمی‌کند. تست موجود Red Claw نیز این تفکیک را تأیید می‌کند.

### A4 — بارداری و پیامدهای تبارشناختی
- وضعیت پزشکی monotonic شده است؛ پس از تأیید پزشکی، بازگشت به suspected رد می‌شود.
- ثبت suspected از AL همچنان تنها مرحلهٔ قابل پیشنهاد است؛ مراحل بعدی به مدرک پزشکی مستقل نیاز دارند.
- پایان بارداری با وضعیت completed نیازمند کودک مشخصی است که شناسهٔ همان پروندهٔ بارداری، مادر یکسان و birthDay معتبر بین startedDay و روز جاری داشته باشد.
- `PregnancyRecord.startedDay` و `childRecordId` و `ChildSlot.pregnancyId` به‌صورت فیلدهای اختیاری و سازگار با Saveهای قدیمی اضافه شدند.
- UI فقط کودکانی را برای پیوند نشان می‌دهد که شواهد زمانی و شناسه‌ای آن‌ها با پروندهٔ جاری مطابقت دارد؛ فهرست مادران پزشکی به پروفایل‌های Canon محدود شد.
- **محدودیت حل‌نشده:** پروژه مسیر مستقل ایجاد/ثبت کودک جدید با سند تولد ندارد. چهار کودک اولیه، رکوردهای تاریخی‌اند و دادهٔ پیوند pregnancyId/birthDay برای این کار ندارند. به‌همین دلیل child یا parent جدیدی ساخته نشده و ثبت completed در نبود رکورد معتبر عمداً مسدود می‌ماند. رکوردهای قدیمی بارداری فاقد startedDay نیز بدون سند قابل backfill نیستند.

### A5/A6 — واکنش اجتماعی و AL
- رویداد نقض مرز دارای شناسهٔ مبتنی بر شواهد است؛ ارسال دوبارهٔ همان رخداد در Store و Delta، Reputation یا Event Ledger را تکرار نمی‌کند.
- شواهد واقعیِ گزارش‌شده به Event Ledger منتقل می‌شود، نه متن placeholder.
- خروجی compact state اکنون sourceStatus و historyDisposition را برای roster و sourceStatus را برای رابطه‌ها به AL می‌دهد.
- دستور AL از شمار کل ردیف‌ها (۳۷) شمار Canon (۲۵) را جدا می‌کند؛ ۱۲ ردیف PROPOSED_EXPANSION فقط به‌عنوان پیشنهاد غیر Canon شناخته می‌شوند. گفت‌وگوی خنثی در صورت وجود مسیر UI مجاز است، اما رویداد عاشقانه/افشا/مرزی/پزشکی/تبارشناختی برای آن‌ها مجاز نیست.

### فایل‌های اصلاح‌شده
1. `src/lib/game/sim/private-relations.ts` — اعتبارسنجی، گذار، شناسه، نرمال‌سازی، idempotency و شواهد بارداری/ازدواج.
2. `src/lib/game/types.ts` — فیلدهای اختیاری پیوند بارداری/کودک.
3. `src/lib/game/store.ts` — پیوند رکورد کودک و جلوگیری از اثر تکراری نقض مرز.
4. `src/lib/game/delta.ts` — idempotency و شواهد Event Ledger در مسیر Delta.
5. `src/lib/game/play.ts` — انتقال منبع Canon/پیشنهادی به compact state.
6. `src/lib/game/retrieve.ts` — دستور AL دقیق‌تر دربارهٔ وضعیت منبع و مرز پیشنهاد/Canon.
7. `src/components/game/V45PanelBody.tsx` — انتخاب کودک دارای پیوند معتبر و محدودسازی کنترل‌های پزشکی/افشا/مرزی به Canon.
8. `scripts/private-relations.test.mjs` — آزمون‌های regression جدید و اصلاح انتظارهای مرتبط.
9. `RECOVERY_PROGRESS.md` و `STAGE47_REPAIR_ROADMAP_2026-11-09.md` — افزودن وضعیت جدید بدون پاک‌کردن تاریخچه.

هیچ فایل والد حذف نشد. نسبت به Round 0، ۱۰ فایل موجود اصلاح شد (۸ فایل کد/آزمون و ۲ سند وضعیت)، ۲۲ فایل افزوده شد و صفر فایل حذف شد. جزئیات ردیف‌به‌ردیف در `STAGE47_ROUND1_CHANGE_MANIFEST_2026-11-09.csv` و فهرست حذف‌های عمدی در `STAGE47_ROUND1_EXCLUSIONS_2026-11-09.md` است.

## B. Verification — فرمان‌ها و نتیجه‌ها

| فرمان / بررسی | نتیجه | وضعیت |
|---|---:|---|
| `node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/private-relations.test.mjs scripts/save-validation.test.mjs` | ۳۹/۳۹ PASS | Unit-tested |
| `node --experimental-strip-types --import ./scripts/register-ts.mjs --test 'scripts/**/*.test.mjs'` | ۴۳۷ PASS، ۴ FAIL از ۴۴۱ | Partial / Blocked |
| `npm run verify:canon` | PASS؛ ۶۵ پنل، invariantها، ۱۶۷ دارایی و catalogها | Unit/tool verification |
| `npm run verify:red-claw` | PASS با هشدارهای Canon/chronology | Unit/tool verification |
| `node --check scripts/private-relations.test.mjs` | PASS | Syntax-verified |
| TypeScript `transpileModule` روی ۷ فایل TS/TSX تغییرکرده | ۷/۷ بدون syntax diagnostic | Syntax-verified فقط؛ نه semantic typecheck |
| `npm run typecheck` | BLOCKED؛ `@types/node` و `vite/client` وجود ندارند | Blocked |
| `npm run build` | BLOCKED؛ `spawn vite ENOENT` | Blocked |
| `npm run lint` | BLOCKED؛ `eslint: not found` | Blocked |

### چهار شکست مجموعهٔ عمومی اسکریپت
- `scripts/game.test.mjs`: suite بارگذاری نشد؛ `ERR_MODULE_NOT_FOUND: Cannot find package 'zod' imported from src/lib/game/delta.ts`.
- سه تست در `scripts/with-app-env.test.mjs`: انتظار تنظیم `VITE_AUTH_ENABLED=true` از `.grok/app-env.json` را داشتند، اما فایل محلی در بسته موجود نیست و مقدار واقعی `{}`/`undefined` شد.
- هیچ تستی حذف یا skip نشد و برای سبز کردن آن‌ها تنظیم جعلی ساخته نشد.

فرمان‌های دقیق و خروجی کامل در `docs/round1-evidence/` بسته‌بندی شده‌اند.

## C. کار باقی‌مانده و موانع

1. مسیر معتبر ایجاد و ثبت کودک/تولد با شناسهٔ بارداری، سند پزشکی و تعیین منشأ اطلاعات وجود ندارد؛ طراحی این مسیر باید از جعل Canon یا parentage جلوگیری کند.
2. رکوردهای پزشکی legacy فاقد startedDay با دادهٔ واقعی باید جداگانه بررسی شوند؛ تاریخ شروع حدس زده نمی‌شود.
3. Integration test مسیر واقعی AL request → Delta validator → Store → persistent commit → reload اجرا نشد؛ Zod و محیط اجرایی کامل در دسترس نیستند.
4. پایگاه دادهٔ واقعی یا production-equivalent در دسترس این دور نبود؛ persistence integration تأیید نشده است.
5. Browser QA پنل ۱۷ و مسیرهای متصل اجرا نشد؛ Vite نصب نیست.
6. Typecheck معنایی، Lint و Build به‌دلیل dependencyهای نصب‌نشده مسدودند. نصب dependency و تغییر lockfile خارج از Round 1 و بدون توجیه/تأیید انجام نشد.
7. Gate 2 همچنان PARTIAL است؛ این دور آن را نمی‌بندد.

## D. Canon integrity

- **Canon حفظ‌شده:** سه همسر رسمی؛ Elara به‌عنوان شریک سابق و فرمانده؛ تمایز رضایت/نامزدی/ازدواج؛ محرمانگی و مرزبندی؛ هویت و والدیت نامعلوم تا وجود شواهد معتبر.
- **Player-authored / In-game state:** رویدادها فقط از طریق validator و شواهد ثبت‌شده وارد state می‌شوند؛ هیچ شخصیت/کودک/پدر/وارث جدیدی در این دور ساخته نشد.
- **Proposed:** ۱۲ پروندهٔ Red Claw پیشنهادی همچنان PROPOSED_EXPANSION هستند و Canon نشده‌اند.
- **Unknown:** تاریخ دقیق تولد برخی شخصیت‌ها، genealogy کامل Floor 7 و مسیر ثبت تولد جدید همچنان UNKNOWN/ناموجودند.
- **Conflict:** هیچ تغییر Canon برای حل تعارض انجام نشد.

## E. Persistence و یکپارچه‌سازی

- تغییرات در validatorهای شبیه‌سازی، Store، Delta، Save-compatible types و UI نوشته و unit-tested شدند.
- فایل‌های inventory، SHA256SUMS، change manifest و exclusions همراه checkpoint قرار گرفته‌اند.
- مسیر serialization واقعی تا پایگاه داده، commit و reload در این دور اجرا نشد؛ بنابراین Integration-tested یا Production-verified اعلام نمی‌شود.
- UI به‌صورت source-level تغییر کرده، ولی Browser-verified نیست.
- هیچ دادهٔ live یا Save واقعی مالک برای آزمون مخرب استفاده نشد.

## F. امنیت، میزبانی و انتشار

- dependency نصب نشد، lockfile تغییر نکرد، secret یا credential جدید ایجاد نشد.
- فایل `.env` واقعی، `node_modules` و build output در این کپی وجود ندارند؛ `.env.example` حفظ شده است.
- اسکن pattern-based موجود در Round 0 برای ۶۵۹ فایل متنی صفر match داشت؛ این صرفاً heuristic است، نه تضمین نبود همهٔ secrets.
- هیچ hosting، database، domain، HTTPS، AL key یا هزینهٔ جدیدی پیکربندی نشد.
- Browser، staging و production اجرا/تأیید نشدند.

## G. تصمیم دور

**Round 1 — Partial source hardening delivered.** اصلاحات منطق و آزمون واحد قابل تحویل‌اند، اما A4 به‌دلیل نبود مسیر ثبت کودک و کل سطح integration/browser همچنان باز است. این بسته Release Candidate، Gate 2 completion یا online release نیست.

**مرحلهٔ بعد طبق ترتیب پرامپت:** ادامهٔ شکاف A4 فقط با قرارداد ثبت تولد مستند و منبع معتبر؛ پس از تعیین تکلیف آن، Round 2 ممیزی Canon/roster/genealogy به‌صورت audit-only. هیچ تأیید داستانی از مالک فرض نشده است.
