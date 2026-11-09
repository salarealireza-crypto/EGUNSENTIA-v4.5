# گزارش ممیزی Round 2 — Canon، شخصیت‌ها و تبارشناسی EGUNSENTIA

**تاریخ:** 2026-11-09  
**والد:** CP10 حاصل از CP9 (آرشیو والد تغییرناپذیر نگه داشته شد)  
**دامنه:** Workstream B / Round 2 — ممیزی فقط؛ بدون افزودن Lore یا تأیید پیشنهادها.

## ۱. جمع‌بندی اجرایی

Round 2 ممیزی شخصیت‌ها، کارت‌های Canon، فهرست Private Relations، پیوندهای خانوادگی، تاریخ‌گذاری و منابع مرجع را انجام داد. هیچ هویت، سن، تاریخ تولد، والد، فرزند، ازدواج، همسر، وارث، شاخه یا رویداد تازه‌ای به Canon اضافه نشد. هیچ فایل کد/دادهٔ بازی اصلاح نشد؛ تنها اسناد ممیزی، گزارش، inventory و یک اسکریپت خواندنی برای بازتولید شمارش‌ها افزوده شدند.

**نتیجهٔ اصلی:** ۲۵ رکورد نخست `WOMEN` در `private-relations.ts` هستهٔ Canon این فهرست هستند؛ ۱۲ رکورد بعدی در همان آرایه، صریحاً `PROPOSED_EXPANSION` و read-only هستند. دو کارت زن بزرگسال دیگر در کارت‌های Canon وجود دارد که در آن فهرست ۲۵تایی نیستند: Countess Seraphine von Aschen و Delegate Johanna Weiss. بنابراین تعداد زنان بزرگسال دارای کارت در منابع بررسی‌شده **۲۷** است؛ این عدد به‌معنای تکمیل یا جامعیت تمام جمعیت جهان بازی نیست.

## ۲. دامنه و منابع

منابع پایهٔ خوانده‌شده: `src/lib/canon/cards.json` (۵۵ کارت)، `atlas.json` (۲۶ ورودی)، `excerpts.json` (۲۸ گزیده)، `private-relations.ts`، `v41-data.ts`، `red-claw-household.json` (۱۰۰ کارت) و مستندات `docs/red-claw-household-expansion/`. رجیستر جزئی منابع در `STAGE47_ROUND2_SOURCE_REGISTER_2026-11-09.csv` آمده است.

دو منبع Canon مهم همچنان در دسترس نیستند:
- `EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt`: فایل حاضر در attachment فقط ۳۳۱ بایت و یک pointer/notice است، نه متن کامل Manuscript.
- `EGUNSENTIA_V4.5_Update_Prompt.txt`: نسخهٔ کامل پیدا نشد. ۱۳ fragment در `references/V45_SESSION_PROMPTS/` موجود است، اما این‌ها دستورهای نشست/Workflow هستند و جایگزین prompt کامل یا Master Lore نیستند.

Red House Ledger در Floor 7 کنار Relic Cabinet در متن Canon به‌عنوان مرجع رسمی تولد، مرگ، ازدواج، فرزندخواندگی و شاخه‌ها معرفی شده؛ محتوای کامل و قابل جست‌وجوی Ledger همراه پروژه نیست. بنابراین درجات دقیق خویشاوندی و برخی edgeهای خانوادگی تأییدپذیر نیستند.

## ۳. ممیزی کارت‌ها و پوشش پروفایل

- تعداد کارت‌های کامپایل‌شده: **۵۵**.
- هستهٔ فهرست Private Relations: **۲۵** شخصیت زن بزرگسال Canon.
- ردیف‌های افزوده‌شده به همان آرایه: **۱۲** پروندهٔ former-partner پیشنهادی؛ در شمار Canon وارد نشدند.
- دو کارت Canon زن بزرگسال خارج از هستهٔ PR: Seraphine von Aschen و Johanna Weiss.
- تعداد کل زنان بزرگسال دارای کارت در دامنهٔ شناسایی‌شده: **۲۷**.
- `Tessa Brun` در کارت خود جنسیت را صریحاً مشخص نمی‌کند؛ از شمارش زنان کنار گذاشته شد، نه اینکه جنسیت او حدس زده شود.

پوشش ۱۵ فیلد رفتاریِ بخش B2 برای ۲۷ کارت زن:
- **19** پروفایل دارای هر ۱۵ فیلد.
- **8** پروفایل ناقص.
- **21** دارای BODY؛ **6** فاقد BODY.

| فیلد | کارت‌های دارای داده از ۲۷ |
|---|---:|
| LOOK | 27 |
| BODY | 21 |
| VOICE | 27 |
| TELLS | 27 |
| IN CRISIS | 19 |
| HANDLE | 25 |
| WANTS | 27 |
| FEARS | 27 |
| DAY | 25 |
| NEVER | 27 |
| SAMPLE LINES | 19 |
| SECRET | 27 |
| KNOWS | 25 |
| RELATIONS | 19 |
| HOOKS | 27 |


