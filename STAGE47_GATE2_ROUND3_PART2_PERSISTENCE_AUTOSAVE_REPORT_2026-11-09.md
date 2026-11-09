# Stage 47 — Gate 2 / Round 3 Part 2: Persistence wiring and autosave (2026-11-09)

## Classification

**Partial source implementation; focused unit tests passed; not Integration-tested.** This is a bounded C3 slice. It is not a production-persistence, browser, or release verification.

Parent checkpoint: `EGUNSENTIA-STAGE47-POST-CP11-ROUND3-PART1-PARTIAL-CP12-2026-11-09.zip`  
Parent SHA-256: `4bcce80dd5676714e0987c114b8cb649963a90a5856ead99019a38b21ac5ace6`

## A. Work completed

### Persistence wiring

- Added a central Zustand snapshot subscriber in `src/lib/game/save-autosave.ts`. It selects the canonical `GameSnapshot`, compares serialized snapshots, and debounces changes for 400 ms. Notice-only/UI metadata changes outside the snapshot do not trigger a write. Cleanup cancels the pending timer and unsubscribes.
- Connected the subscriber from `GameShell` only after local hydration and account-copy reconciliation have completed.
- Added an in-flight deduper keyed by the serialized snapshot. A manual action flush and the global autosave for the same snapshot now share one promise rather than issuing duplicate writes.
- Preserved the existing latest-snapshot queue and conditional revision write. A stale queued snapshot is not reported as the latest save; revision conflicts still block automatic overwrites.
- `flushSave` now returns explicit outcomes: persistent commit, ephemeral commit, already-unchanged baseline, superseded, blocked, or failed. Serialization/revision/storage-confirmation failures are not described as successful saves.
- The server save endpoints now report only the storage class (`persistent` for the PostgreSQL/Neon adapter, `ephemeral` for PGlite); no connection string or secret is exposed.
- Save-conflict metadata preserves that storage class when the owner chooses the account copy or the device copy.
- Corrected empty-account initialization: when `loadSave` finds no row and there is no local progress, the device seed snapshot is no longer marked as already persisted. The account baseline stays empty and the first real campaign mutation creates the account row.

### Receipts

- Command Deck orders and panel-24 decrees now wait for `flushSave` before presenting a final receipt.
- Receipts distinguish `pending`, `account-committed`, `ephemeral`, and `device-only`.
- PGlite receipts explicitly state that the local preview database will not survive a server restart. Failed or blocked account saves are not labelled as committed.
- The earlier Part 1 wording change in `store.ts` and its matching `scripts/game.test.mjs` expectation are carried into this checkpoint (see parent-package discrepancy below).

### Canon / game data

- No Canon facts, character identities, family links, game resource rules, option catalogues, or Save schema/migrations were added or changed in this part.
- No Political Capital balance, income, recovery, cap, or spending rule was invented.
- No credentials or secrets were introduced.

## B. Verification

| Check | Result | Meaning |
|---|---:|---|
| Focused persistence/save tests | 58/58 PASS | Unit-level queue, lifecycle, validation, revision, autosave and dedupe behavior |
| Repository script tests excluding `scripts/game.test.mjs` | 449/449 PASS | Full runnable script suite with temporary non-secret local auth flag |
| `npm test` | 449 PASS / 1 blocked | `scripts/game.test.mjs` cannot load because `zod` is absent; the temporary `.grok/app-env.json` was removed after the run |
| App-data/auth TS tests (separate run) | 6 PASS / 2 blocked | `@tanstack/react-start` and `jose` are absent from `node_modules` |
| Changed TS/TSX transpile checks | 9/9 PASS | Syntax/transpilation only, not semantic typecheck |
| `npm run verify:canon` | PASS | 65-panel registry, invariants, 167 registered assets and option catalogues verified |
| `npm run verify:red-claw` | PASS with warnings | Existing proposed-age, sealed-genealogy and chronology warnings remain |
| `node scripts/verify-art.mjs` | FAIL / INCOMPLETE | 167 assets; 0 generated raster assets; 23 incomplete asset groups |
| `npm run typecheck` | BLOCKED | Missing `@types/node` and `vite/client` type definitions |
| `npm run build` | BLOCKED | `vite` executable unavailable (`spawn vite ENOENT`) |
| `npm run lint` | BLOCKED | `eslint` executable unavailable |
| `npm run test:game` | BLOCKED | `ERR_MODULE_NOT_FOUND: Cannot find package 'zod'` from `src/lib/game/delta.ts` |
| DB transaction / commit / reload | NOT RUN | No `DATABASE_URL`, no installed `pg`/PGlite packages, no PostgreSQL server/client or Docker available |
| Browser workflow | NOT RUN | No runnable app/dependency tree and no browser-backed persisted-state test |
| Production verification | NOT RUN | No deployed URL or configured production backend was exercised |

