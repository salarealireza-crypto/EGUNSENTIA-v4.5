# Stage 47 Gate 1 — Handoff

## Resume point

Use `EGUNSENTIA-STAGE47-GATE1-CORE-SAFETY-CP4-2026-11-09.zip` as the latest working checkpoint. Keep CP1, CP2, CP3 and all historical archives immutable.

## Completed in Gate 1

- Fail-closed production PostgreSQL selection.
- Local PGlite fallback and explicit Vercel non-production preview opt-in.
- Migration command separated from build.
- Deployed Better Auth origin/secret/app-specific OAuth validation.
- Creator-only allowlist enforcement on the server.
- AL status route authenticated.
- Groq and xAI model default refresh.
- Focused tests and documentation updates.

## Remaining external verification

1. Restore package-registry access and run `npm ci`.
2. Run `npm test`, including `scripts/game.test.mjs`; complete TypeScript typecheck, lint and build.
3. Provision a disposable Neon branch and test migrations, saves and restores.
4. Obtain app-specific OAuth client credentials and configure the exact Vercel callback URL.
5. Set `EGUNSENTIA_OWNER_EMAILS` and/or `EGUNSENTIA_OWNER_IDS` in the private Vercel environment; replace the example placeholder.
6. Test real AL requests and provider error/quota behavior with the owner's server-side key.
7. Verify private sign-in, rejection of an unlisted second account, and save durability after restart/redeploy.

## Next development gate

Gate 2: gameplay integrations — NPC availability and Planner, crisis causal outcomes, ceremonies, disappearance case lifecycle, Day Replay and council effect integration. Preserve Canon and keep unknown story facts unknown.

## Important

No Production deployment has been created or verified. Do not expose the game URL until the external checks pass.
