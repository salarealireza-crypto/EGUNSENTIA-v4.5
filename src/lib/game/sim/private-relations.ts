import { cardsJson } from "@/lib/canon/load";
import { RED_CLAW_FAMILY_CARDS } from "./red-claw-household.ts";
import type {
  ChildSlot,
  DynasticConsequence,
  EventLedgerEntry,
  PregnancyRecord,
  PrivateInteractionKind,
  PrivateInteractionRequest,
  PrivateRelationsState,
  PrivateRelationshipRecord,
  PrivateRequestOutcome,
  PrivateWomanCategory,
  ReputationSlice,
} from "../types";

const isCampaignTime = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const isCanonicalProfile = (profile: PlayerWomanCanonProfile | undefined): profile is PlayerWomanCanonProfile =>
  Boolean(profile && profile.ageYears >= 18 && profile.sourceStatus === "CANON");

function stableEvidenceHash(value: string): string {
  // FNV-1a is used only to derive a stable local event key, not for security.
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export interface PlayerWomanCanonProfile {
  id: string;
  name: string;
  ageYears: number;
  category: PrivateWomanCategory;
  role: string;
  relationshipStatus: PrivateRelationshipRecord["status"];
  relationshipEligible: boolean;
  powerReviewRequired: boolean;
  appearance: string;
  bodyMovement: string;
  voice: string;
  behaviour: string;
  wants: string;
  fears: string;
  routine: string;
  boundaries: string;
  dialogueSamples: string;
  secrets: string;
  knownInformation: string;
  relationships: string;
  hooks: string;
  source: string;
  coverage: { present: number; total: number; missing: string[] };
  completeness: "partial" | "substantial";
  sourceStatus?: string;
  historyDisposition?: string;
  currentSpouse?: string;
  currentChildren?: string[];
}

const WOMEN = [
  { id: "dagmar-red", card: "DAGMAR RED, 37", name: "Dagmar Red", age: 37, category: "official-wife", status: "married", eligible: false, power: false },
  { id: "adelheid-von-moren", card: "ADELHEID VON MOREN, 24", name: "Adelheid von Moren", age: 24, category: "official-wife", status: "married", eligible: false, power: false },
  { id: "vera-grotsen", card: "VERA GROTSEN, 19", name: "Vera Grotsen", age: 19, category: "official-wife", status: "married", eligible: false, power: false },
  { id: "elara-red", card: "ELARA RED, 34", name: "Elara Red", age: 34, category: "former-partner", status: "former-partner", eligible: true, power: true },
  { id: "sigrid-falk", card: "SIGRID FALK, 31", name: "Sigrid Falk", age: 31, category: "iron-guard", status: "unestablished", eligible: true, power: true },
  { id: "mira-voss", card: "MIRA VOSS, 29", name: "Mira Voss", age: 29, category: "iron-guard", status: "unestablished", eligible: true, power: true },
  { id: "anja-keller", card: "ANJA KELLER, 33", name: "Anja Keller", age: 33, category: "iron-guard", status: "unestablished", eligible: true, power: true },
  { id: "freja-dorn", card: "FREJA DORN, 28", name: "Freja Dorn", age: 28, category: "iron-guard", status: "unestablished", eligible: true, power: true },
  { id: "karin-voss", card: "CAPTAIN KARIN VOSS, 30", name: "Captain Karin Voss", age: 30, category: "reserve-officer", status: "unestablished", eligible: true, power: true },
  { id: "jana", card: "JANA, 22", name: "Jana", age: 22, category: "household-attendant", status: "unestablished", eligible: true, power: true },
  { id: "mila", card: "MILA, 20", name: "Mila", age: 20, category: "household-attendant", status: "unestablished", eligible: true, power: true },
  { id: "alena", card: "ALENA, 21", name: "Alena", age: 21, category: "household-attendant", status: "unestablished", eligible: true, power: true },
  { id: "bettina", card: "BETTINA, 25", name: "Bettina", age: 25, category: "household-attendant", status: "unestablished", eligible: true, power: true },
  { id: "katya", card: "KATYA, 27", name: "Katya", age: 27, category: "household-attendant", status: "unestablished", eligible: true, power: true },
  { id: "wilhelmina-red", card: "GRANDMOTHER WILHELMINA RED, 68", name: "Wilhelmina Red", age: 68, category: "family-elder", status: "unestablished", eligible: false, power: false },
  { id: "hanne-brauer", card: "HANNE BRAUER, 51", name: "Hanne Brauer", age: 51, category: "senior-household-staff", status: "unestablished", eligible: false, power: true },
  { id: "ilona-brandt", card: "STEWARD ILONA BRANDT, 45", name: "Steward Ilona Brandt", age: 45, category: "house-official", status: "unestablished", eligible: true, power: true },
  { id: "sabine-lorenz", card: "PHYSICIAN SABINE LORENZ, 42", name: "Physician Sabine Lorenz", age: 42, category: "house-official", status: "unestablished", eligible: true, power: true },
  { id: "ilka-red", card: "ILKA RED, 29", name: "Ilka Red", age: 29, category: "red-claw-operative", status: "unestablished", eligible: true, power: true },
  { id: "maren-red", card: "MAREN RED, 27", name: "Maren Red", age: 27, category: "red-claw-operative", status: "unestablished", eligible: true, power: true },
  { id: "ilse-wern", card: "STALKER ILSE WERN, 25", name: "Ilse Wern", age: 25, category: "garrison-stalker", status: "unestablished", eligible: true, power: true },
  { id: "leni-bauer", card: "STALKER LENI BAUER, 30", name: "Leni Bauer", age: 30, category: "garrison-stalker", status: "unestablished", eligible: true, power: true },
  { id: "ruth", card: "RUTH, 24", name: "Ruth", age: 24, category: "medical-assistant", status: "unestablished", eligible: true, power: true },
  { id: "lenka", card: "LENKA, 30", name: "Lenka", age: 30, category: "bound-worker", status: "unestablished", eligible: true, power: true },
  { id: "hedda-red", card: "HEDDA RED, 25", name: "Hedda Red", age: 25, category: "dynastic-relative", status: "unestablished", eligible: false, power: false },
  // Proposed, read-only historical partners. Current spouses and existing family lives disable romantic requests.
  { id: "rc-lenna-falkner", card: "LENNA FALKNER, 36", name: "Lenna Falkner", age: 36, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "public", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-mara-venn", card: "MARA VENN, 35", name: "Mara Venn", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "private", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-sanna-kroll", card: "SANNA KROLL, 35", name: "Sanna Kroll", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "known", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-rika-dorn", card: "RIKA DORN, 35", name: "Rika Dorn", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "public", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-ilva-brandt", card: "ILVA BRANDT, 36", name: "Ilva Brandt", age: 36, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "private", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-hilda-mertens", card: "HILDA MERTENS, 36", name: "Hilda Mertens", age: 36, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "known", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-freya-stahl", card: "FREYA STAHL, 35", name: "Freya Stahl", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "known", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-alrike-sattler", card: "ALRIKE SATTLER, 36", name: "Alrike Sattler", age: 36, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "private", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-klara-hesse", card: "KLARA HESSE, 35", name: "Klara Hesse", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "known", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-nora-weiss", card: "NORA WEISS, 35", name: "Nora Weiss", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "private", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-greta-falk", card: "GRETA FALK, 35", name: "Greta Falk", age: 35, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "known", sourceStatus: "PROPOSED_EXPANSION" },
  { id: "rc-tilda-rehn", card: "TILDA REHN, 36", name: "Tilda Rehn", age: 36, category: "former-partner", status: "former-partner", eligible: false, power: false, visibility: "private", sourceStatus: "PROPOSED_EXPANSION" },
] as const;

type ProfileSourceCard = {
  name: string;
  role: string;
  line?: number;
  fields: Record<string, string>;
  proposed?: boolean;
};

function cardFor(name: string): ProfileSourceCard | undefined {
  const canon = cardsJson.find((card) => card.name === name);
  if (canon) return canon;
  const proposed = RED_CLAW_FAMILY_CARDS.find((card) => `${card.name.toUpperCase()}, ${card.ageYears ?? "UNKNOWN"}` === name);
  if (!proposed) return undefined;
  const p = proposed.privateProfile;
  return {
    name: `${proposed.name.toUpperCase()}, ${proposed.ageYears ?? "UNKNOWN"}`,
    role: proposed.occupation,
    proposed: true,
    fields: {
      LOOK: proposed.appearance,
      BODY: p?.bodyMovement ?? "UNKNOWN — non-sexual movement description not separately recorded.",
      VOICE: proposed.voice,
      TELLS: proposed.habits,
      "IN CRISIS": p?.crisisResponse ?? "Use the character's role and current state; no crisis behaviour is established.",
      HANDLE: p?.interactionStyle ?? "Use a respectful, ordinary conversation; no special approach is established.",
      WANTS: proposed.ambitions,
      FEARS: proposed.fears,
      DAY: proposed.castDay || proposed.dailyRoutine,
      NEVER: p?.boundaries ?? "Do not infer current consent, affection, disclosure or willingness from historical status.",
      "SAMPLE LINES": p?.dialogueSamples ?? "No sample line is canonical; generate only from the profile and scene.",
      SECRET: p?.secrets ?? "No private secret is exposed by default.",
      KNOWS: p?.knownInformation ?? proposed.knowledgeBoundaries,
      RELATIONS: proposed.relationships,
      HOOKS: proposed.eventHooks.join("; "),
    },
  };
}

function field(card: ProfileSourceCard | undefined, key: string): string {
  const value = card?.fields?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : "UNKNOWN — not recorded in the CP9 character card.";
}

/** Profiles are projected from the compiled Canon cards; no missing traits are invented. */
export function getPlayerWomenCanonProfiles(): PlayerWomanCanonProfile[] {
  return WOMEN.map((person) => {
    const card = cardFor(person.card);
    const proposedRecord = RED_CLAW_FAMILY_CARDS.find((row) => row.id === person.id);
    const requiredFields = ["LOOK", "BODY", "VOICE", "TELLS", "IN CRISIS", "HANDLE", "WANTS", "FEARS", "DAY", "NEVER", "SAMPLE LINES", "SECRET", "KNOWS", "RELATIONS", "HOOKS"];
    const missing = requiredFields.filter((key) => !card?.fields?.[key]?.trim());
    const present = requiredFields.length - missing.length;
    return {
      id: person.id,
      name: person.name,
      ageYears: person.age,
      category: person.category,
      role: card?.role ?? "UNKNOWN — role is not present in the compiled card.",
      relationshipStatus: person.status,
      relationshipEligible: person.eligible,
      powerReviewRequired: person.power,
      appearance: field(card, "LOOK"),
      bodyMovement: field(card, "BODY"),
      voice: field(card, "VOICE"),
      behaviour: [field(card, "TELLS"), field(card, "IN CRISIS"), field(card, "HANDLE")].join("\n"),
      wants: field(card, "WANTS"),
      fears: field(card, "FEARS"),
      routine: field(card, "DAY"),
      boundaries: field(card, "NEVER"),
      dialogueSamples: field(card, "SAMPLE LINES"),
      secrets: proposedRecord?.sourceStatus === "PROPOSED_EXPANSION" ? "SEALED — not exposed through this panel; requires a valid disclosure or evidence event." : field(card, "SECRET"),
      knownInformation: proposedRecord?.sourceStatus === "PROPOSED_EXPANSION" ? "The proposed history disposition is recorded separately. The player receives only information established by direct experience, a valid disclosure or an evidence-backed event." : field(card, "KNOWS"),
      relationships: field(card, "RELATIONS"),
      hooks: field(card, "HOOKS"),
      source: card?.proposed ? `Proposed household card: ${card.name} (not authoritative Canon)` : card ? `Compiled Canon card: ${card.name} (source line ${card.line ?? "unknown"})` : `Missing compiled Canon card: ${person.card}`,
      coverage: { present, total: requiredFields.length, missing },
      completeness: present >= 11 && Boolean(card?.fields?.BODY) ? "substantial" : "partial",
      sourceStatus: proposedRecord?.sourceStatus ?? (card ? "CANON" : "UNKNOWN"),
      historyDisposition: proposedRecord?.historicalRelationship?.disposition,
      currentSpouse: proposedRecord?.currentSpouseId ? RED_CLAW_FAMILY_CARDS.find((row) => row.id === proposedRecord.currentSpouseId)?.name : undefined,
      currentChildren: proposedRecord?.childIds.map((id) => RED_CLAW_FAMILY_CARDS.find((row) => row.id === id)?.name ?? id),
    };
  });
}

export const PRIVATE_RELATIONS_ROSTER_GAPS = [
  "The supplied sources are not consistent about the Iron Guard detail count: the V4.1 Hotset says exactly five Iron Guard women; Elara’s card refers to her four guards; and Captain Karin Voss’s card refers to the five guards while identifying Karin as a reserve officer. Four permanent subordinate profiles are named (Sigrid Falk, Mira Voss, Anja Keller, Freja Dorn); do not invent another member or assert whether the count includes the commander until the full authoritative roster is recovered.",
  "Canon states that the household service corps has five young adult women; the five named attendant cards are present in CP9.",
  "The roster also includes named House officials, Red Claw operatives, garrison stalkers, a medical assistant, a bound-labor worker and an extended dynastic relative. External faction envoys are not household members and are outside this roster.",
  "Twelve proposed historical former-partner dossiers are shown as read-only, non-romantically eligible profiles; they are not Canon until approved and entered in the authoritative genealogy.",
  "The full V4.1 master manuscript and V4.5 update prompt are absent from CP9, so source completeness is limited to the compiled cards and excerpts in this archive.",
] as const;

export function defaultPrivateRelationsState(): PrivateRelationsState {
  return {
    schemaVersion: 1,
    relationships: WOMEN.map((person) => ({
      personId: person.id,
      personName: person.name,
      category: person.category,
      status: person.status,
      visibility: "visibility" in person ? person.visibility : person.status === "married" ? "public" : person.status === "former-partner" ? "known" : "private",
      lastEventId: null,
      note: person.status === "married"
        ? "Canonical marriage already recorded; current consent is never inferred from marital status."
        : person.status === "former-partner"
          ? ("sourceStatus" in person && person.sourceStatus === "PROPOSED_EXPANSION" ? "PROPOSED historical former-partner entry; current spouse is recorded; conversation only; no reconciliation, consent or affection is assumed." : "Canonical former relationship; no current reconciliation or consent is assumed.")
          : "No romantic relationship is established by the current Canon.",
    })),
    requests: [],
    consequences: [],
  };
}

export function normalizePrivateRelations(value: unknown): PrivateRelationsState {
  const base = defaultPrivateRelationsState();
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  const raw = value as Partial<PrivateRelationsState>;
  const allowed = new Map(base.relationships.map((row) => [row.personId, row]));
  const profiles = new Map(getPlayerWomenCanonProfiles().map((profile) => [profile.id, profile]));
  const visibilityRank = { private: 0, known: 1, public: 2 } as const;
  const relationships = base.relationships.map((seed) => {
    const found = Array.isArray(raw.relationships)
      ? raw.relationships.find((row) => Boolean(row && typeof row === "object" && !Array.isArray(row) && row.personId === seed.personId))
      : undefined;
    if (!found || !["married", "former-partner", "unestablished", "courtship", "engagement-pending", "separated"].includes(found.status)) return seed;
    // Non-romantically eligible identities (including existing spouses and
    // proposed dossiers) are immutable through the generic relationship save
    // block. Conversation events do not rewrite their relationship record.
    if (!profiles.get(seed.personId)?.relationshipEligible) return seed;
    return {
      ...seed,
      status: found.status,
      visibility: ["private", "known", "public"].includes(found.visibility)
        ? (visibilityRank[found.visibility as keyof typeof visibilityRank] < visibilityRank[seed.visibility]
          ? seed.visibility
          : found.visibility as keyof typeof visibilityRank)
        : seed.visibility,
      lastEventId: typeof found.lastEventId === "string" ? found.lastEventId.slice(0, 160) : null,
      note: typeof found.note === "string" ? found.note.slice(0, 500) : seed.note,
    };
  });
  const seenRequestIds = new Set<string>();
  const normalizedRequests = Array.isArray(raw.requests) ? raw.requests.slice(-100).flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row) || !allowed.has(row.personId) || typeof row.id !== "string" || !row.id.trim() || typeof row.dayIndex !== "number" || !Number.isSafeInteger(row.dayIndex) || row.dayIndex < 0) return [];
    if (!["conversation", "courtship", "reconciliation", "marriage-proposal"].includes(row.kind)) return [];
    if (!["pending", "accepted", "declined", "withdrawn", "cancelled"].includes(row.status)) return [];
    if (seenRequestIds.has(row.id)) return [];
    seenRequestIds.add(row.id);
    return [{
      id: row.id.slice(0, 160), personId: row.personId, personName: allowed.get(row.personId)!.personName,
      kind: row.kind, status: row.status, dayIndex: row.dayIndex,
      time: typeof row.time === "string" ? row.time.slice(0, 10) : "UNKNOWN",
      responseNote: typeof row.responseNote === "string" ? row.responseNote.slice(0, 500) : "",
      consentEvidence: typeof row.consentEvidence === "string" ? row.consentEvidence.slice(0, 500) : "",
      freeToDeclineConfirmed: row.freeToDeclineConfirmed === true,
      independentSafeguard: row.independentSafeguard === true,
      independentSafeguardEvidence: typeof row.independentSafeguardEvidence === "string" ? row.independentSafeguardEvidence.slice(0, 500) : "",
      eventId: typeof row.eventId === "string" ? row.eventId.slice(0, 160) : undefined,
    } satisfies PrivateInteractionRequest];
  }) : [];
  const seenConsequenceIds = new Set<string>();
  const consequences = Array.isArray(raw.consequences) ? raw.consequences.slice(-200).flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row) || typeof row.id !== "string" || !row.id.trim() || typeof row.title !== "string" || typeof row.detail !== "string" || typeof row.dayIndex !== "number" || !Number.isSafeInteger(row.dayIndex) || row.dayIndex < 0) return [];
    if (!["open", "acknowledged", "resolved"].includes(row.status)) return [];
    if (!["conflict-of-interest", "household-review", "boundary-breach", "pregnancy-and-succession", "relationship-disclosure"].includes(row.kind)) return [];
    if (seenConsequenceIds.has(row.id)) return [];
    seenConsequenceIds.add(row.id);
    return [{
      id: row.id.slice(0, 160), kind: row.kind, title: row.title.slice(0, 120), detail: row.detail.slice(0, 1000),
      dayIndex: row.dayIndex, status: row.status, audiences: Array.isArray(row.audiences) ? row.audiences.filter((x) => typeof x === "string").slice(0, 12) : [],
      sourceEventId: typeof row.sourceEventId === "string" ? row.sourceEventId.slice(0, 160) : "",
      requiredReview: typeof row.requiredReview === "string" ? row.requiredReview.slice(0, 500) : "",
    } satisfies DynasticConsequence];
  }) : [];
  return { schemaVersion: 1, relationships, requests: normalizedRequests, consequences };
}

