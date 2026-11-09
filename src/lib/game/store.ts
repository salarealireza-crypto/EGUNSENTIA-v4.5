import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BRIEFING_FOOTER,
  BRIEFING_SCENE,
  OPENING_FOOTER,
  OPENING_SCENE,
  OPENING_SUMMARY,
  SUGGESTIONS,
  dayOneCalendar,
  dayOneCases,
  dayOneChronicle,
  dayOneEdicts,
  dayOneFinds,
  dayOneForeign,
  dayOneInbox,
  dayOneKin,
  dayOneMysteries,
  dayOneNews,
  dayOneRelations,
  dayOneSecretClocks,
  dayOneSorties,
  dayOneStalkers,
  dayOneThreads,
  dayOneWorld,
  dayOneWorldNews,
} from "./kernel";
import {
  RADIO_STATIONS,
  dayOneChildren,
  dayOneEvents,
  dayOneFactionVault,
  dayOneFilms,
  dayOneGates,
  dayOneHousehold,
  dayOneIntel,
  dayOneMemories,
  dayOnePersonalVault,
  dayOnePregnancies,
  dayOneReputations,
  dayOneTrades,
} from "./v41-data";
import { clampChronicle } from "./delta";
import { clockFromDayIndex, digestScene, newsFromDigest, parseAdvance, parseAdvanceSpec, simulateAdvance } from "./time";
import type {
  CalendarEvent,
  CaseItem,
  ChildSlot,
  ChronicleEntry,
  DockTab,
  Edict,
  EventLedgerEntry,
  FilmItem,
  FindItem,
  ForeignReport,
  GameSnapshot,
  GateStatus,
  HouseholdStatus,
  InboxItem,
  IntelReport,
  KinCard,
  Mystery,
  NewsItem,
  NpcMemory,
  PolicyKind,
  PregnancyRecord,
  PrivateInteractionKind,
  PrivateRequestOutcome,
  PrivateRelationsState,
  RadioStation,
  Relation,
  ReputationSlice,
  SceneFooter,
  SceneTurn,
  SecretClock,
  SortieRecord,
  Stalker,
  ThreadItem,
  TimeDigest,
  ToastItem,
  TradeOffer,
  VaultItem,
  ViewMode,
  WorldNewsItem,
  WorldState,
} from "./types";
import { APP_VERSION } from "./types";
import { absMin } from "./sim/core.ts";
import { castNow } from "./presence";
import { scheduleCeremony as scheduleCeremonyEngine, recordCeremonyOutcome as recordCeremonyOutcomeEngine, type CeremonyDraft, type CeremonyStatus } from "./sim/ceremony.ts";
import { createInvestigationCase as createInvestigationCaseEngine, linkInvestigationClue as linkInvestigationClueEngine, addInvestigationNote as addInvestigationNoteEngine, setInvestigationStatus as setInvestigationStatusEngine, type CreateInvestigationCaseOptions, type InvestigationStatus } from "./sim/investigation-cases.ts";
import { appendLedgerEvents, crisisHistoryIdentity, crisisHistoryToLedgerEvent } from "./sim/event-ledger.ts";
import {
  acknowledgeDynasticConsequence as acknowledgeDynasticConsequenceEngine,
  applyBoundaryReputationImpact,
  createPrivateInteractionRequest as createPrivateInteractionRequestEngine,
  defaultPrivateRelationsState,
  getPlayerWomenCanonProfiles,
  normalizePrivateRelations,
  recordBoundaryBreach,
  recordBoundaryBreachEvent,
  recordPregnancyEvidence,
  recordPregnancyEvent,
  recordPrivateRequestEvent,
  recordPrivateRelationshipDisclosure,
  recordPrivateRelationshipDisclosureEvent,
  resolvePrivateInteractionRequest as resolvePrivateInteractionRequestEngine,
} from "./sim/private-relations.ts";
import { appendOptionCommandIdentity, optionCommandIdentity } from "./sim/option-command.ts";
import { nextClockTime, nextMarketday, nextScheduled } from "./sim/planner.ts";
import { advanceClock, decideCouncil, decreeOrder, defaultP4State, normalizeP4, simulateWeek, syncClock } from "./p4-simulation";
import { restoreSnapshotArray } from "./snapshot-array";
import type { P4State, ReceiptPersistence, WorldInputs } from "./p4-simulation";
import { applyClockContinuity, applyCrisisGateEffects, applyCrisisStocks, rollNewDays } from "./clock-continuity";
import { optionsForPanel } from "@/lib/platform/options/lookup";
import { runOption, runCouncilDecree } from "@/lib/platform/options/execute";
import type { RichOption } from "@/lib/platform/options/effects";

export interface GameStore {
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
  /** Runtime-only status; derived from confirmed account load/save responses. */
  receiptPersistence: ReceiptPersistence;
  toasts: ToastItem[];
  nightSummary: string | null;
  busy: boolean;
  error: string | null;
  failedAction: string | null;
  notice: string | null;
  hydrated: boolean;
  muted: boolean;
  volume: number;
  bootDone: boolean;
  savedAt: number;
  remoteRevision: number | null;
  setSavedAt: (savedAt: number) => void;
  setRemoteRevision: (revision: number | null) => void;
  setReceiptPersistence: (status: ReceiptPersistence) => void;
  setHydrated: () => void;
  start: () => void;
  reset: () => void;
  loadSnapshot: (snap: GameSnapshot) => void;
  snapshot: () => GameSnapshot;
  setDock: (tab: DockTab) => void;
  setPanel: (id: string) => void;
  openPlatform: () => void;
  closePlatform: () => void;
  pushPlayer: (text: string) => void;
  pushScene: (text: string, footer?: SceneFooter, extra?: { dice?: SceneTurn["dice"] }) => void;
  appendSceneVariant: (id: string, text: string) => void;
  setSceneVariant: (id: string, index: number) => void;
  replaceChatLog: (log: SceneTurn[]) => void;
  markLastPlayerFailed: (failed: boolean) => void;
  pushNote: (text: string) => void;
  setBusy: (busy: boolean) => void;
  setError: (error: string | null) => void;
  setFailedAction: (action: string | null) => void;
  setNotice: (notice: string | null) => void;
  applyFooter: (footer: SceneFooter) => void;
  answerMessage: (id: string, patch?: Partial<InboxItem>) => void;
  setPolicy: (resource: "water" | "food" | "energy", policy: PolicyKind) => void;
  pinChronicle: (id: string) => void;
  editChronicle: (id: string, line: string) => void;
  deleteChronicle: (id: string) => void;
  addEdict: (edict: Edict) => void;
  setDossier: (name: string | null) => void;
  pushToasts: (items: Omit<ToastItem, "id">[]) => void;
  dismissToast: (id: string) => void;
  setNightSummary: (text: string | null) => void;
  applyWorldPatch: (patch: Partial<GameStore>) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setRadioFreq: (freq: number) => void;
  setTonightFilm: (id: string | null) => void;
  chooseEvening: (name: string) => void;
  setBootDone: (done: boolean) => void;
  applyAdvance: (days: number) => TimeDigest;
  advanceHours: (hours: number) => void;
  advanceUntil: (target: "next-item" | "marketday" | { time: string }) => void;
  executeV45Option: (optionId: string) => void;
  stampDecree: (seatId: string) => void;
  setV45Setting: (key: keyof P4State["settings"], value: P4State["settings"][keyof P4State["settings"]]) => void;
  applyP4: (p4: P4State) => void;
  runP4Week: () => void;
  scheduleCeremony: (draft: CeremonyDraft) => void;
  recordCeremonyOutcome: (id: string, outcome: Exclude<CeremonyStatus, "planned">, note?: string) => void;
  createInvestigationCase: (title: string, options?: CreateInvestigationCaseOptions) => void;
  linkInvestigationClue: (caseId: string, clueId: string) => void;
  addInvestigationNote: (caseId: string, text: string) => void;
  setInvestigationCaseStatus: (caseId: string, status: InvestigationStatus, archiveNote?: string) => void;
  createPrivateInteractionRequest: (personId: string, kind: PrivateInteractionKind) => void;
  finalizePrivateMarriage: (personId: string, mutualConsentEvidence: string, ceremonyEvidence: string) => void;
  resolvePrivateInteractionRequest: (requestId: string, outcome: PrivateRequestOutcome, options?: { note?: string; consentEvidence?: string; freeToDeclineConfirmed?: boolean; independentSafeguard?: boolean; independentSafeguardEvidence?: string }) => void;
  recordPrivateRelationshipDisclosure: (personId: string, visibility: "known" | "public", evidence: string) => void;
  recordPrivateBoundaryBreach: (personId: string, evidence: string) => void;
  recordPrivatePregnancyEvidence: (mother: string, status: "suspected" | "confirmed" | "public" | "monitored" | "completed" | "loss", evidence: string, medicallyVerified?: boolean, birthRecordId?: string) => void;
  acknowledgeDynasticConsequence: (consequenceId: string, status: "acknowledged" | "resolved", note?: string) => void;
}

