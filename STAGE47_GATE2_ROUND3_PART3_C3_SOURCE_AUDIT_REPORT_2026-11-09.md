# Stage 47 — Gate 2 / Round 3 Part 3: ممیزی منبع C3 و معیارهای یکپارچه‌سازی

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد کاری:** `EGUNSENTIA-STAGE47-POST-CP12-ROUND3-PART2-PARTIAL-CP13-2026-11-09.zip`  
**Checkpoint این تحویل:** CP14 — ممیزی منبع / تحویل جزئی؛ نه Integration-tested و نه Release Candidate.

## 1. رأی اجرایی

**وضعیت: BLOCKED / PARTIAL**

این Part 3 یک ممیزی کد و آماده‌سازی آزمون C3 است؛ هیچ کد اجرایی، schema، migration، Canon یا قاعدهٔ اقتصاد تغییر نکرد. C3 هنوز **Integration-tested نیست**، زیرا در محیط حاضر PostgreSQL واقعی/معادلِ پایدار، `DATABASE_URL`، وابستگی‌های لازم و محیط مرورگر قابل اجرا در دسترس نبودند. مسیر واقعی `Player Command → validation → authorization → mutation → SQL commit → reload → Receipt` اجرا نشده است.

نتیجهٔ مهم این دور: wiring مربوط به autosave در CP13 وجود دارد، اما دو موضوع باید قبل از بستن C3 بررسی/تکمیل شوند:

1. آزمون واقعی رفتار Save Adapter و retry در وضعیت «commit انجام شده ولی پاسخ به client نرسیده» انجام نشده است؛ `expectedRevision` فقط CAS روی Save row است و به‌تنهایی قرارداد idempotency شبکه‌ای را اثبات نمی‌کند.
2. Receipt payload (`p4.lastReceipt`) در snapshot نرمال/نگهداری می‌شود، ولی نمایش و برچسب persistence آن در دو مسیر بررسی‌شده به React local state وابسته است. در reload، `receiptOpen` دوباره `false` و `receiptPersistence` دوباره `device-only` می‌شود؛ بنابراین بازسازی Receipt و وضعیت قطعی آن از persisted state اثبات نشده و یک gap منبع/UI در برابر C3.8 وجود دارد.

**تصمیم:** CP13 immutable باقی می‌ماند و مبنای ادامه است. CP14 فقط گزارش/ماتریس/هندآف و log این ممیزی را اضافه می‌کند. C4 تا تکمیل آزمون‌های ضروری C3 شروع نمی‌شود.

## 2. ممیزی source — آنچه واقعاً در کد وجود دارد

### 2.1 Database runtime و مرزبندی محیط

- `src/lib/db-runtime-policy.mjs` مسیر PostgreSQL را با `DATABASE_URL` معتبر انتخاب می‌کند و در Production/Vercel نبود آن را با خطا رد می‌کند؛ PGlite fallback فقط برای محیط غیر Production و مجاز preview تعریف شده است.
- `src/lib/db.ts` برای مسیر PostgreSQL از `pg.Pool` استفاده می‌کند. مسیر PGlite در حافظهٔ process ایجاد می‌شود و در توضیحات همان فایل صریحاً ephemeral/local preview نامیده شده است؛ از آن نمی‌توان برای اثبات دوام پس از restart استفاده کرد.
- در محیط این ممیزی، هیچ‌یک از `DATABASE_URL`، `BETTER_AUTH_SECRET` و `PGLITE_ALLOW_EPHEMERAL` تنظیم نبودند. فرمان‌های `docker`, `postgres`, `psql`, `pg_isready` نیز در PATH یافت نشدند. بنابراین هیچ backend متصل و قابل آزمونی وجود نداشت.

### 2.2 Server Save Adapter و revision control

