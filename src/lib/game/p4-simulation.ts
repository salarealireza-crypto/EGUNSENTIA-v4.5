// V4.5 simulation layer. State is plain JSON (save-safe, additive only); logic lives in ./sim/*.
import { absMin, clamp, DEFAULT_WORLD, fromMin, TIER_RANK, type Tier, type WorldInputs } from "./sim/core.ts";
import { generateEnvoys, scoreBanquet, type BanquetOpts, type BanquetResult, type Envoy } from "./sim/banquet.ts";
import { councilPositions, type CouncilSeat } from "./sim/council.ts";
import { interruptTier, resolveCrisis as resolveCrisisImpl, shouldInterrupt, spawnCrisis, tickCrisis, type Crisis } from "./sim/crisis.ts";
import { defaultEconomy, economyTick, cascade, type Good, type Market } from "./sim/economy.ts";
import { FACTION_SEED, stepFactions, type FactionState, type Report } from "./sim/factions.ts";
import { advanceTheory, contradictions, discover, type Clue, type EvidenceClass } from "./sim/investigation.ts";
import { inspectLetter, type Letter } from "./sim/letters.ts";
import { RESEARCH_PROJECTS, tickResearchDay, type ResearchProgress } from "./sim/research.ts";
import { rollDailyEvents, nudgeRelation, type NpcStatus } from "./sim/npc.ts";
import { castNow } from "./presence";
import { addPlanItem, dueBetween, FIXED_RHYTHM, type PlanItem, type PlanOpts, type PlanResult } from "./sim/planner.ts";
import { optionsForPanel } from "@/lib/platform/options/lookup";
import type { RichOption } from "../platform/options/effects.ts";
import { normalizeCeremonies, type CeremonyRecord } from "./sim/ceremony.ts";
import { normalizeInvestigationCases, type InvestigationCase } from "./sim/investigation-cases.ts";

export type { Tier, WorldInputs, Crisis, Envoy, Letter, PlanItem, PlanResult, Clue, EvidenceClass, Report, CouncilSeat, NpcStatus };
export type FactionId = FactionState["id"];
export type P4Faction = FactionState;

export interface P4State {
  week: number;
  factions: FactionState[];
  sectors: Record<string, { pressure: number; signs: number; status: string }>;
  npcSchedule: Array<{ id: string; name: string; block: string; place: string; available: boolean }>;
  clues: Clue[];
  boardPins: string[];
  letters: Letter[];
  planner: PlanItem[];
  council: CouncilSeat[];
  banquet: { seated: string[]; result: BanquetResult };
  moments: Array<{ id: string; title: string; seen: boolean; copy: string }>;
  queue: QueueItem[];
  crisis: Crisis | null;
  log: string[];
  settings: { assist: "Story" | "Steward" | "Hard Winter"; reducedMotion: boolean; highContrast: boolean; textScale: number; runtimeArt: boolean; tts: boolean };
  unlockedAssets: string[];
  // ---- additive in V4.5 depth pass (all filled by normalizeP4 for older saves) ----
  now?: { day: number; minute: number };
  envoys?: Envoy[];
  reports?: Report[];
  rumors?: string[];
  newsFeed?: string[];
  redLedger?: string[];
  relations?: Record<string, number>;
  memories?: Array<{ day: number; text: string; npc?: string }>;
  npcStatus?: Record<string, NpcStatus>;
  crisisBacklog?: string[];
  crisisHistory?: Array<{ kind: string; outcome: "resolved" | "failed"; atMin: number; affectedGateIds?: string[] }>;
  chronicleNotes?: string[];
  lastPlan?: PlanResult;
  economy?: Record<Good, Market>;
  spent?: { marks: number; hours: number };
  flags?: Record<string, boolean>;
  deskNotes?: string[];
  researchProjects?: Record<string, ResearchProgress>;
  lastReceipt?: ReceiptSlip | null;
  gaugeShift?: Record<string, "up" | "down" | "flat">;
  /** Additive, save-safe state for the ceremony desk. */
  ceremonies?: CeremonyRecord[];
  /** Case lifecycle remains separate from the legal/Justice case register. */
  investigationCases?: InvestigationCase[];
  /** Idempotency keys for persisted council decrees; capped to keep old saves small. */
  appliedCouncilCommandIds?: string[];
  /** Idempotency keys for successful generic option executions; capped for save size. */
  appliedOptionCommandIds?: string[];
}

