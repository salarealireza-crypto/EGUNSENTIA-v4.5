# Stage 47 — Gate 2 / Round 3 Part 4
## اصلاح source-level برای بازسازی Receipt پس از reload

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد کاری immutable:** `EGUNSENTIA-STAGE47-POST-CP13-ROUND3-PART3-C3-SOURCE-AUDIT-PARTIAL-CP14-2026-11-09.zip`  
**SHA-256 والد:** `733e5e649337948fde0e2b069eddfa86246b308272f8b377038550a51b1722f9`  
**این تحویل:** CP15 — partial source implementation؛ نه Integration-tested و نه Release Candidate.

## 1. رأی اجرایی

**C3.8 در سطح source و unit/source-contract tests پیشرفت کرده است؛ C3 به‌طور کلی همچنان BLOCKED / PARTIAL است. Gate 2 نیز PARTIAL می‌ماند.**

این دور شکاف مشخصی را که CP14 در مسیر Receipt یافته بود اصلاح می‌کند: محتوای Receipt از قبل در `p4.lastReceipt` حفظ می‌شد، اما بازشدن Receipt و وضعیت ماندگاری آن به React local state وابسته بود و پس از reload قابل بازسازی نبود.

اکنون نمایش Receipt از fingerprint دادهٔ persisted در `p4.lastReceipt` دوباره فعال می‌شود. وضعیت ماندگاری آن فقط از classification پاسخ server در `loadSave` یا نتیجهٔ تأییدشدهٔ `flushSave` به دست می‌آید. خود Receipt payload یا وجود آن هرگز برای ادعای `account-committed` کافی تلقی نمی‌شود.

این اصلاح هنوز در مرورگر واقعی، با PostgreSQL و با commit/restart/reload واقعی آزموده نشده است؛ بنابراین نمی‌توان C3.8 را Browser-verified یا Integration-tested نامید.

## 2. تغییرهای انجام‌شده

### 2.1 قرارداد وضعیت Receipt
- نوع `ReceiptPersistence` اکنون در `src/lib/game/p4-simulation.ts` تعریف شده و از `Receipt.tsx` re-export می‌شود.
- ماژول `src/lib/game/receipt-persistence.mjs` دو مسئولیت کوچک و مستقل دارد:
  - fingerprint پایدار برای تشخیص تغییر واقعی محتوای `lastReceipt`.
  - نگاشت storage classification واقعی به `account-committed`، `ephemeral` یا `device-only`.
- فایل declaration همراه `.d.mts` قرارداد TypeScript این helper را مشخص می‌کند.

### 2.2 وضعیت runtime در Store
- `receiptPersistence` و `setReceiptPersistence` به `GameStore` افزوده شدند.
- این وضعیت runtime-only است و عمداً در `persistKeys`، `GameSnapshot` و Save payload قرار ندارد.
- پس از `loadSnapshot`، مقدار اولیه device-only است تا پیش از دریافت پاسخ قابل اعتماد server هیچ ادعای ماندگاری ساخته نشود.

### 2.3 بازیابی پس از load و save
- در `GameShell`، وقتی account snapshot واقعاً پذیرفته و بارگذاری می‌شود، وضعیت Receipt از `remote.storage` و `remote.payload.p4.lastReceipt` محاسبه می‌شود.
- مسیر انتخاب Account Copy در conflict نیز همان منطق را استفاده می‌کند.
- هنگام conflict فعال، وضعیت Receipt به device-only تنزل می‌یابد؛ تا زمان حل تعارض، وضعیت snapshot محلی به‌عنوان account copy تأییدشده نمایش داده نمی‌شود.
- `play.ts` پس از commit تأییدشده و نیز مسیر unchanged baseline، وضعیت Receipt را بر اساس storage classification همان snapshot به‌روزرسانی می‌کند.
- خطا، conflict، superseded و عدم اطمینان storage به وضعیت device-only ختم می‌شوند؛ از دادهٔ optimistic یا یک state محلی قدیمی برای ادعای commit استفاده نمی‌شود.

