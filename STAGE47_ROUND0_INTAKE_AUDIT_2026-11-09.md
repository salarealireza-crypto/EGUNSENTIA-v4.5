# EGUNSENTIA — گزارش ممیزی دریافت و خط مبنا (Round 0)

**تاریخ اجرا:** ۹ نوامبر ۲۰۲۶  
**وضعیت:** Round 0 برای بستهٔ Stage شده اجرا شد؛ تطبیق با آرشیو خالص CP9 به‌دلیل تفاوت نوع بسته محدود است.  
**مبنای اجرایی واقعی:** `EGUNSENTIA-RED-CLAW-HOUSEHOLD-EXPANSION-CP9-STAGED-2026-11-09.zip`  
**پرامپت اجرایی:** `EGUNSENTIA_Master_Prompt_Optimized.txt`

## ۱. تحلیل پرامپت

این پرامپت یک پروتکل ادامه و تکمیل پروژهٔ موجود است، نه مجوز بازنویسی یا ساخت بازی جایگزین. اصول عملیاتی آن عبارت‌اند از: حفظ checkpointهای قبلی؛ کار در working copy مستقل؛ تقدم امنیت، اصالت Canon و صداقت آزمون؛ انجام یک Round محدود در هر نشست؛ عدم تبدیل UNKNOWN یا پیشنهاد AI به واقعیت؛ و تفکیک پیاده‌سازی از آزمون واحد، یکپارچه‌سازی، تأیید مرورگر و تأیید Production.

هفت Workstream تعریف شده‌اند: A) روابط خصوصی و پیامدهای دودمانی؛ B) Lore شخصیت‌های زن؛ C) باقیماندهٔ Gate 2؛ D) وابستگی‌ها و آزمون/Build؛ E) دارایی‌های بصری؛ F) میزبانی خصوصی و استقرار؛ G) انتشار و handoff مالک. ترتیب ده Round نیز Intake (۰)، ممیزی Private Relations (۱)، ممیزی Lore و خانواده (۲)، گیم‌پلی Gate 2 (۳)، بازیابی وابستگی و QA (۴)، تکمیل Lore با دامنهٔ تأییدشده (۵)، یکپارچه‌سازی (۶)، آماده‌سازی میزبانی (۷)، استقرار (۸) و ممیزی نهایی (۹) است.

در این اجرا فقط Round 0 انجام شده است. هیچ Round توسعه‌ای یا تغییر منطق بازی در این نشست آغاز نشده است.

## ۲. اصالت و سلامت ورودی

### آرشیو مورد انتظار در پرامپت

- نام: `EGUNSENTIA-STAGE47-PRIVATE-RELATIONS-ROUND1-CP9-2026-11-09.zip`
- SHA-256 مورد انتظار: `a43bf92240b98dc17cff02b91adf7c7016ca4ae8d51e9ca2a229d5499e734eb1`
- تعداد مورد انتظار: ۶۴۰ فایل

### آرشیو واقعاً دریافت‌شده

- نام: `EGUNSENTIA-RED-CLAW-HOUSEHOLD-EXPANSION-CP9-STAGED-2026-11-09.zip`
- SHA-256 محاسبه‌شده: `096929f9bc35575b8c9c19b311a7fef17c9e4623b073c50ac84403807c56e690`
- اندازهٔ فایل فشرده: حدود ۷٫۴ MiB
- تعداد ورودی‌های ZIP: ۶۷۰؛ همه فایل و بدون ورودی پوشه‌ای
- آزمون `unzip -t`: موفق؛ هیچ خطای CRC یا دادهٔ ناقص گزارش نشد.
- نام تکراری، مسیر مطلق، مسیر دارای `..` یا symlink: صفر مورد.
- استخراج: فقط در working copy مستقل انجام شد؛ آرشیو اصلی بازنویسی نشد.

### علت مستند اختلاف

این فایل همان آرشیو خالص CP9 با نام و هش مورد انتظار نیست؛ یک **Staged CP9 Extension** مبتنی بر CP9 است. مستندات داخلی بسته این رابطه را توضیح می‌دهند:

- خلاصهٔ Inventory در `docs/red-claw-household-expansion/15_FILE_INVENTORY_SUMMARY.md` می‌گوید CP9 پایه ۶۴۰ فایل داشته و نسخهٔ مرحله‌ای ۶۷۰ فایل دارد؛ ۳۰ فایل افزوده، ۸ فایل تغییرکرده و صفر فایل حذف‌شده.
- manifest توسعه‌یافته ۶۶۹ مسیر را ثبت می‌کند (خود manifest برای جلوگیری از self-hash در ردیف‌هایش نیامده است): ۶۳۲ بدون تغییر، ۲۹ ردیف جدید و ۸ ردیف تغییرکرده. با احتساب خود manifest، شمار افزوده‌ها ۳۰ و شمار فایل‌های بسته ۶۷۰ است.
- Inventory مربوط به CP9 دارای ۶۳۹ ردیف مسیر به‌علاوهٔ خود فایل Inventory است. هر ۶۳۹ مسیر در بستهٔ توسعه‌یافته وجود دارد؛ هیچ مسیر پایه‌ای حذف نشده و هش ۸ فایل با مقدار ثبت‌شده برای CP9 متفاوت است.
- هر ۶۶۹ ردیف manifest توسعه‌یافته، از نظر وجود، اندازه و SHA-256 با فایل استخراج‌شده تطبیق داده شد: ۶۶۹/۶۶۹ موفق.

هشت فایل گزارش‌شده به‌عنوان تغییرکرده نسبت به CP9 عبارت‌اند از:

1. `package.json`
2. `scripts/private-relations.test.mjs`
3. `src/components/game/CastPanel.tsx`
4. `src/components/game/V45PanelBody.tsx`
5. `src/lib/game/kernel.ts`
6. `src/lib/game/sim/npc.ts`
7. `src/lib/game/sim/private-relations.ts`
8. `src/lib/game/types.ts`

بنابراین اختلاف هش، با شواهد داخلی، ناشی از دریافت نسخهٔ مرحله‌ای توسعه‌یافته به‌جای آرشیو خالص CP9 است؛ نشانه‌ای از خرابی ZIP مشاهده نشد. بااین‌حال خود آرشیو خالص CP9 با هش `a43bf...` در ورودی‌های این نشست موجود نبود. در نتیجه، تطبیق فعلی بر اساس manifest و گزارش‌های داخل بسته معتبر است، اما byte-diff مستقیم با بایت‌های آرشیو اصلی CP9 در این نشست ممکن نیست.

## ۳. وضعیت واقعی پروژه و تطبیق گزارش با کد

### CP9 — Private Relations & Dynastic

گزارش Round 1 می‌گوید این سیستم بر CP8 افزوده شده و شامل state نسخه‌دار و سازگار با Save قدیمی، درخواست و پاسخ NPC، ثبت امتناع/انصراف بدون مجازات، حفاظت مستقل در روابط دارای تعارض قدرت، گذار جداگانهٔ نامزدی و ازدواج، افشای مبتنی بر شواهد، بررسی نقض مرز، وضعیت‌های محافظه‌کارانهٔ بارداری و پیامدهای دودمانی است.

وجود مسیرهای اصلی در کد بررسی شد: `src/lib/game/sim/private-relations.ts`، `src/lib/game/store.ts`، `src/lib/game/delta.ts`، `src/lib/game/play.ts`، `src/lib/game/retrieve.ts`، `src/lib/game/save-validation.mjs` و `src/components/game/V45PanelBody.tsx`. شواهد کد، پیاده‌سازی منبع را تأیید می‌کند؛ ولی به‌تنهایی تأیید مرورگر یا دوام ذخیره‌سازی نیست.

### Staged Red Claw Household Expansion

رجیستری ۱۰۰ کارتی، اعتبارسنج مستقل و نمایش/اتصال محدود CAST و Panel 17 در بسته وجود دارد. `npm run verify:red-claw` ساختار ۱۰۰ کارت با توزیع A20/B30/C50، ۷۱ رکورد پیشنهادی ساکنان مرتبط با خانواده، ۷۲ رکورد فعال CAST، هشت نیروی تاریخی پیشنهادی و ۱۲ سابقهٔ پیشنهادی شریک پیشین را گزارش کرد.

اسناد این بسته، ۷۹ مورد را `PROPOSED_EXPANSION` و نیازمند تصمیم مالک می‌دانند. اعتبارسنجی ساختاری به معنای تأیید Canon، تبارشناسی یا قابلیت سکونت/عملیات واقعی نیست. خود گزارش پذیرش می‌گوید سیستم کامل خانوار، دفتر اشغال طبقات، زنجیرهٔ رویدادهای پایدار، خدمات کامل و QA مرورگر/Production هنوز تحویل نشده‌اند؛ این بسته باید Staged CP9 Extension بماند و CP10 یا سیستم کامل تلقی نشود.

