/** Typed effects, generated from category recipes. Catalog ids and titles are never rewritten. */
import rawCards from "../../canon/cards.json";
import { GOODS, type Good } from "../../game/sim/economy.ts";
import { cleanName } from "../../game/sim/npc.ts";
import { ARCHETYPE_BY_PANEL, type Archetype } from "../desks";

export const FACTIONS = ["Red Claws", "Monarchia", "Grotsen Dominion", "Demos", "Survivors"] as const;
export type FactionName = (typeof FACTIONS)[number];

export const NPC_NAMES: string[] = (rawCards as { name: string }[]).map((c) => cleanName(c.name));

export type NoteChannel = "ledger" | "news" | "rumor" | "chronicle";
export type RelationStep = -2 | -1 | 1 | 2;
export type MoodBand = "steady" | "strained" | "bright" | "sour";

export type Effect =
  | { type: "stock"; good: Good; delta: number }
  | { type: "relation"; faction?: FactionName; npc?: string; step: RelationStep }
  | { type: "queue"; afterHours: number; consequenceId: string; becauseOf: string }
  | { type: "note"; channel: NoteChannel; templateId: string }
  | { type: "flag"; op: "set" | "clear"; key: string }
  | { type: "npc"; id: string; busyHours?: number; mood?: MoodBand };

export type Require =
  | { kind: "npc"; id: string }
  | { kind: "stock"; good: Good; min: number }
  | { kind: "flag"; key: string }
  | { kind: "relation"; who: string; atLeast: "strained" | "cool" | "even" | "cordial" | "warm" };

export interface RichOption {
  id: string;
  panelId: string;
  title: string;
  summary: string;
  category: string;
  costs: { marks: number; hours: number; resources?: Record<string, number>; personnel?: readonly string[]; politicalCapital?: number };
  requires: Require[];
  risk: string;
  uncertainty: string;
  forecast: { knownEffects: string[]; unknownEffects: string[] };
  delay: string;
  cooldown: number;
  confirm: string;
  effects: Effect[];
  hooks: Record<string, boolean>;
  visual?: { artId?: string; animationId?: string };
  sfx?: string;
  advisorId?: string;
  attachTo?: string;
}

export const NOTE_TEXT: Record<string, string> = {};