const freshLog = (): SceneTurn[] => [
  {
    id: "open",
    role: "scene",
    text: OPENING_SCENE,
    footer: OPENING_FOOTER,
  },
];

function crisisLedgerEventsSince(before: P4State, after: P4State): EventLedgerEntry[] {
  const known = new Set((before.crisisHistory ?? []).map(crisisHistoryIdentity));
  return (after.crisisHistory ?? [])
    .filter((row) => !known.has(crisisHistoryIdentity(row)))
    .map(crisisHistoryToLedgerEvent);
}

function blank(): Omit<
  GameStore,
  | "setHydrated"
  | "setSavedAt"
  | "setRemoteRevision"
  | "setReceiptPersistence"
  | "start"
  | "reset"
  | "loadSnapshot"
  | "snapshot"
  | "setDock"
  | "setPanel"
  | "openPlatform"
  | "closePlatform"
  | "pushPlayer"
  | "pushScene"
  | "appendSceneVariant"
  | "setSceneVariant"
  | "replaceChatLog"
  | "markLastPlayerFailed"
  | "pushNote"
  | "setBusy"
  | "setError"
  | "setFailedAction"
  | "setNotice"
  | "applyFooter"
  | "answerMessage"
  | "setPolicy"
  | "pinChronicle"
  | "editChronicle"
  | "deleteChronicle"
  | "addEdict"
  | "setDossier"
  | "pushToasts"
  | "dismissToast"
  | "setNightSummary"
  | "applyWorldPatch"
  | "setMuted"
  | "setVolume"
  | "setRadioFreq"
  | "setTonightFilm"
  | "chooseEvening"
  | "setBootDone"
  | "applyAdvance"
  | "advanceHours"
  | "advanceUntil"
  | "executeV45Option"
  | "stampDecree"
  | "setV45Setting"
  | "applyP4"
  | "runP4Week"
  | "scheduleCeremony"
  | "recordCeremonyOutcome"
  | "createInvestigationCase"
  | "linkInvestigationClue"
  | "addInvestigationNote"
  | "setInvestigationCaseStatus"
  | "createPrivateInteractionRequest"
  | "resolvePrivateInteractionRequest"
  | "recordPrivateBoundaryBreach"
  | "recordPrivatePregnancyEvidence"
  | "acknowledgeDynasticConsequence"
> {
  return {
    view: "title",
    dock: "platform",
    platformOpen: false,
    panel: "01",
    world: dayOneWorld(),
    inbox: dayOneInbox(),
    news: dayOneNews(),
    worldNews: dayOneWorldNews(),
    cases: dayOneCases(),
    threads: dayOneThreads(),
    chronicle: dayOneChronicle(),
    relations: dayOneRelations(),
    secretClocks: dayOneSecretClocks(),
    calendar: dayOneCalendar(),
    edicts: dayOneEdicts(),
    stalkers: dayOneStalkers(),
    finds: dayOneFinds(),
    sorties: dayOneSorties(),
    mysteries: dayOneMysteries(),
    foreignReports: dayOneForeign(),
    kin: dayOneKin(),
    log: freshLog(),
    rollingSummary: OPENING_SUMMARY,
    quickActions: [...SUGGESTIONS],
    turnCount: 0,
    requestedDossier: null,
    personalVault: dayOnePersonalVault(),
    factionVault: dayOneFactionVault(),
    events: dayOneEvents(),
    household: dayOneHousehold(),
    gates: dayOneGates(),
    trades: dayOneTrades(),
    radio: RADIO_STATIONS.map((s) => ({ ...s })),
    radioFreq: 91.4,
    films: dayOneFilms(),
    tonightFilm: "FL-01",
    intel: dayOneIntel(),
    memories: dayOneMemories(),
    reputations: dayOneReputations(),
    pregnancies: dayOnePregnancies(),
    children: dayOneChildren(),
    privateRelations: defaultPrivateRelationsState(),
    lastDigest: null,
    p4: defaultP4State(),
    receiptPersistence: "device-only",
    toasts: [],
    nightSummary: null,
    busy: false,
    error: null,
    failedAction: null,
    notice: null,
    hydrated: false,
    muted: true,
    volume: 0.45,
    bootDone: false,
    savedAt: 0,
    remoteRevision: null,
  };
}

const persistKeys = [
  "view",
  "dock",
  "platformOpen",
  "panel",
  "world",
  "inbox",
  "news",
  "worldNews",
  "cases",
  "threads",
  "chronicle",
  "relations",
  "secretClocks",
  "calendar",
  "edicts",
  "stalkers",
  "finds",
  "sorties",
  "mysteries",
  "foreignReports",
  "kin",
  "log",
  "rollingSummary",
  "quickActions",
  "turnCount",
  "requestedDossier",
  "personalVault",
  "factionVault",
  "events",
  "household",
  "gates",
  "trades",
  "radio",
  "radioFreq",
  "films",
  "tonightFilm",
  "intel",
  "memories",
  "reputations",
  "pregnancies",
  "children",
  "privateRelations",
  "lastDigest",
  "p4",
  "remoteRevision",
  "muted",
  "volume",
] as const;

