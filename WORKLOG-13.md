# EGUNSENTIA — Worklog 13

## Scope
Continue Phase 1 from the extracted `EGUNSENTIA-v4.5-stage12-latest.zip` working copy. The uploaded archives remain unchanged. One small production configuration fix and its regression test were added in this batch.

## Archive and source verification
- Confirmed both uploaded archives are readable. The Stage 12 archive contains 1,076 entries and is the active baseline; the older V4.5 archive contains 543 entries.
- Extracted Stage 12 into a separate working directory.
- Read `EGUNSENTIA_RELEASE_CHECKPOINTS.md`, `WORKLOG-12.md`, `V45_FINAL_STATUS.md`, `V45_UNFINISHED.md`, `V45_HANDOFF.md`, `package.json`, and `package-lock.json`.
- Confirmed the project is not a Git working tree (`.git` absent). This is recorded for the later GitHub phase, not treated as a source-code defect.

## Reproduced test and verification results
- `npm test` before the URL-normalization fix: **283 passed / 2 failed / 285 total**. After the fix and new regression test: **284 passed / 2 failed / 286 total**. Both failures are `ERR_MODULE_NOT_FOUND` for `zustand/index.js` while importing `src/lib/game/store.ts`; this does not yet establish a gameplay logic defect.
- `npm run verify:canon`: **PASS** — 65-panel registry, invariants, 167 asset references, preserved art, and option catalogs.
- `npm run verify:art -- --structure`: **PASS for structural audit only**; 23 groups remain unfilled with real art. Inventory: 167 total references, 0 generated raster assets, 150 code-drawn, 17 preserved.
- `npm run typecheck`: blocked by absent files for `node` and `vite/client` type definitions.
- `npm run lint`: blocked; `eslint` executable is unavailable.
- `npm run build`: blocked; `vite` executable is unavailable.
- `node_modules` contains 270 package directories but is only about 2.1 MB; critical packages including `zustand`, `vite`, `typescript`, `@types/node`, `eslint`, `@tanstack/react-start`, `react`, `jose`, and `@electric-sql/pglite` have zero files. `npm ls --depth=0` reports many invalid and extraneous packages.
- `npm cache verify`: 0 cached packages.
- npm registry requests to `registry.npmjs.org`, `registry.npmmirror.com`, and `registry.yarnpkg.com` all fail with DNS `EAI_AGAIN`. No clean installation was attempted against an unreachable registry in this batch; the earlier timed-out `npm ci` remains documented in Worklog 12.
- A direct rerun of the previously reported 67-test auth/migration/PWA suite is currently blocked by missing `@tanstack/react-start/server` and `jose` files. The readiness subtests that could load passed; overall direct suite result was 6 passed / 2 failed. Therefore the historical 67/67 result is not reproducible in this extracted runtime.
- Migration planner tests: **8/8 PASS** (including the new database URL normalization regression test).
- `npm run check:auth` is blocked because the required dev server cannot be started without Vite.

## Initial architecture/security inspection
- Authenticated game server functions use `authMiddleware`; it rejects cross-site/sibling requests and derives the user ID from a verified session rather than a client-supplied user ID.
- Save load/write/clear queries are scoped by `context.userId`; save payloads have a 1,400,000-character limit and writes use an upsert keyed by user ID.
- Database selection is explicit: `DATABASE_URL` selects PostgreSQL/Neon; otherwise PGlite is used. The code documents PGlite as an in-process preview/development fallback, not a durable serverless production database.
- The migration planner and the two shipped SQL migrations were inspected; the auth schema copy is present and the planner tests verify it is byte-identical.
- The only file-based API route found is the Better Auth catch-all route. AL gameplay is exposed as a TanStack Start server function in `src/lib/game/gm.ts`, protected by `authMiddleware`.
- Preliminary AL hardening items remain for deeper review: `playTurn` currently uses a TypeScript-only input validator (no runtime schema validation); rate limiting is an in-memory per-process Map (not distributed across serverless instances); and user-provided state/history/memory need explicit size/shape bounds before expensive processing. These are audit findings to verify and address in the appropriate Phase 1/4 work, not claimed as fixed.
- No `.gitignore` exists in the extracted root. No `.env`, `.env.*`, PEM, or key files were found in the scanned project root and first three directory levels. A safe ignore policy must be added before any GitHub push.

## Blockers
- Dependency restoration is blocked by DNS/network resolution, not by a package-specific failure. No fake package files, dependency removal, lockfile edits, or arbitrary upgrades were made.
- Typecheck, lint, production build, browser smoke, and the historical focused auth suite cannot be fully verified until dependencies are restored.

## Next actions
1. Retry dependency restoration when registry/DNS access is available, using the existing lockfile without upgrades.
2. Once installed, rerun the complete test suite and focused auth/migration/PWA tests, then typecheck, lint, canon/art checks, build, and browser smoke.
3. Continue detailed runtime/security review of AL server functions, auth, save/load, migrations, and simulation integration.
4. Add regression tests before changing any confirmed production defect.
5. Keep Phase 2 and visual production on hold until Phase 1 gates are satisfied.

## Security
- No credentials were added, copied, or printed.
- The previously exposed provider key remains compromised and must be revoked/replaced by the user before the future server-side provider setup.