export interface QueueItem {
  id: string;
  dueDay: number;
  /** Exact absolute minute deadline; absent on legacy/day-based queue entries. */
  dueMin?: number;
  label: string;
  source: string;
  visibility: "public" | "private" | "secret";
  /** Applied when the item comes due. The delta is never written into player-facing text. */
  relationHit?: { faction: string; delta: number };
  /** Option title, shown later as "Because of". */
  becauseOf?: string;
  becauseId?: string;
}

export interface ReceiptSlip {
  optionId: string;
  title: string;
  done: string[];
  spent: string[];
  hear: string[];
  written: string[];
}

/** Runtime display status derived from the last confirmed save/load result. */
export type ReceiptPersistence = "pending" | "account-committed" | "ephemeral" | "device-only";

/** Resolve the actual Council decree from the authoritative panel 24 catalog.
 * Missing catalog data is a blocker; no fallback costs or delays are invented. */
export function decreeOrder(): RichOption | null {
  return optionsForPanel("24").find((option) => option.id === "24-OPT-02") ?? null;
}

const moments = [
  ["gate-breached", "Gate Breached", "Smoke reaches the wall lamps; the platform records the breach."], ["gate-falls", "Gate Falls", "The state crosses a line that cannot be narrated away."], ["latch-seals-open", "Latch Seals Open", "The old seal gives; the Surface Watch begins the descent."], ["surface-return", "Return From the Surface", "Boots, ash and tagged finds cross the quarantine line."], ["recovered-reel", "A Recovered Reel Plays", "A projector beam catches a frame that was not expected."], ["birth", "A Birth", "Lamp, hands and folded cloth; the household continues."], ["rites-at-ash", "Rites at the Ash", "Names are spoken and the living stand together."], ["wedding", "A Wedding", "A public promise is made; the Chronicle remembers it."], ["banquet-toast", "State Banquet Toast", "The room raises its glasses without deciding tomorrow."], ["treason-verdict", "Treason Hearing Verdict", "A verdict enters the ledger with evidence attached."], ["water-rite", "Water Rite", "The cistern is opened by ritual, then sealed again."], ["sixth-carrier", "The Sixth Carrier Is Tuned", "At 108.0 after midnight, the unexplained signal returns."],
].map(([id, title, copy]) => ({ id, title, copy, seen: false }));

const seedClues = (): Clue[] => [
  { id: "CL-M3", label: "Skyline reel origin", evidence: "THEORY", source: "Projector archive", linked: ["43"], discovered: true, reliability: 0.6, supports: [] },
  { id: "CL-M5", label: "Irregular signal", evidence: "OBSERVED", source: "Radio 108.0", linked: ["42", "37"], discovered: true, reliability: 0.8, supports: ["CL-M5T"] },
  { id: "CL-GATE", label: "Eastern tracks", evidence: "OBSERVED", source: "Surface Watch", linked: ["15", "18"], discovered: true, reliability: 0.75, supports: ["CL-M5T"] },
  { id: "CL-M5T", label: "The signal is not a Red Claw set", evidence: "UNKNOWN", source: "Radio log analysis", linked: ["42"], discovered: false, requires: ["CL-M5", "CL-GATE"], reliability: 0.5 },
  { id: "CL-RUM", label: "A courier saw lights beyond the east wall", evidence: "RUMOR", source: "Market talk", linked: ["15"], discovered: true, reliability: 0.3, falseLead: true, contradicts: ["CL-GATE"], supports: ["CL-M5T"] },
];
const seedLetters = (): Letter[] => [
  { id: "L-01", sender: "Commissar Anton Dreyer", seal: "UNKNOWN", route: "North rail", handwriting: "formal block script", truth: "AUTHENTIC", faction: "Grotsen Dominion" },
  { id: "L-02", sender: "Monarchian court circular", seal: "AUTHENTIC", route: "Diplomatic courier", handwriting: "archival hand", truth: "AUTHENTIC", faction: "Monarchia" },
  { id: "L-03", sender: "Unsigned supply notice", seal: "UNKNOWN", route: "Unlogged courier", handwriting: "hurried copy hand", truth: "FORGED", faction: "Survivors" },
];

