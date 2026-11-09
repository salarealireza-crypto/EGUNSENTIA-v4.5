# EGUNSENTIA — Worklog 17

## Scope
Continue Phase 1 with a cross-site request isolation audit. The prior auth middleware already enforced Fetch Metadata for authenticated server functions, and the connector tool caller enforced it independently. Two public POST server functions did not use that guard: connector-readiness probing and AL/Grok linked-status probing.

## Changes
- Extracted the Fetch Metadata decision into dependency-free `src/lib/auth/request-isolation.mjs` so the policy can be tested without importing the TanStack server runtime.
- Updated `src/lib/auth/isolation.server.ts` to use the shared policy while preserving the existing allow rules: absent metadata for non-browser/server-to-server clients, same-origin, `none`, and cross-site top-level GET navigations; reject cross-site/same-site scripted requests and embedded/object navigations.
- Added `assertSameSiteRequest()` to the public `getConnectorReadiness` and `grokStatus` POST handlers. These endpoints remain unauthenticated by design and disclose only small status values, but no longer accept credentialed cross-site browser requests.
- Added five focused regression tests in `scripts/request-isolation.test.mjs`.
- Added a defensive `.gitignore` for dependency/build output, local environment secrets, local databases, and workspace-injected `.grok/app-env.json`. Existing `.grok` project assets/configuration are otherwise retained.

## Verification
- Request-isolation policy tests: **5/5 PASS**.
- Full `npm test`: **307 passed / 2 failed / 309 total**. The two failures remain blocked by missing files in the incomplete `zustand` package tree; no new test failure was introduced.
- `node scripts/verify-canon.mjs`: **PASS** — 65-panel registry, invariants, 167 asset references, preserved art, and option catalogs.
- `node scripts/verify-art.mjs --structure`: **PASS (structural audit only)** — 167 total references, 0 generated raster assets, 150 code-drawn, 17 preserved; 23 groups remain unfilled with real art.
- `npm ping --fetch-retries=0 --fetch-timeout=7000`: **BLOCKED** by `EAI_AGAIN` resolving `registry.npmjs.org`.
- Typecheck, lint, production build, and browser smoke remain blocked/unverified because the dependency tree is incomplete. No production build or deployment is claimed.

## Security notes
- This guard is defense-in-depth, not authentication. Endpoints that access per-user or secret data must still use `authMiddleware` and server-derived user IDs.
- Requests without `Sec-Fetch-Site` remain allowed for non-browser/server-to-server compatibility; callers must not treat this metadata policy as a substitute for authentication or origin/CSRF validation.
- AL rate limiting remains process-local and is not distributed across Vercel instances.

## Phase status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive was created because dependency-backed checks and production build remain blocked.
