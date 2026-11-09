/** Pure option execution. Callers clone nothing themselves; this never mutates inputs. */
import { relationWord } from "../../game/sim/banquet.ts";
import { absMin } from "../../game/sim/core.ts";
import { discover } from "../../game/sim/investigation.ts";
import { appendLedgerEvents } from "../../game/sim/event-ledger.ts";
import { nudgeRelation } from "../../game/sim/npc.ts";
import { advanceClock, normalizeP4, syncClock, type P4State, type ReceiptSlip } from "../../game/p4-simulation";
import { castNow } from "../../game/presence";
import { clockFromDayIndex } from "../../game/time";
import type { ChronicleEntry, EventLedgerEntry, GateStatus, NewsItem, TradeOffer, WorldState } from "../../game/types";
import type { WorldInputs } from "../../game/sim/core.ts";
import { GOODS, type Good } from "../../game/sim/economy.ts";
import { planCouncilDecree, type CouncilSeat } from "../../game/sim/council.ts";
import { optionsForPanel } from "./lookup.ts";
import { bandRank, indexBand, ratioBand, type BandWord, type GaugeArrow } from "../gauges";
import { NOTE_TEXT, consequenceLabel, hearWhen, type RichOption } from "./effects";

const REL_RANK = { strained: 0, cool: 1, even: 2, cordial: 3, warm: 4 } as const;

export interface OptionLockContext { allowCouncilDecree?: boolean }

/** Validate all spendable resources before any state mutation. Catalog political
 * capital remains explicitly unresolved until an authoritative balance exists. */
export interface OptionResourceReservation {
  marks: number;
  hours: number;
  resourceCosts: Partial<Record<Good, number>>;
  unresolvedPoliticalCapital: number;
}

export type OptionReservationResult =
  | { ok: true; reservation: OptionResourceReservation }
  | { ok: false; reason: string };

const WORLD_STOCK_SCALE: Partial<Record<Good, { account: "food" | "water" | "energy"; scale: number }>> = {
  food: { account: "food", scale: 8 },
  water: { account: "water", scale: 400 },
  "fuel stocks": { account: "energy", scale: 200 },
};

/** A pure reservation/preflight plan. The caller commits the resulting state in
 * one Zustand set only after the complete command succeeds. */
