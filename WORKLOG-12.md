# EGUNSENTIA — Worklog 12

## Scope
Start Phase 1 stabilization on the dedicated stage-12 working copy. Original archives remain unchanged. APK/native work is excluded.

## Verified baseline and findings
- Re-ran the full test suite before edits: 273/285 passed, 12 failed.
- The failures were not 12 gameplay defects. Ten were stale/contaminated test expectations and two gameplay tests could not load the declared `zustand` dependency because installation was incomplete.
- `.grok/app-env.json` explicitly enables `VITE_AUTH_ENABLED=true`; the auth invariant test incorrectly expected false.
- The auth-enabled workspace includes `migrations/0001_auth.sql` as a byte-identical copy of `migrations/auth/0001_auth.sql`, plus `0002_saves.sql`; the migration test incorrectly expected the root migration directory to be empty.
- PWA metadata tests were reading the real workspace `src/lib/og/site.json` and public art files, making fixture expectations depend on the project's actual branding/assets. Updated tests to pass isolated site/cwd fixtures rather than changing production metadata behavior.

## Changes made
- Updated the auth-invariant test to expect the shipped auth-enabled configuration.
- Updated the migration-plan test to assert the two actual pending migrations and verify the auth schema copy is byte-identical to its source.
- Isolated PWA head-injection tests from workspace-specific `site.json` and public image files.
- No production gameplay, authentication, migration, or PWA implementation code changed in this worklog's fixes.

## Verification
- Focused auth/migration/PWA suite: **67/67 passed**.
- Full test suite after changes: **283/285 passed**. Remaining two failures are the gameplay option tests blocked by missing `zustand` package files.
- Canon verification: **passed** — 65-panel registry, invariants, 167 asset references, preserved art, and option catalogs.
- Art verification: **failed/incomplete by design at this stage** — 0 generated raster assets; 150 code-drawn and 17 preserved assets. This is tracked for the later visual-production phase, not masked.
- Typecheck: **blocked** because `@types/node` and Vite client type definitions are unavailable in the incomplete dependency tree.
- `npm ci --no-audit --no-fund --fetch-retries=1 --fetch-timeout=20000` timed out before completing; npm cache is empty. No successful clean install or production build is claimed.

## Next actions
1. Restore a complete dependency install (requires npm registry access or a populated package cache).
2. Re-run the two gameplay option tests; then the full suite.
3. Run typecheck, lint, production build, browser smoke and save/migration tests with complete dependencies.
4. Continue the gameplay/runtime defect audit before entering visual production.

## Security
- No API key or credential was added to source, tests, logs, or archive.
- The API key previously pasted in chat remains considered compromised and must be revoked/replaced by the user before server-side configuration.