export function createPrivateInteractionRequest(
  state: PrivateRelationsState,
  personId: string,
  kind: PrivateInteractionKind,
  dayIndex: number,
  time: string,
): { state: PrivateRelationsState; request?: PrivateInteractionRequest; message: string } {
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
  if (!profile || profile.ageYears < 18) return { state, message: "The selected character is not an eligible adult in the current Canon roster." };
  if (!["conversation", "courtship", "reconciliation", "marriage-proposal"].includes(kind)) return { state, message: "Unsupported private-interaction request type." };
  if (profile.sourceStatus !== "CANON" && kind !== "conversation") return { state, message: "Proposed or unresolved profiles are not eligible for Canon relationship changes; only a neutral conversation request is permitted." };
  if (!profile.relationshipEligible && kind !== "conversation") return { state, message: "Canon does not permit a romantic request for this family or staff role; a conversation may still be requested." };
  const currentStatus = state.relationships.find((row) => row.personId === personId)?.status ?? profile.relationshipStatus;
  if (kind === "reconciliation" && currentStatus !== "former-partner" && currentStatus !== "separated") return { state, message: "Reconciliation is available only for a canonically established former or separated relationship." };
  if (kind === "marriage-proposal" && (currentStatus === "married" || currentStatus === "engagement-pending")) return { state, message: "This character is already recorded as married or awaiting marriage; use a household conversation instead." };
  if (kind === "courtship" && (currentStatus === "married" || currentStatus === "engagement-pending" || currentStatus === "courtship")) return { state, message: "A new courtship request cannot replace an existing marriage, engagement or active courtship." };
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0 || !isCampaignTime(time)) return { state, message: "Invalid campaign date or time." };
  if (state.requests.filter((row) => row.personId === personId && row.status === "pending").length) return { state, message: "A request to this character is already awaiting her response." };
  const id = `PR-${dayIndex + 1}-${personId}-${globalThis.crypto.randomUUID()}`;
  const request: PrivateInteractionRequest = {
    id, personId, personName: profile.name, kind, status: "pending", dayIndex, time,
    responseNote: "", consentEvidence: "", freeToDeclineConfirmed: false, independentSafeguard: false,
  };
  return { state: { ...state, requests: capPrivateInteractionRequests([...state.requests, request], state.relationships) }, request, message: `Request recorded for ${profile.name}. No acceptance or consent has been assumed.` };
}

