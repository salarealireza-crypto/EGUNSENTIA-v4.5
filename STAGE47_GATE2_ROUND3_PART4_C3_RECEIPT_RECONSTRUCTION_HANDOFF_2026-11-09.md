# EGUNSENTIA — تحویل CP15 برای ادامهٔ C3 (Round 3 Part 4)

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد دقیق:** `EGUNSENTIA-STAGE47-POST-CP13-ROUND3-PART3-C3-SOURCE-AUDIT-PARTIAL-CP14-2026-11-09.zip`  
**SHA-256 والد:** `733e5e649337948fde0e2b069eddfa86246b308272f8b377038550a51b1722f9`  
**بستهٔ جاری:** `EGUNSENTIA-STAGE47-POST-CP14-ROUND3-PART4-RECEIPT-RECONSTRUCTION-PARTIAL-CP15-2026-11-09.zip`  
**وضعیت:** Partial source implementation؛ نه Integration-tested، نه Browser-verified، نه Production-verified.

## نقطهٔ ادامهٔ قطعی

از CP15 به‌عنوان parent کاری استفاده کن. CP14 و تمام والدهای قبلی immutable هستند. CP15 یک working copy مستقل از CP14 دارد. هیچ checkpoint قبلی را overwrite نکن.

## آنچه در Part 4 انجام شد

شکاف source/UI در C3.8 برای بازشدن و status بازیابی‌شدهٔ Receipt اصلاح شد:

- `ReceiptPersistence` در `src/lib/game/p4-simulation.ts` تعریف شده.
- `src/lib/game/receipt-persistence.mjs` fingerprint محتوای Receipt و storage classification را به helperهای مستقل تقسیم می‌کند؛ declaration آن در `receipt-persistence.d.mts` است.
- `GameStore` وضعیت runtime-only `receiptPersistence` و setter دارد؛ این property در `persistKeys` و `GameSnapshot` نیست.
- `GameShell` پس از load واقعی Account Copy، status را فقط از `remote.storage` و وجود `remote.payload.p4.lastReceipt` استخراج می‌کند.
- conflict وضعیت را محافظه‌کارانه device-only می‌کند؛ انتخاب Account Copy نیز status را از storage result بازسازی می‌کند.
- `play.ts` status را پس از save confirmed یا unchanged baseline به‌روزرسانی می‌کند؛ شکست/عدم قطعیت status committed تولید نمی‌کند.
- `CommandDeck` و `CouncilBody` با fingerprint persisted Receipt پس از mount آن را دوباره باز می‌کنند. Receipt مربوط به Council در Command Deck تکرار نمی‌شود.
- جابه‌جایی بین deskها دیگر status یک Receipt تأییدشده را به device-only downgrade نمی‌کند.

## فایل‌های کد

**افزوده‌شده**
- `src/lib/game/receipt-persistence.mjs`
- `src/lib/game/receipt-persistence.d.mts`
- `scripts/receipt-persistence.test.mjs`

**اصلاح‌شده**
- `src/lib/game/p4-simulation.ts`
- `src/lib/game/store.ts`
- `src/lib/game/play.ts`
- `src/components/game/GameShell.tsx`
- `src/components/game/CommandDeck.tsx`
- `src/components/game/V45PanelBody.tsx`
- `src/components/platform/Receipt.tsx`
- `scripts/save-autosave.test.mjs`

**Canon / Save schema / migrations / package manifest / lockfile:** بدون تغییر. **فایل حذف‌شده:** صفر.

## Verification