- `src/lib/game/save.ts` روی `loadSave`, `persistSave` و `clearSave` از `authMiddleware` استفاده می‌کند؛ شناسهٔ کاربر از `context.userId` احراز‌شده وارد query می‌شود.
- ورودی `persistSave` شامل `payload` و `expectedRevision` است؛ payload از مسیر `serializeSavePayload` عبور می‌کند.
- نوشتن Save در یک SQL CTE انجام می‌شود: UPDATE فقط وقتی `user_id` و `revision` با انتظار client برابر باشند؛ INSERT فقط برای `expectedRevision = 0` و در صورت نبودن row؛ و `ON CONFLICT DO NOTHING`. نبود row برگشتی به‌صورت conflict گزارش می‌شود.
- هر write snapshot در سطح یک statement واحد به row `game_saves` انجام می‌شود. این یک مسیر optimistic revision-CAS و ذخیرهٔ snapshot است؛ اما چون هیچ PostgreSQL واقعی اجرا نشد، Commit، isolation، رفتار driver/network و recovery بعد از قطع ارتباط را **تأییدشده** نمی‌نامیم.
- پاسخ موفق storage class را بر اساس adapter به `persistent` (Neon/PostgreSQL) یا `ephemeral` (PGlite) تفکیک می‌کند. درنتیجه پیام «persistent» فقط از backend class می‌آید؛ این ممیزی آن را با یک عملیات DB واقعی اثبات نکرد.

### 2.3 Migration runner

- `scripts/migrate.mjs` فایل‌های `migrations/*.sql` را به‌صورت non-recursive جمع می‌کند؛ از `pg.Pool` و client استفاده می‌کند؛ ledger به‌نام `_migrations` را نگه می‌دارد؛ و هر migration را از مسیر `withMigrationTransaction` اجرا می‌کند.
- `scripts/migration-transaction.mjs` توالی `BEGIN`، `pg_advisory_xact_lock`، اجرای عمل، `COMMIT` و در خطا `ROLLBACK` را پیاده می‌کند. migration runner بعد از گرفتن قفل، ledger را دوباره می‌خواند تا اجرای هم‌زمان deployها از فهرست کهنه استفاده نکند.
- در CP13 تست helper با fake client وجود داشت و در focused suite اجرا شد؛ migrationها روی PostgreSQL واقعی اعمال نشدند. هیچ ادعای «schema applied» یا «migration integration-tested» نداریم.
- migrationهای موجود `0002_saves.sql` و `0003_save_revisions.sql` قرارداد Save row/revision را می‌سازند؛ این دور هیچ migration تازه‌ای نساخت و هیچ migration موجودی را اجرا نکرد.

### 2.4 Autosave queue و command identity

- `src/lib/game/save-autosave.ts` subscriber snapshot canonical را پس از hydration/reconciliation فعال می‌کند؛ تغییرها ۴۰۰ میلی‌ثانیه debounce می‌شوند؛ تغییر notice-only خارج snapshot ذخیره را trigger نمی‌کند؛ و flushهای هم‌زمان برای payload یکسان Promise مشترک می‌گیرند.
- `src/lib/game/play.ts` latest-snapshot queue، dedupe همان snapshot، `expectedRevision`، نتیجه‌های روشن `committed / ephemeral / unchanged / superseded / blocked / failed` و توقف در conflict را نگه می‌دارد.
- `src/lib/game/store.ts` برای generic option از `optionCommandIdentity(option.id, dayIndex, minuteOfDay)` و `appliedOptionCommandIds` استفاده می‌کند؛ Council نیز `appliedCouncilCommandIds` را نگه می‌دارد. اینها هویت‌های درون campaign state هستند و پس از snapshot/normalization قابل نگهداری‌اند.
- این guardها در سطح source قابل مشاهده‌اند؛ اما آزمون «دو session»، «درخواست شبکه‌ای تکراری»، «timeout بعد از commit»، «replay پس از restart» و «هم‌زمانی Save row» انجام نشده است. هیچ جدول idempotency جداگانه در Save migrationهای بررسی‌شده مشاهده نشد؛ قرارداد CAS به‌تنهایی جایگزین اثبات end-to-end idempotency نیست.

### 2.5 Receipt: gap مشخص در C3.8

