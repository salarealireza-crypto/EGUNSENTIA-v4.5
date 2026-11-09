# Private Relations & Dynastic Integration Report

## Existing architecture retained

The existing engine's state types, event/evidence model, store persistence, interaction request and validation layers remain the source of truth. The existing adult-only/consent validation is retained; no second independent relationship engine is introduced. The original 25 CP9 profiles remain present and twelve proposed read-only former-partner profiles are appended, bringing the displayed roster to 37.

## New profiles

Each of the twelve proposed women is represented with `category=former-partner`, `status=former-partner`, `relationshipEligible=false`, `powerReviewRequired=false`, `sourceStatus=PROPOSED_EXPANSION`, and a current spouse/children summary. The profile is historical and informational; it does not provide a route to resume the relationship. Ordinary conversation can remain available subject to engine validation. The three Canon wives remain the only official wives. Elara remains a separate Canon former partner and commander, not part of the twelve.

## Relationship, knowledge and evidence rules

- Historical relationship status never establishes current affection, consent, loyalty or willingness.
- The twelve records do not create pregnancy, child or parentage events. Each explicitly records `pregnancyByChristian=false` and an empty `childrenByChristian` list.
- Current children are assigned only to their proposed current spouses in the proposed branch records.
- Visibility (`public`, `known`, `private`) is not identical to what a particular NPC knows. A spouse's knowledge is recorded separately and can be unknown.
- Secrets are kept sealed in the projection until a valid reveal/evidence event authorises disclosure.
- Rumours are not upgraded to confirmed evidence, and private medical/dynastic information is not automatically broadcast.
- Kinship and legal status cannot be confirmed from name/branch strings; Floor 7 Family Ledger review is a blocking gate for marriage, pregnancy parentage or succession transitions.
- Minors are not part of the private relationship roster. Any underage NPC remains blocked from adult relationship categories and mature scenes by engine rules.

## Elara and Luka

Elara's current-day relationship profile remains separate. Luka remains her son and Christian's acknowledged son with no succession title. There is no live pregnancy at day-one state; the seed pregnancy row is inactive. Past birth/parentage information comes from the established child/household facts, not an active pregnancy state. Exact dates and adult-at-the-time status remain unresolved; no historic intimate event is reconstructed.

## Persistency

The twelve read-only records are in the default Private Relations roster and old-save normalization path. Existing save-state keys remain unchanged; normalizing legacy state includes new proposed profile rows while preserving old state. The current 100-card registry is a lore/provenance registry and does not overwrite live affection, mood, relationship status or family Save fields.

## Not yet implemented

No new persistent pregnancy/birth/parentage/succession event handlers were added for the twelve proposed characters. Their profiles alone do not authorize any event. New evidence-backed family events, medical privacy gates, public-disclosure rules and genealogy approval workflow still require authored state-transition contracts and tests before use.
