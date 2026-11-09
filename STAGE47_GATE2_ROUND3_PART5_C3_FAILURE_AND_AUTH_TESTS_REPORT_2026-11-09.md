# Stage 47 — Gate 2 / Round 3 Part 5
## C3: تقویت آزمون مسیرهای شکست migration و مرز احراز هویت Save

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد کاری immutable:** `EGUNSENTIA-STAGE47-POST-CP14-ROUND3-PART4-RECEIPT-RECONSTRUCTION-PARTIAL-CP15-2026-11-09.zip`  
**SHA-256 والد:** `c61c1d6675147a173af6cf6998ccf576e666374ca6fd57f98645139c5920d47a`  
**تحویل:** CP16 — partial C3 test-hardening checkpoint؛ نه Integration-tested و نه Release Candidate.

## 1. رأی اجرایی

**C3 همچنان BLOCKED / PARTIAL است؛ Gate 2 همچنان PARTIAL است.**

در این بخش، دو دسته آزمون source/contract به suite موجود افزوده شد:

1. `withMigrationTransaction` اکنون failure path مربوط به شکست `COMMIT` را هم می‌آزماید: helper باید `ROLLBACK` را امتحان کند و خطای اصلی Commit را حفظ کند. مسیر شکست advisory lock نیز باید پیش از اجرای migration body، rollback کند.
2. سه Save server function (`loadSave`, `persistSave`, `clearSave`) باید `authMiddleware` داشته باشند و مالکیت رکورد را فقط از `context.userId` بگیرند. validator مسیر `persistSave` فقط `payload` و `expectedRevision` را از ورودی برمی‌گرداند و شناسهٔ حساب ارسالی client را نمی‌پذیرد.

این‌ها آزمون قرارداد منبع و fake-client helper هستند. نه SQL واقعی را اجرا می‌کنند، نه transaction واقعی PostgreSQL را اثبات می‌کنند، نه command-to-save integration هستند.

## 2. تغییرهای دقیق

### افزوده به `scripts/migration-transaction.test.mjs`

- `a COMMIT failure triggers rollback and preserves the commit error`
- `an advisory-lock failure prevents migration work and rolls back`

پوشش قبلیِ شکست migration body و شکست خود ROLLBACK حفظ شد. تعداد این suite از ۴ به ۶ رسید.

### افزوده به `scripts/save-revision.test.mjs`

- `all save endpoints scope access to the authenticated middleware context`
- `persistSave does not accept a caller-selected account identity`

تعداد این suite از ۱۱ به ۱۳ رسید. هیچ handler یا implementation کد اجرایی در این Part تغییر نکرد.

## 3. یافته‌های حفظ‌شده از CP15

- `persistSave` از authenticated `context.userId` و `expectedRevision` در conditional CTE استفاده می‌کند. این مسیر source-audited است، نه DB-executed.
- `clearSave` نیز به revision فعلی مقید است و حذف Save جدیدتر را با CAS رد می‌کند.
- migration runner از `BEGIN`، transaction-scoped advisory lock، اجرای migration، ثبت ledger و `COMMIT` استفاده می‌کند؛ اگر body یا commit خطا دهد، helper rollback را امتحان می‌کند.
- generic option و Council command identity در P4 نگهداری می‌شود و تست‌های فعلی پایداری identity پس از normalization و Save serialization را پوشش می‌دهند. retry بعد از lost response و replay شبکه‌ای روی backend واقعی هنوز آزموده نشده است.
- fixtureهای موجود برای legacy save مصنوعی و test-only هستند. در CP15 archive، فایل مستقل و قابل‌شناسایی به‌عنوان historical player Save پیدا نشد؛ بنابراین C3.6 با historical data کامل نشده است.

## 4. Verification — اجرای واقعی در CP15 working copy

