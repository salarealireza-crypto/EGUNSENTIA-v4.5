/** Home selectors. Gauges and desk metadata stay in gauges.ts / desks.ts. */
import { indexBand, resourceGauge, type GaugeArrow, type GaugeReading } from "./gauges";
import { WING_PLACE, type Archetype } from "./desks";
import type { Wing } from "./registry";

export const CUTAWAY_ORDER: Wing[] = ["SURFACE", "MEDIA", "COMMAND", "HOUSE", "CITY", "WORLD", "ARCHIVE", "SHADOWS"];

/** Visual depth. Same level shares a stratum; side branches sit beside it. */
export const CUTAWAY_DEPTH: Record<Wing, number> = {
  SURFACE: 0,
  MEDIA: 1,
  COMMAND: 2,
  HOUSE: 2,
  CITY: 3,
  WORLD: 3,
  ARCHIVE: 4,
  SHADOWS: 5,
};

const TREASURY_FULL = 120000;

export interface HomeLetter {
  id: string;
  sender: string;
  seal: string;
  verified?: string;
}

export interface HomeInbox {
  id: string;
  from: string;
  urgency?: string;
}

export interface HomeAbsence {
  name: string;
}

export interface HomePlan {
  id: string;
  time: string;
  label: string;
  status: string;
}

export interface HomeQueue {
  id: string;
  dueDay: number;
  label: string;
  becauseOf?: string;
}

export interface HomeCrisis {
  active: boolean;
  title: string;
  severity: string;
  deadlineHours: number;
  kind?: string;
}

export interface HomeSnapshot {
  water: { stock: number; capacity: number };
  food: { stock: number; capacity: number };
  energy: { stock: number; capacity: number };
  treasuryMarks: number;
  order: number;
  morale: number;
  gaugeShift: Record<string, GaugeArrow | undefined>;
  crisis: HomeCrisis | null;
  letters: HomeLetter[];
  inboxOpen: HomeInbox[];
  absentees: HomeAbsence[];
  planner: HomePlan[];
  clockTime: string;
  queue: HomeQueue[];
  day: number;
  rumors: string[];
  bottlenecks: string[];
  chronicle: { id: string; line: string }[];
  news: { id: string; body: string; source: string }[];
}

export interface DeskItem {
  id: string;
  title: string;
  status: string;
  panelId: string;
  urgency: number;
  tier?: string;
  focusId?: string;
}

export interface LookLine {
  id: string;
  source: "Ledger" | "News" | "Whisper";
  text: string;
}

const CRISIS_PANEL: Record<string, string> = {
  water: "21",
  food: "54",
  energy: "14",
  cistern: "21",
  outbreak: "52",
  fire: "28",
  gate: "18",
  monster: "57",
};

const CRISIS_WINGS: Record<string, Wing[]> = {
  water: ["CITY", "COMMAND"],
  food: ["CITY"],
  energy: ["CITY"],
  cistern: ["CITY"],
  outbreak: ["CITY", "HOUSE"],
  fire: ["CITY", "COMMAND"],
  gate: ["SURFACE", "WORLD", "COMMAND"],
  monster: ["SURFACE", "COMMAND"],
};

const TIER_URGENCY: Record<string, number> = { emergency: 100, critical: 80, important: 60, normal: 40 };

const GAUGE_BY_ARCHETYPE: Record<Archetype, string[]> = {
  MINISTRY: ["order", "morale", "treasury"],
  LEDGER: ["food", "treasury", "water"],
  SCHEMATIC: ["energy", "water", "order"],
  DOSSIER: ["morale", "order"],
  POST: ["order", "morale"],
  EVIDENCE: ["order", "morale"],
  CLOCKFACE: ["order", "morale"],
  CODEX: ["morale", "order"],
  SYSTEM: ["treasury"],
};

const GAUGE_OVERRIDE: Record<string, string[]> = {
  "21": ["water", "energy", "morale"],
  "54": ["food", "treasury", "morale"],
  "06": ["water", "food", "energy"],
  "11": ["treasury", "food", "order"],
  "45": ["treasury", "food", "order"],
  "18": ["order", "energy", "morale"],
  "15": ["order", "morale"],
  "57": ["order", "energy"],
};

function shift(snap: HomeSnapshot, key: string): GaugeArrow {
  return snap.gaugeShift[key] ?? "flat";
}

