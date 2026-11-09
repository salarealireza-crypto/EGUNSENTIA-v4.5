import rawHousehold from "@/lib/canon/red-claw-household.json";

export type HouseholdTier = "A" | "B" | "C";
export type HouseholdSourceStatus =
  | "CANON"
  | "CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY"
  | "CANON_RECORD_WITH_UNRESOLVED_GENEALOGY"
  | "PROPOSED_EXPANSION";

export interface RedClawCharacterCard {
  id: string;
  name: string;
  ageYears: number | null;
  ageLabel: string;
  birthDate: string;
  gender: string;
  familyBranch: string;
  generation: string;
  parents: string[];
  siblings: string[];
  spouseIds: string[];
  childIds: string[];
  status: string;
  residenceStatus: string;
  currentLocation: string;
  occupation: string;
  appearance: string;
  voice: string;
  temperament: string;
  habits: string;
  ambitions: string;
  fears: string;
  education: string;
  dailyRoutine: string;
  attitudeToPlayer: string;
  relationships: string;
  knowledgeBoundaries: string;
  eventHooks: string[];
  interactionCategories: string[];
  sourceStatus: HouseholdSourceStatus;
  sourceEvidence: string;
  timelineNotes: string;
  tier: HouseholdTier;
  castActive: boolean;
  castDay: string;
  privateProfile?: {
    bodyMovement: string;
    crisisResponse: string;
    interactionStyle: string;
    boundaries: string;
    dialogueSamples: string;
    secrets: string;
    knownInformation: string;
  };
  historicalRelationship?: {
    partnerId: string;
    startDate: string;
    endDate: string;
    ageAtStart: number;
    adultAtEveryRecordedPoint: boolean;
    relationshipAgeVerifiedAgainstCanonicalDOB: boolean;
    status: string;
    disposition: string;
    pregnancyByChristian: boolean;
    childrenByChristian: string[];
    currentReconciliationInterest: string;
    currentRelationshipEligibility: boolean;
    currentSpouseId: string;
    firstFormalMarriageCandidateDate: string;
  };
  currentSpouseId?: string;
  spouseAttitude?: string;
  currentFamilyPriorities?: string;
  spouseOfFormerPartner?: string;
  knowledgeOfPartnerHistory?: boolean;
  kinshipAudit?: string;
  adultRelationshipSystems?: string;
  parentageEvidence?: string;
}

export interface RedClawHouseholdData {
  schemaVersion: number;
  campaignDate: { day: number; month: string; year: number; worldDate: string };
  statusLegend: Record<string, string>;
  canonRules: string[];
  historicalDateProposals: Record<string, string>;
  cards: RedClawCharacterCard[];
  counts: Record<string, number>;
}

export const RED_CLAW_HOUSEHOLD = rawHousehold as unknown as RedClawHouseholdData;
export const RED_CLAW_FAMILY_CARDS = RED_CLAW_HOUSEHOLD.cards;
export const RED_CLAW_CAST_CARDS = RED_CLAW_FAMILY_CARDS.filter((card) => card.castActive);

export function getRedClawHouseholdCensus() {
  const cards = RED_CLAW_FAMILY_CARDS;
  const localResidents = cards.filter((card) => card.residenceStatus === "permanent");
  const activeCast = cards.filter((card) => card.castActive);
  const byTier = {
    A: cards.filter((card) => card.tier === "A").length,
    B: cards.filter((card) => card.tier === "B").length,
    C: cards.filter((card) => card.tier === "C").length,
  };
  const bySource = Object.fromEntries(
    [...new Set(cards.map((card) => card.sourceStatus))].map((status) => [
      status,
      cards.filter((card) => card.sourceStatus === status).length,
    ]),
  );
  return {
    totalCards: cards.length,
    tiers: byTier,
    sourceStatus: bySource,
    proposedPermanentFamilyResidents: localResidents.length,
    activeCastEntries: activeCast.length,
    deceased: cards.filter((card) => card.status === "deceased").length,
    departed: cards.filter((card) => card.residenceStatus === "departed").length,
    minors: cards.filter((card) => card.ageYears !== null && card.ageYears < 18).length,
    formerAdultPartners: cards.filter((card) => Boolean(card.historicalRelationship)).length,
  };
}