export function resolvePrivateInteractionRequest(
  state: PrivateRelationsState,
  requestId: string,
  outcome: PrivateRequestOutcome,
  options: { dayIndex: number; time: string; note?: string; consentEvidence?: string; freeToDeclineConfirmed?: boolean; independentSafeguard?: boolean; independentSafeguardEvidence?: string },
): { state: PrivateRelationsState; ok: boolean; message: string; request?: PrivateInteractionRequest; consequence?: DynasticConsequence } {
  const request = state.requests.find((row) => row.id === requestId);
  if (!request) return { state, ok: false, message: "Private-relations request not found." };
  if (request.status !== "pending") return { state, ok: false, message: "This request already has a recorded outcome." };
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === request.personId);
  if (!profile) return { state, ok: false, message: "The Canon character record is missing." };
  if (!["accepted", "declined", "withdrawn", "cancelled"].includes(outcome)) return { state, ok: false, message: "Unsupported private-relations outcome." };
  const note = (options.note ?? "").trim().slice(0, 500);
  const consentEvidence = (options.consentEvidence ?? "").trim().slice(0, 500);
  const independentSafeguardEvidence = (options.independentSafeguardEvidence ?? "").trim().slice(0, 500);
  if (!Number.isSafeInteger(options.dayIndex) || options.dayIndex < request.dayIndex || !isCampaignTime(options.time)) return { state, ok: false, message: "Invalid response date or time." };
  if (outcome === "accepted") {
    if (request.kind !== "conversation" && profile.sourceStatus !== "CANON") {
      return { state, ok: false, message: "A proposed or unresolved profile cannot receive a Canon romantic relationship transition." };
    }
    if (request.kind !== "conversation" && !profile.relationshipEligible) {
      return { state, ok: false, message: "This profile is not eligible for a Canon romantic relationship transition." };
    }
    const currentStatus = state.relationships.find((row) => row.personId === request.personId)?.status ?? profile.relationshipStatus;
    if (request.kind === "reconciliation" && currentStatus !== "former-partner" && currentStatus !== "separated") {
      return { state, ok: false, message: "The relationship is no longer eligible for reconciliation." };
    }
    if (request.kind === "courtship" && ["married", "engagement-pending", "courtship"].includes(currentStatus)) {
      return { state, ok: false, message: "The current relationship state does not permit a new courtship transition." };
    }
    if (request.kind === "marriage-proposal" && ["married", "engagement-pending"].includes(currentStatus)) {
      return { state, ok: false, message: "The current relationship state does not permit another marriage proposal." };
    }
    if (!options.freeToDeclineConfirmed || consentEvidence.length < 12) return { state, ok: false, message: "Acceptance requires recorded evidence of freely expressed agreement and confirmation that refusal carried no penalty." };
    if (profile.powerReviewRequired && request.kind !== "conversation" && (!options.independentSafeguard || independentSafeguardEvidence.length < 12)) return { state, ok: false, message: "For staff or command-chain relationships, an independently documented reporting route and protection from employment, housing, pay, rank or duty retaliation are required first." };
  }
  const eventId = `EV-PR-${request.id}-${outcome}`;
  const nextRequest: PrivateInteractionRequest = {
    ...request, status: outcome, responseNote: note, consentEvidence,
    freeToDeclineConfirmed: outcome === "accepted" && options.freeToDeclineConfirmed === true,
    independentSafeguard: outcome === "accepted" && options.independentSafeguard === true,
    independentSafeguardEvidence: outcome === "accepted" ? independentSafeguardEvidence : "",
    eventId,
  };
  const relationships = state.relationships.map((row) => {
    if (row.personId !== request.personId || outcome !== "accepted" || request.kind === "conversation") return row;
    const status = request.kind === "courtship" || request.kind === "reconciliation" ? "courtship" : request.kind === "marriage-proposal" ? "engagement-pending" : row.status;
    // Relationship knowledge is monotonic. A private conversation or a new
    // relationship decision must never erase an earlier household/public disclosure.
    return { ...row, status, lastEventId: eventId, note: note || `A ${request.kind} request was accepted; no further outcome is assumed.` };
  });
  const consequences = [...state.consequences];
  let consequence: DynasticConsequence | undefined;
  if (outcome === "accepted" && profile.powerReviewRequired && request.kind !== "conversation") {
    consequence = {
      id: `DY-${request.id}-COI`, kind: "conflict-of-interest", title: `${profile.name}: independent-role review`,
      detail: "A consensual relationship request was accepted, but the existing household or command dependency can distort free choice. The record does not establish coercion; safeguards must remain in force and professional decisions must be independently reviewed.",
      dayIndex: options.dayIndex, status: "open", audiences: audiencesForCategory(profile.category),
      sourceEventId: eventId, requiredReview: "Confirm independent reporting, no retaliation, and recusal from employment or duty decisions affected by the relationship.",
    };
    consequences.unshift(consequence);
  } else if (outcome === "accepted" && request.kind !== "conversation") {
    consequence = {
      id: `DY-${request.id}-HOUSE`, kind: "household-review", title: `Household implications: ${profile.name}`,
      detail: "A private adult relationship choice was recorded. This creates a review point, not an automatic scandal, pregnancy, heir, faction response or change in succession.",
      dayIndex: options.dayIndex, status: "open", audiences: ["House", "Household"], sourceEventId: eventId,
      requiredReview: "Resolve disclosure, household expectations and any directly evidenced political response through later events.",
    };
    consequences.unshift(consequence);
  }
  const nextRequests = state.requests.map((row) => row.id === requestId ? nextRequest : row);
  const nextState = { ...state, relationships, requests: capPrivateInteractionRequests(nextRequests, relationships), consequences: consequences.slice(0, 200) };
  return { state: nextState, ok: true, request: nextRequest, consequence, message: outcome === "declined" ? `${profile.name} declined. The boundary is recorded; no penalty or relationship change is applied.` : outcome === "withdrawn" ? `${profile.name} withdrew the request or agreement. The interaction is closed without presuming consent.` : `${profile.name}'s recorded response is accepted as an in-game record. Any dependent-role safeguards remain active.` };
}