| Check | Result | Interpretation |
|---|---:|---|
| Focused persistence/Receipt/DB/migration suite | 70/70 PASS | Unit/helper/source-contract only |
| Runnable `scripts/*.test.mjs` excluding `scripts/game.test.mjs` | 461/461 PASS | 56 test files; Zod-dependent file excluded |
| `npm test` | 461 PASS / 1 BLOCKED | `scripts/game.test.mjs` cannot import `zod` |
| Separate app-data/auth test batch | 6 PASS / 2 BLOCKED | missing `@tanstack/react-start` and `jose` |
| `node scripts/verify-canon.mjs` | PASS | 65-panel registry, invariants, 167 assets and option catalogs |
| Red Claw verifier | PASS with 14 warnings | age/provenance/chronology warnings retained |
| Art verifier | FAIL / INCOMPLETE | 167 assets; 0 generated raster; 150 code-drawn; 17 preserved; 23 incomplete groups |
| `npm run typecheck` | BLOCKED | missing `@types/node` and `vite/client` |
| `npm run build` | BLOCKED | `spawn vite ENOENT` |
| `npm run lint` | BLOCKED | `eslint: not found` |
| `npm run check:auth` | BLOCKED | no dev server resolved `VITE_AUTH_ENABLED` available to checker |
| Real PostgreSQL migration / save transaction | NOT RUN | no `DATABASE_URL`, PG binaries/service or Docker |
| Browser / Production | NOT RUN | no runnable full dependency/app/backend environment |

Exact commands and observed error summaries are in `STAGE47_GATE2_ROUND3_PART5_C3_VERIFICATION_LOG_2026-11-09.txt`.

## 5. C3 status matrix

- **C3.1:** Blocked — persistent backend is not configured; PGlite is not accepted as durable-production evidence.
- **C3.2:** Blocked — no authenticated command path was exercised through actual SQL commit and reload.
- **C3.3:** Blocked — rejection/no-mutation was not measured against a persistent backend.
- **C3.4:** Unit-tested — command identity persistence is covered; response-lost retry/network replay on persistent backend is unverified.
- **C3.5:** Unit-tested — migration helper tests cover body failure, rollback failure, advisory-lock failure and commit failure; real DB transaction/failure injection is unverified.
- **C3.6:** Partial — safe defaults for synthetic legacy-shaped fixtures are tested; genuine historical player saves and DB roundtrip are not available/verified.
- **C3.7:** Blocked — browser, application and backend restart persistence not run.
- **C3.8:** Implemented / Unit-tested at source level in CP15; browser refresh against persisted PostgreSQL Receipt remains blocked.
- **C3.9:** Unit-tested — local queue/CAS and stale snapshot protections; two authenticated sessions and simultaneous DB writes not run.
- **C3.10:** Evidence/matrix updated; end-to-end acceptance remains blocked.

## 6. Environment and exact blockers

- Node `v22.16.0`; npm `10.9.2`.
- `node_modules` absent; npm cache has no cached `zod` package.
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `PGLITE_ALLOW_EPHEMERAL` unset.
- `psql`, `postgres`, `pg_isready`, `docker` unavailable.
- Prior CP14 `npm ci --no-audit --no-fund` timed out at 180 seconds. It was not retried in this Part; `package-lock.json` remains unchanged with SHA-256 `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b`.
- A workspace-local `.grok/app-env.json` containing only `VITE_AUTH_ENABLED=true` was absent from the CP15 parent archive; it was removed before packaging as a local environment artifact. No secret value was present or added.
- `npm run check:auth` could not inspect a dev-server resolved environment because a dev server/dependency tree is not available.

## 7. Canon, data and scope integrity

- No Canon facts, character identities, genealogy, proposed lore status or economy rules changed.
- C2 Political Capital remains unresolved. Do not invent balance, income, recovery, caps or spending; do not blanket-block Wait.
- No Save schema, SQL migration, package manifest or lockfile changed.
- No credentials or secrets added.
- No file deleted.

## 8. Exact next step

Continue C3. Do not start C4 yet.

1. Owner configures the existing PostgreSQL connection and auth settings through the hosting provider's protected environment UI; secrets must never be pasted into chat or stored in this repository.
2. In a registry-enabled environment, install exactly from the existing lockfile; verify the lockfile hash is unchanged. Do not upgrade dependencies.
3. Apply existing migrations using the project's migration runner in an isolated database.
4. Exercise actual authenticated UI command paths: Council decree, generic option, Wait/time advance and one representative multi-mutation action.
5. Verify successful commit/revision/row contents/reload, rejected command no-mutation, before-commit failure, commit failure, post-commit lost response/retry, durable idempotency, two-session CAS conflict, legacy-save roundtrip, restart and Receipt reconstruction.
6. Fill all C3.1–C3.10 evidence rows with real backend, commit, reload and Receipt-match fields. C3 can be Integration-tested only after the actual command → DB commit → reload path passes.
7. Only after C3 acceptance proceed to C4 NPC availability, C5 missing-person integration, C6 legacy panel aliases, C7 connected gameplay/browser verification.

CP16 is a partial test-hardening checkpoint, not completion of C3, Gate 2 or the project.