export function reserveOptionResources(option: RichOption, p4: P4State, world: WorldState): OptionReservationResult {
  const marks = option.costs?.marks;
  const hours = option.costs?.hours;
  const politicalCapital = option.costs?.politicalCapital ?? 0;
  if (!Number.isSafeInteger(marks) || marks < 0) return { ok: false, reason: "This order has an invalid treasury cost and cannot be executed." };
  if (!Number.isFinite(world.treasury?.marks) || world.treasury.marks < 0) return { ok: false, reason: "The treasury balance is invalid; no order was executed." };
  if (world.treasury.marks < marks) return { ok: false, reason: `Locked: this order requires ${marks} marks; only ${world.treasury.marks} are available.` };
  if (!Number.isSafeInteger(hours) || hours < 0 || hours > 24) return { ok: false, reason: "This order has an invalid time cost and cannot be executed." };
  if (!Number.isSafeInteger(politicalCapital) || politicalCapital < 0) return { ok: false, reason: "This order has an invalid Political Capital catalog cost." };
  if ((option.costs?.personnel?.length ?? 0) > 0) return { ok: false, reason: "Personnel cost reservations are not defined by an authoritative personnel-cost contract; no order was executed." };

  const resourceCosts: Partial<Record<Good, number>> = {};
  const rawCosts = option.costs?.resources ?? {};
  if (!rawCosts || typeof rawCosts !== "object" || Array.isArray(rawCosts)) return { ok: false, reason: "This order has an invalid resource-cost contract." };
  for (const [rawGood, amount] of Object.entries(rawCosts)) {
    if (!(GOODS as readonly string[]).includes(rawGood) || !Number.isSafeInteger(amount) || amount < 0) {
      return { ok: false, reason: `This order has an invalid resource reservation for ${rawGood}.` };
    }
    if (amount > 0) resourceCosts[rawGood as Good] = amount;
  }

  const stockUse: Partial<Record<Good, number>> = { ...resourceCosts };
  for (const effect of option.effects ?? []) {
    if (effect.type !== "stock") continue;
    if (!(GOODS as readonly string[]).includes(effect.good) || !Number.isSafeInteger(effect.delta)) {
      return { ok: false, reason: "This order contains an invalid typed stock effect." };
    }
    if (effect.delta < 0) {
      const combined = (stockUse[effect.good] ?? 0) - effect.delta;
      if (!Number.isSafeInteger(combined) || combined < 0) {
        return { ok: false, reason: `The combined ${effect.good} reservation is outside the safe numeric range.` };
      }
      stockUse[effect.good] = combined;
    }
  }

  for (const good of GOODS) {
    const required = stockUse[good] ?? 0;
    if (!required) continue;
    const held = p4.economy?.[good]?.stock;
    if (!Number.isFinite(held) || held < 0) return { ok: false, reason: `The ${good} stock account is unavailable or invalid; no order was executed.` };
    if (held < required) return { ok: false, reason: `Locked: this order needs ${required} ${good}; only ${held} are recorded in the stores.` };
    const mapped = WORLD_STOCK_SCALE[good];
    if (mapped) {
      const worldHeld = world[mapped.account]?.stock;
      const worldRequired = required * mapped.scale;
      if (!Number.isSafeInteger(worldRequired)) return { ok: false, reason: `The world ${mapped.account} reservation is outside the safe numeric range.` };
      if (!Number.isFinite(worldHeld) || worldHeld < 0) return { ok: false, reason: `The world ${mapped.account} stock account is unavailable or invalid; no order was executed.` };
      if (worldHeld < worldRequired) return { ok: false, reason: `Locked: this order needs ${worldRequired} ${mapped.account} stock units; only ${worldHeld} are available.` };
    }
  }

  return {
    ok: true,
    reservation: { marks, hours, resourceCosts, unresolvedPoliticalCapital: politicalCapital },
  };
}

export function lockReason(option: RichOption, p4: P4State, world: WorldState, context: OptionLockContext = {}): string | null {
  if (option.id === "24-OPT-02" && !context.allowCouncilDecree) return "This order must be stamped from the Council panel so its decree, cost and queue are committed together.";
  const normalized = normalizeP4(p4);
  const reservation = reserveOptionResources(option, normalized, world);
  if (!reservation.ok) return reservation.reason;
  const rows = castNow(normalized, world.dayIndex, world.clock.time);
  for (const req of option.requires ?? []) {
    if (req.kind === "npc") {
      const row = rows.find((r) => r.name === req.id);
      if (!row) return `Locked: ${req.id} is not on the roster.`;
      if (!row.available) {
        const why = row.reason === "illness" ? "ill" : row.reason === "errand" ? "away on an errand" : "not at hand";
        return `Locked: ${row.name} is ${why} — ${row.activity}.`;
      }
    } else if (req.kind === "stock") {
      const held = normalized.economy?.[req.good]?.stock ?? 0;
      if (held < req.min) return `Locked: ${req.good} is too thin to spend.`;
    } else if (req.kind === "flag") {
      if (!normalized.flags?.[req.key]) return "Locked: hear the desk before you spend. Inquire first.";
    } else if (req.kind === "relation") {
      const word = relationWord(normalized.relations?.[req.who] ?? 0);
      if (REL_RANK[word] < REL_RANK[req.atLeast]) return `Locked: ${req.who} is ${word} — not ${req.atLeast} enough for this.`;
    }
  }
  return null;
}

export interface RunInput {
  option: RichOption;
  /** Present only for the dedicated panel-24 council transaction. */
  councilContext?: { commandId: string; seat: CouncilSeat };
  p4: P4State;
  world: WorldState;
  gates: GateStatus[];
  trades: TradeOffer[];
  events: EventLedgerEntry[];
  news: NewsItem[];
  chronicle: ChronicleEntry[];
  turnCount: number;
  worldInputs: WorldInputs;
}

export type RunResult =
  | { ok: false; notice: string }
  | {
      ok: true;
      notice: string;
      p4: P4State;
      world: WorldState;
      gates: GateStatus[];
      trades: TradeOffer[];
      events: EventLedgerEntry[];
      news: NewsItem[];
      chronicle: ChronicleEntry[];
    };

