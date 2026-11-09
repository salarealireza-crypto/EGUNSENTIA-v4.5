# EGUNSENTIA — Worklog 28

Date: 2026-11-08

## Scope
Re-establish a reproducible baseline from the user-uploaded Stage 27 archive before beginning additional stabilization work.

## Source and workspace
- Source archive: `EGUNSENTIA-working-backup-stage27-2026-11-08.zip` (user-uploaded copy).
- ZIP integrity: `unzip -t` passed; archive extracted into a separate working directory. The uploaded archive itself was not modified.
- The archive contains Worklogs 04–27 and the release checkpoint ledger.
- The working copy has no `.git` directory and no `node_modules` directory.
- Restored the known workspace-only `.grok/app-env.json` setting (`VITE_AUTH_ENABLED=true`) from the recorded project configuration. This file is ignored by `.gitignore` and intentionally excluded from portable archives; it contains no secret.

## Runtime and dependency baseline
- Node: `v22.16.0`.
- npm: `10.9.2`.
- Lockfile: npm lockfile v3; 472 package entries; 57 declared root dependencies; locked Zustand `5.0.15`, Vite `8.3.2`.
- `npm cache verify`: 0 cached packages.
- `npm ping --fetch-retries=0 --fetch-timeout=10000`: blocked by DNS `EAI_AGAIN registry.npmjs.org`. No lockfile or dependency versions changed; no fake dependency files created.

## Verification
- Full `npm test` before restoring the ignored workspace flag: 338 passed / 5 failed / 343 total. Three failures were environment-fixture expectations because `.grok/app-env.json` was intentionally absent from the portable archive; two were existing game-option tests blocked by missing `zustand`.
- After restoring the documented local workspace flag: 341 passed / 2 failed / 343 total. The only remaining failures are import-time `ERR_MODULE_NOT_FOUND` for `zustand` in the two game-option execution tests. No tests were removed or skipped.
- `node scripts/verify-canon.mjs`: PASS (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- `node scripts/verify-art.mjs --structure`: structural PASS only; all 23 production-art groups remain unfilled (0 generated raster, 150 code-drawn, 17 preserved).
- TypeScript, ESLint, production build, browser E2E, and real DB integration remain unverified because dependencies / service access are unavailable.

## Result and next action
- The Stage 27 archive is a valid, usable source baseline, but it is not a release-ready build.
- Phase 1 remains open. Next: restore a complete lockfile-based dependency installation when npm registry DNS is available, then rerun full tests, typecheck, lint, build, and integration gates.
- No production code behavior was changed in this worklog. No Git commit, deployment, or production sign-off is claimed.