function audiencesForCategory(category: PrivateWomanCategory): string[] {
  if (["iron-guard", "reserve-officer", "red-claw-operative", "garrison-stalker"].includes(category)) {
    return ["House", "Soldiers", "Military command"];
  }
  if (["household-attendant", "senior-household-staff", "medical-assistant", "bound-worker"].includes(category)) {
    return ["Household staff", "House", "Bound Workers", "Commoners"];
  }
  return ["House"];
}

function capPrivateInteractionRequests(
  requests: PrivateInteractionRequest[],
  relationships: PrivateRelationshipRecord[],
): PrivateInteractionRequest[] {
  const engagedIds = new Set(relationships.filter((row) => row.status === "engagement-pending").map((row) => row.personId));
  const protectedIds = new Set(requests
    .filter((row) => engagedIds.has(row.personId) && row.kind === "marriage-proposal" && row.status === "accepted")
    .map((row) => row.id));
  const protectedRows = requests.filter((row) => protectedIds.has(row.id));
  const remainingCapacity = Math.max(0, 100 - protectedRows.length);
  return [
    ...requests.filter((row) => !protectedIds.has(row.id)).slice(-remainingCapacity),
    ...protectedRows,
  ];
}

export function recordBoundaryBreach(
  state: PrivateRelationsState,
  personId: string,
  dayIndex: number,
  time: string,
  evidence: string,
): { state: PrivateRelationsState; ok: boolean; message: string; consequence?: DynasticConsequence; duplicate?: boolean } {
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
  const detailEvidence = evidence.trim().slice(0, 500);
  if (!isCanonicalProfile(profile)) return { state, ok: false, message: "Boundary reviews require a named adult Canon profile; proposed or unresolved dossiers cannot create Canon events." };
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0 || !isCampaignTime(time) || detailEvidence.length < 12) return { state, ok: false, message: "A valid campaign timestamp and concise evidence note are required." };
  const evidenceKey = stableEvidenceHash(detailEvidence);
  const eventId = `EV-PR-BOUNDARY-${personId}-${dayIndex}-${time.replace(":", "")}-${evidenceKey}`;
  const existing = state.consequences.find((row) => row.id === `DY-BOUNDARY-${personId}-${dayIndex}-${time.replace(":", "")}-${evidenceKey}`);
  if (existing) return { state, ok: true, duplicate: true, consequence: existing, message: "This boundary incident is already recorded; no duplicate reputation or Event Ledger effect was applied." };
  const consequence: DynasticConsequence = {
    id: `DY-BOUNDARY-${personId}-${dayIndex}-${time.replace(":", "")}-${evidenceKey}`, kind: "boundary-breach", title: `Boundary breach review — ${profile.name}`,
    detail: `A boundary violation was recorded against ${profile.name}. Evidence: ${detailEvidence}`,
    dayIndex, status: "open", audiences: audiencesForCategory(profile.category),
    sourceEventId: eventId, requiredReview: "Stop the conduct, protect the affected person's freedom to refuse, preserve the report, and independently review any command or employment power involved.",
  };
  return { state: { ...state, consequences: [consequence, ...state.consequences.filter((row) => row.id !== consequence.id)].slice(0, 200) }, ok: true, consequence, message: "Boundary breach recorded. It does not create a relationship or imply consent." };
}

