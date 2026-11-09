# EGUNSENTIA — Stage 47 Core Recovery Checkpoint 01

**تاریخ:** 2026-11-08  
**وضعیت:** Checkpoint قابل‌بازیابی؛ ادامهٔ کار لازم است  
**پایه:** `EGUNSENTIA-STAGE46-BASELINE-REVIEWED-2026-11-08.zip`

## 1. مرجع و حفاظت از منبع

- working copy از آرشیو بررسی‌شدهٔ Stage 46 ساخته شد؛ آرشیوهای اصلی و نسخهٔ پایه تغییر نکردند.
- آرشیو پایه 569 فایل دارد و SHA-256 آن چنین است:
  `a8c050be2885629bad998fc0b5c29c6d84f504c945f1183d9a302d0451dffb88`
- آرشیو اصلی `EGUNSENTIA-stage46-paused-full-2026-11-08.zip` شامل 568 فایل بود. تمام 568 فایل آن در نسخهٔ پایهٔ بررسی‌شده وجود دارد؛ یک گزارش بررسی اضافه شده و `STAGE46_HANDOFF.md` در بستهٔ بررسی‌شده به‌روزتر است.
- آرشیو Stage 40 شامل 552 فایل بود؛ همهٔ آن‌ها در Stage 46 بررسی‌شده حضور دارند. Stage 46 علاوه بر آن 17 مسیر اضافه و 10 فایل مشترکِ اصلاح‌شده دارد.
- در این محیط فقط سه آرشیو Stage 40، Stage 46 full و Stage 46 reviewed در دسترس بودند؛ نسخه‌های قدیمی‌تر نام‌برده‌شده در پرامپت در این نشست موجود نبودند.
- ZIP ورودی سالم بود و فایل‌های استخراج‌شده با محتویات آرشیو از نظر مسیر و SHA-256 تطبیق داده شدند.
- `.grok/app-env.json` یک فایل محیط محلی و ignoreشده است. در working copy با مقدار غیرمحرمانهٔ `VITE_AUTH_ENABLED=true` بازسازی شد تا اجرای تست‌ها با تنظیم ثبت‌شده در Worklogهای قبلی هم‌خوان شود؛ در ZIP قابل‌انتقال قرار نمی‌گیرد.
- `node_modules` نیز عمداً در checkpoint قرار نمی‌گیرد؛ نصب آن در محیط فعلی ناقص است.

## 2. محدودهٔ پرامپت دریافت‌شده

متن دریافت‌شده شامل مأموریت، قواعد غیرقابل‌مذاکره، رویهٔ بازیابی، معماری هدف، ترتیب فازها و Issues 1 تا 10 بود و در انتهای Issue 10 متوقف شد. متنِ ادامهٔ Issue 10، Issueهای 11 و 12 و دستورهای اجرایی تفصیلیِ فازهای C تا I در پیام دریافت‌شده وجود نداشتند.

بنابراین این checkpoint فقط تغییرات قابل‌استناد به متن موجود تا پایان Issue 10 را در بر دارد. هیچ الزام یا جزئیاتِ غایبی حدس زده نشده است.

## 3. تغییرات انجام‌شده

### Core / persistence / AL

