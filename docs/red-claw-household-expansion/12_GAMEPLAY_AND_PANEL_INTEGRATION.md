# Gameplay and Panel Integration Report

## Implemented in this round

1. **Roster data contract:** new `src/lib/canon/red-claw-household.json` with exactly 100 unique family cards (20 Tier A, 30 Tier B, 50 Tier C), IDs, source status, family links, residence, roles, appearance, voice, behaviour, routines, knowledge boundaries and hooks.
2. **Historical record:** new `src/lib/canon/red-claw-historical-household.json` with the ten-person adult core specification, eight proposed household staff cards and historical zone model. Historical staff are deliberately not active CAST.
3. **Runtime registry:** `src/lib/game/sim/red-claw-household.ts` imports the roster, derives census values, and validates structural integrity and relationship references.
4. **CAST:** `src/lib/game/kernel.ts` extends the existing compiled CAST with active proposed/canon registry records not already present by name. Provenance, tier and residence state are retained; no duplicate names are appended. Proposed character schedules are carried in the existing `day` field.
5. **Place recognition:** `src/lib/game/sim/npc.ts` recognizes the proposed household location terms (nursery, dining/kitchen, residential/family, Grotsen Dominion). This is schedule-routing support, not creation of physical map nodes.
6. **Cast panel:** `src/components/game/CastPanel.tsx` displays provenance and tier labels for expansion NPCs.
7. **Existing Panel 17:** `src/components/game/V45PanelBody.tsx` extends the existing House & Kin panel with a read-only 100-card registry, aggregate counts, source status, relationships, hooks and the Private Relations roster. The old household/kin live state remains visible and is not overwritten.
8. **Private Relations:** `src/lib/game/sim/private-relations.ts` adds twelve proposed non-romantically-eligible histories to the existing 25-person profiles; default state and legacy normalization include them.
9. **Types:** `CastCard` optional provenance/tier/residence fields were added to `src/lib/game/types.ts`.
10. **Tests:** `scripts/red-claw-household.test.mjs` adds six roster/age/reference/relationship/census tests; the PR regression test has been updated to expect the extended roster.

## Existing systems intentionally not modified

Panel IDs and aliases, core save key structure, Event Ledger schema, event transition logic, Planner/Calendar data schema, pregnancy evidence logic, child registry and canonical three-wife structure remain unchanged. This is a staged integration, not a replacement.

## Existing integration coverage versus unfinished wiring

| System | State after round | Honest status |
|---|---|---|
| CAST / CastPanel | Roster entries and proposed `day` routines included | Partially integrated; schedule display/availability exists, but not all floor service events are scheduled. |
| Panel 17 House & Kin | 100-card browse view added | Integrated read-only registry; does not mutate family state. |
| Private Relations | +12 proposed read-only former histories | Integrated at profile/default/normalization level; no reactivation path. |
| Planner / Calendar | Not extended with recurring household schedule records | Not integrated yet. |
| Event system / Event Ledger / Day Replay | Hooks are data only; no new transition-producing events | Not integrated. |
| Messages / News / Evening Hall | No new message/event generation connected | Not integrated. |
| Personnel | CAST profile visibility only | No formal employment assignment/shift resource model added. |
| Inventory / kitchen / medical / education | Contract documentation only | Not runtime-connected. |
| Investigation Register | No automatic facts or leads injected | Not integrated. |
| Save/load | New roster is static code data; PR default/legacy state includes rows; old persisted keys remain | Focused legacy-save tests pass; full production migration and browser QA remain blocked. |
| AL prompt / validation | Existing prompt authority unchanged; proposed lore is provenance-tagged and displayed | No new AL trigger or event authority added; full prompt attachment is not supplied. |

## Player agency and persistence

Christian IV's actions, dialogue, feelings, consent and choices remain player-controlled. Registry data is not a command to fire a narrative event. Every future event must validate character ID, time, location, state transition, evidence and knowledge scope. A proposed card cannot by itself trigger a marriage, pregnancy, disclosure, death or succession change.