function clockMinutes(t: string): number {
  return Number.parseInt(t.slice(0, 2), 10) * 60 + Number.parseInt(t.slice(3, 5), 10);
}

function tag(channel: string): string {
  if (channel === "news") return "News";
  if (channel === "rumor") return "Rumor";
  if (channel === "chronicle") return "Chronicle";
  return "Ledger";
}

export function runOption(input: RunInput): RunResult {
  const { option } = input;
  const normalizedP4 = normalizeP4(structuredClone(input.p4));
  const reservationResult = reserveOptionResources(option, normalizedP4, input.world);
  if (!reservationResult.ok) return { ok: false, notice: reservationResult.reason };
  const reservation = reservationResult.reservation;
  const locked = lockReason(option, normalizedP4, input.world, { allowCouncilDecree: Boolean(input.councilContext) });
  if (locked) return { ok: false, notice: locked };

  let p4 = normalizedP4;
  let world: WorldState = structuredClone(input.world);
  let gates = input.gates.map((g) => ({ ...g }));
  let trades = input.trades.map((t) => ({ ...t }));
  const shift: Record<string, GaugeArrow> = { ...(p4.gaugeShift ?? {}) };
  const done: string[] = [];
  const spent: string[] = [];
  const hear: string[] = [];
  const written: string[] = [];

  const mark = (key: string, dir: GaugeArrow) => {
    if (dir !== "flat") shift[key] = dir;
  };

  if (reservation.marks > 0) {
    // The complete reservation was validated first; deduction occurs only in this candidate state.
    world = { ...world, treasury: { ...world.treasury, marks: world.treasury.marks - reservation.marks } };
    p4.spent = { marks: (p4.spent?.marks ?? 0) + reservation.marks, hours: p4.spent?.hours ?? 0 };
    spent.push("Marks leave the treasury.");
    mark("treasury", "down");
    done.push("The treasury is lighter.");
  }
  for (const [good, amount] of Object.entries(reservation.resourceCosts) as Array<[Good, number]>) {
    const market = p4.economy?.[good];
    if (!market) return { ok: false, notice: `The ${good} stock account disappeared before commit; no order was executed.` };
    p4.economy = { ...p4.economy, [good]: { ...market, stock: market.stock - amount } };
    world = nudgeWorldStock(world, good, -amount, mark);
    spent.push(`${amount} ${good} committed from stores.`);
  }
  if (reservation.unresolvedPoliticalCapital > 0) {
    done.push(`Political Capital cost (${reservation.unresolvedPoliticalCapital}) is recorded in the catalog but was not deducted: no authoritative balance or ledger exists.`);
  }

  const indices = { ...world.indices };
  const beforeOrder = indexBand(indices.Order ?? 5);
  const beforeMorale = indexBand(indices.Morale ?? 5);
  if (option.category === "Order") indices.Order = Math.max(0, Math.min(10, (indices.Order ?? 5) - 2));
  if (option.category === "Invest" || option.category === "Negotiate") indices.Morale = Math.max(0, Math.min(10, (indices.Morale ?? 5) + (option.category === "Negotiate" ? 1 : 1)));
  world = { ...world, indices };
  const afterOrder = indexBand(indices.Order ?? 5);
  const afterMorale = indexBand(indices.Morale ?? 5);
  if (afterOrder !== beforeOrder) {
    done.push(`Order is ${afterOrder}.`);
    mark("order", bandRank(afterOrder) > bandRank(beforeOrder) ? "up" : "down");
  } else if (option.category === "Order") mark("order", "down");
  if (afterMorale !== beforeMorale) {
    done.push(`Morale is ${afterMorale}.`);
    mark("morale", bandRank(afterMorale) > bandRank(beforeMorale) ? "up" : "down");
  }

  for (const effect of option.effects ?? []) applyEffect(effect, option, p4, (w) => { world = w(world); }, done, spent, hear, written, mark, input.turnCount + 1, world);

  if (option.category === "Investigate") {
    const nextClue = p4.clues.find((c) => c.discovered === false);
    if (nextClue) {
      const found = discover(p4.clues, nextClue.id);
      if (found.ok) {
        p4.clues = found.clues;
        p4.log = [found.message, ...p4.log].slice(0, 200);
        done.push(found.message);
      }
    } else {
      const line = `The record of ${option.title} is firmer.`;
      p4.memories = [{ day: p4.now?.day ?? world.dayIndex, text: line }, ...(p4.memories ?? [])].slice(0, 100);
      done.push(line);
    }
  }

  p4.flags = { ...(p4.flags ?? {}), [`opened:${option.panelId}`]: true };
  p4.log = [`Executed ${option.id}: ${option.title}.`, ...p4.log].slice(0, 200);

  let hoursIncurred = reservation.hours;
  if (option.category === "Wait") {
    const from = absMin(world.dayIndex, clockMinutes(world.clock.time));
    const rep = advanceClock(syncClock(p4, world.dayIndex, clockMinutes(world.clock.time)), from, from + reservation.hours * 60, input.worldInputs);
    p4 = rep.p4;
    const elapsedHours = Math.max(0, (rep.reachedMin - from) / 60);
    hoursIncurred = elapsedHours;
    const minute = ((rep.reachedMin % 1440) + 1440) % 1440;
    const day = Math.floor(rep.reachedMin / 1440);
    const hh = String(Math.floor(minute / 60)).padStart(2, "0");
    const mm = String(minute % 60).padStart(2, "0");
    const clock = clockFromDayIndex(day, `${hh}:${mm}`);
    world = { ...world, dayIndex: day, clock: { ...world.clock, weekday: clock.weekday, date: clock.date, year: clock.year, time: `${hh}:${mm}` } };
    spent.push(elapsedHours === 1 ? "One hour passes." : `${elapsedHours} hours pass.`);
    if (rep.stopped && rep.reason) done.push(`The watch was interrupted: ${rep.reason}.`);
    if (rep.fired.length) done.push(`What arrived: ${rep.fired[0]}.`);
    else if (!rep.stopped) done.push("What arrived: the watch stayed quiet.");
  }
  if (hoursIncurred > 0) {
    p4.spent = { marks: p4.spent?.marks ?? 0, hours: (p4.spent?.hours ?? 0) + hoursIncurred };
    if (option.category !== "Wait") spent.push(hoursIncurred === 1 ? "One work hour is committed." : `${hoursIncurred} work hours are committed.`);
  }

  if (option.panelId === "45" && option.title === "Accept offer") {
    trades = trades.map((t) => (t.status === "open" ? { ...t, status: "accepted" as const } : t));
    done.push("An open offer is accepted.");
  }
  if (option.panelId === "18" && option.title === "Reinforce gate") {
    gates = gates.map((g) => (g.id === "east" ? { ...g, condition: "reinforced", threat: "watched", visual: g.visual === "destroyed" ? "breach" : g.visual } : g));
    done.push("The east gate is reinforced.");
  }

  if (!done.length) done.push(`${option.title} is done.`);
  const receipt: ReceiptSlip = {
    optionId: option.id,
    title: option.title,
    done: done.slice(0, 6),
    spent: spent.slice(0, 4),
    hear: hear.slice(0, 4),
    written: [...new Set(written)].slice(0, 4),
  };
  p4.lastReceipt = receipt;
  p4.gaugeShift = shift;
  p4.deskNotes = [`Done: ${option.title}.`, ...(p4.deskNotes ?? [])].slice(0, 40);

  const councilContext = input.councilContext;
  const eventId = councilContext
    ? `EV-${councilContext.commandId.replace(/[^a-zA-Z0-9_-]/g, "-")}`
    : `EV-V45-${input.turnCount + 1}-${option.id}`;
  const entry: EventLedgerEntry = {
    id: eventId,
    date: world.clock.date,
    year: world.clock.year,
    time: world.clock.time,
    location: world.clock.floor,
    type: "COMMAND",
    actors: councilContext ? ["Christian Red IV", councilContext.seat.ministry] : ["Christian Red IV"],
    cause: councilContext ? `Council decree ${option.id}` : `V4.5 option ${option.id}`,
    immediate: option.title,
    later: option.delay === "instant" ? undefined : hear[0],
    evidence: councilContext ? "Council decree recorded by the campaign command system" : "Desk order",
    knowledge: "player",
  };
  const bulletin: NewsItem = {
    id: `NEWS-${eventId}`,
    source: councilContext ? "Council" : "Command Desk",
    time: world.clock.time,
    body: NOTE_TEXT[`note-${option.id}`] ?? `${option.title} was ordered.`,
    tag: "OFFICIAL",
    reliability: "high",
  };
  return {
    ok: true,
    notice: `Executed: ${option.title}`,
    p4,
    world,
    gates,
    trades,
    events: appendLedgerEvents(input.events, entry),
    news: [bulletin, ...input.news].slice(0, 24),
    chronicle: [
      ...input.chronicle,
      { id: `CH-${eventId}`, line: councilContext ? `${option.title} — stamped through ${councilContext.seat.ministry}.` : `${option.title} — ${done[0]}`, at: `${world.clock.time} ${world.clock.date}`, pinned: false, kind: "turn" as const },
    ],
  };
}