### Gate 2

گزارش‌های CP7 و CP8 اجرای typed decree، تراکنش Store و idempotency گزینه‌ها را ثبت کرده‌اند؛ CP9 نیز Gate 2 را تکمیل نکرده است. Political Capital همچنان فاقد قرارداد authoritative برای balance/ledger است. آزمون کامل فرمان تا commit، reload و Receipt؛ تست‌های persistence روی backend واقعی؛ ثبات availability بین تمام پنل‌ها؛ تأیید Browser؛ و برخی مسیرهای investigation و alias هنوز باز یا اثبات‌نشده‌اند. «تست واحد موفق» جای «Integration-tested» یا «Browser-verified» را نمی‌گیرد.

## ۴. شکاف‌های Canon و ورودی‌های مالک

- `attachments/EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` موجود است، اما فقط یادداشت ۳۳۱ بایتی و ۶ خطیِ anchor است؛ نسخهٔ کامل V4.1 نیست.
- `attachments/EGUNSENTIA_V4.5_Update_Prompt.txt` پس از جست‌وجوی پروژه یافت نشد.
- دفتر کامل و قابل جست‌وجوی تبارشناسی مهروموم‌شدهٔ Floor 7 ارائه نشده است؛ درجات خویشاوندی همسران پیشنهادی قابل تأیید نیست.
- تاریخ تولدهای دقیق لازم برای تأیید برخی توالی‌های خانوادگی، از جمله مسئلهٔ Elara/Luka/Christian، در منابع ارائه‌شده کامل نیست.
- هویت پنجمین عضو دائمی زن Iron Guard در منابع قبلی همچنان UNKNOWN است.

هیچ‌یک از این موارد با حدس تکمیل یا به Canon ارتقا داده نشد.

## ۵. محیط و وابستگی‌ها

- Node.js: `v22.16.0`
- npm: `10.9.2`
- `package-lock.json`، نسخهٔ lockfile برابر ۳
- `package.json` فیلد `engines` ندارد.
- `node_modules` وجود ندارد؛ `npm ls --depth=0` کمبود گستردهٔ وابستگی‌ها را نشان می‌دهد.
- `.grok/app-env.json` وجود ندارد؛ ساخته نشد و برای رفع مصنوعی تست‌های محیطی جعل نشد.
- تنها فایل محیطی پیدا‌شده `.env.example` است؛ فایل `.env` در بسته نیست.
- پوشهٔ `.git` و فایل‌های workflow زیر `.github` در بسته وجود ندارند.
- اسکن heuristic روی ۶۵۹ فایل متنی، برای چند الگوی رایج کلید/توکن صفر match داشت؛ این اسکن جای ممیزی جامع اسرار را نمی‌گیرد.
- `npm ci` در Round 0 اجرا نشد؛ هیچ وابستگی نصب یا lockfile تغییر داده نشد.

## ۶. نتایج آزمون‌های اجراشده در همین نشست

| فرمان / بررسی | نتیجه | توضیح |
|---|---|---|
| `unzip -t <input.zip>` | PASS | همهٔ ورودی‌ها سالم |
| تطبیق manifest توسعه‌یافته | PASS | ۶۶۹ از ۶۶۹ مسیر/اندازه/هش |
| تطبیق مسیرهای CP9 با extension | PASS | ۶۳۹ از ۶۳۹ مسیر موجود؛ ۸ هش تغییرکرده |
| `npm test` | FAIL — ۴۳۱/۴۳۵ | یک suite به‌دلیل نبود `zod` بارگذاری نشد؛ سه تست محیطی `with-app-env` مقدار محلی `VITE_AUTH_ENABLED=true` را انتظار داشتند و `.grok/app-env.json` موجود نبود |
| `npm run test:game` | BLOCKED | `ERR_MODULE_NOT_FOUND: zod` در import از `src/lib/game/delta.ts`؛ assertionهای آن suite اجرا نشدند |
| Private Relations + Save focused tests | PASS — ۳۳/۳۳ | اجرای مستقیم تست‌های اختصاصی موجود |
| Red Claw focused tests | PASS — ۱۰/۱۰ | اجرای مستقیم تست رجیستری توسعه‌یافته |
| `npm run verify:canon` | PASS | رجیستری و invariants موجود تأیید شدند |
| `npm run verify:red-claw` | PASS با هشدار | هشدارهای سن/تاریخ غیرقابل تأیید، نبود دفتر کامل خویشاوندی و حل‌نشدن chronology حفظ شدند |
| `npm run verify:art` | FAIL / INCOMPLETE | ۱۶۷ asset؛ ۰ raster generated، ۱۵۰ code-drawn، ۱۷ preserved و ۲۳ گروه ناقص |
| `node --check` برای همهٔ MJSها | PASS — ۹۲/۹۲ | صفر خطای نحوی |
| `npm run typecheck` | BLOCKED | TS2688 برای `node` و `vite/client` |
| `npm run lint` | BLOCKED | `eslint: not found` |
| `npm run build` | BLOCKED | `spawn vite ENOENT` |
| Browser QA | NOT RUN | محیط Build/وابستگی کامل موجود نبود؛ تعامل واقعی بررسی نشد |
| DB / OAuth / AL provider / Production | NOT RUN | backend و اعتبارنامه/محیط واقعی متصل و آزموده نشدند |

