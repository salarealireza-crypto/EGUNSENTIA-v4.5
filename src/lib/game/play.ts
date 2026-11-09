import { playTurn } from "./gm";
import { applyDelta, parseStateDelta } from "./delta";
import { parseGm } from "./parse";
import { persistSave } from "./save";
import { createLatestSaveQueue } from "./save-queue";
import { createInFlightSaveDeduper } from "./save-autosave";
import { receiptPersistenceFromStorage } from "./receipt-persistence.mjs";
import { describeSaveFailure, SAVE_FAILURE_NOTICE_INTERVAL_MS } from "./save-errors.mjs";
import { buildRollingMemorySummary } from "./rolling-memory.mjs";
import { getPlayerWomenCanonProfiles, PRIVATE_RELATIONS_ROSTER_GAPS } from "./sim/private-relations.ts";
import { fitCompactStateBudget } from "./compact-state.mjs";
import { playSfx } from "./sound";
import { applyBriefing, localCommand, useGame } from "./store";
import type { GameSnapshot, MemoryPack } from "./types";

const HOUR = 60 * 60 * 1000;
const MAX_LOCAL = 40;
const RATE_KEY = "egunsentia-v45-demo-rate";
let lastSaveFailureKind: string | null = null;
let lastSaveFailureNoticeAt = 0;
let lastConfirmedSnapshotKey: string | null = null;
let lastConfirmedStorage: "persistent" | "ephemeral" | null = null;
const coalesceSaveFlush = createInFlightSaveDeduper<SaveFlushOutcome>();

export type SaveFlushOutcome =
  | { status: "committed"; storage: "persistent"; revision: number }
  | { status: "ephemeral"; storage: "ephemeral"; revision: number }
  | { status: "unchanged"; storage: "persistent" | "ephemeral" | null }
  | { status: "superseded" }
  | { status: "blocked" }
  | { status: "failed"; kind: string };

/** Mark the account copy read by loadSave() as the current remote baseline. */
export function markRemoteSaveBaseline(
  payload: unknown | null,
  storage?: "persistent" | "ephemeral",
) {
  if (payload === null) {
    lastConfirmedSnapshotKey = null;
    lastConfirmedStorage = storage ?? null;
    return;
  }
  lastConfirmedStorage = storage ?? null;
  try {
    const serialized = JSON.stringify(payload);
    lastConfirmedSnapshotKey = typeof serialized === "string" ? serialized : null;
  } catch {
    lastConfirmedSnapshotKey = null;
  }
}

function allowLocalTurn() {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    const now = Date.now();
    const parsed = raw ? (JSON.parse(raw) as { t: number; n: number }) : { t: now, n: 0 };
    const bucket = now - parsed.t > HOUR ? { t: now, n: 0 } : parsed;
    if (bucket.n >= MAX_LOCAL) return false;
    bucket.n += 1;
    localStorage.setItem(RATE_KEY, JSON.stringify(bucket));
    return true;
  } catch {
    return true;
  }
}

export function buildMemory(): MemoryPack {
  const g = useGame.getState();
  const pinned = g.chronicle.filter((c) => c.pinned).map((c) => `${c.at} — ${c.line}`);
  const canonChanges = g.chronicle.filter((c) => c.kind === "canon").map((c) => c.line);
  const edicts = g.edicts.filter((e) => e.status === "active").map((e) => (e.standing ? `[standing] ${e.text}` : e.text));
  let rolling = g.rollingSummary;
  if (g.turnCount > 0 && g.turnCount % 8 === 0) {
    const rebuilt = buildRollingMemorySummary(g.chronicle, 1200);
    if (rebuilt && rebuilt !== rolling) {
      rolling = rebuilt;
      // Zustand persist writes this locally; flushSave also commits the summary
      // to durable account storage instead of leaving it only in memory.
      useGame.setState({ rollingSummary: rolling });
      void flushSave();
    }
  }
  return {
    rollingSummary: rolling.slice(-1200),
    pinned: pinned.slice(-24),
    canonChanges: canonChanges.slice(-20),
    threads: g.threads.filter((t) => t.status === "active").slice(-24).map((t) => `${t.id} ${t.title}: ${t.summary}`.slice(0, 500)),
    edicts: edicts.slice(-24).map((edict) => edict.slice(0, 500)),
    turnCount: g.turnCount,
  };
}