export function mix(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function panelParams(panelId: string): { good: Good; npc: string; faction: FactionName } {
  const n = Number(panelId) || 1;
  return {
    good: GOODS[n % GOODS.length],
    npc: NPC_NAMES[n % NPC_NAMES.length] ?? "Samer Vogt",
    faction: FACTIONS[n % FACTIONS.length],
  };
}

export function delayHours(delay: string): number {
  if (delay === "instant") return 1;
  if (delay === "hours") return 8;
  if (delay === "weeks") return 24 * 7;
  return 48;
}

export function hearWhen(afterHours: number): string {
  if (afterHours <= 8) return "before the next meal";
  if (afterHours <= 24) return "by tomorrow's Evening Hall";
  if (afterHours <= 72) return "within a few days";
  return "before the week turns";
}

function noteFor(channel: NoteChannel, title: string): string {
  if (channel === "ledger") return `Ledger: ${title}. A mark is not a repair.`;
  if (channel === "news") return `Notice posted: ${title}.`;
  if (channel === "rumor") return `Whisper in the tunnels: ${title}.`;
  return `Chronicle line: ${title}.`;
}

function attachFor(panelId: string, category: string, index: number, good: string, npc: string, faction: string): string | undefined {
  const arch: Archetype = ARCHETYPE_BY_PANEL[panelId] ?? "SYSTEM";
  if (arch === "MINISTRY") {
    if (index % 3 === 0) return "desk";
    if (index % 3 === 1) return `npc:${npc}`;
    return undefined;
  }
  if (arch === "LEDGER") return category === "Order" || category === "Invest" ? `good:${good}` : undefined;
  if (arch === "DOSSIER") {
    if (panelId === "58") return index % 2 === 0 ? `faction:${faction}` : undefined;
    return index % 2 === 0 ? `npc:${npc}` : undefined;
  }
  if (arch === "POST") return index % 2 === 0 ? "letter:*" : undefined;
  if (arch === "EVIDENCE") return category === "Investigate" ? "clue:*" : undefined;
  if (arch === "SCHEMATIC") return category === "Order" ? `site:L-${String(((Number(panelId) + index) % 42) + 1).padStart(2, "0")}` : undefined;
  if (arch === "CLOCKFACE") return index % 2 === 0 ? "desk" : undefined;
  if (arch === "CODEX") return category === "Investigate" ? "desk" : undefined;
  return undefined;
}

interface RawOpt {
  id: string;
  panelId: string;
  title: string;
  summary: string;
  category: string;
  costs: { marks: number; hours?: number; resources?: Record<string, number>; personnel?: readonly string[]; politicalCapital?: number };
  requires?: readonly unknown[];
  risk: string;
  uncertainty: string;
  forecast: { knownEffects: readonly string[]; unknownEffects: readonly string[] };
  delay: string;
  cooldown?: number;
  confirm?: string;
  effects?: readonly unknown[];
  hooks?: Record<string, boolean>;
  visual?: { artId?: string; animationId?: string };
  sfx?: string;
  advisorId?: string;
}

function fill(raw: RawOpt, index: number): RichOption {
  const params = panelParams(raw.panelId);
  const h = mix(raw.id);
  const step = ([-2, -1, 1, 2] as RelationStep[])[h % 4];
  const effects: Effect[] = [];
  const hours = delayHours(raw.delay);
  const queue = (): Effect => ({
    type: "queue",
    afterHours: hours,
    consequenceId: `cq-${raw.id}`,
    becauseOf: raw.id,
  });
  let channel: NoteChannel = "ledger";
  if (raw.category === "Order" || raw.category === "Invest") {
    const delta = raw.category === "Invest" ? 6 + (h % 5) : -(4 + (h % 5));
    effects.push({ type: "stock", good: params.good, delta });
    effects.push(queue());
    channel = raw.hooks?.news ? "news" : "ledger";
    effects.push({ type: "note", channel, templateId: `note-${raw.id}` });
    if (raw.category === "Order") effects.push({ type: "npc", id: params.npc, busyHours: 6, mood: "strained" });
  } else if (raw.category === "Investigate") {
    effects.push({ type: "flag", op: "set", key: `lead:${raw.panelId}:${(index % 3) + 1}` });
    effects.push({ type: "flag", op: "set", key: `opened:${raw.panelId}` });
    if (h % 2 === 0) effects.push({ type: "relation", npc: params.npc, step: 1 });
    channel = "ledger";
    effects.push({ type: "note", channel, templateId: `note-${raw.id}` });
  } else if (raw.category === "Delegate") {
    effects.push({ type: "npc", id: params.npc, busyHours: 8, mood: "steady" });
    effects.push({ type: "relation", faction: params.faction, step: 1 });
    effects.push(queue());
    channel = "rumor";
    effects.push({ type: "note", channel, templateId: `note-${raw.id}` });
  } else if (raw.category === "Wait") {
    effects.push(queue());
    effects.push({ type: "flag", op: "set", key: `waited:${raw.panelId}` });
    channel = "chronicle";
    effects.push({ type: "note", channel, templateId: `note-${raw.id}` });
  } else {
    effects.push({ type: "relation", faction: params.faction, step });
    effects.push(queue());
    channel = "news";
    effects.push({ type: "note", channel, templateId: `note-${raw.id}` });
  }
  NOTE_TEXT[`note-${raw.id}`] = noteFor(channel, raw.title).slice(0, 180);

  const requires: Require[] = [];
  if (h % 5 !== 0) {
    const k = h % 4;
    if (k === 0) requires.push({ kind: "npc", id: params.npc });
    else if (k === 1) requires.push({ kind: "stock", good: params.good, min: 1 });
    else if (k === 2 && raw.category !== "Investigate") requires.push({ kind: "flag", key: `opened:${raw.panelId}` });
    else requires.push({ kind: "relation", who: params.faction, atLeast: "cool" });
  }

  const hadDownstream = (raw.forecast?.unknownEffects ?? []).some((u) => /downstream reaction/i.test(u));
  const unknown = hadDownstream || raw.uncertainty === "unknown"
    ? [`Word may return ${hearWhen(hours)} about this order.`]
    : [...(raw.forecast?.unknownEffects ?? [])].filter((u) => !/downstream reaction/i.test(u));

  return {
    id: raw.id,
    panelId: raw.panelId,
    title: raw.title,
    summary: raw.summary,
    category: raw.category,
    costs: {
      marks: raw.costs?.marks ?? 0,
      hours: raw.costs?.hours ?? 0,
      resources: raw.costs?.resources,
      personnel: raw.costs?.personnel,
      politicalCapital: raw.costs?.politicalCapital,
    },
    requires,
    risk: raw.risk,
    uncertainty: raw.uncertainty,
    forecast: {
      knownEffects: [...(raw.forecast?.knownEffects ?? [])],
      unknownEffects: unknown,
    },
    delay: raw.delay,
    cooldown: raw.cooldown ?? 0,
    confirm: raw.confirm ?? "none",
    effects,
    hooks: raw.hooks ?? {},
    visual: raw.visual,
    sfx: raw.sfx,
    advisorId: raw.advisorId,
    attachTo: attachFor(raw.panelId, raw.category, index, params.good, params.npc, params.faction),
  };
}

export function materializeCatalog<T extends Record<string, readonly RawOpt[]>>(raw: T): Record<string, RichOption[]> {
  const out: Record<string, RichOption[]> = {};
  for (const [panelId, opts] of Object.entries(raw)) out[panelId] = opts.map((o, i) => fill({ ...o, panelId: o.panelId || panelId }, i));
  return out;
}

export function consequenceLabel(title: string): string {
  return `Word returns about “${title}.”`;
}

export function effectStats(catalog: Record<string, readonly RichOption[]>) {
  const all = Object.values(catalog).flat();
  const withFx = all.filter((o) => o.effects.length > 0).length;
  const withReq = all.filter((o) => o.requires.length > 0).length;
  const orderInvest = all.filter((o) => o.category === "Order" || o.category === "Invest");
  const orderOk = orderInvest.filter((o) => o.effects.some((e) => e.type === "stock" || e.type === "relation" || e.type === "queue")).length;
  const investigate = all.filter((o) => o.category === "Investigate");
  const invOk = investigate.filter((o) => o.effects.some((e) => e.type === "flag" || e.type === "note")).length;
  const downstream = all.filter((o) => o.forecast.unknownEffects.some((u) => /downstream reaction/i.test(u))).length;
  return { total: all.length, withFx, withReq, orderInvest: orderInvest.length, orderOk, investigate: investigate.length, invOk, downstream };
}