export function recordPregnancyEvidence(
  current: PregnancyRecord[],
  state: PrivateRelationsState,
  input: { mother: string; status: "suspected" | "confirmed" | "public" | "monitored" | "completed" | "loss"; dayIndex: number; evidence: string; medicallyVerified?: boolean; birthRecord?: ChildSlot },
): { pregnancies: PregnancyRecord[]; state: PrivateRelationsState; ok: boolean; message: string; record?: PregnancyRecord; consequence?: DynasticConsequence } {
  const profile = getPlayerWomenCanonProfiles().find((row) => row.name.toLowerCase() === input.mother.trim().toLowerCase());
  const evidence = input.evidence.trim().slice(0, 500);
  if (!isCanonicalProfile(profile)) return { pregnancies: current, state, ok: false, message: "Pregnancy records require a named adult Canon profile; proposed or unresolved dossiers cannot create Canon medical/dynastic records." };
  if (!Number.isSafeInteger(input.dayIndex) || input.dayIndex < 0 || evidence.length < 12) return { pregnancies: current, state, ok: false, message: "A dated medical source or documented birth record is required." };
  if (!["suspected", "confirmed", "public", "monitored", "completed", "loss"].includes(input.status)) return { pregnancies: current, state, ok: false, message: "Unsupported pregnancy state." };
  if (input.status !== "suspected" && input.medicallyVerified !== true) return { pregnancies: current, state, ok: false, message: "This status requires explicit in-world medical verification. A player note alone may only record a suspicion." };
  const existing = current.filter((row) => row.mother.toLowerCase() === profile.name.toLowerCase() && !["inactive", "completed", "loss"].includes(row.state)).at(-1);
  if (existing) {
    const allowedNext: Record<string, string[]> = {
      suspected: ["suspected", "confirmed"],
      confirmed: ["confirmed", "public", "monitored", "completed", "loss"],
      public: ["public", "monitored", "completed", "loss"],
      monitored: ["monitored", "public", "completed", "loss"],
    };
    if (!(allowedNext[existing.state] ?? []).includes(input.status)) {
      return { pregnancies: current, state, ok: false, message: `The pregnancy state cannot move backwards from ${existing.state} to ${input.status}.` };
    }
  }
  if (["public", "monitored", "completed", "loss"].includes(input.status) && (!existing || !["confirmed", "public", "monitored"].includes(existing.state))) {
    return { pregnancies: current, state, ok: false, message: "This transition requires a previously confirmed medical record." };
  }
  const birthRecord = input.birthRecord;
  const birthRecordMatches = Boolean(
    birthRecord && typeof birthRecord.id === "string" && birthRecord.id.trim()
    && typeof birthRecord.name === "string" && birthRecord.name.trim()
    && birthRecord.mother.trim().toLowerCase() === profile.name.toLowerCase()
    && birthRecord.pregnancyId === existing?.id
    && Number.isSafeInteger(birthRecord.birthDay) && birthRecord.birthDay! <= input.dayIndex
    && existing && Number.isSafeInteger(existing.startedDay) && birthRecord.birthDay! >= existing.startedDay!,
  );
  if (input.status === "completed" && !birthRecordMatches) {
    return { pregnancies: current, state, ok: false, message: "A completed pregnancy requires a separately recorded child whose mother and absolute birth day match this medical record; an older child is not sufficient." };
  }
  const id = existing?.id ?? `PG-${profile.id}-${input.dayIndex + 1}-${globalThis.crypto.randomUUID()}`;
  const record: PregnancyRecord = {
    id, mother: profile.name, state: input.status, startedDay: existing?.startedDay ?? input.dayIndex,
    knowledge: input.status === "public" ? "public" : input.medicallyVerified ? "medical" : "player",
    medical: input.medicallyVerified ? evidence : `Unverified player-supplied reference: ${evidence}`,
    ...(input.status === "completed" && birthRecordMatches ? { childRecordId: birthRecord!.id } : existing?.childRecordId ? { childRecordId: existing.childRecordId } : {}),
  };
  const pregnancies = existing ? current.map((row) => row.id === existing.id ? record : row) : [...current.filter((row) => row.id !== "PG-none"), record];
  const eventId = `EV-PREG-${id}-${input.status}-${input.dayIndex}`;
  const consequence: DynasticConsequence = {
    id: `DY-PREG-${id}-${input.status}`, kind: "pregnancy-and-succession", title: `Medical / dynastic review — ${profile.name}`,
    detail: input.status === "suspected"
      ? "A suspected pregnancy is recorded as a medical lead only; it is not a confirmed pregnancy or an heirship claim."
      : input.status === "confirmed"
        ? "A medically confirmed pregnancy is recorded. Parentage, legitimacy, public disclosure and succession remain separate decisions and are not inferred."
        : `Pregnancy record moved to ${input.status}. No heirship or legitimacy outcome is implied.`,
    dayIndex: input.dayIndex, status: "open", audiences: ["House", "Dynastic succession", "Medical staff"], sourceEventId: eventId,
    requiredReview: "Keep medical privacy, the woman's own decisions, parentage evidence, recognition, and succession law as separate recorded questions.",
  };
  const nextState = { ...state, consequences: [consequence, ...state.consequences.filter((row) => row.id !== consequence.id)].slice(0, 200) };
  return { pregnancies, state: nextState, ok: true, record, consequence, message: `Medical record for ${profile.name} updated to ${input.status}. No conception cause, father, child name or succession status was invented.` };
}

