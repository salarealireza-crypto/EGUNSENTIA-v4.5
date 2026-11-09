# Complete Project File Inventory

- Supplied CP9 baseline: **640 files**
- Updated project archive: **670 files** (including this summary and the CSV manifest)
- New files compared with CP9: **30**
- Modified files compared with CP9: **8**
- Removed CP9 files: **0**

The companion `15_FILE_INVENTORY.csv` records relative path, byte size, SHA-256 and change status for every project file **except the CSV manifest itself** (a file cannot contain its own stable digest). No original CP9 files were removed. The inventory includes source, assets, project metadata, documentation and test evidence; dependency folders are not bundled.

## Files changed from CP9

- `package.json`
- `scripts/private-relations.test.mjs`
- `src/components/game/CastPanel.tsx`
- `src/components/game/V45PanelBody.tsx`
- `src/lib/game/kernel.ts`
- `src/lib/game/sim/npc.ts`
- `src/lib/game/sim/private-relations.ts`
- `src/lib/game/types.ts`

## New files

- `docs/red-claw-household-expansion/00_SOURCE_AUDIT_AND_CONFLICT_REPORT.md`
- `docs/red-claw-household-expansion/01_HISTORICAL_HOUSEHOLD.md`
- `docs/red-claw-household-expansion/02_MIRELDA_GROTSEN_DOSSIER.md`
- `docs/red-claw-household-expansion/03_HALFSISTER_HELENA_DOSSIER.md`
- `docs/red-claw-household-expansion/04A_FIRST_FORMAL_MARRIAGE_TURNING_POINT.md`
- `docs/red-claw-household-expansion/04_TWELVE_FORMER_PARTNERS.md`
- `docs/red-claw-household-expansion/05_ELARA_HISTORICAL_AND_RELATIONSHIP_INTEGRATION.md`
- `docs/red-claw-household-expansion/06_NPC_ROSTER_AND_FAMILY_TREE.md`
- `docs/red-claw-household-expansion/07_HISTORICAL_AND_CURRENT_FAMILY_TIMELINE.md`
- `docs/red-claw-household-expansion/08_RESIDENTIAL_FLOOR_WORLD_MODEL.md`
- `docs/red-claw-household-expansion/09_CENSUS_AND_RESIDENCE.md`
- `docs/red-claw-household-expansion/10_HOUSEHOLD_SERVICES_SPEC.md`
- `docs/red-claw-household-expansion/11_PRIVATE_RELATIONS_DYNASTIC_INTEGRATION.md`
- `docs/red-claw-household-expansion/12_GAMEPLAY_AND_PANEL_INTEGRATION.md`
- `docs/red-claw-household-expansion/13_CONSISTENCY_AND_TEST_REPORT.md`
- `docs/red-claw-household-expansion/14_ROADMAP_WORKLOG_HANDOFF.md`
- `docs/red-claw-household-expansion/15_FILE_INVENTORY.csv`
- `docs/red-claw-household-expansion/README.md`
- `docs/red-claw-household-expansion/test-evidence/build.log`
- `docs/red-claw-household-expansion/test-evidence/canon-verifier.log`
- `docs/red-claw-household-expansion/test-evidence/focused-tests.log`
- `docs/red-claw-household-expansion/test-evidence/full-npm-test.log`
- `docs/red-claw-household-expansion/test-evidence/red-claw-verifier.log`
- `docs/red-claw-household-expansion/test-evidence/typecheck.log`
- `scripts/red-claw-household.test.mjs`
- `scripts/verify-red-claw-household.mjs`
- `src/lib/canon/red-claw-historical-household.json`
- `src/lib/canon/red-claw-household.json`
- `src/lib/game/sim/red-claw-household.ts`
