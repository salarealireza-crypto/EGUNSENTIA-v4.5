# EGUNSENTIA — Stage 47 Private Relations & Dynastic — Round 1 Report

Date: 2026-11-09  
Base: `EGUNSENTIA-STAGE47-GATE2-ROUND4-CP8-2026-11-09.zip`  
Status: **IMPLEMENTED SOURCE CHECKPOINT / RUNTIME INTEGRATION PARTIALLY BLOCKED**

## Scope and boundary

This is a separate content-and-simulation workstream built on CP8. CP8 remains the immutable baseline. The new platform designation is `PRIVATE / NON-GRAPHIC`; no NSFW designation or explicit sexual-content mode was introduced. Private adult relationships, non-explicit affection, courtship, engagement, marriage, former-partner/separated history, disclosure, medical evidence, household response and dynastic review are represented in persistent game state. Intimate acts are not depicted.

All profile details are projected from the compiled CP8 character cards. Missing fields are rendered as `UNKNOWN`; no missing physical or behavioural traits, private history, family connection, pregnancy, child, parentage or succession result is invented.

## Implemented

### 1. Adult character roster and Canon dossiers

Added `src/lib/game/sim/private-relations.ts`, which compiles 25 named adult women from the current House / Iron Guard / Red Claw operational circle and returns structured dossiers for panel 17.

The dossier schema projects 15 existing card fields:

`LOOK`, `BODY`, `VOICE`, `TELLS`, `IN CRISIS`, `HANDLE`, `WANTS`, `FEARS`, `DAY`, `NEVER`, `SAMPLE LINES`, `SECRET`, `KNOWS`, `RELATIONS`, and `HOOKS`.

Current coverage from the CP8 compiled cards:

- 25 profiles total; all 25 rostered people are 18 or older.
- 17 profiles have all 15 fields present.
- 8 profiles are partial.
- 19 profiles have a `BODY` field, used for non-sexual posture/movement description.
- `BODY` remains UNKNOWN for Dagmar Red, Adelheid von Moren, Vera Grotsen, Elara Red, Wilhelmina Red and Hanne Brauer.
- Ilse Wern and Leni Bauer have BODY, but each is missing `IN CRISIS`, `HANDLE`, `DAY`, `SAMPLE LINES`, `KNOWS` and `RELATIONS`.

Canon distinctions retained:

- Exactly three official wives: Dagmar Red, Adelheid von Moren and Vera Grotsen.
- Elara Red remains the former partner and Iron Guard commander, not a fourth wife.
- Four permanent Iron Guard character cards are present although Canon states five permanent women; the fifth remains UNKNOWN.
- Five named household attendants are present.
- The full V4.1 master manuscript and V4.5 update prompt are absent from CP8; therefore this round can complete/normalize only the 25 profiles relative to the compiled cards, not reconstruct the missing manuscript.

The roster includes House officials, Red Claw operatives, garrison stalkers, a medical assistant, a bound-labour worker and an extended dynastic relative where compiled cards exist. External faction envoys are excluded. Non-romantic roles (family elder, retired staff, dynastic relative) are conversation-only.

### 2. Persistent relationship workflow

- Added versioned `privateRelations` state to the game snapshot and persisted Zustand keys.
- Added safe normalization and defaults for legacy saves that do not yet contain this field.
- Added request types: private conversation, courtship, reconciliation and marriage proposal.
- Requests remain pending until a separate NPC outcome is recorded.
- The NPC's response is not inferred from player rank, marriage, previous relationship, silence, employment, military service, gifts or dependency.
- Decline and withdrawal close a request without punishment or relationship change.
- Acceptance requires specific evidence of freely expressed agreement and a record that refusal carried no penalty.
- For staff/command/dependency relationships, acceptance also requires a separately documented independent reporting route and anti-retaliation safeguards. The relationship opens a conflict-of-interest review; it does not remove those safeguards.
- Acceptance of courtship/reconciliation changes status only to `courtship`; acceptance of a proposal changes it only to `engagement-pending`.
- Added a separate marriage-finalization operation. It requires the prior engagement, current mutual adult-consent evidence and a ceremony/legal-register reference. It changes status to `married` but does not automatically publish the marriage.
- Household/public visibility is a separate evidence-backed action. Knowledge cannot be silently rolled back.

### 3. Boundaries, reputation and consequences

