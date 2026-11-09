# EGUNSENTIA — Gate 2 Round 3 Report (CP7)

تاریخ: 2026-11-09  
نسخهٔ پایه: `EGUNSENTIA-STAGE47-GATE2-ROUND2-CP6-2026-11-09.zip`  
SHA-256 پایه: `7c8fc661ff7ea21c4871e6c1aaa632c3d946321484c87c9f87b0a114005cbc3b`

## خلاصه

دور سوم Gate 2 روی اتصال فرمان‌های شورا به اقتصاد و Save، جلوگیری از اجرای تکراری Decree، هم‌ترازی حضور NPCها و ایجاد یک نوع پروندهٔ تحقیقاتیِ مفقودشدنِ غیرقطعی کار کرد. CP6 دست‌نخورده باقی ماند و تمام تغییرات در یک working copy مستقل انجام شد.

## تغییرات پیاده‌سازی‌شده

### 1. Council / Decree transaction
- یک `CouncilDecreePlan` تایپ‌شده و deterministic در `sim/council.ts` تعریف شد.
- `stampCouncilDecree` اثرها را در P4 اعمال می‌کند: Marks، ساعت کار، صف پیامد، memory، rumor، log و receipt.
- Store از یک functional Zustand `set` برای ثبت هم‌زمان P4، کسر خزانه، Event Ledger، News و Chronicle استفاده می‌کند.
- کلید جلوگیری از تکرار اکنون `order + campaign day + minute` است؛ بنابراین تغییر وزیر انتخاب‌شده اجازهٔ stamp دوبارهٔ همان فرمان را در همان دقیقه نمی‌دهد.
- کلیدها در Save باقی می‌مانند و normalizer حداکثر 500 مورد را نگه می‌دارد.
- مسیر discussion-only یعنی `decideCouncil` دیگر Decree ناقص و بدون کسر خزانه تولید نمی‌کند.
- پنل شورا پس از ثبت فرمان، تمام دکمه‌های Decree را در همان دقیقه غیرفعال می‌کند.

### 2. Treasury validation
- مسیر عمومی اجرای گزینه، هزینهٔ Marks را به‌صورت عدد صحیح امن و نامنفی اعتبارسنجی می‌کند.
- در موجودی ناکافی، اجرا پیش از mutation رد می‌شود.
- clamp پنهانی به صفر حذف شده و مقدار ناکافی دیگر به‌ظاهر خرج‌شده تلقی نمی‌شود.
- Decree مربوط به پنل شورا فقط از مسیر تراکنشی اختصاصی قابل اجراست.

### 3. NPC presence projections
- Planner (12)، Personnel (26)، CAST (36)، Messages (01)، Cast side-panel و Evening Hall (33) از محاسبهٔ مشترک `castNow` استفاده می‌کنند.
- Evening Hall فقط افرادی را نمایش می‌دهد که برنامهٔ واقعی آن‌ها در زمان فعلی، Evening Hall را ثبت کرده است.
- نبود رکورد تطبیق به‌عنوان unknown نمایش داده می‌شود؛ از محل یا حضور اشخاص حدس ساخته نمی‌شود.

### 4. Missing-person inquiry
- نوع مستقل `missing-person-inquiry` به ثبت پرونده اضافه شد.
- ساخت پرونده نیازمند نامی است که مالک وارد کند و مرجع منبعی که مالک ارائه کند.
- رکورد و یادداشت اولیه با provenance برابر `player-supplied` و classification برابر `unverified` ذخیره می‌شود.
- هیچ شخصیت تازه، رابطه، علت ناپدیدشدن یا واقعیت Canon تولید نمی‌شود.
- فایل مرجع V4.1 در آرشیو ناقص است؛ تولید خودکار پرونده بر اساس آن همچنان مسدود است.