- Focused persistence + Receipt: `66/66 PASS`.
- Runnable script suite به‌جز `scripts/game.test.mjs`: `457/457 PASS`.
- Full `npm test`: `457 PASS / 1 BLOCKED`; تنها `scripts/game.test.mjs` پیش از اجرا به دلیل `ERR_MODULE_NOT_FOUND: zod` از `src/lib/game/delta.ts` بارگذاری نشد.
- TypeScript/TSX transpile: `7/7 PASS`; فایل `.d.mts` جداگانه parse شد؛ این semantic typecheck نیست.
- `node scripts/verify-canon.mjs`: PASS.
- Red Claw verifier: PASS با ۱۴ هشدار موجود در مورد proposed birth-date ages، Floor 7 genealogy و Elara/Luka/Christian chronology.
- Art verifier: FAIL / INCOMPLETE؛ 167 asset، 0 generated raster، 150 code-drawn، 17 preserved، 23 incomplete groups.
- `npm run typecheck`: BLOCKED، نبود `@types/node` و `vite/client`.
- `npm run build`: BLOCKED، `spawn vite EACCES`.
- `npm run lint`: BLOCKED، `eslint: Permission denied`.
- هیچ PostgreSQL connection، migration، command commit، reload، restart، browser session یا Production مسیر واقعی اجرا نشده است.

فایل موقت `.grok/app-env.json` فقط با `VITE_AUTH_ENABLED=true` برای test run ایجاد و پس از آن حذف شد. `node_modules` وجود ندارد. `DATABASE_URL`, `BETTER_AUTH_SECRET`, `PGLITE_ALLOW_EPHEMERAL` unset هستند. `package-lock.json` دست‌نخورده است و SHA-256 آن با inventory CP14 برابر `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` است.

## C3 هنوز باز است

1. **C3.1** — backend واقعی/production-equivalent پیکربندی نشده؛ `DATABASE_URL` موجود نیست.
2. **C3.2** — فرمان واقعی از UI تا server validator، authorization، DB commit و reload اجرا نشده.
3. **C3.3** — rejected commands در برابر DB واقعی و no-mutation اثبات نشده‌اند.
4. **C3.4** — timeout/replay پس از commit و شبکهٔ تکراری با idempotency پایدار هنوز آزموده نشده.
5. **C3.5** — failure injection در transaction و post-commit/pre-response اجرا نشده.
6. **C3.6** — genuine historical save fixtures برای roundtrip کامل در دسترس/اثبات نشده‌اند.
7. **C3.7** — app/backend restart و new authenticated session بررسی نشده.
8. **C3.8** — source reconstruction اکنون Implemented/Unit-tested است؛ browser refresh و matching با persisted Receipt واقعی هنوز Blocked است.
9. **C3.9** — دو session/concurrent writes و conflict واقعی اجرا نشده.
10. **C3.10** — ماتریس و evidence ثبت شده؛ فقط unit/source checks pass هستند، integration acceptance باز است.

C2 Political Capital همچنان unresolved است. هیچ balance، income، recovery، cap یا spending rule فرضی اضافه نکن و Wait را به‌طور کلی block نکن.

## دستور ادامه

**C3 را تمام کن، بعد C4 را شروع کن.**

1. Owner PostgreSQL URL و auth settings را فقط در protected environment UI وارد کند؛ secret هرگز در chat، source، log یا ZIP قرار نگیرد.
2. dependencyها از package lock در محیط دارای registry/network نصب شوند؛ هیچ upgrade یا lockfile rewrite انجام نشود.
3. migrationهای موجود با runner پروژه در isolated DB اجرا شوند.
4. مسیرهای واقعی Council decree، generic option، Wait/time و یک عملیات multi-mutation از UI اجرا شوند.
5. rejection/no-mutation، transaction failure injection، post-commit lost response، retry، idempotency across session restart، دو-session conflict، legacy-save roundtrip و restart/reload آزموده شوند.
6. Browser test باید بعد از refresh Receipt را از authoritative persisted snapshot باز کند و storage status درست را نمایش دهد.
7. C3 فقط پس از evidence واقعی command → commit → reload قبول می‌شود. سپس ترتیب دقیق Master Prompt: **C4 NPC availability → C5 missing-person integration → C6 legacy panel aliases → C7 connected gameplay/browser verification**.

CP15 partial است و Gate 2 همچنان PARTIAL؛ هیچ ادعای release readiness یا production availability مجاز نیست.