export function defaultP4State(): P4State {
  return normalizeP4({
    week: 0, factions: structuredClone(FACTION_SEED),
    sectors: { east: { pressure: 4, signs: 2, status: "watched" }, west: { pressure: 2, signs: 0, status: "quiet" }, north: { pressure: 3, signs: 1, status: "watched" }, "lost-lines": { pressure: 5, signs: 3, status: "unstable" } },
    npcSchedule: [{ id: "samer", name: "Samer Vogt", block: "10:00", place: "Reception Hall", available: true }, { id: "dagmar", name: "Dagmar Red", block: "12:00", place: "Eastern Wall", available: true }, { id: "wilhelmina", name: "Wilhelmina Red", block: "20:00", place: "Evening Hall", available: true }],
    clues: seedClues(), boardPins: [], letters: seedLetters(), planner: structuredClone(FIXED_RHYTHM),
    council: councilPositions(DEFAULT_WORLD), banquet: { seated: [], result: "unplanned" }, moments: structuredClone(moments), queue: [], crisis: null,
    log: ["P4 simulation initialized from day-one state."],
    settings: { assist: "Steward", reducedMotion: false, highContrast: false, textScale: 1, runtimeArt: false, tts: false }, unlockedAssets: [],
  } as P4State);
}

/** Fill every additive field so any older save (V4.1 / early V4.5 demo) is safe to feed to the engine. */
export function normalizeP4(p: Partial<P4State> | null | undefined): P4State {
  const b = (p ?? {}) as P4State;
  const out: P4State = {
    ...b,
    week: b.week ?? 0,
    factions: (b.factions?.length ? b.factions : structuredClone(FACTION_SEED)).map((f) => {
      const seed = FACTION_SEED.find((s) => s.id === f.id);
      return { ...seed, ...f } as FactionState;
    }),
    sectors: b.sectors ?? { east: { pressure: 4, signs: 2, status: "watched" } },
    npcSchedule: b.npcSchedule ?? [],
    clues: (b.clues ?? seedClues()).map((c) => ({ discovered: c.discovered ?? true, ...c })),
    boardPins: b.boardPins ?? [],
    letters: (b.letters ?? seedLetters()).map((l) => {
      const seed = seedLetters().find((s) => s.id === l.id);
      return { ...l, truth: l.truth ?? seed?.truth ?? "AUTHENTIC", faction: l.faction ?? seed?.faction };
    }),
    planner: b.planner?.length ? b.planner : structuredClone(FIXED_RHYTHM),
    council: b.council ?? councilPositions(DEFAULT_WORLD),
    banquet: b.banquet ?? { seated: [], result: "unplanned" },
    moments: b.moments ?? structuredClone(moments),
    queue: normalizeQueueItems(b.queue),
    crisis: b.crisis ?? null,
    log: b.log ?? [],
    settings: b.settings ?? { assist: "Steward", reducedMotion: false, highContrast: false, textScale: 1, runtimeArt: false, tts: false },
    unlockedAssets: b.unlockedAssets ?? [],
    now: b.now ?? { day: 0, minute: 7 * 60 },
    envoys: b.envoys?.length ? b.envoys : generateEnvoys(),
    reports: b.reports ?? [], rumors: b.rumors ?? [], newsFeed: b.newsFeed ?? [], redLedger: b.redLedger ?? [],
    relations: b.relations ?? {}, memories: b.memories ?? [], npcStatus: b.npcStatus ?? {},
    crisisBacklog: b.crisisBacklog ?? [], crisisHistory: b.crisisHistory ?? [], chronicleNotes: b.chronicleNotes ?? [],
    economy: b.economy ?? defaultEconomy(), spent: b.spent ?? { marks: 0, hours: 0 },
    flags: b.flags ?? {}, deskNotes: b.deskNotes ?? [], ceremonies: normalizeCeremonies(b.ceremonies), investigationCases: normalizeInvestigationCases(b.investigationCases), appliedCouncilCommandIds: Array.isArray(b.appliedCouncilCommandIds) ? b.appliedCouncilCommandIds.filter((id): id is string => typeof id === "string" && id.length > 0).slice(-500) : [], appliedOptionCommandIds: Array.isArray(b.appliedOptionCommandIds) ? b.appliedOptionCommandIds.filter((id): id is string => typeof id === "string" && id.length > 0).slice(-500) : [], researchProjects: b.researchProjects ?? Object.fromEntries(RESEARCH_PROJECTS.filter((project) => b.flags?.[`research:${project.id}`]).map((project) => { const startedDay = b.now?.day ?? 0; return [project.id, { status: "active" as const, startedDay, dueDay: startedDay + project.durationDays, progress: 0 }]; })), lastReceipt: b.lastReceipt ?? null, gaugeShift: b.gaugeShift ?? {},
  };
  return out;
}