function compactText(value: unknown, max = 180): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/**
 * Deterministic, schema-aware AL state projection. Essential current world
 * values are retained; lower-priority history is trimmed from the tail until
 * the serialized state fits the server-side request budget.
 */
export function compactState() {
  const g = useGame.getState();
  const privateRoster = getPlayerWomenCanonProfiles();
  const privateProfileById = new Map(privateRoster.map((person) => [person.id, person]));
  const compact = {
    clock: {
      weekday: compactText(g.world.clock.weekday, 40),
      date: compactText(g.world.clock.date, 60),
      year: compactText(g.world.clock.year, 40),
      time: compactText(g.world.clock.time, 40),
      location: compactText(g.world.clock.location, 100),
      floor: compactText(g.world.clock.floor, 80),
    },
    water: { ...g.world.water },
    food: { ...g.world.food },
    energy: { ...g.world.energy },
    treasury: { ...g.world.treasury },
    arms: { ...g.world.arms },
    population: { ...g.world.population },
    indices: Object.fromEntries(Object.entries(g.world.indices).slice(0, 32)),
    blocs: { ...g.world.blocs },
    surface: {
      garrison: compactText(g.world.surface.garrison, 120),
      sorties: compactText(g.world.surface.sorties, 120),
      cleansing: compactText(g.world.surface.cleansing, 120),
      weekSorties: g.world.surface.weekSorties,
      weekLimit: g.world.surface.weekLimit,
    },
    inbox: g.inbox.slice(0, 8).map((item) => ({
      id: compactText(item.id, 80), from: compactText(item.from, 80), office: compactText(item.office, 80),
      time: compactText(item.time, 60), body: compactText(item.body, 180), status: item.status,
      urgency: item.urgency, deadline: compactText(item.deadline, 60),
    })),
    news: g.news.slice(0, 6).map((item) => ({
      id: compactText(item.id, 80), source: compactText(item.source, 80), time: compactText(item.time, 60),
      body: compactText(item.body, 160), tag: item.tag, reliability: item.reliability,
    })),
    worldNews: g.worldNews.slice(0, 6).map((item) => ({
      id: compactText(item.id, 80), headline: compactText(item.headline, 120), tag: item.tag,
      source: compactText(item.source, 80), reliability: item.reliability, body: compactText(item.body, 160),
    })),
    cases: g.cases.slice(0, 6).map((item) => ({
      id: compactText(item.id, 80), accused: compactText(item.accused, 80), charge: compactText(item.charge, 140),
      status: compactText(item.status, 40), evidence: (item.evidence ?? []).slice(0, 2).map((x) => compactText(x, 100)),
      sentence: compactText(item.sentence, 100),
    })),
    threads: g.threads.filter((item) => item.status !== "dormant").slice(0, 12).map((item) => ({
      id: compactText(item.id, 80), title: compactText(item.title, 100), kind: item.kind,
      summary: compactText(item.summary, 160), status: item.status,
    })),
    relations: g.relations.slice(0, 12).map((item) => ({
      name: compactText(item.name, 80), trust: item.trust, respect: item.respect, fear: item.fear,
      loyalty: item.loyalty, closeness: item.closeness,
    })),
    secretClocks: g.secretClocks.slice(0, 8).map((item) => ({
      id: compactText(item.id, 80), label: compactText(item.label, 100), value: item.value, max: item.max,
    })),
    edicts: g.edicts.filter((item) => item.status === "active").slice(0, 10).map((item) => ({
      id: compactText(item.id, 80), text: compactText(item.text, 140), standing: item.standing,
      deadline: compactText(item.deadline, 60), issuedAt: compactText(item.issuedAt, 60), status: item.status,
    })),
    calendar: g.calendar.filter((item) => item.status === "planned" || item.status === "started").slice(0, 8).map((item) => ({
      id: compactText(item.id, 80), name: compactText(item.name, 80), date: compactText(item.date, 60),
      start: compactText(item.start, 40), place: compactText(item.place, 80), type: compactText(item.type, 60),
      importance: item.importance, status: item.status,
    })),
    stalkers: g.stalkers.map((item) => ({
      id: compactText(item.id, 80), name: compactText(item.name, 80), role: compactText(item.role, 70),
      dose: item.dose, sortiesInRotation: item.sortiesInRotation, status: item.status,
      rotation: item.rotation, wear: item.wear,
    })),
    mysteries: g.mysteries.slice(0, 12).map((item) => ({
      id: compactText(item.id, 80), title: compactText(item.title, 100), clues: item.clues,
      needed: item.needed, leads: item.leads.slice(0, 2).map((x) => compactText(x, 100)),
    })),
    finds: g.finds.slice(0, 6).map((item) => ({
      id: compactText(item.id, 80), name: compactText(item.name, 100), condition: compactText(item.condition, 60),
      radiation: compactText(item.radiation, 40), queue: item.queue, kind: item.kind,
    })),
    sorties: g.sorties.slice(0, 4).map((item) => ({
      id: compactText(item.id, 80), team: item.team.slice(0, 5).map((x) => compactText(x, 60)),
      objective: compactText(item.objective, 120), route: compactText(item.route, 100), hours: item.hours,
      rangeM: item.rangeM, result: compactText(item.result, 100), at: compactText(item.at, 60),
    })),
    kin: g.kin.slice(0, 16).map((item) => ({
      id: item.id, name: compactText(item.name, 80), role: compactText(item.role, 80),
      mood: compactText(item.mood, 80), ageYears: item.ageYears,
    })),
    household: g.household.slice(0, 10).map((item) => ({
      id: item.id, name: compactText(item.name, 80), mood: compactText(item.mood, 60),
      affection: item.affection, misses: item.misses, tonight: compactText(item.tonight, 80),
      chosenEvening: item.chosenEvening,
    })),
    privateRelations: {
      roster: privateRoster.map((person) => ({
        personId: person.id, name: person.name, ageYears: person.ageYears, category: person.category,
        sourceStatus: person.sourceStatus, historyDisposition: person.historyDisposition ?? "UNKNOWN",
        role: compactText(person.role, 140), relationshipEligible: person.relationshipEligible,
        powerReviewRequired: person.powerReviewRequired, canonCoverage: `${person.coverage.present}/${person.coverage.total}`,
      })),
      // These six Round 5 notes are source-backed character-card facts, not live affection, consent, eligibility, or disclosure state.
      canonRelationshipNotes: privateRoster
        .filter((person) => ["dagmar-red", "adelheid-von-moren", "vera-grotsen", "elara-red", "hanne-brauer", "wilhelmina-red"].includes(person.id))
        .map((person) => ({
          personId: person.id, name: person.name, sourceStatus: person.sourceStatus,
          note: compactText(person.relationships, 260),
          interpretation: "Reference lore only; never infer current feelings, consent, relationship state, or disclosure from this note.",
        })),
      rosterGaps: [...PRIVATE_RELATIONS_ROSTER_GAPS],
      relationships: g.privateRelations.relationships.map((item) => ({
        personId: item.personId, personName: item.personName, category: item.category,
        sourceStatus: privateProfileById.get(item.personId)?.sourceStatus ?? "UNKNOWN",
        status: item.status, visibility: item.visibility, note: compactText(item.note, 160),
      })),
      requests: g.privateRelations.requests.slice(-12).map((item) => ({
        id: item.id, personId: item.personId, personName: item.personName, kind: item.kind,
        status: item.status, dayIndex: item.dayIndex, time: item.time,
        responseNote: compactText(item.responseNote, 120),
        consentEvidence: compactText(item.consentEvidence, 120),
        freeToDeclineConfirmed: item.freeToDeclineConfirmed,
        independentSafeguard: item.independentSafeguard,
        independentSafeguardEvidence: compactText(item.independentSafeguardEvidence, 120),
      })),
      consequences: g.privateRelations.consequences.filter((item) => item.status !== "resolved").slice(0, 12).map((item) => ({
        id: item.id, kind: item.kind, title: item.title, detail: compactText(item.detail, 180),
        dayIndex: item.dayIndex, status: item.status, audiences: item.audiences,
        requiredReview: compactText(item.requiredReview, 140),
      })),
    },
    pregnancyRecords: g.pregnancies.filter((item) => item.state !== "inactive").slice(0, 12).map((item) => ({
      id: item.id, mother: item.mother, state: item.state, knowledge: item.knowledge,
      window: compactText(item.window, 50), medical: compactText(item.medical, 140),
    })),
    gates: g.gates.map((item) => ({
      id: item.id, visual: item.visual, threat: compactText(item.threat, 100),
      condition: compactText(item.condition, 100), incident: compactText(item.incident, 100),
    })),
    trades: g.trades.filter((item) => item.status === "open").slice(0, 6).map((item) => ({
      id: compactText(item.id, 80), faction: compactText(item.faction, 80), position: compactText(item.position, 80),
      request: compactText(item.request, 120), offered: compactText(item.offered, 100),
      wanted: compactText(item.wanted, 100), risk: compactText(item.risk, 80),
      deadline: compactText(item.deadline, 60), status: item.status,
    })),
    foreignReports: g.foreignReports.slice(0, 4).map((item) => ({
      id: compactText(item.id, 80), group: compactText(item.group, 80), faction: compactText(item.faction, 80),
      body: compactText(item.body, 140), tag: item.tag,
    })),
    intel: g.intel.slice(0, 4).map((item) => ({
      id: compactText(item.id, 80), title: compactText(item.title, 100), fact: compactText(item.fact, 140),
      sourceType: compactText(item.sourceType, 60), confidence: item.confidence,
    })),
    events: g.events.slice(0, 5).map((item) => ({
      id: compactText(item.id, 80), type: compactText(item.type, 60),
      immediate: compactText(item.immediate, 140), date: compactText(item.date, 60),
    })),
    radioFreq: g.radioFreq,
    tonightFilm: compactText(g.tonightFilm, 100),
    films: g.films.filter((item) => item.known).slice(0, 8).map((item) => compactText(item.title, 80)),
    vaultCount: { personal: g.personalVault.length, faction: g.factionVault.length },
    children: g.children.slice(0, 12).map((item) => ({
      id: compactText(item.id, 80), name: compactText(item.name, 80), ageYears: item.ageYears,
    })),
    dossier: compactText(g.requestedDossier, 160),
  };

  return fitCompactStateBudget(compact);
}