جزئیات خروجی کامل فرمان‌ها در `docs/round0-evidence/` نگهداری شده است. هیچ تستی حذف یا خاموش نشد؛ هیچ dependency برای ساختن نتیجهٔ PASS نصب نشد.

## ۷. طبقه‌بندی وضعیت بر مبنای پرامپت

- **Implemented:** مسیرهای منبع CP9 و اتصال‌های staged Red Claw در کد موجودند؛ این عبارت ادعای عملکرد سرتاسری نیست.
- **Unit-tested:** تست‌های هدفمند Private Relations/Save برابر ۳۳/۳۳ و Red Claw برابر ۱۰/۱۰ پاس شدند؛ Canon و Red Claw verifier نیز پاس شدند.
- **Integration-tested:** برای مسیر واقعی فرمان تا backend پایدار، reload و Receipt در این دور اثبات نشد.
- **Build-verified:** خیر؛ typecheck، lint و build مسدودند.
- **Browser-verified:** خیر؛ اجرا نشد.
- **Production-verified:** خیر؛ اجرا نشد.
- **Blocked:** وابستگی‌های نصب‌نشده، پیکربندی محلی غایب، منابع Canon ناقص و backend/provider واقعی آزموده‌نشده.

## ۸. تغییرات این Round 0

هیچ فایل اجرایی بازی، schema داده، تست موجود یا دادهٔ Canon تغییر نکرد. سه سند موجود (`README.md`، `RECOVERY_PROGRESS.md` و `STAGE47_REPAIR_ROADMAP_2026-11-09.md`) برای انعکاس وضعیت فعلی اصلاح شدند. ۲۱ فایل جدید شامل گزارش، handoff، evidence، worklog و logهای دقیق آزمون اضافه شد؛ فایل Inventory نیز به‌عنوان فایل جدید جداگانه افزوده شده و ردیف self-hash ندارد. در مجموع نسبت به والد: ۶۶۷ فایل بدون تغییر، ۳ فایل اصلاح‌شده، ۲۲ فایل افزوده (با احتساب Inventory) و صفر فایل حذف‌شده؛ تعداد نهایی بسته ۶۹۲ فایل است. آرشیو ورودی و فایل پرامپت دست‌نخورده ماندند.

## ۹. تصمیم و ادامه

**Round 0 به‌عنوان ممیزی Intake برای بستهٔ Staged CP9 Extension تکمیل شد.** این تصمیم نه تأیید هش آرشیو خالص CP9 است، نه تأیید CP10، نه بستن Gate 2 و نه اعلام آمادگی انتشار.

Round بعدی طبق ترتیب پرامپت **Round 1 — ممیزی و hardening سیستم Private Relations موجود** است. باید مسیرهای transition، consent/agency، safeguards، engagement/marriage، privacy/disclosure، pregnancy/dynastic evidence، Event Ledger، Save compatibility و AL validator بررسی شوند؛ هر اصلاح فقط در صورت اثبات gap واقعی و به‌صورت سازگار انجام شود. سیستم از صفر بازنویسی نشود.

پس از آن Round 2 فقط ممیزی roster، genealogy، سن‌ها، timeline و شکاف‌های Canon است. برای تکمیل Canon، منابع V4.1 و V4.5 و دفتر تبارشناسی معتبر لازم‌اند. پیشنهادهای Red Claw تا زمان تصمیم صریح مالک در وضعیت پیشنهادی باقی می‌مانند.
