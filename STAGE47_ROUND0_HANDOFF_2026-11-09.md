# EGUNSENTIA — Handoff ادامه از Round 0

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**بستهٔ والد:** `EGUNSENTIA-RED-CLAW-HOUSEHOLD-EXPANSION-CP9-STAGED-2026-11-09.zip`  
**SHA-256 والد:** `096929f9bc35575b8c9c19b311a7fef17c9e4623b073c50ac84403807c56e690`  
**خروجی این دور:** `EGUNSENTIA-STAGE47-RED-CLAW-STAGED-CP9-ROUND0-AUDIT-2026-11-09.zip`  
**وضعیت:** Staged CP9 Extension؛ نه CP10 و نه Release Candidate.

## ۱. نقطهٔ ادامه

از checkpoint ممیزی Round 0 که همراه این handoff تحویل شده است ادامه بدهید. آرشیو والد و فایل پرامپت اصلی immutable هستند. working copy جداگانه استفاده شود.

آرشیو خالص CP9 با نام و SHA-256 مورد انتظار پرامپت در ورودی این نشست نبود. بستهٔ دریافت‌شده یک Staged CP9 Extension است: manifest آن ۶۴۰ فایل پایهٔ CP9 را حفظ‌شده نشان می‌دهد، ۳۰ فایل افزوده، ۸ فایل اصلاح‌شده و صفر فایل حذف‌شده. تطبیق فایل‌به‌فایل manifest مرحله‌ای کامل است؛ byte-diff مستقیم با ZIP اصلی CP9 به‌دلیل نبود بایت‌های آن آرشیو ممکن نشد.

## ۲. وضعیت تأییدشده

- ZIP سالم و inventory/hashها معتبرند.
- Private Relations + Save focused tests: ۳۳/۳۳ PASS.
- Red Claw focused tests: ۱۰/۱۰ PASS.
- Canon verifier: PASS.
- Red Claw verifier: PASS با هشدارهای Canon/chronology.
- MJS syntax: ۹۲/۹۲ PASS.
- Full `npm test`: ۴۳۱/۴۳۵؛ یک suite به‌دلیل `zod` بارگذاری نشد و سه تست به تنظیم محلی `.grok/app-env.json` وابسته بودند.
- Typecheck، lint و build به‌علت dependencyهای نصب‌نشده BLOCKED هستند.
- Art verifier هنوز INCOMPLETE؛ Browser، DB، OAuth، AL و Production آزموده نشده‌اند.
- Gate 2 هنوز PARTIAL است.

## ۳. Round بعدی — Round 1 فقط

سیستم CP9 Private Relations را ممیزی و در صورت وجود gap واقعی harden کنید؛ آن را بازنویسی نکنید. ترتیب بررسی:

1. تمام state transitionها و رد تغییر نامعتبر بدون آسیب به Save.
2. پاسخ NPC، رضایت مستقل، refusal/withdrawal و safeguards برای کارکنان/زیر‌دستان/نظامیان.
3. تفکیک proposal، engagement و marriage و نیاز به mutual consent و ceremony/registration evidence.
4. privacy، disclosure و reputation فقط بر اساس آگاهی/شواهد معتبر.
5. suspicion، medical confirmation، birth، parentage، legitimacy و heirship به‌عنوان stateهای مستقل.
6. Event Ledger، Save validation، legacy defaults، AL Delta، compact state و authoritative validator.
7. تست‌های هدفمند و هر integration test واقعاً ممکن؛ نوع آزمون را دقیق نام‌گذاری کنید.

فایل‌های شروع: `src/lib/game/sim/private-relations.ts`، `src/lib/game/store.ts`، `src/lib/game/delta.ts`، `src/lib/game/play.ts`، `src/lib/game/retrieve.ts`، `src/lib/game/save-validation.mjs`، `src/components/game/V45PanelBody.tsx` و `scripts/private-relations.test.mjs`.

## ۴. محدودیت‌ها و ورودی‌های لازم برای مراحل بعد

- نسخهٔ کامل `EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` لازم است؛ فایل فعلی فقط anchor note ۳۳۱ بایتی است.
- `EGUNSENTIA_V4.5_Update_Prompt.txt` غایب است.
- دفتر کامل و قابل جست‌وجوی تبارشناسی Floor 7 برای تأیید درجات خویشاوندی لازم است.
- ۷۹ رکورد پیشنهادی Red Claw تا تصویب صریح مالک Canon نیستند.
- هیچ credential، API key یا secret نباید در چت وارد شود؛ مالک باید secrets را فقط در پنل امن provider وارد کند.
- از اجرای npm install/ci، تغییر lockfile یا ایجاد `.grok/app-env.json` برای جعل تست سبز خودداری کنید، مگر اینکه Round وابستگی و محیط مجاز اجرا شود و دلیل/خروجی دقیق ثبت شود.

## ۵. تغییرات Round 0 و وضعیت انتشار

- سه سند موجود (`README.md`، `RECOVERY_PROGRESS.md` و `STAGE47_REPAIR_ROADMAP_2026-11-09.md`) برای انعکاس وضعیت فعلی به‌روزرسانی شدند.
- ۲۱ فایل جدید شامل report، handoff، evidence، worklog و logهای آزمون اضافه شد؛ خود Inventory نیز به‌عنوان فایل جدید جداگانه افزوده شده و برای جلوگیری از self-hash ردیف خودش را ندارد.
- در مجموع نسبت به والد: ۶۶۷ فایل بدون تغییر، ۳ فایل مستنداتی اصلاح‌شده، ۲۲ فایل جدید (با احتساب خود Inventory)، صفر فایل حذف‌شده؛ تعداد نهایی فایل‌های بسته ۶۹۲ است. هیچ فایل کد بازی یا دادهٔ Canon تغییر نکرد.



این بسته source/audit checkpoint است. URL زنده، HTTPS، owner authentication، پایگاه دادهٔ Production، AL server-side، backup/restore و دسترسی مالک تأیید نشده‌اند. هیچ deploy یا هزینهٔ میزبانی انجام نشده است.
