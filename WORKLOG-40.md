# EGUNSENTIA — Worklog 40

Date: 2026-11-08

## Scope
Harden campaign file import resource use and checkpoint server-function access boundaries.

## Finding and changes
- The imported-save parser enforced a 1.4 MB limit, but `TitleScreen` called `file.text()` before invoking the parser. A very large user-selected file could therefore be read into memory before the limit was checked.
- Added `validateImportFileSize()` and call it with the browser's `File.size` before reading file contents. The parser uses the same guard after measuring encoded text.
- Added static regression coverage for authenticated user-scoped campaign/AL endpoints, same-site guards on public status/readiness endpoints, and the root route's minimum client session fields.

## Verification
- Save validation/import guard tests: 15/15 PASS. Server-function auth-boundary tests: 3/3 PASS.
- Full `npm test`: 371 PASS / 2 blocked / 373 total; both blocked tests fail at import because `node_modules/zustand/index.js` is absent.
- `node scripts/verify-canon.mjs`: PASS (65-panel registry, invariants, 167 refs, preserved art, option catalogs).
- `node scripts/verify-art.mjs --structure`: structural PASS only; 23 production art groups remain unfilled.
- `npm run typecheck`: blocked by missing `@types/node` and `vite/client`; `npm run lint`: ESLint executable missing; `npm run build`: Vite executable missing.
- `DATABASE_URL` is not configured in this execution environment; migration 0005 was not run against a live database.
- Live browser and deployed server tests remain pending until the app dependencies can be installed and a database/host is configured.

## Result
Oversized imports are rejected before file contents are read, and access-control invariants have additional regression coverage. Phase 1 remains open.