export type CouncilDecreeRunResult =
  | { ok: false; notice: string }
  | (Extract<RunResult, { ok: true }> & { commandId: string; seat: CouncilSeat });

/** Execute the panel-24 catalog order through the same resource, requirement,
 * typed-effect, receipt and Event Ledger pipeline as every other option. */
export function runCouncilDecree(input: Omit<RunInput, "option">, seatId: string): CouncilDecreeRunResult {
  const option = optionsForPanel("24").find((row) => row.id === "24-OPT-02");
  if (!option) return { ok: false, notice: "The authoritative Council decree option is missing from panel 24; no decree was stamped." };
  const p4 = normalizeP4(input.p4);
  const minute = clockMinutes(input.world.clock.time);
  const planned = planCouncilDecree(input.worldInputs, seatId, option, input.world.dayIndex, minute);
  if (!planned.ok) return { ok: false, notice: planned.reason };
  if (p4.appliedCouncilCommandIds?.includes(planned.plan.commandId)) {
    return { ok: false, notice: "This decree has already been stamped for the current campaign minute." };
  }
  const result = runOption({
    ...input,
    option,
    p4,
    councilContext: { commandId: planned.plan.commandId, seat: planned.plan.seat },
  });
  if (!result.ok) return result;
  const nextP4 = normalizeP4(result.p4);
  nextP4.appliedCouncilCommandIds = [...(nextP4.appliedCouncilCommandIds ?? []), planned.plan.commandId].slice(-500);
  if (nextP4.lastReceipt) {
    nextP4.lastReceipt = {
      ...nextP4.lastReceipt,
      done: [`Decree stamped through ${planned.plan.seat.ministry}.`, ...nextP4.lastReceipt.done].slice(0, 6),
      written: [...new Set([...nextP4.lastReceipt.written, "Council"])].slice(0, 4),
    };
  }
  return { ...result, p4: nextP4, commandId: planned.plan.commandId, seat: planned.plan.seat };
}

