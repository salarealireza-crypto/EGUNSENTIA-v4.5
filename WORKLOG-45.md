# EGUNSENTIA — Worklog 45

Date: 2026-11-08

## Scope
Close duplicate queue identity paths outside the general option engine and make restoration robust to malformed queue entries.

## Finding and changes
- Council delegations and decrees used IDs based only on seat and current minute. Repeating a council action at the same minute could create duplicate IDs; resolution removes by ID and could discard multiple records while applying one result.
- Council delegation/decree queue IDs now include the next queue sequence at insertion, preserving separate records for repeated actions.
- Added queue normalization: malformed rows are discarded, invalid optional `dueMin` is removed to preserve the valid legacy `dueDay` fallback, and valid exact deadlines remain intact.

## Verification
- Council queue identity + queue normalization focused suite: 3/3 PASS.
- Full `npm test`: 387 PASS / 2 blocked / 389 total. Both remaining failures are `ERR_MODULE_NOT_FOUND` for `zustand` at the two pre-existing store/option integration tests; no assertions were removed or skipped.
- Canon verification: PASS (65-panel registry, invariants, 167 references, option catalogs).
- Art structural verification: structural PASS only; 23 groups still require real production assets (currently 0 generated raster assets).
- TypeScript, ESLint and Vite production build remain unverified due missing dependencies; no `DATABASE_URL`, live browser, GitHub or Vercel deployment is configured.

## Result
All queue producers audited in this pass now retain independent delayed records for repeated option and council actions. Phase 1/2 are not cleared; no production release is claimed.
