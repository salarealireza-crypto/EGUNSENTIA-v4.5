# Household Services Specification

**Design status:** proposal and integration contract. Existing service staff and platform state remain authoritative; this document does not create new medicine, supplies, equipment, diagnoses or resource quantities.

## Medical and healthcare

**Proposed facility:** private treatment / consultation room with a separate waiting space and locked supply cabinet. Existing Canon recognizes Physician Sabine Lorenz and medical assistant Ruth; do not assume either has already been assigned to a permanent residential-floor clinic. Staff allocation, permissions and location must be explicitly configured.

Recommended record fields: `medicalRecordId`, patient ID, authoring clinician, date/time, source/evidence, consent and access scope, observation, confirmed finding, treatment, follow-up and status. Pregnancy suspicion is a separate evidentiary state from medical confirmation; confirmation requires a valid medical record. Birth/post-birth and injury records must be events with timestamps, responsible clinician and patient privacy scope. Do not invent medical outcomes. Medical data must not be visible to spouses, servants or faction leadership by default.

## Education and upbringing

Proposed study spaces support age-appropriate literacy, numeracy, history, Red Claw genealogy, factional/political history, correspondence, administration, crafts and supervised military foundations where appropriate. A tutor or instructor needs a role and schedule; do not silently give one NPC two simultaneous teaching/administrative shifts. Children’s learning records are not adult relationship data. Young-adult apprenticeships should be tied to an approved profession, instructor and opportunity.

## Food, kitchens and dining

Proposed chain: procurement request → supplier receipt → inspected store entry → kitchen issue → meal allocation → waste/spoilage log. Separate family dining from staff meal distribution without creating a status-based starvation mechanic. Meal quantities, rations and household budget must use the existing world economy/inventory system if it exposes suitable item IDs. Current CP9 contains macro-resource and logistics numbers, not a verified household pantry stock; do not translate the 60,000 world population or military supply inventory into domestic meals.

## Storage and inventory

Extend a single inventory source rather than creating a duplicate stock ledger. Required metadata: item ID, quantity, unit, location ID, owner/custodian, quality/expiry when applicable, reserved amount, issue/receipt event ID, access class and last reconciliation. Food, clothing, medical supplies, tools, furniture, records and valuables are distinct item categories. Military assets remain in military inventory unless an authorised household issue is recorded. No exact stock levels are asserted by this expansion.

## Domestic administration and labour

The household steward (proposed historical Arno Bittner; current steward assignment remains to be checked against Canon) owns duty rosters, leave, work orders, guest logistics and domestic accounts. Current attendants Jana, Mila, Alena, Bettina and Katya remain a five-person corps; the Iron Guard is a separate professional security organisation. Duties should have start/end time, location, supervisor, relief assignment and status. Prevent duplicate simultaneous assignments and respect rest/leave.

## Security and internal order

Professional Iron Guard chain: Elara commands five subordinate women; four subordinates are named in CP9, the fifth remains unknown. The commander is not counted among the five subordinate members. Household administration can request coverage but cannot issue military orders outside its authority. Core procedures: visitor registration, invitation check, route escort, role-based restricted access, incident report, emergency response and handover. Logs distinguish observed fact from suspicion or rumour. The proposed historical five-person detail has a separate roster file and is not active current personnel.

## Daily and social operations

The daily cadence (morning attendance, meals, lessons/work, administration, visits, evening family/social activity, night watch) is a schedule template. A schedule event must name a real NPC, valid location, start/end time and availability state; it must not conflict with current CAST or Planner assignments. Festivals, ceremonies, birthdays, weddings and funerals require a dated character/event reference and valid state transition.

## Unbuilt service dependencies

Room coordinates, capacity, staffing assignments, medicine catalogue, clinical inventory, lesson schedule, kitchen stock, household budget, supplier contracts, cleaning/laundry equipment and persistent work-order objects are not yet represented as complete floor-level runtime services. The proposal defines contracts; it does not claim these functions are already operational.
