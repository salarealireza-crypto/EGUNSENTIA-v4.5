# EGUNSENTIA — تحویل C3 پس از Source Audit (Round 3 Part 3)

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد دقیق:** `EGUNSENTIA-STAGE47-POST-CP12-ROUND3-PART2-PARTIAL-CP13-2026-11-09.zip`  
**این بسته:** `EGUNSENTIA-STAGE47-POST-CP13-ROUND3-PART3-C3-SOURCE-AUDIT-PARTIAL-CP14-2026-11-09.zip`  
**وضعیت:** Partial documentation/source-audit checkpoint؛ C3 هنوز Integration-tested نیست.

## نقطهٔ ادامهٔ قطعی

از CP14 به‌عنوان package parent استفاده کن. CP13 و تمام والدهای قبلی immutable هستند. CP14 هیچ تغییر کدی ندارد؛ فقط source audit، acceptance matrix، verification log و handoff را اضافه کرده و roadmap/recovery/release checkpoint/worklog را به‌روز می‌کند.

## شواهد source-level

- `src/lib/db-runtime-policy.mjs`: Production بدون DATABASE_URL fail-closed؛ PGlite فقط preview/local و ephemeral.
- `src/lib/db.ts`: `pg.Pool` برای PostgreSQL؛ PGlite حافظه‌ای برای preview.
- `src/lib/game/save.ts`: auth middleware، `context.userId`, payload serialization، SQL CTE با `expectedRevision` برای update/insert و conflict return.
- `scripts/migrate.mjs` + `scripts/migration-transaction.mjs`: migration ledger و transaction/advisory lock source موجود؛ واقعی اجرا نشده.
- `src/lib/game/save-autosave.ts` + `src/lib/game/play.ts`: 400ms debounce، snapshot coalescing، save queue، revision CAS و outcome classification.
- `src/lib/game/store.ts` و `src/lib/game/sim/option-command.ts`: option command identities در campaign P4 snapshot؛ Council identities در P4.
- `src/lib/game/p4-simulation.ts`: `lastReceipt` در normalization نگه داشته می‌شود.
- `src/components/game/CommandDeck.tsx` و `src/components/game/V45PanelBody.tsx`: `receiptOpen` و `receiptPersistence` در React local state هستند و پس از reload از persisted snapshot restore نمی‌شوند. Receipt پس از reload خودکار بازسازی/قابل‌مشاهده نیست؛ این gap C3.8 باید پیش از ادعای تکمیل رفع/تست شود.

## وضعیت آزمون CP14

- Focused persistence/save/db-runtime/migration tests: `58/58 PASS`.
- Script tests excluding `scripts/game.test.mjs`: `449/449 PASS`.
- `node scripts/verify-canon.mjs`: PASS.
- `npm ci --no-audit --no-fund`: timed out at 180 seconds; no complete diagnostic output; partial `node_modules` removed; lockfile unchanged.
- No DATABASE_URL, Better Auth secret, PG service/client, Docker or browser environment. No migration, DB commit, restart or reload test occurred.

## کار دقیق بعدی — C3، نه C4

1. Owner-only: configure PostgreSQL URL and required auth settings through hosting provider's secure environment interface. Never paste secrets into chat or files.
2. In a suitable registry-enabled environment, run `npm ci` against unchanged `package-lock.json`; verify lock hash unchanged. Then run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and record exact outputs. Do not silently skip test files.
3. Use isolated database/account. Apply existing `migrations/*.sql` via existing migration runner; do not invent new migrations or schemas.
4. Fix C3.8 Receipt reconstruction through existing persisted `p4.lastReceipt` and real load/save storage status; do not infer `account-committed` from a stale local React flag.
5. Through actual authenticated UI paths, test Council decree, generic option, Wait/time action, and one other representative multi-mutation action; capture validation, authorization, snapshot mutation, SQL commit, revision, reload and Receipt.
6. Execute rejection/no-mutation, failure injection (pre-commit and post-commit/pre-response), timeout retry, idempotency across session restart, two-session same-revision conflict and legacy-save roundtrip.
7. Complete matrix C3.1–C3.10 with evidence IDs and actual results. Only then mark C3 Integration-tested. Browser-verified and Production-verified remain independent.
8. After C3, continue in prompt order: C4 NPC availability → C5 missing-person integration → C6 legacy aliases → C7 connected gameplay/browser verification.

## Hard blockers and safety

- No DB credentials/configuration in current execution environment. Owner must enter them directly in provider UI.
- Dependency installation timed out. This is not a source failure nor a successful install; typecheck/build/lint remain blocked.
- Do not use PGlite, fake DB clients, direct SQL row mutation or synthetic snapshots as proof of production persistence.
- C2 Political Capital remains unresolved; do not create balances/income/caps/spending or blanket-block Wait.
- No Canon changes, no Save schema/migration changes, no package manifest/lockfile changes, no deleted files.

## CP14 contents

Complete 750-file CP13 project plus six added files and three updated project-level documents. Change manifest, inventory, per-file SHA-256 index and ZIP sidecar are packaged/verified. CP13 archive remains immutable.