- `src/lib/game/p4-simulation.ts` مقدار `lastReceipt` را با `b.lastReceipt ?? null` در نرمال‌سازی P4 حفظ می‌کند؛ بنابراین دادهٔ Receipt جزو campaign snapshot است.
- در `src/components/game/CommandDeck.tsx`، `receiptOpen` با `useState(false)` و `receiptPersistence` با `useState("device-only")` مقداردهی اولیه می‌شوند. نمایش `<Receipt>` به `receiptOpen && p4.lastReceipt` وابسته است.
- در `CouncilBody` در `src/components/game/V45PanelBody.tsx` نیز همین دو state محلی وجود دارند و Receipt فقط با `receiptOpen` نمایش داده می‌شود.
- پس از reload، payload می‌تواند `lastReceipt` را داشته باشد، ولی وضعیت بازبودن Receipt و storage label از snapshot بازسازی نمی‌شود؛ state محلی component از نو مقداردهی می‌شود. این مشاهده یک **source-level gap** است، نه نتیجهٔ آزمون browser.
- اقدام بعدی باید از همین داده‌های موجود و قرارداد Receipt فعلی استفاده کند؛ ایجاد سیستم موازی/ledger جدید یا تغییر معنای Receipt بدون audit و تست لازم نیست. معیار پذیرش: Receipt قابل دسترسی/بازسازی از snapshot و status قابل اعتماد از load/save response؛ پس از reload نباید به اشتباه `device-only` نمایش داده شود.

## 3. ممیزی CP13 و package lineage

- CP13 ZIP با `unzip -tq` بررسی شد: هیچ خطایی در compressed data گزارش نشد.
- SHA-256 آرشیو: `7589cde965aee8681f1afec552ce6f3c45214f681acc23ecc87cfd5d4ca24fc8`؛ با sidecar موجود تطبیق داشت.
- CP13 شامل ۷۵۰ عضو است. گزارش CP13 می‌گوید نسبت به CP12 با ۷۳۹ فایل، ۸ فایل محتوایی افزوده و ۱۳ فایل اصلاح شده و فایلی حذف نشده؛ سه index تولیدی نیز در بسته قرار دارند.
- دو تغییر Part 1 که در working copy قدیمی CP12 حضور داشتند اما در ZIP CP12 نبودند، در CP13 carry-forward شده‌اند: متن notice در `src/lib/game/store.ts` و assertion متناظر در `scripts/game.test.mjs`. CP12 دست‌نخورده نگه داشته شده است.
- `package-lock.json` در working copy CP13 با SHA-256 `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` با مقدار inventory تطبیق داشت. هیچ dependency یا lockfile تغییر نکرد.

## 4. اجرای مجدد آزمون‌های ممکن در CP13 working copy

| بررسی | نتیجه | طبقه‌بندی |
|---|---:|---|
| Focused persistence/save/db-runtime/migration-helper | ۵۸/۵۸ PASS | Unit-tested |
| Script tests به‌جز `scripts/game.test.mjs` | ۴۴۹/۴۴۹ PASS | Unit-tested |
| `node scripts/verify-canon.mjs` | PASS؛ ۶۵ پنل، invariants، ۱۶۷ assets و option catalogues | منبع/Canon validation |
| `npm ci --no-audit --no-fund` | timeout در ۱۸۰ ثانیه؛ خروجی تشخیصی کامل ثبت نشد؛ partial `node_modules` پاک شد | Blocked — dependency/network environment |
| `npm run typecheck` | با توجه به نبود dependencyهای لازم قابل اجرا/تأیید نشد | Blocked |
| `npm run build` | Vite binary/dependencies موجود نیست | Blocked |
| `npm run lint` | ESLint binary/dependencies موجود نیست | Blocked |
| PostgreSQL migration/commit/reload | اجرا نشد | Blocked — configuration/backend |
| Browser workflow | اجرا نشد | Not started / environment blocked |

فرمان suite مستقل در این دور:

```sh
node --experimental-strip-types --test scripts/save-autosave.test.mjs scripts/save-queue.test.mjs scripts/save-lifecycle.test.mjs scripts/save-errors.test.mjs scripts/save-revision.test.mjs scripts/save-validation.test.mjs scripts/db-runtime-policy.test.mjs scripts/migration-transaction.test.mjs

mapfile -t tests < <(find scripts -maxdepth 1 -name '*.test.mjs' ! -name 'game.test.mjs' -print | sort)
node --experimental-strip-types --import ./scripts/register-ts.mjs --test "${tests[@]}"

node scripts/verify-canon.mjs
```

برای اجرای script suite، `.grok/app-env.json` موقت فقط با `VITE_AUTH_ENABLED=true` ساخته و بلافاصله حذف شد. در انتها فایل موقت وجود نداشت. هیچ secretی در فایل یا گزارش وارد نشد.

## 5. ماتریس معیار پذیرش C3

فایل `STAGE47_GATE2_ROUND3_PART3_C3_ACCEPTANCE_MATRIX_2026-11-09.csv` وضعیت C3.1 تا C3.10 را به تفکیک می‌آورد. موارد اصلی:

- C3.1: منبع adapter و environment policy ممیزی شده؛ backend واقعی در دسترس نیست.
- C3.2–C3.3: command-success و rejection/no-mutation در مسیر واقعی هنوز مسدود است.
- C3.4: command identityهای campaign-level موجودند؛ replay/network retry اثبات نشده.
- C3.5: migration helper unit-tested است؛ failure injection روی DB و حالت post-commit/pre-response اجرا نشده.
- C3.6: تست‌های validation شامل legacy shape حداقلی‌اند؛ در CP13 bundle فایل تاریخی campaign save مستقل با الگوهای نام/پسوند بررسی‌شده پیدا نشد. این یافته به معنای نبود هر نوع backup خارج از bundle نیست.
- C3.7: restart/reload روی DB پایدار اجرا نشده.
- C3.8: Receipt payload در snapshot است، اما UI receipt-open/storage state پس از reload reconstruct نمی‌شود؛ اصلاح/Browser QA لازم است.
- C3.9: optimistic revision CAS و client queue در source موجودند؛ multi-session concurrency واقعی اجرا نشده.
- C3.10: ماتریس و evidence تهیه شده؛ شرط Integration-tested محقق نشده.

## 6. برنامهٔ اجرایی C3 — ترتیب بدون تغییر schema یا Canon تا زمان اثبات نیاز

1. Owner از طریق پنل محافظت‌شدهٔ provider، PostgreSQL URL و secretهای auth مورد نیاز را پیکربندی کند. مقادیر محرمانه هرگز در chat، ZIP، log، source یا report قرار نگیرند.
2. dependencyهای دقیق `package-lock.json` با `npm ci` در محیطی با دسترسی registry نصب شوند؛ hash فایل lock باید بدون تغییر بماند. تا آن زمان typecheck/build/lint همچنان blocked هستند.
3. یک database و account آزمایشی مجزا انتخاب شود؛ backup/restore یا branch ایزوله لازم است تا دادهٔ واقعی overwrite نشود. فقط migrationهای موجود اجرا شوند؛ schema جدید نسازید مگر یک نقص مستند، پس از آزمون، آن را ضروری کند.
4. ابتدا یک فرمان واقعی از UI (Council decree و یک generic option) اجرا شود؛ state اولیه، authorization، validator، state transition و event ledger قبل/بعد ثبت شود. نوشتن مستقیم row جایگزین مسیر UI/command نیست.
5. پاسخ SQL و revision ذخیره‌شده با snapshot ارسالی برابر شود؛ سپس app/backend restart، session reconnect و login مجدد انجام شود؛ `loadSave` باید همان snapshot را بازیابی کند.
6. invalid input، permission failure، insufficient resource و stale revision را آزمایش کنید؛ هیچ تغییر ناقص، event جعلی یا موفقیت کاذب نباید در DB/Receipt باقی بماند.
7. failure injection قبل از commit، هنگام commit، و بعد از commit قبل از client confirmation را انجام دهید. retry در حالت timeout باید بدون اجرای دوبارهٔ mutation به نتیجهٔ همان عملیات برسد یا با conflict قابل بازیابی و explicit مواجه شود.
8. دو session هم‌زمان روی یک revision و یک منبع واحد را آزمایش کنید؛ یک commit باید revision را جلو ببرد و session دیگر باید conflict/refresh قابل فهم بگیرد؛ هیچ overwrite یا double spend نباید رخ دهد.
9. Receipt را از snapshot persisted پس از reload بازسازی کنید؛ status آن باید با نتیجهٔ واقعی backend هم‌خوان باشد. این مرحله نیازمند رفع gap `receiptOpen` / `receiptPersistence` است.
10. fixtureهای واقعی legacy Save را از checkpointهای تاریخی بازیابی کنید؛ در نبود fixtureهای معتبر، محدودهٔ نسخه‌های پوشش‌داده‌نشده را صریحاً ثبت کنید و از ساخت دادهٔ جعلی به‌جای historical save پرهیز کنید.
11. C3 فقط پس از pass شدن مسیر فرمان واقعی تا reload در matrix به `Integration-tested` ارتقا می‌یابد. `Browser-verified` و `Production-verified` معیارهای مستقل هستند.

