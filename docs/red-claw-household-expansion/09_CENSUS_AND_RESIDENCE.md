# Red Claw Household Census and Residence Ledger

**Important:** this is a reproducible census of the 100-card registry, not a verified census of every person physically present on Floor 6.

## 1. Registry totals

| Measure | Count |
|---|---:|
| Character cards | 100 |
| Tier A / B / C | 20 / 30 / 50 |
| Canon-confirmed cards | 11 |
| Canon identity + proposed biography | 2 |
| Canon record with unresolved genealogy | 8 |
| Proposed expansion | 79 |
| Proposed permanent family-linked residents | 71 |
| Departed | 2 |
| Deceased | 2 |
| Duty-based presence | 1 |
| Not counted as resident | 24 |
| Under 18 (all registry records) | 27 |
| Historical former partners | 12 |

## 2. Full roster demographic breakdown

| Dimension | Count |
|---|---|
| Gender | Female 52; male 48 |
| Age bands | 0–17: 27, 18–25: 5, 26–40: 20, 41–60: 14, 61+: 32; unknown age: 2 |

Age values for proposed cards are proposals. The gender/age distribution is a property of this proposed 100-card roster, not a demographic claim about the authoritative Red Claw population.

## 3. Proposed permanent family-linked resident demographic

| Dimension | Count |
|---|---|
| Residence status permanent | 71 |
| Gender | Female 36; male 35 |
| Age bands | 0–17: 27, 18–25: 3, 26–40: 14, 41–60: 12, 61+: 15; unknown age: 0 |

The count includes 12 proposed former partners, their 12 spouses, 24 proposed children, 8 proposed parents and 6 proposed elders as well as Canon household relatives. It is a scenario population and only becomes an in-game census after the user approves each proposal, residence and effective date.

## 4. Historical snapshots

The historical household data describes a 10-person adult core plus the player as dependent (11 total) in the proposed 76–79 AW frame, then 12 named persons when Helena is added from proposed 80 AW. It excludes visitors and off-floor support. After Christian III's proposed death and Mirelda/Helena departure, the staff disposition is unknown; therefore no complete post-death count is issued.

## 5. Why this is not the full floor census

The 100-card roster deliberately includes 24 non-resident parent/elder records, two departed Grotsen family members, two deceased records, and one duty-based commander. It does not include a full set of attendants, all four named subordinate Guard members, medical and kitchen staff, all temporary visitors, guests, or staff dependants. Some of those people are already represented in separate CP9 cards and are not necessarily members of the Red Claw genealogy. Do not add or double-count them into this 100-card family roster.

## 6. Census formula

The programmatic `getRedClawHouseholdCensus()` derives counts from `RED_CLAW_FAMILY_CARDS`; it does not hardcode the report values. The validator rejects duplicate IDs/names and broken in-registry parent/child/spouse references. For actual occupancy, an authoritative presence ledger with from/to dates, role and location is still required.