function applyEffect(
  effect: RichOption["effects"][number],
  option: RichOption,
  p4: P4State,
  setWorld: (fn: (w: WorldState) => WorldState) => void,
  done: string[],
  spent: string[],
  hear: string[],
  written: string[],
  mark: (key: string, dir: GaugeArrow) => void,
  executionNumber: number,
  currentWorld: WorldState,
) {
  if (effect.type === "stock") {
    const good = effect.good;
    const eco = p4.economy?.[good];
    if (eco) eco.stock = Math.max(0, eco.stock + effect.delta);
    const dir: GaugeArrow = effect.delta < 0 ? "down" : effect.delta > 0 ? "up" : "flat";
    mark(good, dir);
    const stockChange = effect.delta < 0
      ? `decreased by ${Math.abs(effect.delta)}`
      : effect.delta > 0
        ? `increased by ${effect.delta}`
        : "was unchanged";
    done.push(`${titleCase(good)} stock ${stockChange}.`);
    setWorld((world) => nudgeWorldStock(world, good, effect.delta, mark));
  } else if (effect.type === "relation") {
    const who = effect.faction ?? effect.npc ?? "the desk";
    const before = relationWord(p4.relations?.[who] ?? 0);
    p4.relations = { ...(p4.relations ?? {}), [who]: Math.max(-10, Math.min(10, (p4.relations?.[who] ?? 0) + effect.step)) };
    const after = relationWord(p4.relations[who] ?? 0);
    if (effect.npc) p4.npcStatus = { ...(p4.npcStatus ?? {}), [effect.npc]: nudgeRelation(p4.npcStatus?.[effect.npc], "Christian Red IV", effect.step) };
    done.push(before === after ? `${who} holds at ${after}.` : `${who} moves from ${before} to ${after}.`);
    mark(`rel:${who}`, effect.step > 0 ? "up" : "down");
  } else if (effect.type === "queue") {
    const dueMin = absMin(currentWorld.dayIndex, clockMinutes(currentWorld.clock.time)) + effect.afterHours * 60;
    const dueDay = Math.floor(dueMin / 1440);
    p4.queue = [
      ...p4.queue,
      { id: `${effect.consequenceId}-${executionNumber}`, dueDay, dueMin, label: consequenceLabel(option.title), source: option.id, visibility: "public", becauseOf: option.title, becauseId: effect.becauseOf },
    ];
    hear.push(`${consequenceLabel(option.title)} ${hearWhen(effect.afterHours)}.`);
  } else if (effect.type === "note") {
    const text = NOTE_TEXT[effect.templateId] ?? `Noted: ${option.title}.`;
    if (effect.channel === "ledger") p4.log = [text, ...p4.log].slice(0, 200);
    else if (effect.channel === "news") p4.newsFeed = [text, ...(p4.newsFeed ?? [])].slice(0, 60);
    else if (effect.channel === "rumor") p4.rumors = [text, ...(p4.rumors ?? [])].slice(0, 60);
    else p4.chronicleNotes = [text, ...(p4.chronicleNotes ?? [])].slice(0, 60);
    written.push(tag(effect.channel));
  } else if (effect.type === "flag") {
    p4.flags = { ...(p4.flags ?? {}) };
    if (effect.op === "set") p4.flags[effect.key] = true;
    else delete p4.flags[effect.key];
    if (effect.key.startsWith("lead:")) done.push("A lead is opened in the record.");
  } else if (effect.type === "npc") {
    const abs = absMin(p4.now?.day ?? 0, p4.now?.minute ?? 0);
    const hours = effect.busyHours ?? 4;
    const prev = p4.npcStatus?.[effect.id];
    p4.npcStatus = {
      ...(p4.npcStatus ?? {}),
      [effect.id]: {
        avoiding: prev?.avoiding ?? [],
        grudge: prev?.grudge ?? {},
        ...prev,
        ...(effect.mood ? { mood: effect.mood } : {}),
        errandUntil: abs + hours * 60,
        errandPlace: "on orders",
      },
    };
    spent.push(`${effect.id} is posted away.`);
  }
}