export function finalizePrivateMarriage(
  state: PrivateRelationsState,
  personId: string,
  dayIndex: number,
  time: string,
  mutualConsentEvidence: string,
  ceremonyEvidence: string,
): { state: PrivateRelationsState; ok: boolean; message: string; relationship?: PrivateRelationshipRecord; consequence?: DynasticConsequence; event?: EventLedgerEntry } {
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
  const current = state.relationships.find((row) => row.personId === personId);
  const consent = mutualConsentEvidence.trim().slice(0, 500);
  const ceremony = ceremonyEvidence.trim().slice(0, 500);
  if (!isCanonicalProfile(profile) || !profile.relationshipEligible || !current) return { state, ok: false, message: "Marriage can be formalized only for an eligible adult Canon profile." };
  if (current.status !== "engagement-pending") return { state, ok: false, message: "A recorded engagement is required before marriage can be formalized." };
  const acceptedProposal = [...state.requests].reverse().find((row) =>
    row.personId === personId && row.kind === "marriage-proposal" && row.status === "accepted",
  );
  if (!acceptedProposal || !acceptedProposal.freeToDeclineConfirmed || acceptedProposal.consentEvidence.trim().length < 12
    || (profile.powerReviewRequired && (!acceptedProposal.independentSafeguard || (acceptedProposal.independentSafeguardEvidence ?? "").trim().length < 12))) {
    return { state, ok: false, message: "Marriage requires a retained accepted proposal with recorded free-choice and applicable independent safeguards." };
  }
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0 || !isCampaignTime(time) || consent.length < 12 || ceremony.length < 12) {
    return { state, ok: false, message: "A valid campaign timestamp, mutual adult consent record and ceremony/legal record are required." };
  }
  const eventId = `EV-PR-MARRIAGE-${personId}-${dayIndex}-${time.replace(":", "")}`;
  const relationship: PrivateRelationshipRecord = {
    ...current,
    status: "married",
    lastEventId: eventId,
    note: `Marriage formalized. Mutual consent: ${consent}. Ceremony/legal record: ${ceremony}`.slice(0, 500),
  };
  const nextState = { ...state, relationships: state.relationships.map((row) => row.personId === personId ? relationship : row) };
  const consequence: DynasticConsequence = {
    id: `DY-PR-MARRIAGE-${personId}-${dayIndex}`,
    kind: "household-review",
    title: `Marriage and household review — ${profile.name}`,
    detail: `A marriage was formalized on the basis of recorded mutual consent and a ceremony/legal record. Public visibility, pregnancy, parentage, legitimacy, heirship and succession are not inferred.`,
    dayIndex,
    status: "open",
    audiences: ["House", "Household", "Dynastic succession"],
    sourceEventId: eventId,
    requiredReview: "Record any disclosure, household arrangements, inheritance implications and political response as separate evidenced decisions.",
  };
  const event: EventLedgerEntry = {
    id: eventId, date: "UNKNOWN", year: "UNKNOWN", time, location: "Marriage / Household Hall",
    type: "PRIVATE_MARRIAGE", actors: ["Christian Red IV", profile.name],
    cause: "Marriage formalized after recorded engagement",
    immediate: "A marriage was formalized. The event does not itself disclose the marriage publicly or create a pregnancy, child or succession ruling.",
    later: consequence.requiredReview,
    evidence: `Mutual consent: ${consent}; ceremony/legal record: ${ceremony}`.slice(0, 1000),
    knowledge: "player",
  };
  return { state: { ...nextState, consequences: [consequence, ...state.consequences.filter((row) => row.id !== consequence.id)].slice(0, 200) }, ok: true, message: `Marriage to ${profile.name} was formalized. Social disclosure and dynastic consequences remain separate.`, relationship, consequence, event };
}

