export const APP_VERSION = "V4.5 Demo / Update 4.5";
import type { P4State } from "./p4-simulation";

export type ViewMode = "title" | "play";
export type DockTab = "platform" | "cast" | "threads" | "chronicle";
export type Interrupt = "normal" | "important" | "critical" | "emergency";
export type NewsTag =
  | "CONFIRMED"
  | "INITIAL REPORT"
  | "RUMOR"
  | "DISPUTED"
  | "CLASSIFIED"
  | "OFFICIAL"
  | "LOCAL REPORT"
  | "INTELLIGENCE"
  | "UNVERIFIED";
export type InboxStatus = "open" | "answered" | "delegated" | "postponed" | "verdict";
export type PolicyKind = "normal" | "ration" | "reserve" | "repair" | "trade";
export type StalkerStatus = "ready" | "rest" | "sick" | "on-sortie" | "cleansing";
export type GateVisual = "normal" | "combat" | "breach" | "destroyed";
export type AtlasState =
  | "KNOWN"
  | "RECOVERED"
  | "DISPUTED"
  | "PARTLY KNOWN"
  | "RUMOR"
  | "UNKNOWN"
  | "ARCHIVED"
  | "LOST";
export type KnowledgeLayer =
  | "actual"
  | "player"
  | "public"
  | "household"
  | "medical"
  | "authority"
  | "rumor"
  | "intelligence"
  | "secret";
export type RelicQueue = "cleansing" | "quarantine" | "released" | "catalogued" | "review" | "assigned";
export type PregnancyState =
  | "inactive"
  | "reserved"
  | "suspected"
  | "confirmed"
  | "hidden"
  | "public"
  | "monitored"
  | "completed"
  | "loss";

export interface Clock {
  weekday: string;
  date: string;
  year: string;
  time: string;
  location: string;
  floor: string;
}

export interface ResourceBlock {
  stock: number;
  capacity: number;
  production: number;
  consumption: number;
  unit: string;
  policy: PolicyKind;
}

export interface WorldState {
  clock: Clock;
  water: ResourceBlock;
  food: ResourceBlock;
  energy: ResourceBlock;
  treasury: { marks: number; income: number; expenses: number };
  arms: { suitsReady: number; inRepair: number; rifles: number; ammo: number };
  population: { house: number; soldiers: number; bound: number; redClaws: number; known: number };
  indices: Record<string, number>;
  blocs: { oldGuard: number; banners: number; works: number };
  surface: { garrison: string; sorties: string; cleansing: string; weekSorties: number; weekLimit: number };
  dayIndex: number;
  lastWeeklyRelicDay: number;
}

export interface InboxItem {
  id: string;
  from: string;
  office: string;
  time: string;
  body: string;
  status: InboxStatus;
  urgency?: "low" | "normal" | "important" | "critical";
  deadline?: string;
  glyph?: string;
  delegate?: string;
  verdict?: string;
}

export interface NewsItem {
  id: string;
  source: string;
  time: string;
  body: string;
  tag?: NewsTag;
  reliability?: "high" | "medium" | "low" | "unverified";
}

export interface WorldNewsItem {
  id: string;
  headline: string;
  tag: NewsTag;
  source: string;
  reliability: "high" | "medium" | "low" | "unverified";
  body: string;
}

export interface CaseItem {
  id: string;
  accused: string;
  charge: string;
  status: string;
  evidence?: string[];
  sentence?: string;
}

export interface ThreadItem {
  id: string;
  title: string;
  kind: "thread" | "seed";
  summary: string;
  status: "active" | "dormant" | "watched" | "resolved";
}

export interface ChronicleEntry {
  id: string;
  line: string;
  at: string;
  pinned: boolean;
  kind: "turn" | "canon";
}

export interface Relation {
  name: string;
  trust: number;
  respect: number;
  fear: number;
  loyalty: number;
  closeness: number;
}

export interface SecretClock {
  id: string;
  label: string;
  value: number;
  max: number;
}

export interface CalendarEvent {
  id: string;
  name: string;
  date: string;
  start: string;
  end: string;
  place: string;
  type: string;
  importance: "Low" | "Medium" | "High" | "Critical";
  status: "planned" | "started" | "missed" | "done" | "crisis" | "cancelled";
  reminder?: boolean;
  /** Additive ceremony metadata; legacy calendar rows need not contain it. */
  year?: string;
  attendees?: string[];
  costMarks?: number;
  ceremonyId?: string;
}

export interface Edict {
  id: string;
  text: string;
  standing: boolean;
  deadline?: string;
  issuedAt: string;
  status: "active" | "fulfilled" | "broken";
}

