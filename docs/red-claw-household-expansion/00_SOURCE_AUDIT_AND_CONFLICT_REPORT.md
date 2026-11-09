# EGUNSENTIA CP9 — Source Audit & Canon Conflict Report

**Audit target:** `EGUNSENTIA-STAGE47-PRIVATE-RELATIONS-ROUND1-CP9-2026-11-09.zip`  
**Audit baseline:** CP9, supplied archive; current in-game date 20 Ironmonth 105 AW, 07:00.  
**Archive integrity:** ZIP central-directory and payload integrity test passed; extraction completed (640 files, approximately 12 MB uncompressed).  
**Status:** PASS for archive integrity and core Canon verifier; BLOCKED for authoritative full-source completeness and full build/browser QA.

## 1. Source map

| Source | Use / authority | Finding |
|---|---|---|
| `src/lib/canon/cards.json` | Compiled character cards | 55 character cards; core identities and behavioural rules. |
| `src/lib/canon/atlas.json` | Entity-level Canon | 26 atlas entries; Christian IV, family and faction anchor records. |
| `src/lib/canon/excerpts.json` | Extracted authority, timeline, kinship, household, and safety rules | Main source for household invariants and panel references. |
| `src/lib/canon/seeds.json` | Event seeds | 40 seeds; no pre-authored Red Claw family event chain matching this whole project. |
| `src/lib/game/v41-data.ts` | Day-one state and existing family records | Current household and children are already represented. |
| `src/lib/game/sim/private-relations.ts` | Private Relations roster, state defaults, projection and consent checks | Existing adult-only and consent validation architecture; 25 original women, now extended with 12 read-only proposals. |
| `src/lib/game/types.ts`, `store.ts`, `delta.ts`, `retrieve.ts`, `play.ts`, `time.ts`, `kernel.ts` | Runtime state, persistence, deltas, retrieval, simulation and CAST | Existing integration points; no duplicate save schema introduced. |
| `src/components/game/V45PanelBody.tsx` | Existing panel body | Panel 17 was extended rather than creating a duplicate panel identity. |
| `src/components/game/CastPanel.tsx` | Cast display | Provenance and tier flags added. |
| `.grok/`, `docs/`, `scripts/` | Worklogs, prompts, tests, verification | Cross-checked against actual code; reports are not treated as source authority. |
| `attachments/EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` | Expected complete lore manuscript | 331-byte anchor note only; it states 960 ready + 40 repair, population 60k, and 15 + 27 = 42 tunnel accounting. It is not the full manuscript. |
| V4.5 update prompt | Expected implementation prompt | Not present in the supplied CP9 archive. |

## 2. Canon-confirmed anchors preserved

- Player: **Christian Red IV**, age 35, the Fist; his agency is never assigned to the AI.
- Father: **Christian Red III**; identity and fatherhood are confirmed, but exact birth/death dates and a full dossier are not supplied.
- Biological mother: **Katharina Red**, deceased; detailed dates and profile are not established in the audited cards.
- Stepmother: **Mirelda Grotsen**, House Grotsen origin; she helped raise Christian IV after Katharina's death. Her exact genealogy and personal biography are incomplete.
- Official wives: exactly **three** — Dagmar Red (first), Adelheid von Moren (second), Vera Grotsen (third). No fourth official wife is created.
- Dagmar is mother of Konrad (15) and Liese (11); Adelheid is mother of Emil (3).
- **Elara Red** is a former partner, Iron Guard commander, and mother of Luka; she is not a wife.
- **Luka Vahl** is Christian IV's acknowledged son, age 18, and has no succession title.
- Wilhelmina Red is Christian IV's maternal grandmother (Katharina's mother).
- Household attendants: Jana, Mila, Alena, Bettina and Katya. They are not the Iron Guard.
- Elara commands five subordinate Iron Guard women; four are individually named in supplied cards, the fifth remains UNKNOWN. Elara is the commander, not a fifth subordinate.
- Current campaign date is 20 Ironmonth 105 AW, 07:00. Floor 6 — the Dome — is the current residence anchor; Floor 7's Family Ledger beside the Relic Cabinet is the kinship-register anchor.

