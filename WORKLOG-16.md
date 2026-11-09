# EGUNSENTIA — Worklog 16

## Scope
Continue Phase 1 with production authentication configuration and multi-instance session safety.

## Finding
`src/lib/auth/server.ts` previously fell back to a process-local random Better Auth signing secret whenever `BETTER_AUTH_SECRET` was absent. That fallback is acceptable for disposable local/embedded preview sessions, but it is unsafe on Vercel: serverless instances and cold starts do not share process memory. A session minted by one instance could fail verification on another instance or after a restart, causing intermittent sign-outs and broken persistence workflows.

## Changes
- Added dependency-free `src/lib/auth/runtime-config.mjs` to resolve the Better Auth signing secret.
- Vercel now fails closed when `BETTER_AUTH_SECRET` is missing or blank; it can no longer silently use an ephemeral process-local secret.
- Non-Vercel local/preview environments retain the process-stable preview fallback.
- `src/lib/auth/server.ts` now uses the shared resolver.
- Added five regression tests in `scripts/auth-runtime-config.test.mjs`.

## Verification
- Auth runtime config tests: **5/5 PASS**.
- Full `npm test`: **302 passed / 2 failed / 304 total**. The same two pre-existing failures are caused by missing `zustand/index.js` in the incomplete `node_modules` tree. No new test failures.
- `npm run verify:canon`: **PASS** (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- `npm run verify:art -- --structure`: **PASS (structural only)**; 23 groups remain without real art; 0 generated raster assets, 150 code-drawn assets, 17 preserved assets.
- Typecheck, lint, production build remain blocked by missing dependencies; no successful build is claimed.

## Remaining risks
- This check detects Vercel through `VERCEL=1`; deployment must set a stable, high-entropy `BETTER_AUTH_SECRET` in Vercel Environment Variables.
- A real multi-instance session test still requires a configured Vercel preview/deployment and durable Postgres database.
- AL rate limiting remains per-process/in-memory and is not distributed across Vercel instances.
- OAuth client credentials, database connectivity, and save/load round-trip remain unverified end-to-end.

## Phase status
Phase 1 remains open. No deployment, release archive, or production readiness is claimed. Original uploaded ZIP archives remain untouched.