- A documented boundary breach cancels the affected person's pending requests and creates a persistent review record.
- The relevant audience reputation slices are adjusted by the existing store integration; no blanket population awareness is generated.
- Dynastic consequences can be acknowledged or resolved only with a written resolution note. Original event history remains in the Event Ledger.
- Consequences are review prompts, not automatic scandal, punishment, family acceptance, faction response or succession rulings.

### 4. Pregnancy and succession evidence

- AL may create an unverified suspicion only, and must supply an in-world source.
- Confirmed, public, monitored, completed and loss statuses require a separate owner-facing medical verification record.
- A completed pregnancy additionally requires a separately existing child/birth record.
- Pregnancy never infers father, conception cause, child, parentage, legitimacy, heirship or succession.
- Medical privacy, relationship disclosure, parentage, recognition and succession remain separate state questions.

### 5. Event Ledger, AL and UI

- Panel 17 now contains Private Relations & Dynastic controls and 25 expandable Canon dossiers.
- Store actions write relationship requests/outcomes, marriage, disclosures, boundary incidents, medical updates and dynastic reviews to the Event Ledger/Chronicle where applicable.
- AL prompt rules and strict Delta schema now understand existing pending responses, boundary breaches, household/public disclosures and suspicion-only pregnancy updates.
- AL compact state includes the bounded roster, Canon coverage/gaps, current relationship state, request history, unresolved consequences and active pregnancy records.
- The event ledger keeps relationship request/outcome events at player knowledge until a separate supported disclosure advances visibility. This prevents an accepted private request from automatically becoming household news.

## Files changed

Modified existing files:

- `src/components/game/V45PanelBody.tsx`
- `src/lib/game/delta.ts`
- `src/lib/game/play.ts`
- `src/lib/game/retrieve.ts`
- `src/lib/game/save-validation.mjs`
- `src/lib/game/store.ts`
- `src/lib/game/types.ts`
- `scripts/save-validation.test.mjs`
- `STAGE47_REPAIR_ROADMAP_2026-11-09.md`

Added:

- `src/lib/game/sim/private-relations.ts`
- `scripts/private-relations.test.mjs`
- `STAGE47_PRIVATE_RELATIONS_ROUND1_REPORT_2026-11-09.md`
- `STAGE47_PRIVATE_RELATIONS_ROUND1_HANDOFF_2026-11-09.md`
- `WORKLOG-55.md`
- `STAGE47_PRIVATE_RELATIONS_ROUND1_EVIDENCE_2026-11-09.json`
- `STAGE47_PRIVATE_RELATIONS_ROUND1_FILE_INVENTORY_2026-11-09.csv`

## Verification

| Check | Result |
|---|---:|
| Private Relations targeted tests | 15/15 PASS |
| Save validation tests | 18/18 PASS |
| Runnable repository script suite, excluding `scripts/game.test.mjs` | 421/424 PASS; 3 known environment failures |
| Canon verifier | PASS — 65 panels, 167 registered assets, catalog invariants |
| Changed TS/TSX syntax transpile | 7/7 PASS; zero syntax diagnostics |
| MJS syntax check | 89/89 PASS |
| `npm run typecheck` | BLOCKED — missing `@types/node` and `vite/client` |
| `npm run build` | BLOCKED — Vite executable absent (`spawn vite ENOENT`) |
| `scripts/game.test.mjs` | NOT RUN — Zod is absent, so the suite cannot load |
| Browser QA / real Zustand UI runtime | NOT RUN |
| Neon/PostgreSQL, Better Auth/OAuth, live AL provider, production | NOT RUN |
| Art verifier | FAIL — base project has 167 registered assets, 0 generated raster assets, and multiple incomplete art groups; this round did not create visual assets |

The three script-suite failures are the `with-app-env` tests that expect `.grok/app-env.json` to contain `VITE_AUTH_ENABLED=true`. That local-only file is intentionally excluded from the checkpoint. It was not recreated or packaged. The other 421 runnable script tests passed.

Syntax transpilation is not a full semantic TypeScript check. Full typecheck/build and browser/provider verification remain outstanding. No dependencies were installed or tests weakened to obtain a pass.

## Decision

The Private Relations & Dynastic source workflow is implemented and has focused unit/save tests. It is **not yet browser- or production-verified**. The 25 dossiers are structured from the compiled cards, but not complete relative to the absent V4.1 master manuscript or missing card fields. Gate 2 remains independently PARTIAL; this round does not close Gate 2 or mark the game release-ready.
