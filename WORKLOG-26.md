# EGUNSENTIA — Worklog 26

Date: 2026-11-08

## Scope
Protect account campaign saves against concurrent edits from multiple devices/tabs and make conflicts explicit instead of silently applying last-write-wins.

## Finding
- `createLatestSaveQueue()` serialized writes only within one browser module instance. The `game_saves` upsert itself had no compare-and-swap condition, so two clients that loaded the same older campaign could overwrite one another.
- The browser had no persisted record of which remote save revision its local campaign was based on, so a previously offline device could not detect that the account copy had moved ahead.
- A missing remote row also needed to be distinguished from a valid first save; a stale client must not silently recreate a deliberately removed account row.

## Changes
- Added `migrations/0003_save_revisions.sql`: additive `revision BIGINT NOT NULL DEFAULT 1` column; existing account-save rows retain their payload and receive an initial revision.
- `loadSave()` now returns the remote revision (`0` when no row exists).
- `persistSave()` requires a non-negative safe-integer `expectedRevision`. Its single SQL statement updates only a row whose current revision matches, permits insert only when the expected revision is `0`, and returns the incremented revision. Stale or missing-row writes return an explicit conflict instead of overwriting/recreating data.
- Added dependency-free revision validation/policy helpers and regression coverage.
- Added `remoteRevision` to the browser-persisted Zustand metadata, separate from the portable `GameSnapshot`. New campaign reset and imported-snapshot loading retain the current remote base revision.
- Client writes send the remembered revision. A conflict blocks repeated automatic attempts until a deliberate choice is made.
- `GameShell` detects when a local copy has an unknown/stale base and differs from the account copy. The in-game conflict banner lets the player load the account copy or intentionally keep/upload the local campaign. If the account row is missing, restoring the local copy is also explicit.
- A conflict detected during an already-running session now emits a browser event; `GameShell` reloads the latest account revision and opens the same explicit choice banner without requiring a page refresh. Failed conflict-detail reads leave remote writes blocked and preserve the local campaign.

## Verification
- Save revision + migration plan + save queue focused tests: **22/22 PASS** (includes the active-session conflict UI path).
- Full `npm test` after adding the active-session conflict UI regression: **337 passed / 2 failed / 339 total**. The only failures are the two option-execution tests that cannot import `node_modules/zustand/index.js` (`ERR_MODULE_NOT_FOUND`).
- Canon verification: PASS (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- Art verification: structural PASS only; 23 groups still lack production art (0 generated raster, 150 code-drawn, 17 preserved).
- TypeScript syntax transpilation: PASS for all five changed TS/TSX files; `node --check` also passes for the new revision helper and its test. Full typecheck remains blocked by missing `@types/node` and `vite/client` definitions.
- ESLint unavailable (`eslint: not found`). Production build unavailable (`vite: ENOENT`). `pg` and `@electric-sql/pglite` are also absent, so the SQL migration and compare-and-swap statement have not been exercised against a live Postgres/PGLite database.
- No browser, Neon round-trip, or two-device end-to-end test has been run.

## Phase / release status
Phase 1 remains open. This is a concurrency guard, not a multi-device integration sign-off. No release archive, Git commit, deployment, or production-readiness claim was created. Original uploaded archives remain unchanged.