/** Keep usable legacy queue rows, discard malformed rows, and fall back to dueDay for bad optional exact deadlines. */
function normalizeQueueItems(value: unknown): QueueItem[] {
  if (!Array.isArray(value)) return [];
  const rows: QueueItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Partial<QueueItem>;
    if (
      typeof item.id !== "string" || !item.id ||
      !Number.isSafeInteger(item.dueDay) || (item.dueDay ?? -1) < 0 ||
      typeof item.label !== "string" ||
      typeof item.source !== "string" ||
      !["public", "private", "secret"].includes(item.visibility ?? "")
    ) continue;
    const normalized = { ...item } as QueueItem;
    if (!Number.isSafeInteger(item.dueMin) || (item.dueMin ?? -1) < 0) delete normalized.dueMin;
    rows.push(normalized);
  }
  return rows;
}

const cap = <T>(a: T[], n = 200) => a.slice(0, n);
const nowMin = (p: P4State) => absMin(p.now!.day, p.now!.minute);

/** Sync the engine clock with the store's world clock. */
export function syncClock(s: P4State, day: number, minuteOfDay: number): P4State {
  const n = normalizeP4(s);
  n.now = { day, minute: minuteOfDay };
  return n;
}

export function simulateWeek(s: P4State, world: WorldInputs = DEFAULT_WORLD): P4State {
  const n = normalizeP4(structuredClone(s));
  n.week += 1;
  const step = stepFactions(n.factions, n.week);
  n.factions = step.factions;
  n.reports = step.reports;
  for (const e of step.events) { n.log.unshift(`Week ${n.week}: ${e}`); n.rumors!.unshift(e); }
  for (const [k, v] of Object.entries(n.sectors)) {
    const drift = ((n.week * 7 + k.length) % 3) - 1; // deterministic, no modulo-of-faction coupling
    v.signs = clamp(v.signs + drift, 0, 8);
    v.pressure = clamp(v.pressure + (v.signs >= 3 ? 1 : -1), 0, 10);
    v.status = v.pressure >= 6 ? "unstable" : v.signs >= 2 ? "watched" : "quiet";
  }
  const signs = Object.fromEntries(Object.entries(n.sectors).map(([k, v]) => [k, v.signs]));
  const spawned = spawnCrisis(n, world, nowMin(n), signs);
  spawned.council = councilPositions(world);
  if (!spawned.crisis) spawned.log.unshift(`Week ${spawned.week}: quiet period; factions, routes and work continued.`);
  spawned.log = cap(spawned.log); spawned.rumors = cap(spawned.rumors!, 60);
  return spawned;
}

export function triggerMoment(s: P4State, id: string): P4State {
  const n = normalizeP4(structuredClone(s));
  const m = n.moments.find((x) => x.id === id);
  if (m && !m.seen) { m.seen = true; n.log.unshift(`Moment seen: ${m.title}`); n.unlockedAssets.push(`moment.${id}`); n.chronicleNotes!.push(`${m.title}: ${m.copy}`); }
  return n;
}

/** Council discussion actions. Persistent decrees are executed by the shared catalog-option runner in the store. */
export function decideCouncil(s: P4State, id: string, world: WorldInputs = DEFAULT_WORLD, _order?: unknown): P4State {
  const n = normalizeP4(structuredClone(s));
  n.council = councilPositions(world);
  const [cm, num, mode] = id.split("-");
  const seat = n.council.find((c) => c.id === `${cm}-${num}`);
  if (!seat) { n.log.unshift(`Council: unknown seat ${id}.`); return n; }
  const day = n.now!.day;
  if (mode === "delegate") {
    n.memories!.unshift({ day, text: `${seat.ministry} was given the matter to settle.` });
    n.queue.push({ id: `Q-del-${seat.id}-${nowMin(n)}-${n.queue.length + 1}`, dueDay: day + 2, label: `${seat.ministry} reports on the delegated matter`, source: "council", visibility: "public" });
    n.log.unshift(`Council: matter delegated to ${seat.ministry}.`);
  } else if (mode === "decree") {
    // A decree is not a discussion-only P4 mutation: it must debit the actual
    // world treasury and persist its idempotency key in the same store commit.
    n.log.unshift("Council: use the atomic Stamp Decree action; no marks or queue entry were changed.");
  } else {
    n.memories!.unshift({ day, text: `Heard ${seat.ministry}: ${seat.position}` });
    n.log.unshift(`Council: heard ${seat.ministry}.`);
  }
  n.memories = cap(n.memories!, 100);
  return n;
}