export function recordPrivateRequestEvent(
  request: PrivateInteractionRequest,
  personCategory: PrivateWomanCategory,
  date: string,
  year: string,
  location: string,
): EventLedgerEntry {
  const accepted = request.status === "accepted";
  return {
    id: request.eventId ?? `EV-PR-${request.id}-${request.status}`,
    date, year, time: request.time, location, type: "PRIVATE_RELATIONSHIP",
    actors: ["Christian Red IV", request.personName],
    cause: `${request.kind} request outcome recorded: ${request.status}`,
    immediate: accepted
      ? `The recorded response to the ${request.kind} request was affirmative. This record does not authorize or depict an intimate scene.`
      : request.status === "declined"
        ? `${request.personName} declined the request; no relationship status change was applied.`
        : `${request.personName}'s request/response status was recorded as ${request.status}.`,
    later: request.responseNote || undefined,
    evidence: request.consentEvidence || `Player-recorded ${personCategory} interaction outcome`,
    // Acceptance does not itself disclose a relationship to the household.
    // Explicit witnesses/declarations use recordPrivateRelationshipDisclosure.
    knowledge: "player",
  };
}

export function recordPrivateRelationshipDisclosure(
  state: PrivateRelationsState,
  personId: string,
  visibility: "private" | "known" | "public",
  dayIndex: number,
  evidence: string,
): { state: PrivateRelationsState; ok: boolean; message: string; consequence?: DynasticConsequence } {
  const current = state.relationships.find((row) => row.personId === personId);
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
  const note = evidence.trim().slice(0, 500);
  if (!current || !isCanonicalProfile(profile)) return { state, ok: false, message: "A relationship disclosure requires an established adult Canon profile; proposed or unresolved dossiers cannot create Canon events." };
  if (current.status === "unestablished") return { state, ok: false, message: "A relationship cannot be disclosed before it is established." };
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0 || note.length < 12) return { state, ok: false, message: "A dated disclosure event and specific evidence are required." };
  const rank = { private: 0, known: 1, public: 2 } as const;
  if (rank[visibility] < rank[current.visibility]) return { state, ok: false, message: "A disclosure cannot erase knowledge already established in the campaign." };
  if (visibility === current.visibility) return { state, ok: false, message: "This disclosure level is already recorded." };
  const eventId = `EV-PR-DISCLOSE-${personId}-${dayIndex}-${visibility}`;
  const relationships = state.relationships.map((row) => row.personId === personId ? { ...row, visibility, lastEventId: eventId, note: note } : row);
  const audiences = visibility === "public" ? ["House", "Household", "Nobility", "Commoners"] : ["House", "Household"];
  const consequence: DynasticConsequence = {
    id: `DY-PR-DISCLOSE-${personId}-${dayIndex}-${visibility}`,
    kind: "relationship-disclosure",
    title: `${profile.name}: relationship disclosure review`,
    detail: visibility === "public"
      ? `The relationship status is now publicly known on the strength of a recorded disclosure. This does not establish universal approval, scandal, parentage or succession.`
      : `The relationship status is now known within the household circle. Wider public knowledge is not implied.`,
    dayIndex, status: "open", audiences, sourceEventId: eventId,
    requiredReview: "Record only audience reactions supported by witnesses, public statements or reliable reports. Preserve the distinction between household knowledge and public knowledge.",
  };
  return { state: { ...state, relationships, consequences: [consequence, ...state.consequences.filter((row) => row.id !== consequence.id)].slice(0, 200) }, ok: true, consequence, message: `${profile.name}'s relationship visibility was advanced to ${visibility}; a review of audience consequences was opened.` };
}

