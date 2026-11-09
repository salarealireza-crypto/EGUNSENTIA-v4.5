# WORKLOG-47 — Stage 47 Core Recovery CP1

**Date:** 2026-11-08

## Scope

Recovery and implementation of the received master prompt through Issue 10 only. The received prompt stopped at the end of Issue 10; details for Issues 11–12 and later phases were not supplied.

## Source

- Verified immutable base: `EGUNSENTIA-STAGE46-BASELINE-REVIEWED-2026-11-08.zip`
- SHA-256: `a8c050be2885629bad998fc0b5c29c6d84f504c945f1183d9a302d0451dffb88`
- Extracted inventory: 569 files; each extracted source file was hash-checked against the archive.
- Original source archive `EGUNSENTIA-stage46-paused-full-2026-11-08.zip`: 568 files; all present in the reviewed baseline. The reviewed baseline includes one additional baseline-review document and a refreshed handoff.
- Stage40 archive: 552 files; all included in the reviewed Stage46 baseline.
- Original archives and verified baseline were not edited.

## Implemented

- Confirmed Stage46 Issue 1 hard-interrupt fix and expanded tests for gate/water/cistern/envoy interruptions, simultaneous triggers, and year boundary.
- Hardened Delta parsing, safe-key filtering, bounded structures, strict numeric handling, negative economy/resource clamps, stable-identity updates, and full candidate-save validation. Explicit null remains a no-op except the schema-declared nullable root fields `requestedDossier` and `tonightFilm`.
- Added safe/throttled persistent save error notices; maintained fail-closed behavior for save conflicts.
- Added safe legacy-save parsing and optional collection defaults; surfaced remote load failures without replacing local progress.
- Fixed calendar cross-year date range inference, including Dead Days.
- Corrected ration policy regression expectation: 0.5 baseline becomes 0.46, not 1; zero remains zero.
- Added bounded rolling eight-turn summary and persistent flush path.
- Hardened GM state parsing against missing END markers and malformed/truncated state.
- Added AL quota refund for failed provider operations, explicit 429 priority classification, structural compact-state projection and size budgeting.
- Added optional absolute `birthDay`, stable identity migration/updates, and removed misleading passive affection no-op drift.
- Added regression tests and updated stale source-shape assertions to reflect the migration wrappers; no tests were removed.

## Evidence

- Targeted test batch: 70/70 passed (separate run).
- Script suite excluding `scripts/game.test.mjs`: 347/347 passed.
- Official `npm test`: 347 passed; 1 test file blocked at module load because the local dependency installation has an empty/incomplete `node_modules/zod` package. No assertion failure was reported by that file; it did not execute.
- Standalone tests: `readiness-schedule` and `sign-in-gate`: 6/6 passed. Other TypeScript test files were blocked by missing `@tanstack/react-start/server` and `jose` packages.
- TypeScript/TSX syntax transpilation: 11 changed TypeScript/TSX source files passed syntax diagnostics; new MJS modules also passed `node --check`.
- `verify:canon`: PASS.
- `verify:art`: FAIL/INCOMPLETE (0 raster generated assets; placeholders remain).
- `npm run typecheck`: BLOCKED by missing `@types/node` and `vite/client` type packages.
- `npm run build`: BLOCKED because Vite executable is missing (`spawn vite ENOENT`).
- No browser, production database, multi-device sync or deployment verification claimed.

## Unfinished / next

- Receive the missing continuation of the master prompt (remainder of Issue 10, Issues 11–12, and later phase details).
- Restore dependencies in a network-enabled environment using `npm ci`; rerun full tests, typecheck and build.
- Continue with integration and browser validation only after dependency recovery.
- Phases C–I not started.
