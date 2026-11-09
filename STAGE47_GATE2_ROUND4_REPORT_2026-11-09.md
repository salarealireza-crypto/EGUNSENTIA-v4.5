# EGUNSENTIA — Stage 47 Gate 2 Round 4 Report

Date: 2026-11-09  
Base: `EGUNSENTIA-STAGE47-GATE2-ROUND3-CP7-2026-11-09.zip`  
Status: **SOURCE CHECKPOINT COMPLETE / INTEGRATION PARTIALLY BLOCKED**

## Scope

This round addressed three bounded topics:
1. Generic option replay/idempotency in the Zustand game-store execution path.
2. Explicit resolution of current panel IDs versus historical panel redirects.
3. Evidence-backed audit of Political Capital costs without inventing a currency balance.

## Implemented

### A. Generic option idempotency

- Added `src/lib/game/sim/option-command.ts`.
- A valid command identity is `v45-option:<optionId>:<dayIndex>:<minuteOfDay>`.
- `executeV45Option` derives the identity from the current campaign world time and checks the persisted `P4State.appliedOptionCommandIds` before calling `runOption`.
- Only successful executions are recorded.
- Both normal execution and Wait/time-advance execution persist the identity in the resulting P4 state.
- Normalization filters malformed entries and retains the latest 500 identities. Older saves with no field safely normalize to an empty list.
- The production save serializer/parser round-trip test confirms the field survives serialization and restoration.
- Search found `runOption` called only from `executeV45Option` inside `src`; no second production call path bypasses this guard.

The idempotency window is one exact world minute. An option may be used again at a later campaign minute, as intended. The guard does not mark rejected or failed actions as executed.

### B. Panel identity audit

The registry contains 65 current canonical panels and 11 historical redirects. All 11 redirect source keys overlap with current canonical IDs. Consequently, a bare numeric input is ambiguous if a caller does not state whether it means a current panel or an old reference.

- Added `resolveCanonicalPanelId()` for current navigation; all IDs 01–65 resolve to themselves.
- Added `resolveLegacyPanelTarget()` for explicit lookup through the historical redirect map.
- Kept `resolvePanelId()` legacy-first to preserve existing migration compatibility.
- Confirmed no current source caller of `resolvePanelId()` exists in `src` or `scripts` beyond its declaration/tests.
- Confirmed all redirect targets are current registered panels and the per-panel `legacyAlias` values agree with the redirect table.

No saved panel value or alias mapping was rewritten. Old saves must not be bulk-migrated until their context is known.

### C. Political Capital audit

A fresh import of the catalog confirms:
- 403 total options.
- 182 options with `politicalCapital > 0`.
- All 26 Wait-category options also carry a positive Political Capital value.
- There is no authoritative Political Capital balance/ledger in the current state model or generic execution path.

No arbitrary Political Capital resource was added. No blanket rejection was introduced because it would also disable Wait options and conflict with the current time-advance design. This remains an explicit economy/design blocker.

## Verification evidence

| Check | Result |
|---|---:|
| Focused Gate 2 Round 4 tests | 8/8 PASS |
| Runnable script tests excluding `scripts/game.test.mjs` | 408/408 PASS |
| Canon verification | PASS (65 panels, 167 registered art assets, catalogue invariants) |
| MJS syntax | 89/89 PASS |
| Changed TypeScript syntax | 4/4 PASS |
| Focused strict TypeScript (`option-command.ts`, `desks.ts`, `registry.ts`) | PASS |
| Save serializer/parser round trip for option IDs | PASS |

### Blocked or not verified

- `scripts/game.test.mjs` cannot load because package `zod` is absent.
- The separate TypeScript test group ran 8 tests: 6 passed; 2 suites could not load because `@tanstack/react-start` and `jose` are absent.
- Full `npm run typecheck` cannot start because `@types/node` and `vite/client` are absent.
- `npm run build` cannot start because Vite is absent (`spawn vite ENOENT`).
- No browser, real Zustand store runtime, Neon/PostgreSQL, OAuth, or live AL-provider integration test was run.

The local `.grok/app-env.json` was created temporarily only to run the repository tests, contained only `VITE_AUTH_ENABLED=true`, and was removed before checkpoint creation. No secret is included in this report or checkpoint.

## Changed files

Modified:
- `src/lib/game/p4-simulation.ts`
- `src/lib/game/store.ts`
- `src/lib/platform/registry.ts`
- `STAGE47_REPAIR_ROADMAP_2026-11-09.md`

Added:
- `src/lib/game/sim/option-command.ts`
- `scripts/gate2-round4.test.mjs`
- Round 4 report, handoff, worklog, evidence JSON, and file inventory.

## Decision

CP8 is a verified source checkpoint for this round. It is **not** a production release candidate. Continue from CP8; preserve CP7 and earlier checkpoints unchanged.

## Checkpoint packaging

The delivered CP8 archive contains 633 files: all 626 CP7 base files, 7 additions, and 5 modified existing files. No CP7 path is missing. The embedded CSV inventory contains 632 rows because it intentionally excludes its own row to avoid a self-referential hash. The ZIP was reopened, passed its CRC/integrity test, and every archived member hash matched the working copy. The temporary local `.grok/app-env.json` is not included.