function countWord(n: number): string {
  const words = ["none", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  if (n < words.length) return words[n];
  return String(n);
}

function clip(text: string, max = 120): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

function toMin(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}

export function pulseReadings(snap: HomeSnapshot): GaugeReading[] {
  const treasuryRatio = TREASURY_FULL > 0 ? Math.max(0, Math.min(1, snap.treasuryMarks / TREASURY_FULL)) : 0;
  return [
    resourceGauge("water", "Water", snap.water.stock, snap.water.capacity, shift(snap, "water")),
    resourceGauge("food", "Food", snap.food.stock, snap.food.capacity, shift(snap, "food")),
    resourceGauge("energy", "Energy", snap.energy.stock, snap.energy.capacity, shift(snap, "energy")),
    resourceGauge("treasury", "Treasury", treasuryRatio, 1, shift(snap, "treasury")),
    { key: "order", label: "Order", word: indexBand(snap.order), arrow: shift(snap, "order") },
    { key: "morale", label: "Morale", word: indexBand(snap.morale), arrow: shift(snap, "morale") },
  ];
}

export function deskGaugeKeys(panelId: string, archetype: Archetype): string[] {
  return GAUGE_OVERRIDE[panelId] ?? GAUGE_BY_ARCHETYPE[archetype] ?? ["order", "morale"];
}

export function readingsFor(snap: HomeSnapshot, keys: string[]): GaugeReading[] {
  const all = pulseReadings(snap);
  return keys.map((k) => all.find((g) => g.key === k)).filter((g): g is GaugeReading => Boolean(g));
}

export function crisisPanel(kind?: string): string {
  return (kind && CRISIS_PANEL[kind]) || "24";
}

export function crisisTouches(kind: string | undefined, wing: Wing): boolean {
  if (!kind) return false;
  return (CRISIS_WINGS[kind] ?? ["COMMAND"]).includes(wing);
}

export function nextPlan(snap: HomeSnapshot): HomePlan | null {
  const planned = snap.planner.filter((p) => p.status === "planned");
  if (!planned.length) return null;
  const now = toMin(snap.clockTime) ?? 0;
  return planned.find((p) => (toMin(p.time) ?? 0) >= now) ?? planned[0];
}

function openLetters(snap: HomeSnapshot): HomeLetter[] {
  return snap.letters.filter((l) => !l.verified && l.seal !== "AUTHENTIC" && l.seal !== "FORGED");
}

export function buildDeskQueue(snap: HomeSnapshot): DeskItem[] {
  const items: DeskItem[] = [];
  if (snap.crisis?.active) {
    const c = snap.crisis;
    items.push({
      id: `crisis-${c.kind ?? "open"}`,
      title: c.title,
      status: `${c.severity} · ${c.deadlineHours}h left`,
      panelId: crisisPanel(c.kind),
      urgency: TIER_URGENCY[c.severity] ?? 50,
      tier: c.severity,
      focusId: c.kind,
    });
  }
  const letters = openLetters(snap);
  if (letters.length) {
    const n = countWord(letters.length);
    items.push({
      id: "letters",
      title: letters.length === 1 ? letters[0].sender : "Letters awaiting a verdict",
      status: letters.length === 1 ? "The seal is still unread." : `${n} letters still lack a verdict.`,
      panelId: "16",
      urgency: 70,
      focusId: letters[0].id,
    });
  }
  const urgentInbox = snap.inboxOpen.filter((m) => m.urgency === "critical" || m.urgency === "important");
  const inbox = urgentInbox.length ? urgentInbox : snap.inboxOpen;
  if (inbox.length) {
    const top = inbox[0];
    items.push({
      id: `inbox-${top.id}`,
      title: top.from,
      status: inbox.length === 1 ? "A message is waiting on a verdict." : `${countWord(inbox.length)} messages are waiting.`,
      panelId: "01",
      urgency: top.urgency === "critical" ? 78 : 72,
      focusId: top.id,
    });
  }
  const due = snap.queue.filter((q) => q.dueDay <= snap.day + 1);
  if (due.length) {
    const q = due[0];
    items.push({
      id: `queue-${q.id}`,
      title: q.label,
      status: q.becauseOf ? `Because of: ${q.becauseOf}` : "Due before the day turns.",
      panelId: "44",
      urgency: q.dueDay <= snap.day ? 68 : 58,
      focusId: q.id,
    });
  }
  if (snap.absentees.length) {
    const a = snap.absentees[0];
    items.push({
      id: "absent",
      title: a.name,
      status: snap.absentees.length === 1 ? "Away from the hall." : `${countWord(snap.absentees.length)} of the house are away.`,
      panelId: "26",
      urgency: 42,
      focusId: a.name,
    });
  }
  const plan = nextPlan(snap);
  if (plan) {
    items.push({
      id: `plan-${plan.id}`,
      title: plan.label,
      status: `Next on the rota, ${plan.time}.`,
      panelId: "12",
      urgency: 36,
      focusId: plan.id,
    });
  }
  if (snap.bottlenecks.length) {
    const good = snap.bottlenecks[0];
    items.push({
      id: `bottle-${good}`,
      title: "Market bottleneck",
      status: `${good} is the talk of the tunnel.`,
      panelId: "54",
      urgency: 34,
      focusId: good,
    });
  } else if (snap.rumors.length) {
    items.push({
      id: "rumor-0",
      title: "A rumor on the board",
      status: clip(snap.rumors[0]),
      panelId: "31",
      urgency: 32,
      focusId: "rumor-0",
    });
  }
  return items.sort((a, b) => b.urgency - a.urgency || a.id.localeCompare(b.id)).slice(0, 5);
}

export function attentionForPanel(snap: HomeSnapshot, panelId: string): number {
  return buildDeskQueue(snap).filter((item) => item.panelId === panelId).length;
}

export function attentionForWing(snap: HomeSnapshot, wing: Wing, panelIds: string[]): number {
  const ids = new Set(panelIds);
  return buildDeskQueue(snap).filter((item) => ids.has(item.panelId)).length;
}

export function deskStatusLine(panelId: string, snap: HomeSnapshot): string {
  if (snap.crisis?.active && crisisPanel(snap.crisis.kind) === panelId) {
    return `${snap.crisis.title}. ${snap.crisis.deadlineHours} hours left.`;
  }
  if (panelId === "01") {
    return snap.inboxOpen.length ? `${countWord(snap.inboxOpen.length)} messages still open.` : "The tray is clear.";
  }
  if (panelId === "16") {
    const n = openLetters(snap).length;
    return n ? `${countWord(n)} letters still lack a verdict.` : "No letter is waiting.";
  }
  if (panelId === "21") return `Water is ${resourceGauge("water", "Water", snap.water.stock, snap.water.capacity).word.toLowerCase()}.`;
  if (panelId === "54") return `Food is ${resourceGauge("food", "Food", snap.food.stock, snap.food.capacity).word.toLowerCase()}.`;
  if (panelId === "14" || panelId === "28") {
    return `Energy is ${resourceGauge("energy", "Energy", snap.energy.stock, snap.energy.capacity).word.toLowerCase()}.`;
  }
  if (panelId === "26" || panelId === "17") {
    return snap.absentees[0] ? `${snap.absentees[0].name} is away from the hall.` : "The house is accounted for.";
  }
  if (panelId === "12" || panelId === "05") {
    const plan = nextPlan(snap);
    return plan ? `Next: ${plan.label} at ${plan.time}.` : "The rota is clear.";
  }
  if (panelId === "31" && snap.rumors[0]) return clip(snap.rumors[0]);
  if (panelId === "44" || panelId === "09") return snap.chronicle[0] ? clip(snap.chronicle[0].line) : "The ledger is quiet.";
  if (panelId === "02" && snap.news[0]) return clip(snap.news[0].body);
  const queued = snap.queue.find((q) => q.dueDay <= snap.day + 1);
  if (panelId === "44" && queued) return queued.becauseOf ? `Because of: ${queued.becauseOf}` : clip(queued.label);
  return "Nothing new is waiting.";
}

export function wingMood(wing: string): string {
  return WING_PLACE[wing]?.mood ?? "A working desk.";
}

export function buildLooked(snap: HomeSnapshot): LookLine[] {
  const ledger = snap.chronicle.slice(-3).reverse().map((c) => ({ id: c.id, source: "Ledger" as const, text: clip(c.line) }));
  const news = snap.news.slice(0, 2).map((n) => ({ id: n.id, source: "News" as const, text: clip(n.body) }));
  const whispers = snap.rumors.slice(0, 2).map((r, i) => ({ id: `whisper-${i}`, source: "Whisper" as const, text: clip(r) }));
  return [...ledger, ...news, ...whispers].slice(0, 6);
}
