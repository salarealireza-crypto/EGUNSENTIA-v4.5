# Red Claw Household Expansion — CP9 Round

This folder accompanies the CP9 source modifications. It documents the audit, provenance, proposed family lore, historical household, 100-card roster, world model, household service contracts, integration and validation limits.

## Source of truth

- `../../src/lib/canon/red-claw-household.json` — structured 100-card registry.
- `../../src/lib/canon/red-claw-historical-household.json` — father-generation historical household and eight proposed historical personnel.
- `../../src/lib/game/sim/red-claw-household.ts` — runtime types, census and structural validator.

All proposal-only material is explicitly tagged. CP9 Canon identities and relationships are preserved and are not silently overwritten.

## Reading order

1. `00_SOURCE_AUDIT_AND_CONFLICT_REPORT.md`
2. `01_HISTORICAL_HOUSEHOLD.md`
3. `02_MIRELDA_GROTSEN_DOSSIER.md`
4. `03_HALFSISTER_HELENA_DOSSIER.md`
5. `04_TWELVE_FORMER_PARTNERS.md`
6. `05_ELARA_HISTORICAL_AND_RELATIONSHIP_INTEGRATION.md`
7. `06_NPC_ROSTER_AND_FAMILY_TREE.md`
8. `07_HISTORICAL_AND_CURRENT_FAMILY_TIMELINE.md`
9. `08_RESIDENTIAL_FLOOR_WORLD_MODEL.md`
10. `09_CENSUS_AND_RESIDENCE.md`
11. `10_HOUSEHOLD_SERVICES_SPEC.md`
12. `11_PRIVATE_RELATIONS_DYNASTIC_INTEGRATION.md`
13. `12_GAMEPLAY_AND_PANEL_INTEGRATION.md`
14. `13_CONSISTENCY_AND_TEST_REPORT.md`
15. `14_ROADMAP_WORKLOG_HANDOFF.md`
16. `15_FILE_INVENTORY_SUMMARY.md` and `15_FILE_INVENTORY.csv`

## Completion status

This staged CP9 extension delivers the canon audit, proposed lore/data, roster validation, partial CAST and Panel 17 integration, and Private Relations read-only history integration. Final focused tests pass 25/25; the project-wide suite passes 431/435 with four environment/dependency blockers. It does **not** deliver the complete residential-floor simulation, persistent household event chains, full census, full inventory/medical/education systems, production build or browser QA. See audit and handoff documents before promotion or merge.