- `delta.ts`: ورودی عددی سخت‌گیرانه، محدودیت عمق/تعداد گره/آرایه/رشته، مسدودکردن کلیدهای حساس در تمام عمق‌ها، strict کردن ساختارهای ثابت، clamp کردن مقادیر منابع و اقتصاد، و اعتبارسنجی Snapshot کامل قبل از قبول Delta.
- `identity-updates.mjs`: به‌روزرسانی افراد شناخته‌شده بر اساس ID پایدار؛ ID گمشده یا تکراری رد می‌شود و فرد تازه از مسیر Delta ساخته نمی‌شود.
- `play.ts`: خطای Save پایدار به‌صورت پیام انگلیسیِ امن و throttled به UI منتقل می‌شود؛ در خطای تعارض، Save محلی حفظ می‌شود. وضعیت فشردهٔ AL ساختاریافته شده و از بریدن کورِ JSON جلوگیری می‌شود.
- `save-errors.mjs`: طبقه‌بندی امن خطاهای شبکه، مجوز، اعتبارسنجی و Storage، بدون نمایش متن خامِ provider.
- `save-validation.mjs`: بارگذاری Saveهای تاریخی با collectionهای اختیاریِ غایب سازگار شده؛ birthDay در صورت وجود اعتبارسنجی می‌شود.
- `GameShell.tsx`: بارگذاری remote نامعتبر یا ناموفق، پیام روشن نشان می‌دهد و Save محلی را جایگزین یا پاک نمی‌کند.
- `rolling-memory.mjs`: خلاصهٔ هشت نوبت اخیر با حفظ انتهای متن ساخته می‌شود؛ `play.ts` آن را در وضعیت محلی می‌نویسد و برای ثبت پایدار remote، `flushSave()` را فراخوانی می‌کند.
- `compact-state.mjs`: بودجهٔ ساختاریافتهٔ 7600 کاراکتری؛ فیلدهای حیاتی نگه داشته می‌شوند و بخش‌های کم‌اولویت از انتها کوتاه می‌شوند. اگر هستهٔ تصمیم‌گیری به‌تنهایی از بودجه فراتر رود، درخواست AL fail-closed می‌شود.
- `gm.ts` و `al-rate-limit.mjs`: رزرو سهمیه پس از آماده‌سازی محلی prompt انجام می‌شود؛ در خطای provider یا پاسخ نامعتبر، سهمیه در همان پنجره و در صورت امکان بازگردانده می‌شود.
- `xai.ts`: خطای HTTP 429 پیش از تشخیص عمومی quota طبقه‌بندی می‌شود؛ پاسخ خالی یا غیرقابل‌خواندن موفق تلقی نمی‌شود.

### Time / calendar / household

- Hard-interrupt مسیرها در Stage 46 قبلاً از clock مقصد استفاده می‌کردند؛ تست‌های بازگشتی برای خانواده‌های interruption و مرز سال افزوده شدند.
- `calendarDateMatches` برای بازه‌های دقیق و بازه‌های عبوری از پنج Dead Days اصلاح شد. بازهٔ بدون سال، با توجه به موقعیت تاریخ جاری در بخش قبل یا بعد از سال‌نو، به سال مناسب متصل می‌شود.
- جیره‌بندی مصرف را افزایش نمی‌دهد؛ انتظار تستِ قدیمیِ کف 1 اصلاح شد تا مقدار 0.5 را به 0.46 کاهش دهد و صفر را صفر نگه دارد.
- drift بی‌دلیل affection حذف شد؛ اتصال household و kin بر اساس ID پایدار است.
- فیلد اختیاری `birthDay` برای فرزندانی که تاریخ تولد واقعی در Save دارند اضافه شد؛ برای رکوردهای قدیمیِ بدون تاریخ تولد، رفتار پیشین حفظ می‌شود.
- مهاجرت دادهٔ تاریخی IDهای پایدار را برای household و kin موجود فراهم می‌کند و نام/نقش افراد را از Delta نمی‌پذیرد.

### مستندات و تست‌ها

- Worklog و checkpoint برای ادامهٔ توسعه به این بسته افزوده شده‌اند.
- تست‌های بازگشتی جدید برای AL refund، compact-state budget، stable identity، rolling memory و save-error notices افزوده شده‌اند.
- تست حذف یا خاموش نشده است؛ assertionهایی که پس از مهاجرت ساختار کد کهنه شده بودند، به ساختار جدید به‌روز شدند.

## 4. وضعیت هر Issue