Commands and exact outcomes are recorded in `STAGE47_GATE2_ROUND3_PART2_VERIFICATION_LOG_2026-11-09.txt`.

## C. C3 acceptance status

- **Implemented:** central snapshot autosave, per-snapshot flush coalescing, explicit storage classification, safe empty-account initialization, and non-optimistic receipt states.
- **Unit-tested:** autosave debounce, ignored non-snapshot metadata, cleanup, identical-snapshot coalescing, separate-snapshot isolation, empty-account baseline contract, and receipt storage wording.
- **Integration-tested:** NOT achieved. No real or production-equivalent database driver was available to exercise command → server validator → SQL transaction → commit → reload.
- **Browser-verified:** NOT achieved. No real browser workflow was run.
- **Production-verified:** NOT achieved.

The C3.1/C3.2/C3.3/C3.4/C3.5/C3.6/C3.7/C3.8/C3.9 matrix is still incomplete. In particular, transaction-failure injection, multi-session concurrency, legacy-save roundtrips against a real backend, and receipt reconstruction after server restart remain unverified.

## D. Environment and exact blockers

- Node `v22.16.0`; npm `10.9.2`.
- `node_modules` absent; package lock/manifests were not changed and no packages were installed.
- `DATABASE_URL` is unset. `BETTER_AUTH_SECRET` and `PGLITE_ALLOW_EPHEMERAL` are also not configured in this runtime.
- `psql`, `postgres`, `pg_isready`, and `docker` are unavailable.
- The temporary `.grok/app-env.json` used only for the script-test run contained the non-secret `VITE_AUTH_ENABLED=true` flag and was removed before packaging.
- No DB migration was run and no real Save row was read or written.

Owner-only next action for a real persistent run: configure the existing PostgreSQL connection and required auth settings through the hosting/provider's protected environment interface. Do not paste secrets into chat, source, reports, or this ZIP. Then install the exact lockfile dependency tree and execute the actual command-to-save-to-reload matrix.

## E. Parent package discrepancy discovered

The CP12 archive itself passes ZIP integrity and SHA-256 verification. A byte comparison between that immutable archive and the CP12 working copy found two Part 1 edits present in the working copy but absent from the CP12 ZIP:

1. `src/lib/game/store.ts` — the Council decree notice was changed to say that the decree was applied locally and account save is pending.
2. `scripts/game.test.mjs` — its expected notice text was changed to match.

These edits are preserved and included in this CP13 checkpoint. CP12 was not overwritten or silently repaired. This report records the mismatch so future handoffs use CP13 as the consistent parent.

## F. Source-level changes in this part

- `src/lib/game/save-autosave.ts` — new debounced snapshot autosave and in-flight save deduper.
- `scripts/save-autosave.test.mjs` — new tests for debounce, ignored UI-only state, cleanup, dedupe, empty account baseline, and receipt status wording.
- `src/lib/game/play.ts` — save result union, baseline tracking, same-snapshot in-flight dedupe, safe failure outcomes.
- `src/lib/game/save.ts` — storage class included in successful load/save results.
- `src/components/game/GameShell.tsx` — autosave lifecycle and baseline/conflict reconciliation.
- `src/components/game/CommandDeck.tsx` — order receipt waits for save outcome.
- `src/components/game/V45PanelBody.tsx` — Council decree receipt waits for save outcome.
- `src/components/platform/Receipt.tsx` — explicit persistence-status messaging.
- `src/components/game/SaveConflictBanner.tsx` — save-conflict storage metadata type.
- Carry-forward from Part 1: `src/lib/game/store.ts`, `scripts/game.test.mjs`.

No files were deleted. No package manifest or lockfile was changed.

## G. Next exact step

Continue C3, not C4 yet: obtain a real configured persistent backend in an isolated test account/environment; install dependencies with the repository lockfile; run migrations in that isolated environment; exercise the actual command paths and verify committed revision, row contents, server restart, reload, Receipt match, conflict handling, failure injection, idempotency and concurrency. Do not use direct database row mutation as proof of the command path. Until that is done, C3 remains **Blocked / Partial**, and Gate 2 remains PARTIAL.

## H. Checkpoint package

CP13 contains 750 files. Relative to the 739-file CP12 ZIP: 8 substantive files are added, 13 existing files are modified, and 0 files are deleted. Three generated index files (change manifest, inventory and SHA-256 list) are included as package metadata; the change manifest records the 8 substantive additions and 13 modifications. The inventory excludes its own row and the separate SHA-256 list; the SHA-256 list covers every other packaged file, including the inventory.

Checkpoint name: `EGUNSENTIA-STAGE47-POST-CP12-ROUND3-PART2-PARTIAL-CP13-2026-11-09.zip`. The external `.sha256` sidecar is generated only after the ZIP is finalized and independently verified.