function titleCase(good: string): string {
  return good.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

function nudgeWorldStock(world: WorldState, good: Good, delta: number, mark: (key: string, dir: GaugeArrow) => void): WorldState {
  const dir: GaugeArrow = delta < 0 ? "down" : delta > 0 ? "up" : "flat";
  const bump = (stock: number, capacity: number, scaled: number) => Math.max(0, Math.min(capacity, stock + scaled));
  if (good === "food") {
    const scaled = delta * 8;
    const stock = bump(world.food.stock, world.food.capacity, scaled);
    mark("food", dir);
    return { ...world, food: { ...world.food, stock } };
  }
  if (good === "water") {
    const scaled = delta * 400;
    const stock = bump(world.water.stock, world.water.capacity, scaled);
    mark("water", dir);
    return { ...world, water: { ...world.water, stock } };
  }
  if (good === "fuel stocks") {
    const scaled = delta * 200;
    const stock = bump(world.energy.stock, world.energy.capacity, scaled);
    mark("energy", dir);
    return { ...world, energy: { ...world.energy, stock } };
  }
  return world;
}

export function gaugeWord(kind: "ratio" | "index", value: number, cap = 1): BandWord {
  return kind === "index" ? indexBand(value) : ratioBand(cap > 0 ? value / cap : 0);
}