شش پروفایل قدیمی‌تر (Dagmar، Adelheid، Vera، Elara، Wilhelmina، Hanne) همان ۱۱ فیلد را دارند و BODY، IN CRISIS، SAMPLE LINES و RELATIONS در آن‌ها غایب است. Ilse Wern و Leni Bauer هرکدام ۹/۱۵ فیلد دارند و IN CRISIS، HANDLE، DAY، SAMPLE LINES، KNOWS و RELATIONS در آن‌ها غایب است. Seraphine و Johanna در کارت‌های مستقل خود ۱۵/۱۵ فیلد دارند. جدول کامل فردبه‌فرد و ۱۹ عنوان شامل چهار فیلد هویتی/نقشی در فایل `STAGE47_ROUND2_PROFILE_COVERAGE_2026-11-09.csv` ثبت شده است.

**محدودیت سن:** سن‌های جدول از عنوان کارت خوانده می‌شوند؛ برای این اشخاص تاریخ تولد دقیق در منبع Canon قابل مشاهده ارائه نشده است. پس «سن کارت» را با «DOB تأییدشده» یکی نمی‌گیریم.

## ۴. خانواده و تبارشناسی — موارد تأییدشده

- Christian Red IV، ۳۵ ساله و Fist، فرزند Christian Red III و Katharina Red است.
- Wilhelmina Red مادر Katharina و مادربزرگ مادری Christian IV است.
- Mirelda Grotsen به‌عنوان نامادری Christian IV از House Grotsen و کسی که پس از مرگ Katharina در بزرگ‌کردن او کمک کرده، در منبع معرفی شده است؛ جزئیات کامل ازدواج، تاریخ‌ها، شاخهٔ Grotsen و پروندهٔ خانوادگی او در Canon حاضر نیست.
- سه همسر رسمی Christian IV دقیقاً Dagmar Red (اول)، Adelheid von Moren (دوم) و Vera Grotsen (سوم) هستند.
- Dagmar مادر Konrad (۱۵) و Liese (۱۱)؛ Adelheid مادر Emil (۳) است.
- Elara Red همسر چهارم نیست؛ شریک سابق Christian IV، فرماندهٔ Iron Guard و مادر Luka Vahl (۱۸) است. Luka فرزند به‌رسمیت‌شناخته‌شدهٔ Christian و فاقد عنوان جانشینی است.
- Elara نسبت خویشاوندی دور با Christian IV دارد، اما درجهٔ آن صریحاً UNKNOWN است.
- Dagmar با Karl Line (شاخهٔ پدری) مرتبط است؛ Christian IV با Main Red Line. سیستم Kinship پنج درجه دارد و جانشینی صرفاً بر اساس سن فرزند نیست.

## ۵. تناقض‌ها و خطرهای مدل تبارشناسی

۱. در `red-claw-household.json` برای Katharina و Christian III پیوند `spouseIds` ثبت شده، در حالی‌که `sourceEvidence` همان رکورد فقط مادری Katharina برای Christian IV را از N-CHRISTIAN و H-WIVES مستند می‌کند؛ این شواهد به‌تنهایی ازدواج رسمی را اثبات نمی‌کنند. باید این edge تا یافتن سند ازدواج/دفتر Floor 7 **نیازمند بازبینی** باقی بماند.

۲. در رکورد Christian III، پیوند همسری با Mirelda و فرزند Helena در کنار اطلاعات هویتی Canon آمده؛ خود رکورد `CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY` است. در رکورد Mirelda نیز ازدواج و مادری Helena در prose به‌عنوان پیشنهاد توصیف شده، اما edgeهای ساختاری بدون provenance مستقل قرار دارند.

۳. `rc-christian-iv.siblings` شامل Helena است، با اینکه Helena `PROPOSED_EXPANSION` است. این یک **آلودگی provenance در گراف** است: وضعیت رکورد والد CANON است ولی edge خواهر/برادری پیشنهادی است. قبل از استفادهٔ gameplay، edge-level source status لازم است.

۴. Hedda Red در کارت Canon «cousin married into Grotsen» است و Ivo Grotsen به‌عنوان شوهر و Rolf Kessel به‌عنوان «link» نام برده شده؛ اما گراف ۱۰۰‌تایی spouse edge به Ivo یا معنی رابطه با Rolf را حل نمی‌کند. معنی «link» نباید حدس زده شود.

۵. Matthias Red و Greta Red در کارت‌ها cousin خوانده شده‌اند، اما جد مشترک، درجه و branch هر دو UNKNOWN است.

۶. Cassandra Red به‌عنوان نمایندهٔ فعلی Steward Line در گزیدهٔ Kinship نام برده شده، اما کارت و دادهٔ زیستی/تبارشناختی مستقل او در roster حاضر یافت نشد.