/** Structural checks are deliberately separate from sealed-ledger kinship approval. */
export function validateRedClawHouseholdRoster() {
  const cards = RED_CLAW_FAMILY_CARDS;
  const issues: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  const byId = new Map(cards.map((card) => [card.id, card]));

  if (cards.length !== 100) issues.push(`Expected 100 character cards; found ${cards.length}.`);
  for (const card of cards) {
    if (!card.id.trim()) issues.push("A card has an empty ID.");
    if (ids.has(card.id)) issues.push(`Duplicate character ID: ${card.id}.`);
    ids.add(card.id);
    const folded = card.name.trim().toLocaleLowerCase("en-GB");
    if (!folded) issues.push(`Card ${card.id} has an empty name.`);
    if (names.has(folded)) issues.push(`Duplicate canonical display name: ${card.name}.`);
    names.add(folded);
    if (!(["A", "B", "C"] as string[]).includes(card.tier)) issues.push(`Invalid tier for ${card.id}.`);
    if (card.ageYears !== null && (!Number.isInteger(card.ageYears) || card.ageYears < 0 || card.ageYears > 120)) {
      issues.push(`Invalid age for ${card.id}: ${card.ageYears}.`);
    }
    for (const key of ["parents", "siblings", "spouseIds", "childIds"] as const) {
      for (const ref of card[key] ?? []) if (!byId.has(ref)) issues.push(`${card.id} has unresolved ${key} reference ${ref}.`);
    }
  }

  const tierCounts = {
    A: cards.filter((card) => card.tier === "A").length,
    B: cards.filter((card) => card.tier === "B").length,
    C: cards.filter((card) => card.tier === "C").length,
  };
  if (tierCounts.A !== 20 || tierCounts.B !== 30 || tierCounts.C !== 50) {
    issues.push(`Tier distribution mismatch: A=${tierCounts.A}, B=${tierCounts.B}, C=${tierCounts.C}.`);
  }

  for (const parent of cards) {
    for (const childId of parent.childIds) {
      const child = byId.get(childId);
      if (child && !child.parents.includes(parent.id)) issues.push(`Parent/child links are not reciprocal: ${parent.id} → ${childId}.`);
    }
    for (const spouseId of parent.spouseIds) {
      const spouse = byId.get(spouseId);
      if (spouse && !spouse.spouseIds.includes(parent.id)) issues.push(`Spouse links are not reciprocal: ${parent.id} ↔ ${spouseId}.`);
    }
  }

  const partners = cards.filter((card) => card.historicalRelationship);
  if (partners.length !== 12) issues.push(`Expected 12 former adult partners; found ${partners.length}.`);
  for (const partner of partners) {
    const history = partner.historicalRelationship!;
    if (partner.ageYears === null || partner.ageYears < 18) issues.push(`${partner.name} is not an adult at the current campaign date.`);
    if (history.ageAtStart < 18 || !history.adultAtEveryRecordedPoint) issues.push(`${partner.name} has an underage/unchecked historical relationship age.`);
    if (history.pregnancyByChristian || history.childrenByChristian.length) issues.push(`${partner.name} has a prohibited pregnancy/child attribution to Christian.`);
    if (history.currentRelationshipEligibility) issues.push(`${partner.name} is incorrectly romantically eligible despite a current spouse.`);
    if (!partner.currentSpouseId || !byId.has(partner.currentSpouseId)) issues.push(`${partner.name} lacks a valid current spouse reference.`);
    if (!partner.childIds.length) issues.push(`${partner.name} lacks proposed children with the current spouse.`);
    if (!history.relationshipAgeVerifiedAgainstCanonicalDOB) warnings.push(`${partner.name}: relationship age is valid under proposed dates but not verified against a canonical birth date.`);
    if (partner.kinshipAudit) warnings.push(`${partner.name}: ${partner.kinshipAudit}`);
  }

  if (cards.some((card) => card.ageYears !== null && card.ageYears < 18 && card.historicalRelationship)) {
    issues.push("A minor appears in the former-partner history set.");
  }
  warnings.push("The sealed Floor 7 genealogy ledger was not supplied in a complete searchable form; spouse degrees-of-kinship are not certified.");
  warnings.push("Elara/Luka/Christian parent-age chronology requires exact canonical birth dates; no romantic-history age is certified for that relationship.");

  return { ok: issues.length === 0, issues, warnings, tierCounts };
}
