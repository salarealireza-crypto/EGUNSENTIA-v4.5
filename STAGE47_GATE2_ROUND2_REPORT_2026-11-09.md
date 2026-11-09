# EGUNSENTIA — Gate 2 Round 2 Implementation Report

Date: 2026-11-09  
Base: CP5 (611 files)  
Checkpoint: CP6  
Status: **ROUND DELIVERED — GATE 2 STILL PARTIAL**

## Executive summary

This round completes the Event Ledger / Ceremony / Investigation Register / Day Replay slice. It does not claim that all Gate 2 work or the whole game is complete. The working copy was derived from CP5; original archives and previous checkpoints were not modified.

## Implemented changes

### A. Event Ledger

- New shared `appendLedgerEvents` helper prevents duplicate stable IDs and enforces a maximum 500-row retention window. Existing rows win on ID collision, preventing replay from rewriting history.
- New events carry in-world year so repeated date labels in different years remain distinguishable. Legacy rows with no year remain supported and are shown as year-not-recorded.
- Event sources connected in this round: initial calendar seed, time advances/time skips, V4.5 option executions, AL Delta-created events, council decrees, crisis resolutions/failures, ceremony schedule/outcome and investigation actions.
- Untrusted AL-created Event Ledger rows are shape-bounded before append; malformed required fields, actor arrays or knowledge layers are rejected without rejecting unrelated state changes in the same Delta. Replay rendering also tolerates incomplete legacy display fields.
- Crisis outcomes created during `applyP4`, direct clock advance and Wait command paths are all captured with deterministic event identity.
- Snapshot/persisted history remains bounded at 500 rows.

### B. Ceremonies & Calendar — panel 05

- Player can schedule a ceremony within the next 365 campaign days.
- Validates title/place, same-day time interval, maximum duration, cost bounds, attendee count/uniqueness, venue/person conflicts and CAST availability throughout the full interval.
- Calendar event and Ceremony record are created together.
- Outcomes: held, missed or cancelled, with time-bound validation.
- Estimated cost is deducted only when marked held and only if treasury can afford it.
- Ceremony outcome and notes are added to Event Ledger; held ceremonies also add a Chronicle line.
- Save normalizer rejects malformed dates/times/costs and safely bounds legacy records.

No new ritual lore, religious practice, character relationship or automatic Morale change was invented. Those consequences need owner-approved canon/gameplay rules.

### C. Investigation Register — panel 19

- Separate `P4State.investigationCases` collection prevents mixing investigative files with legal/court cases.
- Player can open a file, link discovered clues, add notes, mark open/on-hold/actionable and archive with a required note.
- Actionable status requires at least one linked clue. Archived cases become read-only.
- Linking a clue never changes its evidence classification; UNKNOWN remains UNKNOWN. Archiving does not declare a mystery solved.
- All meaningful actions are written to Event Ledger. Older saves default to an empty register.

This is a generic manual case lifecycle; automated case creation from an authoritative missing-person database remains unimplemented.

### D. Day Replay — panel 34

- Read-only view built exclusively from stored Event Ledger rows.
- Day options are separated by in-world year and date. Events within a day are displayed chronologically.
- The UI does not regenerate scenes, fill missing records or mutate game state. It explicitly warns when a day has no recorded events.

## Files changed/added

Existing source files changed: `V45PanelBody.tsx`, `delta.ts`, `p4-simulation.ts`, `store.ts`, `time.ts`, `types.ts`, `v41-data.ts`, `execute.ts`.  
New implementation/test files: `sim/event-ledger.ts`, `sim/ceremony.ts`, `sim/investigation-cases.ts`, `scripts/gate2-round2.test.mjs`.  
Existing planning document updated: `STAGE47_REPAIR_ROADMAP_2026-11-09.md`.

## Verification

| Check | Result |
|---|---:|
| Targeted Gate 2 Round 2 tests | 11/11 PASS |
| Runnable script test suite | 387/387 PASS |
| Canon verification | PASS |
| Art verification | INCOMPLETE — 167 registered assets (150 code-drawn, 17 preserved), zero generated Raster assets; 23 asset groups incomplete |
| Focused strict TypeScript check | 6 relevant modules PASS |
| Additional in-source TS test files | 6/8 PASS; 2 files blocked by missing `@tanstack/react-start` and `jose` |
| MJS syntax | 87/87 PASS |
| TS/TSX transpile | 132 files, 0 syntax diagnostics |
| Full typecheck | BLOCKED — missing `@types/node` and `vite/client` |
| Production build | BLOCKED — Vite executable absent |
| `scripts/game.test.mjs` | BLOCKED — `zod` package absent |
| Browser / DB / OAuth / live AL / production | NOT RUN |

The 387/387 script-suite result excludes `scripts/game.test.mjs`; that file was not deleted and is not represented as passing. The separate four-file TS test invocation produced 6 passing tests and 2 module-load blockers (`@tanstack/react-start`, `jose`). `transpileModule` checks syntax/transpilation only; it is not a substitute for whole-project TypeScript semantic checking.

## Still open in Gate 2

1. Council typed-effect adapter and double-spend prevention.
2. Command → state → persisted save → UI receipt integration tests against a runnable save backend.
3. NPC attendance consistency across Planner, Personnel, Message, CAST and Evening Hall.
4. Automatic missing-person case generation once authoritative source records are found.
5. Legacy panel alias audit.
6. Browser QA of the new panels and connected save flows.

## Final checkpoint packaging audit

- Final CP6 archive is assembled from the complete project root (not a selected source subset).
- All 611 files from CP5 are present; none are missing.
- 9 existing files have intentional content changes (8 implementation files plus the repair roadmap); 7 project files were added before this report's evidence artifacts.
- Added audit artifacts: `STAGE47_GATE2_ROUND2_EVIDENCE_2026-11-09.json` and `STAGE47_GATE2_ROUND2_FILE_INVENTORY_2026-11-09.csv`.
- The inventory contains SHA-256 for every packaged project file except the inventory CSV itself (self-hash is intentionally excluded). The ZIP receives a separate `.sha256` sidecar.
- `.grok/app-env.json` is local-only and excluded; `.grok` reference images, documentation, and skills are preserved.
- Temporary TypeScript check configuration, local dependencies, build output, and secrets are excluded.
- Round 2 final re-run: targeted tests 11/11 PASS; runnable script suite 387/387 PASS; Canon PASS; focused strict TypeScript 6 modules PASS; MJS 87/87 PASS; TS/TSX transpile 132 files with 0 syntax diagnostics.
- Gate 2 remains PARTIAL. Outstanding work and all environment blockers are listed above and in the handoff.