export function verifyLetter(s: P4State, id: string): P4State {
  const n = normalizeP4(structuredClone(s));
  const i = n.letters.findIndex((x) => x.id === id);
  if (i < 0) return n;
  const prior = n.letters[i];
  const out = inspectLetter(prior, n.week);
  n.letters[i] = out.letter;
  n.spent!.marks += out.cost; n.spent!.hours += out.hours;
  n.log.unshift(out.message);
  if (out.hours) n.queue.push({ id: `Q-letter-${id}-${nowMin(n)}-${(out.letter.checks ?? []).length}`, dueDay: n.now!.day + Math.ceil(out.hours / 24), label: `Examiners' note on ${id} filed`, source: "letters", visibility: "private" });
  if (prior.verified !== "AUTHENTIC" && out.letter.verified === "AUTHENTIC" && out.letter.truth === "FORGED") {
    const faction = out.letter.faction ?? factionOfSender(out.letter.sender);
    n.queue.push({
      id: `Q-falseauth-${id}-${n.now!.day + 2}`,
      dueDay: n.now!.day + 2,
      label: faction ? `Diplomatic consequence: ${faction} cools after a forged letter was judged authentic` : "Diplomatic consequence: a forged letter was judged authentic",
      source: "letters",
      visibility: "private",
      relationHit: faction ? { faction, delta: -2 } : undefined,
    });
    n.log.unshift("A forged letter was accepted as authentic. A diplomatic consequence is queued.");
  }
  return n;
}

function factionOfSender(sender: string): string | undefined {
  const s = sender.toLowerCase();
  if (s.includes("monarch")) return "Monarchia";
  if (s.includes("dreyer") || s.includes("grotsen") || s.includes("commissar")) return "Grotsen Dominion";
  if (s.includes("demos")) return "Demos";
  if (s.includes("survivor") || s.includes("unsigned")) return "Survivors";
  if (s.includes("red claw")) return "Red Claws";
  return undefined;
}

export function planItem(s: P4State, label: string, time: string, opts: PlanOpts = {}): P4State {
  const n = normalizeP4(structuredClone(s));
  const npcAvailable = opts.npc
    ? (npc: string, absMinute: number, durationMinutes: number) => {
        const start = Math.max(0, absMinute);
        const step = 15;
        for (let offset = 0; offset < Math.max(1, durationMinutes); offset += step) {
          const at = start + offset;
          const day = Math.floor(at / 1440);
          const row = castNow(n, day, fromMin(at % 1440)).find((candidate) => candidate.name.toLocaleLowerCase() === npc.trim().toLocaleLowerCase());
          if (!row?.available) return false;
        }
        return true;
      }
    : undefined;
  const r = addPlanItem(n.planner, label, time, { day: n.now!.day, tier: interruptTier(n), ...opts, npcAvailable });
  n.planner = r.items;
  n.lastPlan = r.result;
  n.log.unshift(r.result.ok ? `Planner: ${label} at ${r.items[r.items.length - 1].time} - ${r.result.reason}` : `Planner refused "${label}": ${r.result.reason}`);
  if (r.result.ok && r.result.displaced?.length) n.queue.push({ id: `Q-clash-${nowMin(n)}-${n.planner.length}`, dueDay: n.now!.day + 1, label: `Displaced plans noticed: ${r.result.displaced.join(", ")}`, source: "planner", visibility: "private" });
  return n;
}

