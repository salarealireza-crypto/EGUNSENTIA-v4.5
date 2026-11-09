# EGUNSENTIA — private deployment preparation

**Status: NOT READY FOR DEPLOYMENT.** This document records the intended private, browser-based deployment path. It is not a claim that a live deployment, database connection, OAuth callback, or AL request has been tested.

## Intended shape

- Browser client: React 19 + Vite + TanStack Start.
- Hosting: Vercel Hobby for an eligible personal, non-commercial deployment, subject to current provider limits and terms.
- Durable data: PostgreSQL-compatible Neon database.
- Authentication: this app's Better Auth endpoint with app-specific OAuth credentials, HTTPS origin validation, and a creator-only account allowlist. The policy is implemented and unit-tested; live OAuth verification remains blocked on provider credentials.
- AL: server-side Groq or xAI-compatible API. The key must never reach the browser.
- Public address: the stable Vercel-provided `*.vercel.app` hostname; no custom domain purchase is assumed.

A stable URL does not mean guaranteed 24/7 uptime. Free tiers have usage, sleeping, connection, execution, and service-policy limits. A dormant database may need to wake before the first request. No provider should be treated as an unconditional lifetime hosting guarantee.

## Release blockers that must be cleared first

1. `src/lib/db.ts` now fails closed when `DATABASE_URL` is absent in production or on Vercel; local PGlite remains available, while deployed non-production preview requires an explicit opt-in. Unit tests pass, but a real Neon connection has not been exercised.
2. The `build` script no longer applies database migrations. `npm run db:migrate` is a separate, explicit deployment step; migration execution against a live Neon database remains unverified.
3. Deployed Better Auth now requires a canonical HTTPS `BETTER_AUTH_URL`, a 32-byte signing secret, app-specific OAuth client credentials, and the creator allowlist. Unit tests pass, but the OAuth callback has not been verified against a real deployed hostname.
4. Creator-only authorization now rejects unlisted accounts at the server boundary. It still needs an end-to-end test using the creator's actual login provider and account.
5. AL defaults were updated to current documented model IDs (`openai/gpt-oss-120b` for Groq and `grok-4.7` for xAI), with stale implicit fallbacks removed. Account entitlement, billing, and an actual provider request remain unverified.
6. Exact lockfile dependency installation is blocked in this audit environment because `registry.npmjs.org` DNS resolution returned `EAI_AGAIN` and the local npm cache is empty. The complete game-test suite, TypeScript semantic check, lint, and production build remain blocked.
7. Save persistence across refresh, logout/login, browser restart, redeploy, and a second device has not been production-integration-tested.
8. Owner-only sign-in, session expiry, backup/export/restore, rollback, and deployment protection must be tested before sharing the stable URL.

## Required server-side environment

Use `.env.example` as the variable-name reference. Configure secrets in the hosting provider's encrypted environment-variable settings, not in Git or browser-visible variables.

Required for a private online instance:

- `DATABASE_URL`: PostgreSQL connection URL for the production database.
- `BETTER_AUTH_SECRET`: a new long random secret dedicated to this app.
- `BETTER_AUTH_URL`: exact deployed HTTPS origin.
- `GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, `GROK_AUTH_CLIENT_SECRET`: the issuer and app-specific OAuth client credentials. The shared preview client is rejected on Vercel.
- `EGUNSENTIA_OWNER_EMAILS` and/or `EGUNSENTIA_OWNER_IDS`: exact, comma-separated owner allowlist. A deployed environment with no allowlist denies all authenticated users.
- `VITE_AUTH_ENABLED=true`: public build flag that keeps sign-in enabled. It is not an access-control mechanism by itself.
- One server-side AL provider key (`GROQ_API_KEY`, `XAI_API_KEY`, or `LLM_API_KEY`) plus explicit `LLM_BASE_URL` / `LLM_MODEL` when using a provider override.

Optional variables include `GROK_PROJECT_ID`, `GROK_GATE_ORIGIN`, connector settings, and `VITE_STUN_URLS`, depending on which optional features are enabled.

Never send secrets in chat or commit them. The project archive intentionally contains placeholders only.

## Intended deployment sequence (after blockers are fixed)

1. Create a **private** Git repository from the reviewed checkpoint. Keep the original archives outside the repository. Protect the main branch and retain release tags/checkpoints.
2. Connect the private repository to a Vercel project. Keep access restricted; do not share the deployment URL yet.
3. Create a Neon PostgreSQL project/branch and configure its connection URL as `DATABASE_URL` in the server environment. Confirm SSL and connection limits against the selected hosting plan.
4. Configure app-specific Better Auth OAuth credentials for the exact Vercel hostname, and configure the callback URL through the auth broker's supported setup. Set `BETTER_AUTH_URL` to the canonical HTTPS origin and `BETTER_AUTH_SECRET` to a fresh random secret.
5. Configure one AL provider key and an explicit model that the owner's account can actually use. Do not put the key in `VITE_*` variables.
6. Run `npm run db:migrate` as a separate, controlled deployment step. `npm run build` no longer runs migrations. Back up PostgreSQL before running the migration command.
7. Deploy a private preview. Verify sign-in and sign-out, access rejection for a second/unlisted account, AL success/failure/429/timeout handling, and durable save/load against the real database.
8. Restart/redeploy the application and repeat save/load verification. Export a backup, restore it to a test branch, and verify rollback before using the stable URL.
9. Review provider quotas and sleeping behavior. Only then mark the private instance ready for the creator.

## Current commands (once dependencies are available)

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run verify:canon
npm run verify:art
npm run build
```

`npm run build` now builds without touching the database. Run `npm run db:migrate` deliberately after backing up the target database and before switching traffic to code that requires the new schema.

## Rollback and data safety

- Keep every prior verified ZIP and its SHA-256 immutable.
- Back up PostgreSQL before schema migration or restore tests.
- Never switch production saves to PGlite or an in-memory store as a fallback.
- Never overwrite a newer cloud save with an invalid, stale, or unauthenticated response.
- Retain a clear rollback target for both application deployment and database schema/data.