class RemoteSaveConflictError extends Error {}

let remoteSaveBlocked = false;

export function blockRemoteSaves() {
  remoteSaveBlocked = true;
}

export function resumeRemoteSaves() {
  remoteSaveBlocked = false;
}

const enqueueRemoteSave = createLatestSaveQueue(async (payload: GameSnapshot) => {
  const expectedRevision = useGame.getState().remoteRevision;
  if (typeof expectedRevision !== "number" || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0) {
    remoteSaveBlocked = true;
    throw new RemoteSaveConflictError(
      "The account save version is unknown. Your local campaign is safe on this device; reload while online to compare account copies.",
    );
  }
  const result = await persistSave({ data: { payload, expectedRevision } });
  if (!result.ok) {
    if (result.conflict) {
      remoteSaveBlocked = true;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("egunsentia:save-conflict"));
      }
      throw new RemoteSaveConflictError(result.error);
    }
    throw new Error(result.error);
  }
  useGame.getState().setRemoteRevision(result.revision);
  lastConfirmedSnapshotKey = JSON.stringify(payload);
  lastConfirmedStorage = result.storage;
});

async function performSaveFlush(payload: GameSnapshot): Promise<SaveFlushOutcome> {
  try {
    const saved = await enqueueRemoteSave(payload);
    if (!saved) return { status: "superseded" };

    useGame.getState().setSavedAt(Date.now());
    lastSaveFailureKind = null;
    lastSaveFailureNoticeAt = 0;
    const revision = useGame.getState().remoteRevision;
    if (typeof revision !== "number" || !Number.isSafeInteger(revision)) {
      useGame.getState().setNotice("The account save response did not include a valid revision. The device copy remains available; persistent confirmation is not recorded.");
      return { status: "failed", kind: "revision" };
    }
    useGame.getState().setReceiptPersistence(
      receiptPersistenceFromStorage(payload.p4?.lastReceipt, lastConfirmedStorage),
    );
    if (lastConfirmedStorage === "persistent") {
      return { status: "committed", storage: "persistent", revision };
    }
    if (lastConfirmedStorage === "ephemeral") {
      return { status: "ephemeral", storage: "ephemeral", revision };
    }
    useGame.getState().setNotice("The save completed without a verified storage classification. Persistent account confirmation is not recorded.");
    return { status: "failed", kind: "storage-confirmation" };
  } catch (err) {
    if (err instanceof RemoteSaveConflictError) {
      useGame.getState().setNotice(err.message);
      return { status: "blocked" };
    }
    const failure = describeSaveFailure(err);
    const now = Date.now();
    if (
      failure.kind !== lastSaveFailureKind ||
      now - lastSaveFailureNoticeAt >= SAVE_FAILURE_NOTICE_INTERVAL_MS
    ) {
      useGame.getState().setNotice(failure.notice);
      lastSaveFailureKind = failure.kind;
      lastSaveFailureNoticeAt = now;
    }
    // Never log raw provider/server errors; some adapters attach request data.
    console.error(`[save] persistent save failed (${failure.kind})`);
    return { status: "failed", kind: failure.kind };
  }
}

