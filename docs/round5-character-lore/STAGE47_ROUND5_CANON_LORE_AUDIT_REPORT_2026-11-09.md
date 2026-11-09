# گزارش نهایی راند ۵ — ممیزی و تکمیل lore شخصیت‌ها و خانوار

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد immutable:** CP21 — `EGUNSENTIA-STAGE47-POST-CP20-ROUND4-DEPENDENCY-RECOVERY-PARTIAL-CP21-2026-11-09.zip`  
**وضعیت:** `PARTIAL — SOURCE-BOUNDED PROFILE REPAIR PASS; CANON EXPANSION BLOCKED BY MISSING AUTHORITY`  
**محدوده:** فقط Workstream B، بدون شروع Round 6.

## ۱. تصمیم اجرایی

با دستور مالک پروژه، پس از مسدودماندن بخش‌های وابسته به محیط در راند ۴، راند ۵ آغاز شد. کار فقط بر داده‌هایی انجام شد که پشتوانهٔ مستقیم در Canon موجود داشتند. هیچ شخصیت پیشنهادی، تاریخ پیشنهادی، پیوند خانوادگی نامطمئن یا جزئیات رفتاریِ فاقد منبع به Canon ارتقا نیافت.

دو اصلاح واقعی انجام شد:
1. شش کارت ناقص سطح اول، فیلد `RELATIONS` عمومی و source-backed دریافت کردند: Dagmar Red، Adelheid von Moren، Vera Grotsen، Elara Red، Hanne Brauer و Wilhelmina Red.
2. در `private-relations.ts` ادعای قبلیِ قطعی دربارهٔ «چهار عضو نام‌دار + عضو پنجم ناشناس» اصلاح شد. شواهد count با یکدیگر سازگار نیستند؛ بنابراین دیگر عضو پنجم فرض یا ساخته نمی‌شود. یک تست واحد برای هر دو اصلاح اضافه شد.

## ۲. نتایج آزمون

- `scripts/private-relations.test.mjs` و `scripts/red-claw-household.test.mjs`: **۳۲/۳۲ PASS**.
- `node scripts/verify-canon.mjs`: **PASS** — رجیستری ۶۵ پنلی، invariants، تعداد ۱۶۷ دارایی و option catalogها.
- `node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-red-claw-household.mjs`: **PASS** — ۱۰۰ کارت A20/B30/C50، ۷۱ residence-label permanent، ۷۲ active CAST entry در مجموعهٔ مختلط و ۸ نیروی تاریخی proposal؛ با ۱۴ هشدار قابل‌ردیابی، نه خطای assertion.
- تست جدید Round 5 مشخصاً شش فیلد RELATIONS و caveat تعداد Iron Guard را می‌سنجد.
- آزمون full suite / typecheck / build / lint در این راند هدف نبود؛ موانع نصب وابستگی راند ۴ در گزارش CP21 باقی هستند.
- DB Integration، Browser QA و Production verification اجرا نشده‌اند و ادعایی دربارهٔ آن‌ها مطرح نمی‌شود.

## ۳. پوشش واقعی ۱۹ فیلد

دامنه‌ها جدا شده‌اند تا با baseline Master Prompt اشتباه نشوند:

- هستهٔ Private Relations: **۲۵ زن Canon**، همان ۲۵ رکورد `WOMEN` در `private-relations.ts`.
- دامنهٔ گستردهٔ کارت‌های زن Canon: **۲۷ پروفایل**؛ ۲ مورد افزوده، Countess Seraphine von Aschen و Delegate Johanna Weiss، کارت Canon دارند ولی عضو roster خانوار/Private Relations نیستند.
- ۱۲ پروفایل former-partner در runtime فقط proposal و read-only هستند؛ آن‌ها ۱۲ زن Canon دیگر نیستند.

پس از افزودن شش `RELATIONS`، فیلدهای ۱۹گانه در CSV به‌صورت ستون‌های مستقل ثبت شده‌اند. چون DOB دقیق برای هیچ‌یک از ۲۷ نفر در منابع موجود ثبت نشده، هیچ پروفایلی هنوز ۱۹/۱۹ کامل نیست؛ ۱۹ پروفایل به ۱۸/۱۹، شش پروفایل به ۱۵/۱۹ و دو پروفایل به ۱۲/۱۹ می‌رسند. این کمبود فقط مربوط به «سنِ قابل‌راستی‌آزمایی بر اساس DOB» نیست که با age label کارت جایگزین شود؛ آن را عمداً MISSING نگه داشتم.