| Issue | وضعیت | سطح تأیید |
|---|---|---|
| 1. Hard-interrupt | اصلاح قبلی حفظ شد؛ پوشش آزمون گسترده شد | Unit-tested برای مسیرهای مستقل زمان |
| 2. Delta / save range | پیاده‌سازی شد؛ تست مستقیم Delta در `game.test.mjs` افزوده/به‌روز شد | Blocked برای اجرای مستقیم، چون بستهٔ Zod در `node_modules` ناقص است؛ syntax transpilation موفق |
| 3. Save errors | پیام‌های امن و throttle پیاده شد | Unit-tested برای classifier؛ اتصال واقعی DB/browser تست نشده |
| 4. Legacy saves | parser سازگار و notice مسیر remote اضافه شد | Unit-tested برای validation/defaults؛ browser integration تست نشده |
| 5. Calendar | تطبیق دقیق و عبور بازه از سال اصلاح شد | Unit-tested |
| 6. Ration | مصرف صفر/کسری و baseline اصلاح شد | Unit-tested |
| 7. AL rolling memory | tail-preserving summary و flush پایدار اضافه شد | Unit-tested برای helper؛ چرخهٔ remote save integration-tested نشده |
| 8. GM parser | state ناقص بدون marker کامل دور انداخته می‌شود و متن صحنه حفظ می‌شود | Unit-tested |
| 9. AL quota / compact state | بودجهٔ ساختاریافته، refund و اولویت 429 پیاده شد | Unit-tested برای helperها و ledger؛ provider/DB واقعی integration-tested نشده |
| 10. Household / aging | ID پایدار، عدم drift و birthDay اختیاری اضافه شد | Unit-tested برای continuity/helper؛ بارگذاری کامل Zustand به‌علت وابستگی ناقص اجرا نشد |
| 11–12 | در متن دریافت‌شده وجود نداشت | Not started — متن لازم دریافت نشده |

## 5. شواهد تست و محدودیت‌ها

- مجموعهٔ تست‌های script به‌جز `scripts/game.test.mjs`: **347/347 پاس**.
- اجرای رسمی `npm test`: **347 پاس، 1 مسدود**. فایل `scripts/game.test.mjs` پیش از اجرای assertionها به‌علت نصب ناقص `zod` در `node_modules/zod/index.js` بارگذاری نمی‌شود.
- تست‌های مستقل TypeScript که وابستگی‌های خارجی لازم نداشتند: **6/6 پاس** (`readiness-schedule` و `sign-in-gate`). دو فایل دیگرِ تست TypeScript به‌علت نبود `@tanstack/react-start/server` و `jose` اجرا نشدند.
- 70 تست هدفمند برای اصلاحات اصلی، در اجرای مجزا **70/70 پاس**.
- TypeScript/TSX syntax transpilation با TypeScript سراسری برای 11 فایل تغییرکرده موفق بود؛ ماژول‌های MJS جدید نیز با `node --check` بررسی شدند. این جایگزین typecheck معنایی نیست.
- `node --check` برای فایل‌های TS قابل‌بررسی و ماژول‌های MJS جدید موفق بود.
- `verify:canon`: **PASS** — رجیستری 65 پنلی، invariants، 167 reference و کاتالوگ گزینه‌ها.
- `verify:art`: **FAIL / INCOMPLETE** — 167 asset ثبت‌شده، 0 raster generated، 150 code-drawn و 17 preserved؛ گروه‌های لازمِ تصویری هنوز placeholder یا فاقد خروجی نهایی‌اند.
- `npm run typecheck`: **BLOCKED** — type definitionهای `node` و `vite/client` در نصب فعلی موجود نیستند.
- `npm run build`: **BLOCKED** — executable مربوط به Vite موجود نیست (`spawn vite ENOENT`).
- Browser verification، PostgreSQL/Neon round-trip، multi-device synchronization و Production deployment اجرا نشده‌اند.

این checkpoint یک release candidate یا ادعای «بازی کاملاً سالم» نیست.

## 6. ادامه از این نقطه

1. همین ZIP را به‌عنوان آخرین checkpoint قابل‌بازیابی نگه دارید.
2. متن کامل پرامپت را از ادامهٔ Issue 10 به بعد ارسال کنید؛ Issueهای 11 و 12 و ادامهٔ فازهای C تا I هنوز دریافت نشده‌اند.
3. پیش از اجرای تست کامل، وابستگی‌ها با `npm ci` در محیط دارای دسترسی به registry نصب و صحت `zod`, `zustand`, `@tanstack/react-start`, `jose`, `vite`, `typescript` و type definitions بررسی شوند.
4. پس از نصب کامل، `npm test`، `npm run typecheck`، `npm run build` و سپس browser/integration tests اجرا شوند.

**قانون ادامه:** از آخرین checkpoint سالم ادامه دهید؛ آرشیو اصلی و Stage 46 پایه را تغییر ندهید.