export function flushSave(): Promise<SaveFlushOutcome> {
  if (remoteSaveBlocked) return Promise.resolve({ status: "blocked" });

  const payload = useGame.getState().snapshot();
  let snapshotKey: string;
  try {
    const serialized = JSON.stringify(payload);
    if (typeof serialized !== "string") throw new TypeError("Campaign snapshot is not serializable.");
    snapshotKey = serialized;
  } catch {
    useGame.getState().setNotice("The campaign snapshot could not be serialized. The device copy remains available; account persistence is not confirmed.");
    return Promise.resolve({ status: "failed", kind: "serialization" });
  }

  if (snapshotKey === lastConfirmedSnapshotKey) {
    useGame.getState().setReceiptPersistence(
      receiptPersistenceFromStorage(payload.p4?.lastReceipt, lastConfirmedStorage),
    );
    return Promise.resolve({ status: "unchanged", storage: lastConfirmedStorage });
  }

  // An explicit action flush and the global autosave can fire for the same
  // snapshot. Share the pending promise so one command cannot double-write.
  return coalesceSaveFlush(snapshotKey, () => performSaveFlush(payload));
}

export async function submitAction(raw: string, opts?: { retry?: boolean }) {
  const text = raw.trim();
  if (!text) return;
  const g = useGame.getState();
  if (g.busy) return;
  g.setError(null);
  g.setNotice(null);

  if (!opts?.retry) {
    g.pushPlayer(text);
    g.setFailedAction(null);
  } else {
    g.markLastPlayerFailed(false);
  }

  const kind = localCommand(text);
  if (kind === "handled") {
    void flushSave();
    return;
  }
  if (kind === "briefing") {
    applyBriefing();
    void flushSave();
    return;
  }

  if (!allowLocalTurn()) {
    g.pushNote("The Hall is overfull this hour. Wait, then speak again.");
    return;
  }

  g.setBusy(true);
  const history = g.log
    .filter((t) => t.role === "player" || t.role === "scene")
    .slice(-10)
    .map((t) => ({ role: t.role as "player" | "scene", text: t.text }));

  let state: string;
  let memory: MemoryPack;
  try {
    state = JSON.stringify(compactState());
    memory = buildMemory();
  } catch {
    useGame.getState().setBusy(false);
    useGame.getState().setError("The current campaign state could not be compressed safely. Your saved campaign remains unchanged.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    return;
  }

  try {
    const result = await playTurn({ data: { action: text, history, state, memory } });
    if (!result.ok) {
      useGame.getState().setError(result.error);
      useGame.getState().setFailedAction(text);
      useGame.getState().markLastPlayerFailed(true);
      useGame.getState().pushNote(result.error);
      return;
    }
    const parsed = parseGm(result.text);
    const { delta, notice } = parseStateDelta(parsed.stateMissing ? null : parsed.stateRaw);
    const store = useGame.getState();
    if (delta) {
      const { next, result: applied } = applyDelta(store.snapshot(), delta);
      if (!applied.ok) {
        store.pushScene(parsed.scene, parsed.footer);
        store.setNotice(applied.notice ?? "The Platform rejected the state update. The previous campaign state was preserved.");
      } else {
      store.applyWorldPatch({
        world: next.world,
        inbox: next.inbox,
        news: next.news,
        worldNews: next.worldNews,
        cases: next.cases,
        threads: next.threads,
        chronicle: next.chronicle,
        relations: next.relations,
        secretClocks: next.secretClocks,
        calendar: next.calendar,
        edicts: next.edicts,
        stalkers: next.stalkers,
        finds: next.finds,
        sorties: next.sorties,
        mysteries: next.mysteries,
        foreignReports: next.foreignReports,
        kin: next.kin,
        household: next.household,
        privateRelations: next.privateRelations,
        pregnancies: next.pregnancies,
        gates: next.gates,
        trades: next.trades,
        films: next.films,
        intel: next.intel,
        events: next.events,
        personalVault: next.personalVault,
        factionVault: next.factionVault,
        memories: next.memories,
        reputations: next.reputations,
        radio: next.radio,
        radioFreq: next.radioFreq,
        tonightFilm: next.tonightFilm,
        rollingSummary: next.rollingSummary,
        quickActions: next.quickActions,
        turnCount: next.turnCount,
        requestedDossier: next.requestedDossier,
      });
      if (applied.toasts.length) store.pushToasts(applied.toasts);
      if (applied.adjustments?.length) {
        store.pushToasts([{ kind: "notice", text: `The Platform bounded ${applied.adjustments.length} out-of-range state values.` }]);
      }
      if (applied.nightSummary) store.setNightSummary(applied.nightSummary);
      store.pushScene(parsed.scene, parsed.footer, { dice: applied.dice });
      if (applied.dice.length) playSfx("dice");
      if (applied.toasts.some((t) => t.kind === "message" || t.kind === "knock")) playSfx("ping");
      if (parsed.footer.interrupt === "critical" || parsed.footer.interrupt === "emergency") {
        store.pushToasts([{ kind: "alert", text: parsed.footer.prompt || "Critical event." }]);
      }
      }
    } else {
      store.pushScene(parsed.scene, parsed.footer);
      store.setNotice(notice ?? "The Platform kept the last numbers — the archive sent no state this turn.");
    }
    if (notice && delta) store.setNotice(notice);
    useGame.getState().setBusy(false);
    useGame.getState().setFailedAction(null);
    useGame.getState().markLastPlayerFailed(false);
    void flushSave();
  } catch (err) {
    console.error("[play]", err);
    useGame.getState().setError("The line to the Hall went dead.");
    useGame.getState().setFailedAction(text);
    useGame.getState().markLastPlayerFailed(true);
    useGame.getState().pushNote("The line to the Hall went dead. Try the action again.");
  }
}

/** Generate another narrative answer for an existing player turn without replaying its state delta. */
export async function regenerateReply(sceneId: string) {
  const store = useGame.getState();
  if (store.busy) return;
  const sceneIndex = store.log.findIndex((turn) => turn.id === sceneId && turn.role === "scene");
  if (sceneIndex < 0) return;
  let playerIndex = sceneIndex - 1;
  while (playerIndex >= 0 && store.log[playerIndex].role !== "player") playerIndex -= 1;
  if (playerIndex < 0) return;

  const history = store.log
    .slice(0, sceneIndex + 1)
    .filter((turn) => turn.role === "player" || turn.role === "scene")
    .slice(-10)
    .map((turn) => ({ role: turn.role as "player" | "scene", text: turn.text }));
  const action =
    "Write an alternate narration of the immediately preceding assistant answer. Preserve its exact events, outcomes, decisions, consequences, and established game state. This is a narration-only alternative, not a new turn: do not advance time, perform another action, or change the outcome.";

  store.setError(null);
  store.setBusy(true);
  try {
    const result = await playTurn({
      data: { action, history, state: JSON.stringify(compactState()), memory: buildMemory() },
    });
    if (!result.ok) {
      useGame.getState().setError(result.error);
      useGame.getState().pushNote(result.error);
      return;
    }
    const parsed = parseGm(result.text);
    if (!parsed.scene.trim()) {
      useGame.getState().pushNote("The archive returned an empty alternative. The earlier answer remains intact.");
      return;
    }
    useGame.getState().appendSceneVariant(sceneId, parsed.scene);
    void flushSave();
  } catch (err) {
    console.error("[play] regenerate reply", err);
    useGame.getState().setError("The line to the Hall went dead. The earlier answer remains intact.");
  } finally {
    useGame.getState().setBusy(false);
  }
}