پس از افزودن شش `RELATIONS`:

| سنجه | نتیجه |
|---|---:|
| پروفایل‌های ۲۵تایی هسته که هر ۱۵ فیلد قدیمی را دارند | ۱۷/۲۵؛ بدون تغییر در تعداد کامل‌ها |
| پروفایل‌های ۲۵تایی هسته با ۱۲ فیلد از ۱۵ | ۶/۲۵ |
| پروفایل‌های ۲۵تایی هسته با ۹ فیلد از ۱۵ | ۲/۲۵ |
| دامنهٔ گستردهٔ ۲۷تایی با ۱۵ فیلد کامل | ۱۹/۲۷ |
| دامنهٔ گسترده با ۱۲ فیلد | ۶/۲۷ |
| دامنهٔ گسترده با ۹ فیلد | ۲/۲۷ |
| پوشش کامل B2 (۱۹/۱۹، با DOB قابل‌راستی‌آزمایی) | ۰/۲۷ |
| فیلد BODY حاضر | ۲۱/۲۷؛ شش کارت سطح اول فاقد BODY |
| فیلد IN CRISIS و SAMPLE LINES حاضر | هرکدام ۱۹/۲۷ |
| HANDLE، DAY و KNOWS حاضر | هرکدام ۲۵/۲۷ |
| RELATIONS حاضر پس از Round 5 | ۲۵/۲۷؛ Ilse Wern و Leni Bauer همچنان ناقص |
| سن مستقل بر مبنای DOB قابل راستی‌آزمایی | ۰/۲۷؛ فقط age label کارت موجود است |

این درصدها فقط حضور ساختاری فیلد را می‌سنجند، نه راستی‌آزمایی مستقلِ سن، عمق شجره یا کفایت روایی. `cast-cards` می‌گوید کارت‌های Stalker و برخی Underrows عمداً مختصر هستند. برای BODY سطح اول نیز به supplement §4.5.12 اشاره می‌کند، ولی آن supplement در منابع کامل موجود این بسته یافت نشد؛ بنابراین شش BODY خالی ماند.

## ۴. خلاصهٔ تغییر شش پروفایل

- **Dagmar:** First Wife؛ مادر Konrad و Liese؛ شاخهٔ Karl Line از سمت پدری. پیوند خونی دیگری اختراع نشد.
- **Adelheid:** Second Wife؛ مادر Emil؛ House von Moren به‌عنوان Marriage Kin، نه blood kin؛ Bettina attendant و Vera companion طبق دادهٔ روزمره.
- **Vera:** Third Wife؛ پل سیاسی House Grotsen؛ هیچ نسبت خونی با Christian اثبات نشده؛ Katya attendant و Adelheid companion.
- **Elara:** former partner، نه wife؛ خویشاوند دور با درجهٔ UNKNOWN؛ مادر Luka. شمار دقیق Guard با توجه به شواهد متناقض UNKNOWN ماند.
- **Wilhelmina:** مادر Katharina و مادربزرگ مادری Christian IV؛ House Representative و رئیس Kin and Ash Council. شجرهٔ بیشتر به Family Ledger طبقهٔ ۷ نیاز دارد.
- **Hanne:** senior staff برای پنج attendant بزرگسال و بازنشسته از roster فعال خدمتکاران؛ پنج نام Jana، Mila، Alena، Bettina و Katya. نسبت خانوادگی ساخته نشد.

این‌ها روابط عمومی‌اند؛ state پنهان روابط، میزان علاقه، consent، reconciliation یا event جدید ایجاد نشد.

## ۵. خانوار، NPC و نقش‌ها