export interface Stalker {
  id: string;
  name: string;
  role: string;
  dose: number;
  sortiesInRotation: number;
  status: StalkerStatus;
  rotation: "garrison" | "reserve" | "core";
  wear: number;
  scar?: string;
}

export interface FindItem {
  id: string;
  name: string;
  condition: string;
  radiation: string;
  queue: RelicQueue;
  release?: string;
  foundBy?: string;
  kind?: "relic" | "map" | "log" | "tool" | "other";
}

export interface SortieRecord {
  id: string;
  team: string[];
  objective: string;
  route: string;
  hours: number;
  rangeM: number;
  result?: string;
  debrief?: string;
  at: string;
}

export interface Mystery {
  id: string;
  title: string;
  clues: number;
  needed: number;
  leads: string[];
}

export interface ForeignReport {
  id: string;
  group: string;
  faction: string;
  body: string;
  tag?: NewsTag;
}


export type PrivateWomanCategory =
  | "official-wife"
  | "former-partner"
  | "iron-guard"
  | "reserve-officer"
  | "household-attendant"
  | "family-elder"
  | "senior-household-staff"
  | "house-official"
  | "red-claw-operative"
  | "garrison-stalker"
  | "medical-assistant"
  | "bound-worker"
  | "dynastic-relative";
export type PrivateRelationshipStatus =
  | "married"
  | "former-partner"
  | "unestablished"
  | "courtship"
  | "engagement-pending"
  | "separated";
export type PrivateInteractionKind = "conversation" | "courtship" | "reconciliation" | "marriage-proposal";
export type PrivateRequestOutcome = "accepted" | "declined" | "withdrawn" | "cancelled";
export interface PrivateRelationshipRecord {
  personId: string;
  personName: string;
  category: PrivateWomanCategory;
  status: PrivateRelationshipStatus;
  visibility: "private" | "known" | "public";
  lastEventId: string | null;
  note: string;
}
export interface PrivateInteractionRequest {
  id: string;
  personId: string;
  personName: string;
  kind: PrivateInteractionKind;
  status: "pending" | PrivateRequestOutcome;
  dayIndex: number;
  time: string;
  responseNote: string;
  consentEvidence: string;
  freeToDeclineConfirmed: boolean;
  independentSafeguard: boolean;
  independentSafeguardEvidence?: string;
  eventId?: string;
}
export interface DynasticConsequence {
  id: string;
  kind: "conflict-of-interest" | "household-review" | "boundary-breach" | "pregnancy-and-succession" | "relationship-disclosure";
  title: string;
  detail: string;
  dayIndex: number;
  status: "open" | "acknowledged" | "resolved";
  audiences: string[];
  sourceEventId: string;
  requiredReview: string;
}
export interface PrivateRelationsState {
  schemaVersion: 1;
  relationships: PrivateRelationshipRecord[];
  requests: PrivateInteractionRequest[];
  consequences: DynasticConsequence[];
}

export interface KinCard {
  id?: string;
  name: string;
  role: string;
  mood: string;
  ageYears?: number;
}

export interface DiceRoll {
  die: string;
  result: number;
  reason: string;
  vs?: number;
}

export interface ToastItem {
  id: string;
  kind: "message" | "knock" | "alert" | "notice";
  text: string;
}

export interface SceneTurn {
  id: string;
  role: "scene" | "player" | "note";
  text: string;
  footer?: SceneFooter;
  dice?: DiceRoll[];
  failed?: boolean;
  /** Alternate AI replies for this same turn; index 0 is the original answer. */
  variants?: string[];
  activeVariant?: number;
}

export interface SceneFooter {
  time: string;
  day: string;
  floor: string;
  interrupt: Interrupt;
  prompt?: string;
}

export interface CastCard {
  name: string;
  age?: string;
  role: string;
  group: string;
  look: string;
  voice: string;
  day: string;
  wants?: string;
  fears?: string;
  hooks?: string;
  never?: string;
  secret?: string;
  /** Source-backed relationship notes; not a live affection, consent, or disclosure state. */
  relationships?: string;
  loreStatus?: string;
  householdTier?: string;
  residenceStatus?: string;
}

export interface MemoryPack {
  rollingSummary: string;
  pinned: string[];
  canonChanges: string[];
  threads: string[];
  edicts: string[];
  turnCount: number;
}

export interface Provenance {
  origin: string;
  previousOwner: string;
  acquisition: string;
  processing: string;
  location: string;
  eventId?: string;
}

export interface VaultItem {
  id: string;
  name: string;
  category: string;
  owner: "personal" | "faction";
  location: string;
  condition: string;
  era: string;
  secrecy: "open" | "house" | "restricted" | "secret";
  use: string;
  value: string;
  radiation: string;
  quantity: number;
  provenance: Provenance;
  related?: string;
}

