# Roadmap, Worklog and Next-Stage Handoff

## Completed in this round

- CP9 ZIP verified and extracted; source map and canonical conflicts reviewed.
- Full lore manuscript gap documented; anchor note not mistaken for complete text.
- Canon family constraints preserved: three wives, Elara former partner/commander, Luka acknowledged without succession title, current children and attendants retained.
- 100-card Red Claw registry created: Tier A20/B30/C50.
- Twelve distinct proposed adult former-partner histories created; all adult under proposed dates, each has a current spouse and children, no pregnancy/child by Christian, current romantic eligibility disabled.
- Mirelda dossier and proposed daughter Helena dossier created.
- Historical father-generation household and eight proposed named personnel created as separate historical archive records.
- Floor world model, census definitions, service contracts, PR integration report, gameplay/panel report and handoff prepared.
- Existing CAST, CastPanel, Panel 17 House & Kin and Private Relations roster extended without creating a duplicate panel or save-key architecture.
- Structural and regression tests added/updated; final focused suite passes 25/25.
- Final Canon verifier passes; Red Claw verifier passes with explicit unverified-date and kinship warnings.
- Full suite reports 431/435 passing; the four blockers are missing `zod` (one test module) and three `.env`-dependent `VITE_AUTH_ENABLED` checks.
- Production build/typecheck and browser QA remain blocked by missing installed dependencies (`vite`, `@types/node`, `vite/client`).
- Complete file inventory and per-file hashes are included in `15_FILE_INVENTORY.csv`.

## Blocked before Canon promotion

1. Obtain the full V4.1 manuscript and V4.5 update prompt.
2. Obtain exact date and genealogy source for Christian III, Katharina, Mirelda and Helena.
3. Review Floor 7 sealed kinship ledger for every proposed spouse/branch, including the five-degree rule.
4. Reconcile exact DOB/event dates for Christian, Elara and Luka before any historical intimacy is described.
5. Verify Dagmar's wedding and Konrad's birth date before committing any first-marriage date.
6. Approve or reject all 79 PROPOSED_EXPANSION cards and proposed character details.
7. Confirm residence, capacity and room mapping for current family, 12 proposed branch families and historical locations.

## Next implementation round (ordered)

### Stage 1 — Canon gates
- Acquire authoritative genealogy and complete master lore.
- Resolve exact dates and kinship constraints.
- Confirm each proposed spouse and child relationship.
- Promote only explicitly approved records.

### Stage 2 — Presence and household operations
- Add a dated residence/presence ledger with entry/exit, temporary/absent/deceased states.
- Define real Floor 6 room IDs and access permissions.
- Formalise current attendants, medical staff, Iron Guard roster and kitchen/stores assignment without duplication.
- Derive a complete occupancy census from that ledger.

### Stage 3 — Service runtime
- Connect medical, education, kitchen, stock and maintenance service records to existing resource/inventory systems.
- Add validated schedule blocks with conflict detection and availability.
- Add guest and household administration procedures.

### Stage 4 — Persistent event integration
- Define event contracts for arrivals, departures, weddings, births, deaths, illnesses, ceremonies, staff changes and shortages.
- Require evidence, valid time/location, idempotency key, source, visibility and legal/relationship validation.
- Connect Event Ledger, Day Replay, Messages, Calendar and News only after these contracts pass.

### Stage 5 — Tests and production QA
- Test all state transitions, evidence/knowledge scopes and save/load compatibility.
- Run project build, typecheck and lint with complete dependencies.
- Browser QA all responsive states and panel navigation.
- After dependencies and canon gates are supplied, rerun production build/typecheck/browser QA; only then promote to CP10. This archive must remain labelled as a staged CP9 extension until that gate passes.

## Handoff cautions

Do not treat the static 100-card registry as a full occupancy database. Do not auto-trigger hooks. Do not grant title or succession rights to Helena or Luka. Do not add a fourth wife. Do not use the historical Iron Guard people as current staff. Do not expose private partner histories beyond each character's current knowledge. Do not present unknown facts as Canon.
