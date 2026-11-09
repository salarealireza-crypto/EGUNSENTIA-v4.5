# EGUNSENTIA — تحویل ادامه پس از CP16

**Checkpoint دقیق:** `EGUNSENTIA-STAGE47-POST-CP15-ROUND3-PART5-C3-FAILURE-PATH-AUTH-TESTS-PARTIAL-CP16-2026-11-09.zip`  
**والد مستقیم immutable:** `EGUNSENTIA-STAGE47-POST-CP14-ROUND3-PART4-RECEIPT-RECONSTRUCTION-PARTIAL-CP15-2026-11-09.zip`  
**SHA-256 والد:** `c61c1d6675147a173af6cf6998ccf576e666374ca6fd57f98645139c5920d47a`  
**وضعیت:** partial C3 test-hardening؛ C3 و Gate 2 همچنان BLOCKED / PARTIAL.

## نقطهٔ ادامه

CP16 را به‌عنوان parent کاری بعدی استفاده کن. CP15 و همهٔ والدهای قبلی immutable هستند. ابتدا CP16 را با SHA-256 و ZIP integrity بررسی کن و سپس آن را در working copy تازه استخراج کن.

## آنچه در Part 5 انجام شد

- در `scripts/migration-transaction.test.mjs` دو test اضافه شد: commit failure باید rollback را امتحان کند و خطای اصلی COMMIT را حفظ کند؛ advisory-lock failure باید migration body را اجرا نکند و rollback کند.
- در `scripts/save-revision.test.mjs` دو source-contract test اضافه شد: تمام Save endpoints از `authMiddleware` و `context.userId` استفاده می‌کنند؛ `persistSave` شناسهٔ account را از caller نمی‌پذیرد.
- Focused suite از 66 به 70 تست PASS افزایش یافت.
- Runnable scripts (به‌جز `scripts/game.test.mjs`) از 457 به 461 تست PASS افزایش یافت.
- Canon verifier PASS؛ Red Claw PASS با 14 هشدار.
- هیچ code handler، Save schema، migration، Canon، اقتصاد، manifest یا lockfile تغییر نکرد.

## Verification جاری

- Focused persistence/Receipt/DB/migration: 70/70 PASS.
- Runnable scripts excluding `scripts/game.test.mjs`: 461/461 PASS.
- Full `npm test`: 461 PASS / 1 BLOCKED؛ `zod` import missing.
- app-data/auth tests separate: 6 PASS / 2 BLOCKED؛ `@tanstack/react-start` و `jose` موجود نیستند.
- Canon: PASS.
- Red Claw: PASS با 14 warnings.
- Art: FAIL/INCOMPLETE؛ 167 assets، 0 generated raster، 150 code-drawn، 17 preserved، 23 incomplete groups.
- typecheck: BLOCKED؛ `@types/node` و `vite/client` missing.
- build: BLOCKED؛ `spawn vite ENOENT`.
- lint: BLOCKED؛ `eslint` missing.
- check:auth: BLOCKED؛ dev server resolved `VITE_AUTH_ENABLED` در دسترس نبود.
- PostgreSQL integration/browser/production: NOT RUN.

## C3.1–C3.10 disposition

C3.4 و C3.5 دارای پوشش unit/source-contract بهتری هستند؛ C3.8 source reconstruction از CP15 باقی است؛ C3.9 queue/CAS unit tests موجودند. با این حال actual persistent backend commit/reload، rejection/no-mutation، failure injection روی PostgreSQL، timeout retry، concurrent sessions، restart و browser Receipt همچنان اجرا نشده‌اند. C3 Integration-tested نیست.

## محیط و blockerها

- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `PGLITE_ALLOW_EPHEMERAL` unset.
- `psql`, `postgres`, `pg_isready`, Docker و `node_modules` absent.
- `npm ci` در CP14 با timeout 180 ثانیه متوقف شده بود؛ در Part 5 تکرار نشد. `package-lock.json` hash `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` و بدون تغییر است.
- یک `.grok/app-env.json` محلی فقط شامل `VITE_AUTH_ENABLED=true` بود، در CP15 والد وجود نداشت و پیش از بسته‌بندی حذف شد؛ secret نبود.
- historical player Save مستقلی در فایل‌های CP15 پیدا نشد؛ legacy tests فعلی بر fixture مصنوعی تکیه دارند.

## دستور ادامهٔ قطعی

1. C3 را ادامه بده؛ C4 شروع نشود.
2. Owner PostgreSQL URL و auth settings را فقط در protected provider environment وارد کند؛ هرگز در chat یا فایل پروژه قرار نگیرد.
3. dependencyهای دقیق از lockfile در محیط دارای package registry نصب شوند؛ lockfile نباید rewrite/upgrade شود.
4. migrationهای موجود در isolated PostgreSQL با `npm run db:migrate` اعمال شوند.
5. command مسیر واقعی UI برای Council decree، generic option، Wait/time و یک multi-mutation action اجرا شود.
6. success, rejection/no-mutation, migration/DB failure injection, post-commit lost response, retry/idempotency, revision conflict, two-session concurrency, legacy Save roundtrip, restart/reload و Receipt restoration ثبت شوند.
7. C3.1–C3.10 فقط با evidence واقعی بسته شود؛ سپس C4 → C5 → C6 → C7 طبق Master Prompt.

هیچ credentialی را از مالک درخواست نکن که در گفتگو ارسال کند. مالک باید secret را مستقیماً در UI امن provider وارد کند.