export function banquet(s: P4State, seated: string[], opts: BanquetOpts = {}): P4State {
  const n = normalizeP4(structuredClone(s));
  // accept envoy ids, names, or legacy "<Faction> Envoy" labels
  const ids = seated.map((x) => n.envoys!.find((e) => e.id === x || e.name === x || `${e.faction.split(" ")[0]} Envoy` === x || x.startsWith(e.faction.split(" ")[0]))?.id).filter((x): x is string => !!x);
  const rep = scoreBanquet(n.envoys!, ids, opts);
  n.banquet = { seated: ids, result: rep.result };
  for (const [f, d] of Object.entries(rep.relationDeltas)) n.relations![f] = clamp((n.relations![f] ?? 0) + (d ?? 0), -10, 10);
  if (rep.rumor) n.rumors!.unshift(rep.rumor);
  if (rep.redLedger) n.redLedger!.unshift(rep.redLedger);
  if (rep.result !== "unplanned") n.newsFeed!.unshift(`State banquet ${rep.result === "without insult" ? "passed without insult" : rep.result === "tense" ? "was tense" : "ended in an incident"}.`);
  n.log.unshift(`Banquet planned: ${rep.result}.${rep.issues.length ? " " + rep.issues[0] : ""}`);
  return n;
}

export function resolveCrisis(s: P4State, choice: string): P4State {
  return normalizeP4(resolveCrisisImpl(normalizeP4(s), choice, nowMin(normalizeP4(s))));
}

export function pinClue(s: P4State, id: string): P4State {
  const n = normalizeP4(structuredClone(s));
  if (!n.clues.find((c) => c.id === id)?.discovered || n.boardPins.includes(id)) return n;
  n.boardPins.push(id);
  const clash = contradictions(n.clues, n.boardPins);
  n.log.unshift(clash.length ? `Pinned ${id}. The board now shows a contradiction: ${clash[0].join(" vs ")}.` : `Pinned evidence ${id}`);
  return n;
}
export function discoverClue(s: P4State, id: string): P4State {
  const n = normalizeP4(structuredClone(s));
  const r = discover(n.clues, id);
  n.clues = r.clues; n.log.unshift(r.message);
  return n;
}
export function theorize(s: P4State, id: string): P4State {
  const n = normalizeP4(structuredClone(s));
  const r = advanceTheory(n.clues, n.boardPins, id);
  n.clues = r.clues; n.log.unshift(r.message);
  return n;
}
export function adjustRelation(s: P4State, npc: string, other: string, delta: number): P4State {
  const n = normalizeP4(structuredClone(s));
  n.npcStatus![npc] = nudgeRelation(n.npcStatus![npc], other, delta);
  return n;
}
export function rollNpcDay(s: P4State, names: string[], day: number): P4State {
  const n = normalizeP4(structuredClone(s));
  for (const nm of names) n.npcStatus![nm] = rollDailyEvents(nm, day, n.npcStatus![nm]);
  return n;
}

export interface AdvanceReport { p4: P4State; reachedMin: number; stopped: boolean; reason?: string; tier: Tier; fired: string[] }
export interface AdvanceOpts { allowCritical?: boolean; stopAtImportant?: boolean }

/**
 * Advance the simulation clock. Due planner items and queued consequences resolve in timestamp
 * order, weekly simulation runs at every week boundary crossed (not just landing on one), crises
 * spawn/tick hour by hour and interrupt by tier. Emergency always stops; a 1 h deliberate pause
 * is always possible even while an emergency is open.
 */