export interface EventLedgerEntry {
  id: string;
  date: string;
  /** In-world year for unambiguous replay; absent on legacy rows. */
  year?: string;
  time: string;
  location: string;
  type: string;
  actors: string[];
  cause: string;
  immediate: string;
  later?: string;
  evidence: string;
  knowledge: KnowledgeLayer;
  news?: string;
  rumor?: string;
  quest?: string;
}

export interface HouseholdStatus {
  id?: string;
  name: string;
  title: string;
  mood: string;
  relation: string;
  affection: number;
  trend: "rising" | "steady" | "cooling";
  misses: "low" | "medium" | "high";
  lastInteraction: string;
  concern: string;
  request?: string;
  available: boolean;
  tonight: string;
  chosenEvening: boolean;
  portraitHue: string;
}

export interface GateStatus {
  id: "north" | "east" | "west" | "south";
  name: string;
  purpose: string;
  visual: GateVisual;
  security: string;
  condition: string;
  commander: string;
  shift: string;
  traffic: string;
  threat: string;
  ammo: string;
  restriction: string;
  incident?: string;
}

export interface TradeOffer {
  id: string;
  faction: string;
  representative: string;
  position: string;
  request: string;
  offered: string;
  wanted: string;
  terms: string;
  relation: string;
  risk: string;
  deadline: string;
  status: "open" | "accepted" | "rejected" | "countered" | "expired" | "deferred";
  history: string;
  /** Last in-world day a still-open recess trade reminder was emitted. */
  lastReminderDay?: number;
}

export interface RadioStation {
  id: string;
  faction: string;
  name: string;
  frequency: number;
  signal: number;
  nowPlaying: string;
  identity: string;
}

export interface FilmItem {
  id: string;
  title: string;
  genre: string;
  era: string;
  origin: string;
  condition: string;
  summary: string;
  known: boolean;
  provenance: string;
  lastShown?: string;
  reactions: string;
}

export interface IntelReport {
  id: string;
  title: string;
  fact: string;
  sourceType: string;
  confidence: "low" | "medium" | "high";
  corroboration: string;
  contradiction: string;
  interpretation: string;
  watch: string;
  restricted: boolean;
}

export interface NpcMemory {
  npc: string;
  event: string;
  date: string;
  felt: string;
  certainty: "witnessed" | "told" | "inferred";
}

export interface ReputationSlice {
  name: string;
  audience: string;
  standing: number;
  note: string;
}

export interface PregnancyRecord {
  id: string;
  mother: string;
  state: PregnancyState;
  /** Absolute campaign day on which the first evidence for this record was entered. */
  startedDay?: number;
  window?: string;
  knowledge: KnowledgeLayer;
  medical?: string;
  /** Stable link to the independently recorded child/birth row when state is completed. */
  childRecordId?: string;
}

export interface ChildSlot {
  id: string;
  name: string;
  mother: string;
  /** Optional explicit link to the pregnancy record that produced this birth. */
  pregnancyId?: string;
  ageYears: number;
  /** Absolute in-world day index of birth; absent on legacy records with unknown dates. */
  birthDay?: number;
  status: "living" | "reserved" | "hidden";
  notes: string;
}

export interface TimeDigest {
  fromDay: number;
  toDay: number;
  elapsed: string;
  major: string[];
  interrupt?: string;
}

export interface GameSnapshot {
  version: string;
  view: ViewMode;
  dock: DockTab;
  platformOpen: boolean;
  panel: string;
  world: WorldState;
  inbox: InboxItem[];
  news: NewsItem[];
  worldNews: WorldNewsItem[];
  cases: CaseItem[];
  threads: ThreadItem[];
  chronicle: ChronicleEntry[];
  relations: Relation[];
  secretClocks: SecretClock[];
  calendar: CalendarEvent[];
  edicts: Edict[];
  stalkers: Stalker[];
  finds: FindItem[];
  sorties: SortieRecord[];
  mysteries: Mystery[];
  foreignReports: ForeignReport[];
  kin: KinCard[];
  log: SceneTurn[];
  rollingSummary: string;
  quickActions: string[];
  turnCount: number;
  requestedDossier: string | null;
  personalVault: VaultItem[];
  factionVault: VaultItem[];
  events: EventLedgerEntry[];
  household: HouseholdStatus[];
  gates: GateStatus[];
  trades: TradeOffer[];
  radio: RadioStation[];
  radioFreq: number;
  films: FilmItem[];
  tonightFilm: string | null;
  intel: IntelReport[];
  memories: NpcMemory[];
  reputations: ReputationSlice[];
  pregnancies: PregnancyRecord[];
  children: ChildSlot[];
  privateRelations: PrivateRelationsState;
  lastDigest: TimeDigest | null;
  p4: P4State;
}
