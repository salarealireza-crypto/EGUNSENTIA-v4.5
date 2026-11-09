# WORKLOG-57 — Stage 47 Private Relations Hardening Round 1 (Partial)

Date: 2026-11-09

- Used the Round 0 audit checkpoint as the immutable parent and worked only in `EGUNSENTIA_ROUND1_WORKING_COPY`.
- Audited existing CP9 Private Relations paths rather than replacing them: normalization, request/response transitions, consent/power safeguards, marriage finalization, disclosure, boundary records, pregnancy evidence, Store, Delta, Event Ledger, Save, AL projection and Panel 17.
- Fixed stale/forged proposal acceptance and final marriage validation; marriage now requires a retained accepted marriage-proposal record, active engagement, eligible adult Canon profile, current mutual-consent evidence and valid ceremony/registration evidence.
- Preserved existing visibility knowledge during ordinary conversations and normalization; conversations do not rewrite the spouse's status/disclosure.
- Replaced request IDs based on bounded array length with UUIDs and retained the accepted proposal record while an engagement is active under the 100-row cap.
- Made repeated identical boundary incidents idempotent across simulation, Store and Delta; passed the source evidence into Event Ledger.
- Blocked Canon boundary, disclosure and pregnancy events for proposed/unresolved dossiers. Preserved the existing neutral-conversation-only behavior for proposed Red Claw dossiers; no romantic status, consent, reconciliation or Canon history is inferred.
- Made pregnancy-state transitions monotonic; a completed state requires a specific ChildSlot linked to the active pregnancy ID, same mother, and an in-range absolute birth day. Added optional startedDay/childRecordId/pregnancyId fields without fabricating legacy dates.
- Hardened malformed Save normalization and deduplicated request/consequence IDs.
- Passed sourceStatus/historyDisposition to AL compact state and corrected the AL instruction to distinguish 25 Canon adult profiles from 12 PROPOSED_EXPANSION dossiers.
- Updated Panel 17 to link only an eligible child record for a completed pregnancy and to disable marriage/disclosure/boundary/medical controls for non-Canon profiles.
- Changed files: `src/lib/game/sim/private-relations.ts`, `src/lib/game/types.ts`, `src/lib/game/store.ts`, `src/lib/game/delta.ts`, `src/lib/game/play.ts`, `src/lib/game/retrieve.ts`, `src/components/game/V45PanelBody.tsx`, `scripts/private-relations.test.mjs`.
- Verification: Private Relations + Save tests 39/39 PASS; all script tests 437/441 (one suite load failure for missing `zod`, three local app-env failures); Canon PASS; Red Claw PASS with chronology/genealogy warnings; 7/7 TS/TSX syntax transpilation and changed MJS syntax PASS.
- `npm run typecheck` blocked by missing `@types/node` and `vite/client`; `npm run build` blocked by missing Vite; `npm run lint` blocked because ESLint is not installed. No dependency install or lockfile change was made.
- No real database transaction/reload or browser workflow was run. No new Canon, child, parent, pregnancy outcome or heir was created.
- A4 remains incomplete because the project has no authoritative child/birth record creation pathway; this is documented as a blocker rather than solved by inventing data.
- Full report, evidence, handoff, inventory and SHA-256 manifest are in this checkpoint. Gate 2 and Workstream A remain PARTIAL.