export function recordPrivateRelationshipDisclosureEvent(
  consequence: DynasticConsequence,
  profileName: string,
  visibility: "private" | "known" | "public",
  date: string,
  year: string,
  time: string,
  location: string,
  evidence: string,
): EventLedgerEntry {
  return {
    id: consequence.sourceEventId, date, year, time, location, type: "PRIVATE_RELATIONSHIP_DISCLOSURE",
    actors: ["Christian Red IV", profileName], cause: `Relationship disclosure recorded: ${visibility}`,
    immediate: consequence.detail, later: consequence.requiredReview, evidence: evidence.trim().slice(0, 500),
    knowledge: visibility === "public" ? "public" : visibility === "known" ? "household" : "player",
  };
}

export function recordBoundaryBreachEvent(
  consequence: DynasticConsequence,
  date: string,
  year: string,
  time: string,
  location: string,
  actorName: string,
  evidence: string,
): EventLedgerEntry {
  return {
    id: consequence.sourceEventId, date, year, time, location, type: "BOUNDARY_REVIEW",
    actors: ["Christian Red IV", actorName], cause: "A boundary breach was explicitly recorded",
    immediate: consequence.title, later: consequence.detail, evidence: evidence.trim().slice(0, 500), knowledge: "authority",
  };
}

export function recordPregnancyEvent(
  consequence: DynasticConsequence,
  record: PregnancyRecord,
  date: string,
  year: string,
  time: string,
): EventLedgerEntry {
  return {
    id: consequence.sourceEventId, date, year, time, location: "Medical Office / Kin Hall", type: "DYNASTIC_MEDICAL",
    actors: [record.mother, "Medical staff"], cause: `Medical pregnancy status recorded: ${record.state}`,
    immediate: consequence.detail, later: consequence.requiredReview,
    evidence: [record.medical ?? "Medical evidence not supplied", record.childRecordId ? `Linked child/birth record: ${record.childRecordId}` : ""].filter(Boolean).join("; "),
    knowledge: record.knowledge,
  };
}

export function acknowledgeDynasticConsequence(
  state: PrivateRelationsState,
  consequenceId: string,
  status: "acknowledged" | "resolved",
  note = "",
): { state: PrivateRelationsState; ok: boolean; message: string } {
  const target = state.consequences.find((row) => row.id === consequenceId);
  if (!target) return { state, ok: false, message: "Dynastic consequence not found." };
  if (target.status === "resolved") return { state, ok: false, message: "This consequence is already resolved." };
  const clean = note.trim().slice(0, 500);
  if (status === "resolved" && !clean) return { state, ok: false, message: "A resolution note is required; do not erase the event history." };
  const consequences = state.consequences.map((row) => row.id === consequenceId ? {
    ...row, status, detail: clean ? `${row.detail}\nResolution note: ${clean}`.slice(0, 1000) : row.detail,
  } : row);
  return { state: { ...state, consequences }, ok: true, message: status === "resolved" ? "Consequence resolution recorded; original event remains in the ledger." : "Consequence acknowledged." };
}

export function applyBoundaryReputationImpact(
  reputations: ReputationSlice[],
  category: PrivateWomanCategory,
): ReputationSlice[] {
  const audiences = audiencesForCategory(category);
  return reputations.map((row) => row.name === "Christian Red IV" && audiences.includes(row.audience)
    ? { ...row, standing: Math.max(0, Math.min(10, row.standing - 2)), note: `${row.note}; standing reduced after a recorded boundary breach` }
    : row);
}

export function hasCanonicalAdultProfile(personId: string): boolean {
  return isCanonicalProfile(getPlayerWomenCanonProfiles().find((row) => row.id === personId));
}