### 5. Type model correction
- نوع ساختاری `CatalogOption.costs` در `options/lookup.ts` شامل `hours` و فیلدهای ثبت‌شدهٔ اختیاری شد. این اصلاح خطای TypeScript واقعی در `decreeOrder()` را آشکار و برطرف کرد.

## وضعیت هزینهٔ Political Capital — حل‌نشده و مهم

از 403 گزینهٔ کاتالوگ، 182 گزینه مقدار مثبت `politicalCapital` دارند. در پروژه هیچ موجودی یا دفترکل authoritative برای Political Capital وجود ندارد؛ 26 گزینهٔ دستهٔ Wait نیز همین مقدار را دارند. به همین دلیل در این دور نه موجودی فرضی ساخته شد و نه همهٔ این گزینه‌ها کورکورانه مسدود شدند. معنای این فیلد باید در یک تصمیم اقتصادی مستقل روشن شود؛ تا آن زمان، پیاده‌سازی دقیقِ برداشت این هزینه قابل ادعا نیست.

همچنین در 403 گزینه، فیلد ساعت وجود دارد؛ اما resource-cost غیرخالی و personnel-cost غیرخالی در این شمارش فعلی دیده نشد.

## آزمون و شواهد

| بررسی | نتیجه |
|---|---:|
| تست‌های هدفمند Round 3 | 29/29 PASS |
| تمام تست‌های اسکریپتیِ قابل بارگذاری به‌جز `game.test.mjs` | 400/400 PASS |
| TypeScript strict روی P4 simulation، council، investigation-cases و option execute و وابستگی‌های resolution شده | PASS |
| Transpile فایل‌های تغییرکردهٔ TS/TSX | 8/8 بدون خطای نحوی |
| نحو اسکریپت‌های MJS | 74/74 PASS |
| Canon verifier | PASS — رجیستری 65 پنلی، 167 asset و کاتالوگ‌ها |
| `scripts/game.test.mjs` | BLOCKED — پکیج `zod` نصب نیست |
| Typecheck کامل پروژه | BLOCKED — وابستگی‌ها / type definitions کامل نصب نیستند |
| Production Build | BLOCKED — Vite محلی در محیط موجود نیست |
| Browser / Live DB / AL provider | NOT RUN |

400 تست، کل مجموعهٔ پیکربندی‌شده نیست: تست `scripts/game.test.mjs` به‌علت نبود Zod حتی بارگذاری نشد. بنابراین نتیجه «400 تست قابل‌اجرا» است، نه ادعای موفقیت کامل همهٔ تست‌های پروژه.

## فایل‌های کد تغییرکرده نسبت به CP6

- `scripts/council-queue-identity.test.mjs`
- `scripts/game.test.mjs`
- `src/components/game/CastPanel.tsx`
- `src/components/game/V45PanelBody.tsx`
- `src/lib/game/p4-simulation.ts`
- `src/lib/game/sim/council.ts`
- `src/lib/game/sim/investigation-cases.ts`
- `src/lib/game/store.ts`
- `src/lib/platform/options/execute.ts`
- `src/lib/platform/options/lookup.ts`

فایل تست جدید: `scripts/gate2-round3.test.mjs`.

## چیزهایی که هنوز انجام نشده‌اند

- تعریف منبع و ledger رسمی برای Political Capital.
- اجرای کامل end-to-end با Zustand persist و backend ذخیره‌سازی واقعی؛ تست‌های این دور helperهای pure، JSON serialize/normalize و مسیر کد را پوشش می‌دهند، نه اتصال live database.
- اجرای تست اصلی `game.test.mjs` پس از نصب Zod.
- Full TypeScript، Build، مرورگر، موبایل و تست بصری.
- اثبات آنلاین بودن Neon/OAuth/Groq یا انتشار عمومی/خصوصی.

## تصمیم

CP7 یک checkpoint کامل و قابل بازگشت برای Round 3 است. Gate 2 تمام نشده و این نسخه Release Candidate نیست.