export function advanceClock(s: P4State, fromAbs: number, toAbs: number, world: WorldInputs = DEFAULT_WORLD, opts: AdvanceOpts = {}): AdvanceReport {
  let p = normalizeP4(structuredClone(s));
  const fired: string[] = [];
  if (toAbs <= fromAbs) return { p4: p, reachedMin: fromAbs, stopped: false, tier: interruptTier(p), fired };
  let end = toAbs;
  if (interruptTier(p) === "emergency") end = Math.min(end, fromAbs + 60); // deliberate pause turn
  type Ev = { at: number; kind: "item" | "queue" | "week" | "hour" | "day"; item?: PlanItem; qid?: string };
  const evs: Ev[] = [];
  for (const d of dueBetween(p.planner, fromAbs, end)) evs.push({ at: d.at, kind: "item", item: d.item });
  for (const q of p.queue) {
    const dueAt = Number.isSafeInteger(q.dueMin) && (q.dueMin ?? -1) >= 0 ? q.dueMin! : q.dueDay * 1440;
    const at = Math.max(dueAt, fromAbs + 1);
    if (dueAt <= end && at <= end) evs.push({ at, kind: "queue", qid: q.id });
  }
  for (let d = Math.floor(fromAbs / 1440); d <= Math.floor(end / 1440); d++) if (d > 0 && d % 7 === 0 && absMin(d, 0) > fromAbs && absMin(d, 0) <= end) evs.push({ at: absMin(d, 0), kind: "week" });
  for (let d = Math.floor(fromAbs / 1440) + 1; d <= Math.floor(end / 1440); d++) evs.push({ at: absMin(d, 0), kind: "day" });
  for (let t = Math.floor(fromAbs / 60) * 60 + 60; t <= end; t += 60) evs.push({ at: t, kind: "hour" });
  const order = { day: 0, week: 1, queue: 2, item: 3, hour: 4 } as const;
  evs.sort((a, b) => a.at - b.at || order[a.kind] - order[b.kind]);
  let cursor = fromAbs, stopped = false, reason: string | undefined;
  const hadEmergency = interruptTier(p) === "emergency";
  for (const e of evs) {
    p = tickCrisis(p, Math.max(0, (e.at - cursor) / 60), e.at);
    cursor = e.at;
    if (e.kind === "day") { tickEconomyDay(p); p = tickResearchDay(p, Math.floor(e.at / 1440)); }
    else if (e.kind === "week") p = simulateWeek(syncClock(p, Math.floor(e.at / 1440), 0), world);
    else if (e.kind === "queue") {
      const q = p.queue.find((x) => x.id === e.qid);
      if (q) {
        p.queue = p.queue.filter((x) => x.id !== e.qid);
        if (q.relationHit) p.relations![q.relationHit.faction] = clamp((p.relations![q.relationHit.faction] ?? 0) + q.relationHit.delta, -10, 10);
        const because = q.becauseOf ? ` Because of: ${q.becauseOf}.` : "";
        p.log.unshift(`Consequence resolved: ${q.label} (${q.source}).${because}`);
        if (q.becauseOf) {
          const slip = `Because of: ${q.becauseOf}. ${q.label}`;
          p.deskNotes = [slip, ...(p.deskNotes ?? [])].slice(0, 40);
          p.rumors = [slip, ...(p.rumors ?? [])].slice(0, 60);
        }
        fired.push(q.label);
      }
    } else if (e.kind === "item" && e.item && !e.item.fixed) {
      const it = p.planner.find((x) => x.id === e.item!.id);
      if (it) {
        const missed = interruptTier(p) === "emergency";
        it.status = missed ? "missed" : "done";
        p.log.unshift(`Planner: ${it.label} ${missed ? "was missed (emergency)" : "took place"} at ${it.time}.`);
        fired.push(it.label);
      }
    } else if (e.kind === "hour") {
      const before = p.crisis?.kind;
      p = spawnCrisis(p, world, e.at, Object.fromEntries(Object.entries(p.sectors).map(([k, v]) => [k, v.signs])));
      if (p.crisis && p.crisis.kind !== before) fired.push(p.crisis.title);
    }
    p.now = { day: Math.floor(e.at / 1440), minute: e.at % 1440 };
    const tier = interruptTier(p);
    const fresh = tier !== "normal" && (p.crisis?.kind !== undefined) && fired.includes(p.crisis!.title);
    if (fresh && shouldInterrupt(tier, opts)) { stopped = true; reason = `${p.crisis!.title} (${tier})`; break; }
    if (hadEmergency && e.at >= end && end < toAbs) { stopped = true; reason = "Emergency open: deliberate pause only."; }
  }
  const reached = stopped ? cursor : end;
  if (!stopped) { p = tickCrisis(p, Math.max(0, (end - cursor) / 60), end); p.now = { day: Math.floor(end / 1440), minute: end % 1440 }; }
  if (end < toAbs && !stopped) { stopped = true; reason = "Emergency open: deliberate pause only."; }
  p.log = cap(p.log);
  p.rumors = cap(p.rumors ?? [], 60);
  return { p4: p, reachedMin: reached, stopped, reason, tier: interruptTier(p), fired };
}
function tickEconomyDay(p: P4State): void {
  const eco = economyTick(cascade(p.economy!));
  p.economy = eco.economy;
  for (const g of eco.bottlenecks) {
    const line = `Bottleneck: ${g} is running short.`;
    p.rumors = [line, ...(p.rumors ?? []).filter((r) => r !== line)];
  }
}
export { TIER_RANK, fromMin };