## 3. Conflicts, gaps and hard stops

| Topic | Audit result | Resolution in this update |
|---|---|---|
| Missing full V4.1 manuscript / V4.5 prompt | Missing; anchor file is not enough to validate every historical claim. | State source limitation; do not invent missing authoritative passages. |
| Historical father dates | Not found in CP9. | Candidate 40–98 AW dates are clearly PROPOSED, not canonical. |
| Mirelda's exact Grotsen lineage | Origin confirmed; parents/branch absent. | Leave parents UNKNOWN; do not assign a canonical branch. |
| Half-sister's identity and dates | Intended relationship/departure specified by task; not present in CP9 family cards. | Helena Red-Grotsen is a proposed identity, dates and biography, never mislabeled Canon. |
| Father's historical staff | The brief fixes three men and five women; their identities are not in the supplied authoritative cards. | Eight distinct historical personnel proposed in a separate archive-only record. |
| Twelve former adult partners | Not in CP9. | Twelve individually differentiated proposed histories; non-graphic, read-only, no present romantic eligibility, no pregnancy or child by Christian. |
| First marriage timing | Dagmar is canonically first wife; exact wedding date not found. | No replacement wife and no exact marriage date invented. Proposed histories end by 15 Endmonth 89 AW; marriage date remains UNKNOWN pending Konrad/Dagmar chronology. |
| Elara / Luka age chronology | CP9 records Christian 35, Elara 34, Luka 18 and parentage. Exact DOBs/events are absent. | Flag possible under-18 parent chronology; no intimate past dates or adult-at-time claim. Preserve parentage and current command role. |
| Genealogical degrees | Floor 7 ledger is referenced but not supplied as a full, searchable, sealed genealogy. | No certification that proposed spouses pass the five-degree close-kin check. Approval gate remains blocked. |
| Residential-floor census | No room-by-room roster or full service/personnel census in CP9. | Publish only the derivable 100-card roster census; do not call it the total floor census. |
| Household locations | Floor 6 Dome and Floor 7 ledger are confirmed; complete room adjacency is not. | Add conceptual zones, not false coordinates or confirmed rooms. |

### Elara chronology note

The age combination (Christian 35, Elara 34, Luka 18) does not by itself prove the parents were minors; exact birthdays and date arithmetic could alter the result. It does, however, make adult-at-the-time status **unverified**. The project therefore prohibits reconstructing or dating the earlier intimate relationship until authoritative dates resolve it. The existing acknowledged parentage of Luka remains intact.

## 4. New data provenance model

- `CANON`: directly supported by supplied CP9 cards or excerpts.
- `CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY`: identity/status confirmed, detailed profile or dates proposed.
- `CANON_RECORD_WITH_UNRESOLVED_GENEALOGY`: existing identity retained; branch/parent relations not guessed.
- `PROPOSED_EXPANSION`: new character or story detail requested or generated for this update, awaiting canon approval.
- `UNKNOWN`: not assigned a value when the source does not support one.

The canonical cards and existing Save data are not overwritten by proposed lore. Proposed cards have explicit provenance labels in the registry, Cast and panel views.

## 5. Gate decision

**PASS:** archive integrity, source extraction, original Canon verifier, focused PR/save regression suite, structural 100-card roster validation.  
**CONDITIONAL:** CAST and Panel 17 integration uses proposed labels and does not create persistent event outcomes.  
**BLOCKED:** full kinship approval, exact father/stepmother/half-sister marriage and birth chronology, full floor census and room plan, full event persistence, household stock accounting, complete build/typecheck and browser QA.

No new lore in this update should be promoted from PROPOSED to CANON until the missing genealogy, exact dates, and authority source are reviewed.