## 7. وضعیت سایر workstreamها و Canon

- C1 در سطح typed Council adapter و reservation/atomic store path از دور قبل پیاده‌سازی و unit-tested گزارش شده است؛ این دور آن را دوباره اجرا نکرد.
- C2 همچنان فاقد قرارداد authoritative برای Political Capital است؛ هیچ balance/income/cap یا قاعدهٔ Wait ساخته نشود.
- C4 NPC availability، C5 missing-person linkage، C6 legacy panel alias، C7 connected gameplay/browser QA هنوز به ترتیب بعد از C3 قرار دارند.
- این دور هیچ fact، شخصیت، رابطه، سن، genealogy، event، resource value یا داستانی را Canon نکرد؛ proposal و UNKNOWN باید همان وضعیت قبلی را حفظ کنند.

## 8. تغییرات فایل

**افزوده‌شده:**
- `STAGE47_GATE2_ROUND3_PART3_C3_SOURCE_AUDIT_REPORT_2026-11-09.md`
- `STAGE47_GATE2_ROUND3_PART3_C3_INTEGRATION_HANDOFF_2026-11-09.md`
- `STAGE47_GATE2_ROUND3_PART3_C3_ACCEPTANCE_MATRIX_2026-11-09.csv`
- `STAGE47_GATE2_ROUND3_PART3_C3_VERIFICATION_LOG_2026-11-09.txt`
- `STAGE47_GATE2_ROUND3_PART3_C3_EVIDENCE_2026-11-09.json`
- `WORKLOG-61.md`

**اصلاح مستندات:**
- `STAGE47_REPAIR_ROADMAP_2026-11-09.md`
- `RECOVERY_PROGRESS.md`
- `EGUNSENTIA_RELEASE_CHECKPOINTS.md`

**کد، schema، migrations، Canon و package files:** بدون تغییر. **فایل حذف‌شده:** صفر.

## 9. وضعیت نهایی این تحویل

- Source audit: انجام‌شده برای مسیرهای Save Adapter، runtime policy، migrations، autosave/queue، command identity و Receiptهای اصلی.
- Focused unit tests: ۵۸/۵۸ PASS.
- Runnable scripts excluding Zod-blocked suite: ۴۴۹/۴۴۹ PASS.
- Canon verifier: PASS.
- `npm ci`: Blocked by timeout; no lockfile mutation.
- Database commit/reload/restart: Blocked / Not run.
- Receipt reconstruction: source-level gap ثبت شد.
- Browser / Production: Not run.
- Gate 2 و C3: PARTIAL / BLOCKED.

**گام بعد:** پس از فراهم‌شدن backend و dependencies، رفع/تست Receipt reconstruction و سپس اجرای C3.1 تا C3.10؛ تا آن زمان C4 شروع نشود.
