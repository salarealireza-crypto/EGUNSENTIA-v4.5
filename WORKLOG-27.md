# EGUNSENTIA — Worklog 27

Date: 2026-11-08

## Scope
Protect deploy-time PostgreSQL schema migrations against concurrent deployment processes.

## Finding
- The deploy migrator read `_migrations` once before applying any file. If two deploy processes shared the same database, both could capture the same stale applied-file list and race to execute/record one migration. The DDL files were transactional, but the migration ledger read was not serialized across deploys.

## Changes
- Added `scripts/migration-transaction.mjs`, which runs a migration callback inside a PostgreSQL transaction and acquires a stable two-integer `pg_advisory_xact_lock` before work begins. The transaction-scoped lock is released automatically on commit/rollback and avoids depending on session affinity for pooled connections.
- Updated `scripts/migrate.mjs` to consider the ordered checked-in migration files, then create/read `_migrations` and re-check whether each file is applied only after taking the lock. A second deploy skips a migration already committed by the first.
- Retained one transaction per migration file and existing rollback behavior. The PGLite startup migration path is unchanged; it already serializes migration passes inside its process.
- Added regression tests for lock ordering, commit, rollback, preservation of the original error when rollback itself fails, and refresh of the migration ledger under lock.

## Verification
- Migration transaction + migration plan tests: **12/12 PASS**.
- Save revision + migration plan + save queue + migration transaction focused suites: **26/26 PASS**.
- Full `npm test`: **341 passed / 2 failed / 343 total**. Both failures remain existing option-execution tests blocked at import by missing `node_modules/zustand/index.js` (`ERR_MODULE_NOT_FOUND`). No tests were removed/skipped.
- Canon verification: PASS (65-panel registry, invariants, 167 refs, preserved art and option catalogs).
- Art verification: structural PASS only; 23 groups still lack production art (0 generated raster, 150 code-drawn, 17 preserved).
- `node --check` passes for the new helper, test, and migration script. The full TypeScript check, ESLint, and production build remain blocked by missing type packages / `eslint` / `vite`.
- No live Postgres/Neon test was possible because `pg` is absent and no durable database connection is configured. The advisory lock and DDL were verified with unit tests and source inspection only, not on a real database.

## Phase / release status
Phase 1 remains open. No browser E2E, production DB migration, deployment, Git commit, or release build has been verified. Original source archives remain unchanged.
