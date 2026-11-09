# EGUNSENTIA — Private Relations & Dynastic Round 1 Handoff

Date: 2026-11-09  
Checkpoint base: CP8 (immutable)  
Checkpoint output: CP9 private-relations round 1

## Current state

Use this checkpoint as the new working base for the next bounded Private Relations round. The CP8 archive and the extracted CP8 audit folder remain unchanged.

Implemented in this round:

1. 25 named adult woman dossiers projected from compiled Canon cards, with 15-field coverage and explicit UNKNOWN values.
2. Persistent versioned `privateRelations` state with backward-compatible legacy Save normalization.
3. NPC request/response workflow for conversation, courtship, reconciliation and marriage proposal.
4. Free-to-decline evidence and independent safeguards for staff/command dependency roles.
5. Separate engagement-to-marriage formalization requiring mutual consent and a ceremony/legal-register reference.
6. Relationship visibility changes only through evidence-backed household/public disclosure.
7. Boundary-breach reviews, request cancellation and audience-specific reputation impact.
8. Pregnancy suspicion versus medically verified statuses, plus child/birth record dependency.
9. Dynastic consequence review and Event Ledger / Chronicle wiring.
10. AL prompt, compact-state, Delta schema and Save validation integration.

## Canon limitations that must remain visible

- The full V4.1 master manuscript is not in CP8. The present `EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` is a short placeholder/reference note, not the complete manuscript.
- `EGUNSENTIA_V4.5_Update_Prompt.txt` is absent.
- Dagmar, Adelheid, Vera, Elara, Wilhelmina and Hanne have no BODY card field in CP8.
- Ilse and Leni each lack six behavioural/voice/relationship fields.
- Canon says five permanent Iron Guard women; only four permanent-member cards are present. Fifth member = UNKNOWN.
- No profile or history should be fabricated to close these gaps.

## Verification status

- 15/15 Private Relations tests PASS.
- 18/18 Save validation tests PASS.
- 421/424 runnable script tests PASS (excluding Zod-blocked `scripts/game.test.mjs`). Three `with-app-env` failures are caused by absent local-only `.grok/app-env.json`; do not package or invent that file.
- Canon verifier PASS.
- Seven changed TS/TSX modules pass syntax transpilation; this is not full typecheck.
- Full typecheck blocked by missing `@types/node` and `vite/client`.
- Build blocked because Vite is absent.
- Browser, database, auth, live AL provider and production verification NOT RUN.
- Art verifier remains FAIL on pre-existing art group gaps.

## Recommended next steps

1. Obtain the authoritative V4.1 master manuscript and V4.5 update prompt from the owner; audit their provenance and diff before extending any profile. Do not attempt to reconstruct them from compiled card extracts.
2. Fill only those dossier fields that the restored Canon source supports. Keep missing data UNKNOWN. Reconcile all named women, their roles, ages, relationship histories and five-member Iron Guard discrepancy.
3. Add an integration test for `applyDelta` and Save round-trip after the project dependencies (especially Zod) can be restored safely; verify request outcomes, marriage, visibility, boundary and suspected pregnancy survive save/reload.
4. Run the game in a browser and exercise panel 17 across mobile and desktop, including failed validation, accepted/declined requests, marriage flow, evidence gating and persistence after reload.
5. Decide whether separation/divorce, household scheduling and dynastic inheritance require additional explicit actions. Add them only against authoritative Canon/rules; do not auto-resolve heirs or parentage.
6. Continue Gate 2 independently. Its outstanding Political Capital semantics, persistence/UI integration, remaining NPC consistency and browser QA are not closed by this round.
7. Maintain private deployment, server-side AL credentials and existing security restrictions. No secret belongs in source, logs or the package.

## Important distinction

This is a source checkpoint, not a Browser-verified build or production release. The Private Relations feature is implemented at code and focused-test level; live runtime integrations remain unverified.
