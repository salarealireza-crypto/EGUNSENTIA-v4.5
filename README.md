# EGUNSENTIA

EGUNSENTIA is an existing browser-based narrative/management game project. This repository preserves its established game engine, campaign data, canon registry, panel catalogues, save system, authentication integration, and server-side AL (Archive/LLM) connection. It is not a greenfield recreation.

> **Current engineering status (9 November 2026; CP13 partial):** The supplied historical baseline is a staged CP9 extension; subsequent CP10–CP13 checkpoints preserve it and add bounded work. CP13 adds central snapshot autosave, same-snapshot flush coalescing, storage-class reporting and truthful pending/ephemeral/device-only Receipts. Focused persistence tests pass 58/58; runnable script tests excluding the Zod-dependent game suite pass 449/449; the full script run is 449/450 because `scripts/game.test.mjs` cannot import missing `zod`. Canon verification passes; Red Claw passes with outstanding provenance/chronology warnings. Typecheck, lint and build are blocked by missing dependencies. No real database commit/reload, browser workflow, or Production verification has been performed. Gate 2 and C3 remain PARTIAL/BLOCKED. CP13 is **not a release candidate**.

## Runtime and package manager

The current working checkpoint was inspected with:

- Node.js `v22.16.0`
- npm `10.9.2`
- npm lockfile version `3`

The project does not yet declare a formal `engines` range in `package.json`. Keep the Node/npm versions consistent with the checkpoint until a deliberate runtime upgrade is tested.

## Local development

1. Install the exact dependency tree from the lockfile:

   ```sh
   npm ci
   ```

2. Keep the auth build flag enabled in the local environment. The checked-in `scripts/with-app-env.mjs` reads `.grok/app-env.json` (ignored by Git and excluded from distributable checkpoints) and only accepts string keys prefixed with `VITE_`:

   ```json
   {
     "VITE_AUTH_ENABLED": "true"
   }
   ```

   The flag is not a secret. Do not put API keys or database credentials in `.grok/app-env.json` or in any `VITE_` variable.

3. Start the Vite/TanStack Start dev server through the project wrapper:

   ```sh
   npm run dev
   ```

   The configured dev host/port is `0.0.0.0:8080`. Do not bypass the wrapper by invoking Vite directly; it keeps the resolved auth flag consistent between dev, build, and preview.

## Useful project commands

| Command | Purpose |
|---|---|
| `npm test` | Configured script and TypeScript test suites |
| `npm run test:game` | Focused game-engine tests |
| `npm run typecheck` | TypeScript semantic check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run build` | Production build only; it does not run migrations |
| `npm run db:migrate` | Explicitly apply pending PostgreSQL migrations when `DATABASE_URL` is configured |
| `npm run verify:canon` | Validate the 65-panel canon registry and option catalogues |
| `npm run verify:art` | Check whether registered art groups have real generated assets |
| `npm run check:auth` | Check the resolved auth flag from the running dev server |

`npm run verify:art` is expected to remain incomplete until real art assets are supplied. Do not create dummy assets to force the check to pass.

## Configuration

See [`.env.example`](.env.example) for variable names and [DEPLOYMENT.md](DEPLOYMENT.md) for the current deployment blockers and safe preparation sequence.

Secrets must remain server-side. Never place `DATABASE_URL`, Better Auth secrets, Groq/xAI keys, or connector tokens in browser code, `VITE_*` variables, committed files, screenshots, logs, or distributable ZIPs.

## Recovery and checkpoint policy

- Historical archives and verified checkpoints are immutable source material.
- Work on a separate copy and deliver complete, versioned ZIP checkpoints.
- Each checkpoint must include a SHA-256 file, a file inventory, a worklog, and honest test evidence.
- Never delete tests, weaken validation, or claim a feature is verified when its relevant test could not run.
- Preserve UNKNOWN canon facts as unknown; do not promote rumours to confirmed lore or add named canon characters without owner approval.


## Stage 47 — Round 2 Canon / genealogy audit (2026-11-09)

Round 2 delivered an audit-only checkpoint. No Canon card, game source, Save, or gameplay behavior was modified. See `STAGE47_ROUND2_CANON_CHARACTER_GENEALOGY_AUDIT_2026-11-09.md`, `STAGE47_ROUND2_HANDOFF_2026-11-09.md`, profile coverage and genealogy edge matrices. Full V4.1 master, complete V4.5 update prompt and the referenced Floor 7 Red House Ledger remain unavailable. Proposals remain unapproved.


## Stage 47 — Round 3 Part 1: Council typed effects and resource reservations (2026-11-09)

CP12 partially advances Gate 2. The Council panel-24 decree now uses the authoritative catalog option and shared typed-effect runner, with preflight resource reservations and numeric stock changes in Receipts. Political Capital remains unresolved and is not deducted or treated as paid; CP8's decision not to invent a balance or blanket-block Wait is preserved. Gate 2 remains PARTIAL. See `STAGE47_GATE2_ROUND3_PART1_COUNCIL_TYPED_EFFECTS_AND_RESERVATIONS_REPORT_2026-11-09.md` and `STAGE47_GATE2_ROUND3_PART1_HANDOFF_2026-11-09.md`.


## Stage 47 — Round 3 Part 2: persistence autosave wiring (2026-11-09)

CP13 adds a central debounced snapshot autosave, deduplicates concurrent flushes for identical snapshots, reports PostgreSQL/Neon vs ephemeral PGlite storage distinctly, and makes Command Deck / Council receipts reflect the actual flush result. An empty account row is no longer treated as a persisted local seed. Focused persistence tests are 58/58; script tests excluding the dependency-blocked game suite are 449/449. The actual DB transaction/commit/reload path and browser workflow remain untested because no `DATABASE_URL`, installed database packages, PostgreSQL service or runnable browser app are available in this environment. See `STAGE47_GATE2_ROUND3_PART2_PERSISTENCE_AUTOSAVE_REPORT_2026-11-09.md` and `STAGE47_GATE2_ROUND3_PART2_HANDOFF_2026-11-09.md`.