function personKey(name: string) {
  return name.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function migrateHousehold(household: HouseholdStatus[]): HouseholdStatus[] {
  return household.map((person) => ({
    ...person,
    id: person.id || `HH-${personKey(person.name)}`,
  }));
}

function migrateKin(kin: KinCard[], children: ChildSlot[], household: HouseholdStatus[]): KinCard[] {
  const childIds = new Map(children.map((child) => [personKey(child.name), child.id]));
  const householdIds = new Map(household.map((person) => [personKey(person.name), person.id || `HH-${personKey(person.name)}`]));
  return kin.map((person) => {
    let next = person;
    if (!next.id) {
      const id = childIds.get(personKey(person.name))
        || householdIds.get(personKey(person.name))
        || `KIN-${personKey(person.name)}-${personKey(person.role)}`;
      next = { ...next, id };
    }
    if (next.name.startsWith("Adelheid") && /third/i.test(next.role)) return { ...next, role: "Second wife" };
    if (next.name.startsWith("Vera") && /fourth/i.test(next.role)) return { ...next, role: "Third wife" };
    return next;
  });
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      ...blank(),
      setHydrated: () => set({ hydrated: true }),
      setSavedAt: (savedAt) => set({ savedAt }),
      setRemoteRevision: (remoteRevision) => set({ remoteRevision }),
      setReceiptPersistence: (receiptPersistence) => set({ receiptPersistence }),
      start: () => set({ view: "play", error: null, bootDone: true }),
      reset: () => set((s) => ({ ...blank(), remoteRevision: s.remoteRevision, hydrated: true, log: freshLog(), bootDone: true })),
      snapshot: () => {
        const s = get();
        return {
          version: APP_VERSION,
          view: s.view,
          dock: s.dock,
          platformOpen: s.platformOpen,
          panel: s.panel,
          world: s.world,
          inbox: s.inbox,
          news: s.news,
          worldNews: s.worldNews,
          cases: s.cases,
          threads: s.threads,
          chronicle: clampChronicle(s.chronicle),
          relations: s.relations,
          secretClocks: s.secretClocks,
          calendar: s.calendar,
          edicts: s.edicts,
          stalkers: s.stalkers,
          finds: s.finds,
          sorties: s.sorties,
          mysteries: s.mysteries,
          foreignReports: s.foreignReports,
          kin: s.kin,
          log: s.log.slice(-120),
          rollingSummary: s.rollingSummary,
          quickActions: s.quickActions,
          turnCount: s.turnCount,
          requestedDossier: s.requestedDossier,
          personalVault: s.personalVault,
          factionVault: s.factionVault,
          events: s.events.slice(0, 500),
          household: s.household,
          gates: s.gates,
          trades: s.trades,
          radio: s.radio,
          radioFreq: s.radioFreq,
          films: s.films,
          tonightFilm: s.tonightFilm,
          intel: s.intel,
          memories: s.memories.slice(0, 40),
          reputations: s.reputations,
          pregnancies: s.pregnancies,
          children: s.children,
          privateRelations: s.privateRelations,
          lastDigest: s.lastDigest,
          p4: s.p4,
        };
      },
      loadSnapshot: (snap) => {
        const base = blank();
        const remoteRevision = get().remoteRevision;
        const worldIn = snap.world ?? base.world;
        set({
          ...base,
          remoteRevision,
          view: snap.view ?? "title",
          dock: snap.dock ?? base.dock,
          platformOpen: snap.platformOpen ?? false,
          panel: snap.panel ?? "01",
          world: {
            ...base.world,
            ...worldIn,
            clock: { ...base.world.clock, ...worldIn.clock },
            water: { ...base.world.water, ...worldIn.water },
            food: { ...base.world.food, ...worldIn.food },
            energy: { ...base.world.energy, ...worldIn.energy },
            treasury: { ...base.world.treasury, ...worldIn.treasury },
            arms: { ...base.world.arms, ...worldIn.arms },
            population: { ...base.world.population, ...worldIn.population },
            indices: { ...base.world.indices, ...worldIn.indices },
            blocs: { ...base.world.blocs, ...worldIn.blocs },
            surface: { ...base.world.surface, ...worldIn.surface },
            dayIndex: worldIn.dayIndex ?? 0,
            lastWeeklyRelicDay: worldIn.lastWeeklyRelicDay ?? 0,
          },
          inbox: snap.inbox ?? base.inbox,
          news: snap.news ?? base.news,
          worldNews: snap.worldNews ?? base.worldNews,
          cases: snap.cases ?? base.cases,
          threads: snap.threads ?? base.threads,
          chronicle: restoreSnapshotArray(snap.chronicle, base.chronicle),
          relations: snap.relations ?? base.relations,
          secretClocks: snap.secretClocks ?? base.secretClocks,
          calendar: snap.calendar ?? base.calendar,
          edicts: snap.edicts ?? base.edicts,
          stalkers: snap.stalkers ?? base.stalkers,
          finds: snap.finds ?? base.finds,
          sorties: snap.sorties ?? base.sorties,
          mysteries: snap.mysteries ?? base.mysteries,
          foreignReports: snap.foreignReports ?? base.foreignReports,
          kin: migrateKin(
            snap.kin ?? base.kin,
            snap.children ?? base.children,
            migrateHousehold(restoreSnapshotArray(snap.household, base.household)),
          ),
          log: snap.log?.length ? snap.log : freshLog(),
          rollingSummary: snap.rollingSummary ?? base.rollingSummary,
          quickActions: restoreSnapshotArray(snap.quickActions, base.quickActions),
          turnCount: snap.turnCount ?? 0,
          requestedDossier: snap.requestedDossier ?? null,
          personalVault: restoreSnapshotArray(snap.personalVault, base.personalVault),
          factionVault: restoreSnapshotArray(snap.factionVault, base.factionVault),
          events: restoreSnapshotArray(snap.events, base.events),
          household: migrateHousehold(restoreSnapshotArray(snap.household, base.household)),
          gates: restoreSnapshotArray(snap.gates, base.gates),
          trades: restoreSnapshotArray(snap.trades, base.trades),
          radio: restoreSnapshotArray(snap.radio, base.radio),
          radioFreq: snap.radioFreq ?? 91.4,
          films: restoreSnapshotArray(snap.films, base.films),
          tonightFilm: snap.tonightFilm ?? base.tonightFilm,
          intel: restoreSnapshotArray(snap.intel, base.intel),
          memories: restoreSnapshotArray(snap.memories, base.memories),
          reputations: restoreSnapshotArray(snap.reputations, base.reputations),
          pregnancies: snap.pregnancies ?? base.pregnancies,
          children: restoreSnapshotArray(snap.children, base.children).map((child) => ({
            ...child,
            ...(Number.isSafeInteger(child.birthDay) ? { birthDay: child.birthDay } : {}),
          })),
          privateRelations: normalizePrivateRelations(snap.privateRelations ?? base.privateRelations),
          lastDigest: snap.lastDigest ?? null,
          p4: normalizeP4(snap.p4 ?? base.p4),
          busy: false,
          error: null,
          failedAction: null,
          notice: null,
          hydrated: true,
          toasts: [],
          muted: get().muted,
          volume: get().volume,
          bootDone: get().bootDone,
        });
      },
      setDock: (dock) => set({ dock }),
      setPanel: (panel) => set({ panel, dock: "platform", platformOpen: true }),
      openPlatform: () => set({ platformOpen: true, dock: "platform" }),
      closePlatform: () => set({ platformOpen: false }),
      pushPlayer: (text) =>
        set({
          log: [...get().log, { id: crypto.randomUUID(), role: "player", text }],
        }),
      appendSceneVariant: (id, text) =>
        set((s) => ({
          log: s.log.map((turn) => {
            if (turn.id !== id || turn.role !== "scene") return turn;
            const variants = turn.variants?.length ? turn.variants : [turn.text];
            return { ...turn, variants: [...variants, text], activeVariant: variants.length };
          }),
        })),
      setSceneVariant: (id, index) =>
        set((s) => ({
          log: s.log.map((turn) => {
            if (turn.id !== id || turn.role !== "scene") return turn;
            const count = turn.variants?.length ?? 1;
            return { ...turn, activeVariant: Math.max(0, Math.min(count - 1, index)) };
          }),
        })),
      replaceChatLog: (log) => set({ log, view: "play", dock: "platform", platformOpen: false, busy: false, error: null, failedAction: null }),
      pushScene: (text, footer, extra) => {
        set({
          log: [
            ...get().log,
            { id: crypto.randomUUID(), role: "scene", text, footer, dice: extra?.dice },
          ],
        });
        if (footer) get().applyFooter(footer);
      },
      markLastPlayerFailed: (failed) =>
        set((s) => {
          const log = [...s.log];
          for (let i = log.length - 1; i >= 0; i -= 1) {
            if (log[i].role === "player") {
              log[i] = { ...log[i], failed };
              break;
            }
          }
          return { log };
        }),
      pushNote: (text) =>
        set({
          log: [...get().log, { id: crypto.randomUUID(), role: "note", text }],
        }),
      setBusy: (busy) => set({ busy }),
      setError: (error) => set({ error, busy: false }),
      setFailedAction: (failedAction) => set({ failedAction }),
      setNotice: (notice) => set({ notice }),
      applyFooter: (footer) =>
        set((s) => ({
          world: {
            ...s.world,
            clock: {
              ...s.world.clock,
              time: footer.time,
              floor: footer.floor,
              location: footer.floor,
            },
          },
        })),
      answerMessage: (id, patch) =>
        set((s) => ({
          inbox: s.inbox.map((m) => (m.id === id ? { ...m, status: "answered", ...patch } : m)),
        })),
      setPolicy: (resource, policy) =>
        set((s) => ({
          world: {
            ...s.world,
            [resource]: { ...s.world[resource], policy },
          },
        })),
      pinChronicle: (id) =>
        set((s) => ({
          chronicle: s.chronicle.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
        })),
      editChronicle: (id, line) =>
        set((s) => ({
          chronicle: s.chronicle.map((c) => (c.id === id ? { ...c, line } : c)),
        })),
      deleteChronicle: (id) =>
        set((s) => ({
          chronicle: s.chronicle.filter((c) => c.id !== id || c.pinned),
        })),
      addEdict: (edict) => set((s) => ({ edicts: [edict, ...s.edicts] })),
      setDossier: (requestedDossier) => set({ requestedDossier, panel: "07", dock: "platform", platformOpen: true }),
      pushToasts: (items) =>
        set((s) => ({
          toasts: [
            ...s.toasts,
            ...items.map((t) => ({ ...t, id: crypto.randomUUID() })),
          ].slice(-6),
        })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      setNightSummary: (nightSummary) => set({ nightSummary }),
      applyWorldPatch: (patch) => set(patch),
      setMuted: (muted) => set({ muted }),
      setVolume: (volume) => set({ volume }),
      setRadioFreq: (radioFreq) => set({ radioFreq }),
      setTonightFilm: (tonightFilm) => set({ tonightFilm }),
      setBootDone: (bootDone) => set({ bootDone }),
      chooseEvening: (name) =>
        set((s) => ({
          household: s.household.map((h) => ({
            ...h,
            chosenEvening: h.name === name,
            misses: h.name === name ? "low" : h.misses,
          })),
        })),
      applyAdvance: (days) => {
        const s = get();
        const { next, digest } = simulateAdvance(s, days);
        const extra = newsFromDigest(digest);
        const clock = clockFromDayIndex(next.world.dayIndex);
        const fromAbs = absMin(s.world.dayIndex, clockMinutes(s.world.clock.time));
        const baseP4 = normalizeP4(s.p4);
        const p4Rep = advanceClock(syncClock(baseP4, s.world.dayIndex, clockMinutes(s.world.clock.time)), fromAbs, absMin(next.world.dayIndex, 7 * 60), worldInputsOf({ world: next.world, gates: s.gates }), { allowCritical: true });
        const rolled = rollNewDays(p4Rep.p4, s.world.dayIndex, next.world.dayIndex);
        const world = applyCrisisStocks(next.world, baseP4, rolled);
        const gates = applyCrisisGateEffects(s.gates, baseP4, rolled);
        set({
          ...next,
          world,
          gates,
          p4: rolled,
          news: [...extra.news, ...next.news].slice(0, 24),
          lastDigest: digest,
          chronicle: [
            ...s.chronicle,
            {
              id: `c-adv-${next.world.dayIndex}`,
              line: `Time advanced ${digest.elapsed}. ${digest.major[0] ?? "Quiet continuity."}`,
              at: clock.label,
              pinned: false,
              kind: "turn",
            },
          ],
          turnCount: s.turnCount + 1,
        });
        get().pushScene(digestScene(digest), {
          time: "07:00",
          day: clock.label,
          floor: s.world.clock.floor,
          interrupt: digest.interrupt ? "critical" : "important",
          prompt: digest.interrupt ? "Decide" : "Open the Platform",
        });
        return digest;
      },
      advanceHours: (hours) => {
        const minutes = Math.max(0, Math.min(24 * 3650 * 60, Math.round(hours * 60)));
        if (!minutes) return;
        runClockAdvance(minutes);
      },
      advanceUntil: (target) => {
        const s = get();
        const from = absMin(s.world.dayIndex, clockMinutes(s.world.clock.time));
        const p4 = normalizeP4(s.p4);
        let to: number | null = null;
        if (target === "next-item") to = nextScheduled(p4.planner, from)?.at ?? null;
        else if (target === "marketday") to = nextMarketday(from, weekdayIndexOfDay0(s));
        else to = nextClockTime(from, target.time);
        if (to === null || to <= from) {
          get().pushNote("Nothing is scheduled ahead of the clock.");
          return;
        }
        runClockAdvance(to - from);
      },
      executeV45Option: (optionId) => {
        const s = get();
        const panelId = optionId.slice(0, 2);
        const option = optionsForPanel(panelId).find((o) => o.id === optionId) as RichOption | undefined;
        if (!option) { set({ notice: "Option not found in the V4.5 catalog." }); return; }
        if (option.id === "24-OPT-02") { set({ notice: "Use the Decree button on the Council panel; this order must be committed with its council queue." }); return; }
        const beforeP4 = normalizeP4(s.p4);
        const commandId = optionCommandIdentity(option.id, s.world.dayIndex, clockMinutes(s.world.clock.time));
        if (!commandId) { set({ notice: "This order has an invalid identity or world timestamp and cannot be executed." }); return; }
        if (beforeP4.appliedOptionCommandIds?.includes(commandId)) {
          set({ notice: "This order has already been executed during the current world minute." });
          return;
        }
        if (s.world.treasury.marks < option.costs.marks) { set({ notice: "Not enough treasury for this option." }); return; }
        const result = runOption({
          option,
          p4: beforeP4,
          world: s.world,
          gates: s.gates,
          trades: s.trades,
          events: s.events,
          news: s.news,
          chronicle: s.chronicle,
          turnCount: s.turnCount,
          worldInputs: worldInputsOf(s),
        });
        if (!result.ok) { set({ notice: result.notice }); return; }
        // 18-OPT-02 and 45-OPT-01 are applied inside runOption. 24-OPT-02 council stamps stay on stampDecree.
        if (option.category === "Wait") {
          const fromAbs = absMin(s.world.dayIndex, clockMinutes(s.world.clock.time));
          const reachedAbs = absMin(result.world.dayIndex, clockMinutes(result.world.clock.time));
          const advanced = applyClockContinuity({
            world: s.world, inbox: s.inbox, news: s.news, worldNews: s.worldNews,
            calendar: s.calendar, stalkers: s.stalkers, finds: s.finds, sorties: s.sorties,
            kin: s.kin, household: s.household, gates: result.gates, trades: result.trades,
            films: s.films, events: result.events, personalVault: s.personalVault,
            factionVault: s.factionVault, children: s.children, threads: s.threads,
            secretClocks: s.secretClocks, chronicle: result.chronicle, radio: s.radio,
          }, result.world, beforeP4, result.p4, fromAbs, reachedAbs);
          const clockEvents = crisisLedgerEventsSince(beforeP4, advanced.p4);
          const replayEvents = appendLedgerEvents(result.events, clockEvents);
          set({
            world: advanced.world, p4: { ...advanced.p4, appliedOptionCommandIds: appendOptionCommandIdentity(advanced.p4.appliedOptionCommandIds, commandId) }, gates: advanced.continuity.gates,
            trades: advanced.continuity.trades, events: replayEvents, news: result.news,
            chronicle: result.chronicle, calendar: advanced.continuity.calendar,
            household: advanced.continuity.household, kin: advanced.continuity.kin,
            children: advanced.continuity.children, finds: advanced.continuity.finds,
            sorties: advanced.continuity.sorties, factionVault: advanced.continuity.factionVault,
            films: advanced.continuity.films, radio: advanced.continuity.radio,
            turnCount: s.turnCount + 1, notice: result.notice,
          });
          return;
        }
        set({ world: result.world, p4: { ...result.p4, appliedOptionCommandIds: appendOptionCommandIdentity(result.p4.appliedOptionCommandIds, commandId) }, gates: result.gates, trades: result.trades, events: result.events, news: result.news, chronicle: result.chronicle, turnCount: s.turnCount + 1, notice: result.notice });
      },
      setV45Setting: (key, value) => set((s) => ({ p4: { ...s.p4, settings: { ...s.p4.settings, [key]: value } } })),
      scheduleCeremony: (draft) => set((s) => {
        const p4 = normalizeP4(s.p4);
        const result = scheduleCeremonyEngine(p4.ceremonies ?? [], s.calendar, draft, s.world.dayIndex, (name, dayIndex, startMinute, durationMinutes) => {
          if (name.trim().toLowerCase() === "christian red iv") return true;
          const end = startMinute + durationMinutes;
          const plannedOverlap = p4.planner.some((item) => {
            if (item.status !== "planned" || item.npc?.trim().toLowerCase() !== name.trim().toLowerCase()) return false;
            const appliesToDay = item.fixed && item.day === undefined ? true : item.day === dayIndex;
            if (!appliesToDay) return false;
            const match = /^(\d{2}):(\d{2})$/.exec(item.time);
            if (!match) return false;
            const itemStart = Number(match[1]) * 60 + Number(match[2]);
            const itemEnd = itemStart + (item.durMin ?? 30);
            return startMinute < itemEnd && itemStart < startMinute + durationMinutes;
          });
          if (plannedOverlap) return false;
          for (let offset = 0; offset < durationMinutes; offset += 15) {
            const absolute = dayIndex * 1440 + startMinute + offset;
            const sampleDay = Math.floor(absolute / 1440);
            const minute = absolute % 1440;
            const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
            const person = castNow(p4, sampleDay, time).find((row) => row.name.trim().toLowerCase() === name.trim().toLowerCase());
            if (!person?.available) return false;
          }
          const finalMinute = Math.max(startMinute, end - 1);
          const finalAbsolute = dayIndex * 1440 + finalMinute;
          const finalTime = `${String(Math.floor((finalAbsolute % 1440) / 60)).padStart(2, "0")}:${String(finalAbsolute % 60).padStart(2, "0")}`;
          const finalPerson = castNow(p4, Math.floor(finalAbsolute / 1440), finalTime).find((row) => row.name.trim().toLowerCase() === name.trim().toLowerCase());
          return Boolean(finalPerson?.available);
        });
        if (!result.ok || !result.ceremony) return { notice: result.message };
        const ceremony = result.ceremony;
        const event: EventLedgerEntry = {
          id: `EV-CEREMONY-SCHEDULE-${ceremony.id}`, date: ceremony.date, year: ceremony.year, time: ceremony.start,
          location: ceremony.place, type: "CEREMONY", actors: ["Christian Red IV", ...ceremony.attendees],
          cause: "Ceremony entered into the campaign calendar", immediate: `${ceremony.title} scheduled (${ceremony.status}).`,
          later: `Planned end ${ceremony.end}; estimated cost ${ceremony.costMarks} marks.`,
          evidence: "Player-created calendar record", knowledge: "player",
        };
        return { p4: { ...p4, ceremonies: result.ceremonies }, calendar: result.calendar, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      recordCeremonyOutcome: (id, outcome, note = "") => set((s) => {
        const p4 = normalizeP4(s.p4);
        const result = recordCeremonyOutcomeEngine(p4.ceremonies ?? [], s.calendar, id, outcome, s.world.dayIndex, s.world.clock.time, note);
        if (!result.ok || !result.ceremony) return { notice: result.message };
        if (outcome === "held" && s.world.treasury.marks < result.ceremony.costMarks) {
          return { notice: `Not enough treasury to complete this ceremony. Required: ${result.ceremony.costMarks} marks.` };
        }
        const ceremony = result.ceremony;
        const world = outcome === "held" ? { ...s.world, treasury: { ...s.world.treasury, marks: s.world.treasury.marks - ceremony.costMarks } } : s.world;
        const event: EventLedgerEntry = {
          id: `EV-CEREMONY-OUTCOME-${ceremony.id}-${outcome}`, date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time,
          location: ceremony.place, type: "CEREMONY", actors: ["Christian Red IV", ...ceremony.attendees],
          cause: `${ceremony.title} outcome recorded`, immediate: `${ceremony.title}: ${outcome}.`,
          later: note.trim() ? note.trim().slice(0, 500) : undefined,
          evidence: "Player-recorded ceremony outcome", knowledge: "player",
        };
        const chronicle = outcome === "held" ? [...s.chronicle, { id: `CH-${event.id}`, line: `${ceremony.title} was held at ${ceremony.place}.`, at: `${s.world.clock.time} ${s.world.clock.date}`, pinned: false, kind: "turn" as const }] : s.chronicle;
        return { p4: { ...p4, ceremonies: result.ceremonies }, calendar: result.calendar, events: appendLedgerEvents(s.events, event), world, chronicle: clampChronicle(chronicle), notice: result.message };
      }),
      createInvestigationCase: (title, options) => set((s) => {
        const p4 = normalizeP4(s.p4);
        const result = createInvestigationCaseEngine(p4.investigationCases ?? [], title, s.world.dayIndex, options);
        if (!result.created) return { notice: result.message };
        const event: EventLedgerEntry = {
          id: `EV-INV-OPEN-${result.created.id}`, date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time,
          location: "Investigation Office", type: "INVESTIGATION", actors: ["Christian Red IV"],
          cause: result.created.kind === "missing-person-inquiry" ? "Player opened an unverified missing-person inquiry" : "Player opened an investigation file",
          immediate: result.created.title,
          later: result.created.kind === "missing-person-inquiry" ? "Subject and source reference were supplied by the player; no disappearance is confirmed by this entry." : undefined,
          evidence: result.created.kind === "missing-person-inquiry" ? "Player-supplied reference (unverified)" : "Player-authored case register", knowledge: "player",
        };
        return { p4: { ...p4, investigationCases: result.rows }, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      linkInvestigationClue: (caseId, clueId) => set((s) => {
        const p4 = normalizeP4(s.p4);
        if (!p4.clues.some((clue) => clue.id === clueId)) return { notice: "Clue not found in the current evidence board." };
        const result = linkInvestigationClueEngine(p4.investigationCases ?? [], caseId, clueId, s.world.dayIndex);
        if (!result.ok) return { notice: result.message };
        const event: EventLedgerEntry = { id: `EV-INV-LINK-${caseId}-${clueId}`, date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time, location: "Evidence Board", type: "INVESTIGATION", actors: ["Christian Red IV"], cause: `Recorded clue ${clueId} linked to ${caseId}`, immediate: "Clue association recorded; evidence classification unchanged.", evidence: "Player-authored case register", knowledge: "player" };
        return { p4: { ...p4, investigationCases: result.rows }, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      addInvestigationNote: (caseId, text) => set((s) => {
        const p4 = normalizeP4(s.p4);
        const result = addInvestigationNoteEngine(p4.investigationCases ?? [], caseId, text, s.world.dayIndex);
        if (!result.ok) return { notice: result.message };
        const target = result.rows.find((row) => row.id === caseId);
        const note = target?.notes.at(-1);
        if (!note) return { notice: "The note could not be recorded." };
        const event: EventLedgerEntry = { id: `EV-INV-NOTE-${note.id}`, date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time, location: "Investigation Office", type: "INVESTIGATION", actors: ["Christian Red IV"], cause: `Note added to ${caseId}`, immediate: note.text, evidence: "Player-authored note", knowledge: "player" };
        return { p4: { ...p4, investigationCases: result.rows }, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      setInvestigationCaseStatus: (caseId, status, archiveNote = "") => set((s) => {
        const p4 = normalizeP4(s.p4);
        const result = setInvestigationStatusEngine(p4.investigationCases ?? [], caseId, status, s.world.dayIndex, archiveNote);
        if (!result.ok) return { notice: result.message };
        const event: EventLedgerEntry = { id: `EV-INV-STATUS-${caseId}-${status}-${s.world.dayIndex}`, date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time, location: "Investigation Office", type: "INVESTIGATION", actors: ["Christian Red IV"], cause: `Investigation status changed: ${caseId}`, immediate: `Case status: ${status}.`, later: status === "archived" ? archiveNote.trim().slice(0, 500) : undefined, evidence: "Player-authored case register", knowledge: "player" };
        return { p4: { ...p4, investigationCases: result.rows }, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      createPrivateInteractionRequest: (personId, kind) => set((s) => {
        const result = createPrivateInteractionRequestEngine(s.privateRelations, personId, kind, s.world.dayIndex, s.world.clock.time);
        if (!result.request) return { notice: result.message };
        const event: EventLedgerEntry = {
          id: `EV-PR-REQUEST-${result.request.id}`, date: s.world.clock.date, year: s.world.clock.year,
          time: s.world.clock.time, location: s.world.clock.floor, type: "PRIVATE_RELATIONSHIP",
          actors: ["Christian Red IV", result.request.personName], cause: `Player submitted a ${kind} request`,
          immediate: "A request was recorded. No acceptance, affection or consent is inferred.",
          evidence: "Player command record", knowledge: "player",
        };
        return { privateRelations: result.state, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      finalizePrivateMarriage: (personId, mutualConsentEvidence, ceremonyEvidence) => set((s) => {
        const result = finalizePrivateMarriage(s.privateRelations, personId, s.world.dayIndex, s.world.clock.time, mutualConsentEvidence, ceremonyEvidence);
        if (!result.ok || !result.event || !result.relationship) return { notice: result.message };
        const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
        if (!profile) return { notice: "The Canon character record is missing." };
        const event: EventLedgerEntry = {
          ...result.event,
          date: s.world.clock.date,
          year: s.world.clock.year,
          location: s.world.clock.floor || s.world.clock.location || "Marriage / Household Hall",
        };
        const chronicle = [...s.chronicle, {
          id: `CH-${event.id}`, line: `Marriage formalized: Christian Red IV and ${profile.name}.`,
          at: `${s.world.clock.time} ${s.world.clock.date}`, pinned: false, kind: "turn" as const,
        }];
        return {
          privateRelations: result.state,
          events: appendLedgerEvents(s.events, event),
          chronicle: clampChronicle(chronicle),
          notice: result.message,
        };
      }),
      resolvePrivateInteractionRequest: (requestId, outcome, options = {}) => set((s) => {
        const result = resolvePrivateInteractionRequestEngine(s.privateRelations, requestId, outcome, {
          dayIndex: s.world.dayIndex, time: s.world.clock.time, ...options,
        });
        if (!result.ok || !result.request) return { notice: result.message };
        const profile = getPlayerWomenCanonProfiles().find((row) => row.id === result.request!.personId);
        if (!profile) return { notice: "The Canon character record is missing." };
        const event = recordPrivateRequestEvent(result.request, profile.category, s.world.clock.date, s.world.clock.year, s.world.clock.floor);
        const chronicle = [...s.chronicle, {
          id: `CH-${event.id}`, line: `${result.request.personName}: ${result.request.kind} request ${outcome}.`,
          at: `${s.world.clock.time} ${s.world.clock.date}`, pinned: false, kind: "turn" as const,
        }];
        return {
          privateRelations: result.state, events: appendLedgerEvents(s.events, event),
          chronicle: clampChronicle(chronicle), notice: result.message,
        };
      }),
      recordPrivateRelationshipDisclosure: (personId, visibility, evidence) => set((s) => {
        const result = recordPrivateRelationshipDisclosure(s.privateRelations, personId, visibility, s.world.dayIndex, evidence);
        if (!result.ok || !result.consequence) return { notice: result.message };
        const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
        if (!profile) return { notice: "The Canon character record is missing." };
        const event = recordPrivateRelationshipDisclosureEvent(
          result.consequence, profile.name, visibility, s.world.clock.date, s.world.clock.year,
          s.world.clock.time, s.world.clock.floor, evidence,
        );
        return {
          privateRelations: result.state,
          events: appendLedgerEvents(s.events, event),
          notice: result.message,
        };
      }),
      recordPrivateBoundaryBreach: (personId, evidence) => set((s) => {
        const result = recordBoundaryBreach(s.privateRelations, personId, s.world.dayIndex, s.world.clock.time, evidence);
        if (!result.ok || !result.consequence) return { notice: result.message };
        const profile = getPlayerWomenCanonProfiles().find((row) => row.id === personId);
        if (!profile) return { notice: "The Canon character record is missing." };
        if (result.duplicate) return { notice: result.message };
        const event = recordBoundaryBreachEvent(result.consequence, s.world.clock.date, s.world.clock.year, s.world.clock.time, s.world.clock.floor, profile.name, evidence);
        const privateRelations = {
          ...result.state,
          requests: result.state.requests.map((row) => row.personId === personId && row.status === "pending" ? { ...row, status: "cancelled" as const, eventId: event.id } : row),
        };
        return {
          privateRelations, reputations: applyBoundaryReputationImpact(s.reputations, profile.category),
          events: appendLedgerEvents(s.events, event),
          notice: `${result.message} Reputation review was applied to the relevant audience groups.`,
        };
      }),
      recordPrivatePregnancyEvidence: (mother, status, evidence, medicallyVerified = false, birthRecordId) => set((s) => {
        const birthRecord = birthRecordId ? s.children.find((child) => child.id === birthRecordId) : undefined;
        const result = recordPregnancyEvidence(s.pregnancies, s.privateRelations, {
          mother, status, dayIndex: s.world.dayIndex, evidence, medicallyVerified,
          birthRecord,
        });
        if (!result.ok || !result.record || !result.consequence) return { notice: result.message };
        const event = recordPregnancyEvent(result.consequence, result.record, s.world.clock.date, s.world.clock.year, s.world.clock.time);
        return {
          pregnancies: result.pregnancies, privateRelations: result.state,
          events: appendLedgerEvents(s.events, event), notice: result.message,
        };
      }),
      acknowledgeDynasticConsequence: (consequenceId, status, note = "") => set((s) => {
        const result = acknowledgeDynasticConsequenceEngine(s.privateRelations, consequenceId, status, note);
        if (!result.ok) return { notice: result.message };
        const event: EventLedgerEntry = {
          id: `EV-DYNASTIC-${consequenceId}-${status}-${s.world.dayIndex}`,
          date: s.world.clock.date, year: s.world.clock.year, time: s.world.clock.time,
          location: "Kin Hall", type: "DYNASTIC_REVIEW", actors: ["Christian Red IV"],
          cause: `Dynastic consequence ${status}`, immediate: `${consequenceId}: ${status}.`,
          later: note.trim().slice(0, 500) || undefined, evidence: "Player-recorded review", knowledge: "player",
        };
        return { privateRelations: result.state, events: appendLedgerEvents(s.events, event), notice: result.message };
      }),
      stampDecree: (seatId) => set((s) => {
        const option = decreeOrder();
        if (!option) return { notice: "The authoritative Council decree is missing from the panel 24 catalog; no resources were changed." };
        const synced = syncClock(s.p4, s.world.dayIndex, clockMinutes(s.world.clock.time));
        const result = runCouncilDecree({
          p4: synced,
          world: s.world,
          gates: s.gates,
          trades: s.trades,
          events: s.events,
          news: s.news,
          chronicle: s.chronicle,
          turnCount: s.turnCount,
          worldInputs: worldInputsOf(s),
        }, seatId);
        if (!result.ok) return { notice: result.notice };
        // One synchronous Zustand commit applies the validated typed option,
        // treasury and stock deductions, queue, receipt and idempotency key.
        return {
          world: result.world,
          p4: result.p4,
          gates: result.gates,
          trades: result.trades,
          events: result.events,
          news: result.news,
          chronicle: clampChronicle(result.chronicle),
          turnCount: s.turnCount + 1,
          notice: `Decree applied locally; account save pending: ${option.title}.`,
        };
      }),
      applyP4: (p4) => set((s) => {
        const before = normalizeP4(s.p4);
        const next = normalizeP4(p4);
        const ledgerRows = crisisLedgerEventsSince(before, next);
        return {
          p4: next,
          events: appendLedgerEvents(s.events, ledgerRows),
          world: applyCrisisStocks(s.world, before, next),
          gates: applyCrisisGateEffects(s.gates, before, next),
        };
      }),
      runP4Week: () => set((s) => ({ p4: simulateWeek(syncClock(s.p4, s.world.dayIndex, clockMinutes(s.world.clock.time)), worldInputsOf(s)) })),
    }),
    {
      name: "egunsentia-v45-demo",
      version: 4,
      skipHydration: true,
      migrate: (persisted: unknown) => ({ ...(persisted as Record<string, unknown>), version: APP_VERSION, p4: normalizeP4((persisted as any)?.p4 ?? defaultP4State()) }),
      partialize: (s) => {
        // This timestamp belongs to the browser copy, not just the last remote
        // sync. Every persisted state mutation must be able to win over an
        // older account snapshot after an offline/abruptly closed session.
        const out: Record<string, unknown> = { version: APP_VERSION, savedAt: Date.now() };
        for (const k of persistKeys) out[k] = s[k];
        return out;
      },
    },
  ),
);

const PANEL_CMD: Record<string, string> = {
  messages: "01",
  "01": "01",
  news: "02",
  internal: "02",
  "02": "02",
  "world report": "03",
  external: "03",
  "03": "03",
  cases: "04",
  edicts: "12",
  "04": "04",
  calendar: "05",
  "05": "05",
  status: "06",
  "06": "06",
  household: "08",
  wives: "08",
  "08": "08",
  vault: "09",
  "personal vault": "09",
  "09": "09",
  "faction vault": "10",
  "10": "10",
  atlas: "11",
  lore: "11",
  "11": "11",
  radio: "13",
  "13": "13",
  projector: "14",
  films: "14",
  "14": "14",
  surface: "15",
  watch: "15",
  "15": "15",
  diplomatic: "16",
  "16": "16",
  kin: "17",
  "17": "17",
  borders: "18",
  gates: "18",
  "18": "18",
  events: "19",
  ledger: "19",
  "19": "19",
  intelligence: "20",
  "black layer": "20",
  "20": "20",
  trade: "21",
  "21": "21",
  relics: "22",
  "22": "22",
  military: "23",
  "23": "23",
  time: "24",
  advance: "24",
  "24": "24",
};

const clockMinutes = (t: string) => Number.parseInt(t.slice(0, 2), 10) * 60 + Number.parseInt(t.slice(3, 5), 10);
const WEEKDAY_ORDER = ["Ironday", "Wellday", "Voiceday", "Stoneday", "Watchday", "Marketday", "Ashday"];
/** Weekday index (0..6) that day 0 falls on, derived from the current clock. */
function weekdayIndexOfDay0(s: { world: { dayIndex: number; clock: { weekday: string } } }): number {
  const cur = Math.max(0, WEEKDAY_ORDER.indexOf(s.world.clock.weekday));
  return (((cur - s.world.dayIndex) % 7) + 7) % 7;
}
/** Ratios + discrete flags the V4.5 engine needs, read from the live world. */
export function worldInputsOf(s: { world: WorldState; gates: GameStore["gates"] }): WorldInputs {
  const ratio = (r: { stock: number; capacity: number }) => (r.capacity > 0 ? Math.max(0, Math.min(1, r.stock / r.capacity)) : 1);
  const gates: Record<string, string> = {};
  for (const g of s.gates) gates[g.id] = g.visual === "normal" ? "NORMAL" : g.visual === "combat" ? "COMBAT" : g.visual === "breach" ? "BREACHED" : "DESTROYED";
  return { water: ratio(s.world.water), food: ratio(s.world.food), energy: ratio(s.world.energy), gates };
}

function runClockAdvance(minutes: number) {
  const s = useGame.getState();
  const fromAbs = absMin(s.world.dayIndex, clockMinutes(s.world.clock.time));
  const rep = advanceClock(syncClock(s.p4, s.world.dayIndex, clockMinutes(s.world.clock.time)), fromAbs, fromAbs + minutes, worldInputsOf(s));
  const w = s.world;
  const advanced = applyClockContinuity({
    world: s.world, inbox: s.inbox, news: s.news, worldNews: s.worldNews,
    calendar: s.calendar, stalkers: s.stalkers, finds: s.finds, sorties: s.sorties,
    kin: s.kin, household: s.household, gates: s.gates, trades: s.trades,
    films: s.films, events: s.events, personalVault: s.personalVault,
    factionVault: s.factionVault, children: s.children, threads: s.threads,
    secretClocks: s.secretClocks, chronicle: s.chronicle, radio: s.radio,
  }, s.world, normalizeP4(s.p4), rep.p4, fromAbs, rep.reachedMin);
  const world = advanced.world;
  const rolled = advanced.p4;
  const clock = clockFromDayIndex(world.dayIndex, world.clock.time);
  const hrs = Math.round((advanced.elapsedMinutes / 60) * 10) / 10;
  const clockEvent: EventLedgerEntry | null = advanced.elapsedMinutes > 0 ? {
    id: `EV-CLOCK-${fromAbs}-${rep.reachedMin}`,
    date: world.clock.date, year: world.clock.year, time: world.clock.time, location: world.clock.floor,
    type: "TIME_ADVANCE", actors: ["World systems"], cause: "The player advanced the Command Deck clock",
    immediate: `Clock advanced ${hrs} hour(s) and reached ${clock.label}.`,
    evidence: "World clock simulation", knowledge: "player",
  } : null;
  const replayEvents = appendLedgerEvents(
    s.events,
    [...crisisLedgerEventsSince(normalizeP4(s.p4), rolled), ...(clockEvent ? [clockEvent] : [])],
  );
  useGame.setState({
    world, p4: rolled, gates: advanced.continuity.gates, events: replayEvents, turnCount: s.turnCount + 1,
    calendar: advanced.continuity.calendar, household: advanced.continuity.household,
    kin: advanced.continuity.kin, children: advanced.continuity.children,
    finds: advanced.continuity.finds, sorties: advanced.continuity.sorties,
    factionVault: advanced.continuity.factionVault, films: advanced.continuity.films,
    radio: advanced.continuity.radio, trades: advanced.continuity.trades,
    notice: rep.stopped ? `Stopped: ${rep.reason}` : `Time advanced ${hrs} hour${hrs === 1 ? "" : "s"}.`,
  });
  const crisis = rolled.crisis?.active ? rolled.crisis : null;
  useGame.getState().pushScene(
    `The Command Deck advances the clock to ${clock.label}. Work, watches, meals and maintenance continue; no action is invented for Christian.${rep.stopped ? ` The advance stops early: ${rep.reason}.` : ""}`,
    { time: world.clock.time, day: clock.label, floor: w.clock.floor, interrupt: crisis ? (crisis.severity === "normal" ? "important" : "critical") : "normal", prompt: crisis ? "Crisis Protocol" : "Open the Platform" },
  );
}

export function localCommand(raw: string): "handled" | "briefing" | "continue" {
  const q = raw.trim().toLowerCase();
  const g = useGame.getState();

  if (/^open( the)? platform$/.test(q) || q === "platform" || q === "compact") {
    g.openPlatform();
    g.pushNote("The Platform is open. The scene holds.");
    return "handled";
  }
  if (/^close( the)? platform$/.test(q)) {
    g.closePlatform();
    g.pushNote("The Platform closes. The scene resumes.");
    return "handled";
  }

  const spec = parseAdvanceSpec(raw);
  if (spec?.kind === "hours") {
    g.advanceHours(spec.n);
    return "handled";
  }
  if (spec?.kind === "until") {
    g.advanceUntil(spec.target);
    return "handled";
  }
  const days = parseAdvance(raw);
  if (days != null && days > 0) {
    g.applyAdvance(days);
    return "handled";
  }

  if (PANEL_CMD[q]) {
    g.setPanel(PANEL_CMD[q]);
    return "handled";
  }

  if (/^special report on (.+)/.test(q)) {
    const name = q.replace(/^special report on\s+/i, "").trim();
    g.setDossier(name);
    return "handled";
  }
  if (/\bcast\b/.test(q) && q.length < 40) {
    g.setDock("cast");
    return "handled";
  }
  if (/^(quests?|threads?|seeds?)$/.test(q)) {
    g.setDock("threads");
    return "handled";
  }
  if (/^chronicle$/.test(q)) {
    g.setDock("chronicle");
    return "handled";
  }
  // The scripted 10:00 briefing is Day-1 content. Once it has been delivered
  // (or the world has moved past Day 1) it must never replay, because it
  // resets the clock to 10:00 Ironday and would rewind the campaign.
  const briefed =
    g.chronicle.some((c) => c.id.startsWith("c-brief-")) || g.world.dayIndex > 0 || g.turnCount > 1;
  if (q === "open") {
    if (briefed) {
      g.openPlatform();
      g.pushNote("The Platform is open. The scene holds.");
      return "handled";
    }
    return "briefing";
  }
  if (
    !briefed &&
    /wait until (the )?briefing|wait for (samer|the briefing)|go to (the )?briefing|morning briefing/.test(q)
  ) {
    return "briefing";
  }
  return "continue";
}

export function applyBriefing() {
  const g = useGame.getState();
  g.pushScene(BRIEFING_SCENE, BRIEFING_FOOTER);
  useGame.setState({
    world: {
      ...g.world,
      clock: {
        ...g.world.clock,
        time: "10:00",
        location: "Reception Hall",
        floor: "Floor 5, Reception Hall",
      },
    },
    chronicle: [
      ...g.chronicle,
      {
        id: `c-brief-${Date.now()}`,
        line: "10:00 Ironday. Samer delivers the morning briefing. Cistern, Latch tracks, Albrecht's rites, Dreyer's offer.",
        at: "10:00 Ironday 20 Ironmonth",
        pinned: false,
        kind: "turn",
      },
    ],
    turnCount: g.turnCount + 1,
  });
}

export function migrateLegacySave() {
  try {
    if (localStorage.getItem("egunsentia-v45-demo")) return;
    const v15 = localStorage.getItem("egunsentia-v15");
    const v1 = localStorage.getItem("egunsentia-v1.5");
    const old = v15 || v1;
    if (old) localStorage.setItem("egunsentia-v45-demo", old);
  } catch {
    /* ignore */
  }
}
