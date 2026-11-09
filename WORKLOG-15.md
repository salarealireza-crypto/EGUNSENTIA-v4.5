# EGUNSENTIA — Worklog 15

## Scope
Continue Phase 1 with save/load boundary validation. The remote save endpoint previously relied on a TypeScript-only validator, which does not validate untrusted runtime input. Persisted JSON was parsed and cast directly to `GameSnapshot` without structural checks.

## Changes
- Added `src/lib/game/save-validation.mjs` with dependency-free runtime checks for campaign snapshot roots, required collections, version, turn counter, summary, nested depth/node count, finite numeric values, prototype-sensitive property names, JSON serialization, and the existing 1.4 MB payload ceiling.
- `persistSave` now validates the request envelope and serializes through the runtime validator before writing.
- `loadSave` validates persisted JSON before returning it to the client; corrupt or structurally invalid stored saves fail closed with the existing safe error response.
- Added `scripts/save-validation.test.mjs` with eight regression cases covering valid round-trip, missing collections, malformed roots, prototype-sensitive keys, invalid numbers/counters, excessive depth/size, and malformed persisted JSON.

## Verification
- Save validation tests: **8/8 PASS**.
- AL validator + migration planner focused tests: **13/13 PASS**.
- Full `npm test`: **297 passed / 2 failed / 299 total**. Both failures remain environmental: `zustand/index.js` is absent from the incomplete `node_modules` tree and imports from `src/lib/game/store.ts` fail. No new failures were introduced.
- `npm run verify:canon`: **PASS** (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- `npm run verify:art -- --structure`: **PASS (structural only)**; 23 art groups remain without real art; 0 generated raster assets, 150 code-drawn assets, 17 preserved assets.
- `npm run typecheck`: **BLOCKED**; missing `@types/node` and `vite/client` definitions.
- `npm run lint`: **BLOCKED**; ESLint executable unavailable.
- `npm run build`: **BLOCKED**; Vite executable unavailable (`spawn vite ENOENT`).

## Open risks
- No real database round-trip was possible in this environment; save endpoint behavior is covered at the pure validation layer, not against Neon/PostgreSQL or PGlite.
- `node_modules` remains incomplete and registry access has previously failed with DNS `EAI_AGAIN`.
- Distributed AL rate limiting remains unresolved; current limit is per process.
- Save schema validation is structural and intentionally does not rewrite or migrate historical snapshots. Compatibility with all historical campaign payloads still needs fixture-based verification.

## Phase status
Phase 1 remains open. No production build, deployment, or release archive is claimed. Original uploaded ZIP archives remain untouched.
