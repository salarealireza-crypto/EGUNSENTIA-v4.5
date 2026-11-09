# EGUNSENTIA Stage 47 — Gate 1 Report

Date: 2026-11-09  
Starting checkpoint: `EGUNSENTIA-STAGE47-GATE0-PARTIAL-CP3-2026-11-09.zip`  
Starting checkpoint SHA-256: `e3dffa17613b22e989c704c64e68255a3c7282ccf50a371e96f15bf0f651e1ba`

## Gate decision

**PARTIALLY COMPLETE / EXTERNAL INTEGRATION BLOCKED.** Gate 1's local safety policies and regression tests are implemented. A real Neon database, deployed OAuth broker callback, real AL provider request, browser session, and durable cloud-save cycle have not been tested. The project is not production-verified and must not be presented as deployed or release-ready.

## Implemented

1. **Database fail-closed policy**
   - Added `src/lib/db-runtime-policy.mjs` and wired it into `src/lib/db.ts`.
   - A valid `postgres://` or `postgresql://` URL selects the durable PostgreSQL path.
   - Invalid/non-PostgreSQL URLs are rejected, not converted to PGlite.
   - `NODE_ENV=production` and Vercel Production fail at startup when `DATABASE_URL` is absent.
   - Local non-production keeps the PGlite development fallback. Vercel Preview/Development can use PGlite only with `PGLITE_ALLOW_EPHEMERAL=true`; Vercel Production never accepts that opt-in.

2. **Migration / build boundary**
   - `npm run build` now runs only the Vite production build.
   - `npm run db:migrate` remains a separate, explicit database operation.
   - The migration runner applies the same database runtime policy and does not silently skip a missing production database.
   - The migration plan and duplicated auth schema copies were reviewed. The `migrations/auth/0001_auth.sql` copy is byte-identical to its source, while the root-only migration scan does not recurse into that directory.

3. **Deployed authentication policy**
   - Added `src/lib/auth/deployment-policy.mjs` and invoked it when the Better Auth server initializes.
   - On Vercel, `BETTER_AUTH_URL` must be a canonical HTTPS origin; `BETTER_AUTH_SECRET` must be at least 32 bytes; dedicated `GROK_AUTH_CLIENT_ID` and `GROK_AUTH_CLIENT_SECRET` must be present.
   - The shared `grok_preview` client is rejected on deployed Vercel environments.
   - An explicit `VITE_AUTH_ENABLED=false` is rejected on Vercel so the private game cannot boot with authentication switched off.

4. **Creator-only application authorization**
   - Added exact-match `EGUNSENTIA_OWNER_EMAILS` and `EGUNSENTIA_OWNER_IDS` policy in `src/lib/auth/creator-access.mjs`.
   - In deployed/production environments, an empty allowlist denies access; absent users and non-allowlisted accounts are denied.
   - `requireUserId()` enforces the allowlist after verified session resolution.
   - The AL provider-status server function now requires the same authenticated middleware. Existing game write functions are covered by the project auth middleware tests.

5. **AL provider model configuration**
   - Groq default changed to `openai/gpt-oss-120b`.
   - xAI default changed to `grok-4.7`.
   - Stale implicit fallback IDs were removed; explicit `LLM_MODEL` and `LLM_FALLBACK_MODELS` overrides remain supported.
   - Provider keys continue to be read from server-side environment variables. No key was added to the source, local app-env, or checkpoint.

6. **Documentation and checkpoints**
   - Updated `README.md`, `.env.example`, `DEPLOYMENT.md`, and this repair roadmap to reflect actual Gate 1 code state.
   - Added a Gate 1 worklog, evidence record, source inventory, and handoff instructions.

## Baseline preservation

- Fresh extraction of CP3 was compared file-by-file against this working copy.
- All **593/593** CP3 files are retained.
- **12** files were added and **17** existing files were intentionally modified.
- **0** baseline files are missing or unintentionally removed.
- `.grok/app-env.json` is a local ignored auth-build setting and is excluded from the distributable ZIP; it contains no credential.
- Original CP3 and earlier archives remain unchanged.

## Verification evidence

| Check | Result | Notes |
|---|---|---|
| Gate 1 focused policy/migration/auth tests | **41/41 PASS** | Covers DB fail-closed, PGlite rules, deployed auth configuration, creator allowlist, migration/build boundary, model defaults and server-function auth contracts. |
| Script test suite excluding the dependency-blocked game test | **367/367 PASS** | 48 test files executed. |
| Full script test discovery | **PARTIAL** | 366 tests passed; `scripts/game.test.mjs` could not load because package `zod` is absent from the blocked dependency installation. No game assertions from that file ran. |
| MJS syntax | **84/84 PASS** | `node --check` over MJS files under `scripts/`, `server/`, and `src/`. |
| TS/TSX syntax transpilation | **129/129 PASS** | Global TypeScript `transpileModule`; syntax-only, not semantic typecheck. |
| Canon verifier | **PASS** | 65-panel registry, invariants, asset references, preserved art and option catalogues. |
| Art verifier | **INCOMPLETE** | 167 registered assets; 0 generated raster assets; 23 art groups remain incomplete. |
| `npm ci` | **BLOCKED** | `registry.npmjs.org` DNS resolution returned `EAI_AGAIN`; npm cache is empty. |
| Full `npm test` | **BLOCKED** | The game test file cannot load without Zod; the chained second TypeScript test group is therefore not reached by the package script. |
| TypeScript semantic typecheck | **BLOCKED** | Locked dependency/type packages are not installed. |
| ESLint | **BLOCKED** | ESLint executable is unavailable until dependencies are installed. |
| Production build | **BLOCKED** | Vite executable is unavailable until dependencies are installed. |
| Neon / Better Auth / AL live integration | **NOT RUN** | No real database URL, app-specific OAuth client, or AL key was provided to the execution environment. Do not send secrets in chat. |
| Browser / Vercel Production verification | **NOT RUN** | No live deployment was created. |

## Important limitations

- `PGLITE_ALLOW_EPHEMERAL` is for a disposable Vercel non-production Preview only. It is not a save-persistence solution.
- A real PostgreSQL connection and all migrations must be tested on a disposable Neon branch before the first private deployment.
- The owner must place the actual account email or stable Better Auth user ID in the Vercel environment allowlist. The sample `creator@example.com` in `.env.example` is a placeholder and must be replaced.
- The OAuth broker must issue a dedicated client whose callback URL is configured for the final Vercel hostname. The code can validate the shape of this configuration but cannot create broker credentials.
- Provider model availability, quota, and billing remain account-specific. Defaults are based on current provider documentation, not a live call using the owner's key.
- `.grok/app-env.json` is a local ignored setup file and is deliberately excluded from the distributable archive. It contains only `VITE_AUTH_ENABLED=true` in this working environment.

## Next actions

1. Restore access to the npm registry or provide an approved dependency cache; run `npm ci` from the lockfile.
2. Run the Zod-dependent game tests, the complete `npm test`, TypeScript typecheck, lint and production build.
3. Provision a disposable Neon branch and run `npm run db:migrate`; verify database connectivity, migration ledger, save/load, and rollback.
4. Configure the actual creator allowlist, Better Auth OAuth client and callback on a private Vercel Preview.
5. Smoke-test a real AL call with the owner's key, including 429, timeout, failure reservation refund and quota behavior.
6. Verify save persistence across refresh, login/logout, browser restart and redeploy before marking Gate 1 complete.
7. Gate 2 gameplay integration can proceed on this checkpoint while the externally credentialed production tests remain pending; never describe Gate 1 as fully complete until those tests pass.