### 2.4 بازشدن UI
- `CommandDeck` و `CouncilBody` fingerprint مربوط به `p4.lastReceipt` را دنبال می‌کنند و پس از mount/reload، Receipt موجود را دوباره نمایش می‌دهند.
- Receipt مربوط به Council فقط در `CouncilBody` نمایش داده می‌شود تا هم‌زمان در Command Deck تکرار نشود.
- تغییر panel/wing دیگر وضعیت persistence یک Receipt قبلاً تأییدشده را به device-only downgrade نمی‌کند.
- pending همچنان به‌صورت pending نمایش داده می‌شود؛ final committed status تنها پس از نتیجهٔ save قابل نمایش است.

## 3. آزمون‌ها و شواهد

### تست‌های متمرکز
فرمان:

```sh
node --experimental-strip-types --test \
  scripts/receipt-persistence.test.mjs \
  scripts/save-autosave.test.mjs \
  scripts/save-queue.test.mjs \
  scripts/save-lifecycle.test.mjs \
  scripts/save-errors.test.mjs \
  scripts/save-revision.test.mjs \
  scripts/save-validation.test.mjs \
  scripts/db-runtime-policy.test.mjs \
  scripts/migration-transaction.test.mjs
```

**نتیجه: 66/66 PASS.** شامل پنج تست helper برای fingerprint/storage mapping و سه source-contract regression test برای restore classification، runtime-only state و navigation behavior است.

### Script suite
فرمان اجرایی با `scripts/game.test.mjs` مستثنا:

```sh
mapfile -t tests < <(find scripts -maxdepth 1 -name '*.test.mjs' ! -name 'game.test.mjs' -print | sort)
node --experimental-strip-types --import ./scripts/register-ts.mjs --test "${tests[@]}"
```

**نتیجه: 457/457 PASS.** برای این اجرا فایل موقت `.grok/app-env.json` تنها با مقدار غیرمحرمانهٔ `{"VITE_AUTH_ENABLED":"true"}` ساخته شد و بلافاصله پس از آزمون حذف شد.

### Full npm test
`npm test` با همان فایل موقت غیرمحرمانه اجرا شد: **457 PASS / 1 BLOCKED از 458 مورد**. تنها فایل مسدودشده `scripts/game.test.mjs` است که پیش از بارگذاری تست‌ها با `ERR_MODULE_NOT_FOUND: Cannot find package 'zod'` در `src/lib/game/delta.ts` متوقف می‌شود. این شکست assertion نیست، ولی full suite را PASS نمی‌کند.

### سایر بررسی‌ها
- `node scripts/verify-canon.mjs`: PASS.
- `node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-red-claw-household.mjs`: PASS با هشدارهای provenance/chronology موجود.
- TS/TSX transpilation: 7/7 PASS؛ declaration file نیز جداگانه parse شد. این semantic typecheck نیست.
- `npm run typecheck`: BLOCKED — `@types/node` و `vite/client` موجود نیستند.
- `npm run build`: BLOCKED — wrapper نتوانست `vite` را اجرا کند (`spawn vite EACCES`).
- `npm run lint`: BLOCKED — اجرای `eslint` با `Permission denied` متوقف شد.
- `node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-art.mjs`: FAIL / INCOMPLETE — 167 asset، صفر generated raster، 150 code-drawn، 17 preserved و 23 گروه asset ناقص.

## 4. موارد خارج از دامنه / موانع باقی‌مانده

- هیچ `DATABASE_URL`، `BETTER_AUTH_SECRET` یا سرویس PostgreSQL/Docker در runtime موجود نبود.
- `node_modules` نصب نیست. تلاش قبلی `npm ci --no-audit --no-fund` در CP14 در 180 ثانیه timeout شد؛ در این Part دوباره نصب یا lockfile rewrite انجام نشد.
- هیچ migration واقعی اجرا نشد؛ هیچ SQL commit/reload/restart، authenticated browser path یا دو-session run انجام نشد.
- C3.4 هنوز نیازمند تست network timeout، پاسخ گم‌شده پس از commit و replay پس از reconnect است؛ `expectedRevision` به‌تنهایی idempotency شبکه‌ای را ثابت نمی‌کند.
- C3.5 هنوز failure injection واقعی داخل/پیش/پس از DB transaction ندارد.
- C3.6 به genuine historical save fixtures نیاز دارد؛ تست synthetic legacy validation جایگزین آن نیست.
- C3.7 restart و new authenticated session هنوز آزموده نشده‌اند.
- C3.9 هم‌زمانی دو session و race واقعی روی revision هنوز آزموده نشده‌اند.
- C2 Political Capital همچنان قرارداد authoritative balance/ledger ندارد؛ balance، income، recovery، cap یا spending rule جدیدی ساخته نشده است.