- کارت‌های `red-claw-household.json`: **۱۰۰** رکورد در Tier A/B/C با توزیع ۲۰/۳۰/۵۰.
- sourceStatus: ۱۱ `CANON`، دو `CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY`، هشت `CANON_RECORD_WITH_UNRESOLVED_GENEALOGY` و **۷۹ `PROPOSED_EXPANSION`**.
- residenceStatus: ۷۱ permanent، ۲۴ not-counted، دو deceased، دو departed و یک duty-based.
- از ۷۱ برچسب permanent، **۶۲ رکورد پیشنهادی** و فقط ۹ مورد از status `CANON` هستند. بنابراین عدد ۷۱ سرشماری Canon نیست. verifier تعداد ۷۲ active CAST entry را در registry مختلط گزارش می‌کند (۷۱ permanent + یک duty-based)؛ این نیز عدد Canon-only نیست.
- نه رکورد permanent با status `CANON` عبارت‌اند از Christian IV، Dagmar، Adelheid، Vera، Luka، Konrad، Liese، Emil و Wilhelmina. Elara یک رکورد duty-based است؛ Katharina deceased.
- هشت نیروی نسل پدر در `red-claw-historical-household.json` صریحاً proposal هستند: سه نیروی خدماتی مرد و پنج نیروی Iron Guard زن. آن‌ها نیروی حال حاضر Elara نیستند و وارد CAST نشده‌اند.
- خدمتکاران فعال فعلی پنج نفرند: Jana، Mila، Alena، Bettina و Katya. Hanne سرپرست ارشد بازنشسته از roster فعال است.
- شمار Iron Guard هنوز حل نشده: Hotset پنج زن می‌گوید؛ کارت Elara از چهار guard یاد می‌کند؛ کارت Karin می‌گوید پنج guards و Karin را reserve officer معرفی می‌کند. فقط چهار subordinate دائمی نام‌دار وجود دارد. هیچ فرد پنجم ناشناسی اضافه نشد.

## ۶. شجره و timeline

پیوندهای تأییدشدهٔ اصلی حفظ شدند: پدری Christian III برای Christian IV؛ مادری Katharina برای Christian IV؛ مادری Wilhelmina برای Katharina؛ سه همسر رسمی Christian IV؛ فرزندان اعلام‌شده؛ رابطهٔ قبلی Elara و مادری او برای Luka؛ پدریِ پذیرفته‌شدهٔ Christian برای Luka؛ برادری ناتنی Luka با Konrad و Liese؛ Karl Line برای Dagmar؛ Marriage Kin بودن Adelheid؛ و پل سیاسی Grotsen برای Vera.

موارد حل‌نشده یا proposal همچنان جدا هستند: spouse edge رسمی Katharina–Christian III پشتوانهٔ کافی ندارد؛ ازدواج Christian III–Mirelda و timeline آن proposed است؛ parent/sibling edges مربوط به Helena proposed است؛ درجه و شاخهٔ Hedda، پیوند spouse برای Ivo، ماهیت پیوند Rolf Kessel، درجهٔ cousin برای Matthias/Greta و پروفایل Cassandra نامعلوم است.

تاریخ جاری بازی `20 Ironmonth 105 AW` است. age labelهای ۲۷ کارت موجودند اما DOB دقیق ندارند. تاریخ‌های ۸۸–۸۹ AW برای ۱۲ former partner پیشنهادند، نه Canon. تاریخ‌های ازدواج، تولد و انتقال تاریخی در موارد متعدد UNKNOWN باقی ماندند.

## ۷. سازگاری با گیم‌پلی

تغییر RELATIONS در همان کارت Canon ذخیره شد و projection موجود Private Relations از همان فیلد استفاده می‌کند؛ duplicate implementation یا Save schema جدیدی ایجاد نشد. تست‌ها نشان می‌دهند proposalها همچنان read-only/non-eligible باقی می‌مانند و acceptance/consent/event rules دست‌نخورده‌اند. اتصال سایر پنل‌ها و save/load در Round 6 است و در این راند اجرا نشد.

## ۸. تصمیم نهایی و موارد نیازمند مالک

Round 5 برای **اصلاحات دارای منبع و ممیزی machine-readable** موفق است، اما برای «گسترش کامل Canon» بسته نیست. ادامهٔ تکمیلِ BODY، crisis behaviour، sample lines، DOB، genealogy و guard roster بدون منبع authoritative به جعل Canon منجر می‌شد؛ عمداً انجام نشد. برای بستن این نقاط باید متن کامل V4.1/V4.5، supplement §4.5.12 و Family Ledger/roster معتبر وارد پروژه شود یا مالک صریحاً دادهٔ پیشنهادی را تأیید کند.

**Round 6 شروع نشده است.** CP21 و همهٔ checkpointهای قبلی immutable مانده‌اند.


## Raw verification evidence
- `docs/round5-character-lore/evidence/focused-private-relations-household-tests.log`
- `docs/round5-character-lore/evidence/canon-verifier.log`
- `docs/round5-character-lore/evidence/red-claw-household-verifier.log`