۷. Elara/Christian/Luka: سن فعلی‌ها به‌تنهایی سن قانونی در زمان رخداد گذشته را ثابت نمی‌کند. DOBها و تاریخ رخداد/تولد در Canon کامل حاضر نیستند؛ adult-at-the-time chronology همچنان تأییدنشده است.

تمام این موارد با شدت و شواهد در `STAGE47_ROUND2_CONFLICT_AND_RISK_REGISTER_2026-11-09.csv` و edgeهای جداگانه در `STAGE47_ROUND2_GENEALOGY_EDGE_AUDIT_2026-11-09.csv` آمده‌اند.

## ۶. داده‌های پیشنهادی — جدا از Canon

`red-claw-household.json` شامل ۱۰۰ کارت یکتا است:
- ۱۱ `CANON`؛
- ۲ `CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY`؛
- ۸ `CANON_RECORD_WITH_UNRESOLVED_GENEALOGY`؛
- ۷۹ `PROPOSED_EXPANSION`.

اعتبارسنجی ساختاری ۱۰۰ رکورد: شناسه‌ها و نام‌های نمایشی یکتا؛ ارجاعات موجود به nodeها در رجیستری resolve می‌شوند؛ reciprocal parent/child و spouse و sibling checks بدون mismatch اجرا شدند. این فقط صحت ساختاری است، نه اثبات Canon بودن هر edge. در سطح رکورد، edge provenance مستقل کافی نیست و چند edge پیشنهادی روی nodeهای mixed-source قرار گرفته‌اند.

۱۲ former-partner پیشنهادی در `private-relations.ts` با `sourceStatus=PROPOSED_EXPANSION` آمده‌اند و read-only هستند. سن رابطه‌ها فقط در تقویم پیشنهادی و با DOB پیشنهادی محاسبه شده؛ در برابر DOBهای Canon تأیید نشده‌اند. تنها former partner قطعی در منابع پایه Elara Red است.

## ۷. خط زمانی

تاریخ جاری بازی در منبع `20 Ironmonth 105 AW` است. سن فعلی کارت‌ها ثبت شده، ولی DOBهای دقیق عموماً UNKNOWN هستند. خط زمانی پیشنهادی Red Claw (تولدهای احتمالی Christian III و Mirelda، تولد Helena، ۱۲ رابطهٔ سابق، تاریخ مرگ Christian III و خروج Mirelda/Helena) در سند جداگانه با برچسب PROPOSED نگه داشته شده است. تاریخ عروسی Dagmar و Christian همچنان UNKNOWN و نیازمند تطبیق با تاریخ دقیق تولد Konrad است.

جزئیات کامل در `STAGE47_ROUND2_FAMILY_TIMELINE_CANON_VS_PROPOSAL_2026-11-09.md`.

## ۸. آزمون و وضعیت راستی‌آزمایی

- `node scripts/verify-canon.mjs` — PASS (65-panel canon registry, invariants, 167 assets, preserved art, option catalogs).
- `npm run verify:red-claw` — PASS ساختاری؛ WARN برای نبود متن Floor 7 Ledger و chronology/kinship unresolved.
- `python scripts/stage47-round2-audit.py` — خروجی شمارش‌ها بازتولیدپذیر.
- Graph reference audit: dangling references **0**؛ reciprocity mismatches **0**. (این تست به معنای تأیید منبعی edgeها نیست.)
- Build، typecheck، lint، browser، DB integration در این Round2 اجرا نشدند؛ Round2 فقط audit است. موانع محیطی Round1 همچنان در پرونده حفظ شده‌اند.

## ۹. تغییر فایل‌ها و تحویل

خروجی کامل فرمان‌های تأیید در `STAGE47_ROUND2_VERIFICATION_LOG_2026-11-09.txt` بسته‌بندی شده است.



هیچ فایل Canon، کد اصلی یا Save بازی تغییر نکرد. فایل‌های افزوده‌شده صرفاً گزارش و CSVهای ممیزی، یک script خواندنی، handoff، evidence، worklog و inventory هستند. checkpoint جدید با عنوان audit-only ساخته شده و Round 2 هیچ gameplay feature را complete نمی‌کند.

## ۱۰. موانع و گام‌های بعدی

- بازیابی full V4.1 Master Lore.
- بازیابی full V4.5 Update Prompt.
- دریافت سند قابل بررسی Red House Ledger در Floor 7 یا منبع رسمی معادل.
- حل edgeهای مختلط/غیرمستند در registry؛ مخصوصاً Katharina–Christian III و Helena–Christian IV.
- تأیید تاریخ‌های تولد و رویدادهای موردنیاز برای chronology، بدون حدس.
- تصمیم مالک دربارهٔ ۷۹ رکورد پیشنهادی؛ تا پیش از approval هیچ موردی به Canon منتقل نشود.

**وضعیت Round 2: AUDIT DELIVERED / CANON UNCHANGED / PROPOSALS NOT APPROVED.**