## 5. وضعیت C3.8 پس از این دور

| معیار | وضعیت |
|---|---|
| Receipt payload در `p4.lastReceipt` | موجود و save-compatible |
| Receipt fingerprint و storage classifier | Implemented + unit-tested |
| runtime persistence status خارج از snapshot | Implemented + source-contract-tested |
| restore status از `loadSave().storage` | Implemented + source-contract-tested |
| Receipt auto-reopen در component mount | Implemented + source-contract-tested |
| actual browser refresh و مشاهدهٔ Receipt | Not run / Blocked |
| PostgreSQL commit → server restart → reload → Receipt match | Not run / Blocked |

**نتیجه:** source-level gap هدف‌گرفته‌شده برطرف شده، اما پذیرش end-to-end C3.8 هنوز باز است.

## 6. Canon، schema و امنیت

- Canon facts / identities / family links / chronology: بدون تغییر.
- Save schema و migrations: بدون تغییر.
- package manifest و `package-lock.json`: بدون تغییر؛ SHA-256 قفل dependency با inventory والد CP14 تطبیق دارد.
- هیچ secret یا credential اضافه نشده است.
- `.grok/app-env.json` موقت پس از آزمون حذف شد؛ `node_modules` وجود ندارد.
- هیچ فایل پروژه‌ای حذف نشده است.

## 7. گام بعد دقیق

1. Owner باید PostgreSQL URL و تنظیمات auth را فقط در protected environment interface سرویس میزبانی وارد کند؛ secret در chat یا source قرار نگیرد.
2. در محیط دارای registry/network، وابستگی‌ها دقیقاً از `package-lock.json` نصب شوند؛ سپس full test، typecheck، lint و build تکرار شوند.
3. روی isolated database، migrationهای موجود با runner فعلی اجرا شوند.
4. مسیر واقعی authenticated command برای Council decree، generic option، Wait/time و یک عملیات چندتغییره اجرا شود.
5. rejection/no-mutation، failure injection، post-commit response loss، retry/idempotency، two-session revision conflict، legacy-save roundtrip و restart/reload آزموده شوند.
6. C3.8 در مرورگر واقعی بررسی شود: Receipt پس از refresh از account snapshot باز شود و status آن با storage class و Save revision بازیابی‌شده مطابقت داشته باشد.
7. ماتریس C3.1–C3.10 فقط با evidence واقعی تکمیل شود. پس از پذیرش C3، توالی Master Prompt ادامه می‌یابد: C4 NPC availability → C5 missing-person integration → C6 legacy panel aliases → C7 connected gameplay/browser verification.

**حکم نهایی:** CP15 یک partial source implementation checkpoint است. C3 و Gate 2 هنوز BLOCKED / PARTIAL هستند؛ C4 آغاز نشده است.


## 8. بسته‌بندی CP15

- والد مستقیم: CP14 با ۷۵۹ عضو؛ آرشیو والد و SHA-256 آن immutable و پیش از کار تأیید شدند.
- CP15 شامل ۷۷۱ عضو است: ۷۵۹ عضو والد + ۹ فایل محتوایی جدید + ۳ فایل index/checksum.
- در قیاس با CP14: ۹ فایل افزوده، ۱۱ فایل اصلاح‌شده، صفر فایل حذف‌شده.
- سه فایل index: Change Manifest، File Inventory و SHA256SUMS. Inventory ردیف خودش و SHA256SUMS جداگانه را کنار می‌گذارد؛ SHA256SUMS تمام فایل‌های دیگر، از جمله Inventory، را پوشش می‌دهد.
- فایل‌های موقت `.grok/app-env.json` و `node_modules` در بسته وجود ندارند.
- قبل از تحویل: ZIP integrity، تطبیق byte-for-byte تمام اعضا با working copy، بررسی حذف/تغییر/افزودن‌ها و تطبیق SHA-256 sidecar انجام می‌شود.
