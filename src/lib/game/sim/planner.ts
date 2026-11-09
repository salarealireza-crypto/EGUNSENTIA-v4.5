import { absMin, fromMin, toMin, type Tier } from "./core.ts";

export interface PlanItem {
  id: string;
  time: string;
  label: string;
  fixed: boolean;
  status: "planned" | "done" | "missed";
  day?: number; // undefined on fixed items = repeats daily
  durMin?: number;
  place?: string;
  npc?: string;
  priority?: number; // higher wins; fixed items are 100
}
export interface PlanResult { ok: boolean; reason: string; rescheduledTo?: string; displaced?: string[] }

const TRAVEL: Record<string, number> = {
  "Evening Hall|Surface Latch": 40, "Evening Hall|Eastern Wall": 25, "Evening Hall|Archive": 10, "Evening Hall|Forge": 20,
  "Reception Hall|Eastern Wall": 20, "Reception Hall|Archive": 8, "Reception Hall|Forge": 18, "Reception Hall|Infirmary": 12,
  "Eastern Wall|Surface Latch": 30, "Eastern Wall|Archive": 30, "Forge|West Cistern": 25, "Rail Platform|Market Tunnel": 15,
};
export function travelMinutes(a?: string, b?: string): number {
  if (!a || !b || a === b) return 0;
  return TRAVEL[`${a}|${b}`] ?? TRAVEL[`${b}|${a}`] ?? 10;
}

export const FIXED_RHYTHM: PlanItem[] = [
  { id: "P-0700", time: "07:00", label: "Hall / free time", fixed: true, status: "planned", durMin: 60, place: "Evening Hall", priority: 100 },
  { id: "P-1000", time: "10:00", label: "Morning Briefing", fixed: true, status: "planned", durMin: 60, place: "Reception Hall", priority: 100 },
  { id: "P-1430", time: "14:30", label: "Public Address", fixed: true, status: "planned", durMin: 45, place: "Reception Hall", priority: 100 },
  { id: "P-2000", time: "20:00", label: "Evening Hall", fixed: true, status: "planned", durMin: 120, place: "Evening Hall", priority: 100 },
  { id: "P-2200", time: "22:00", label: "Hall choosing", fixed: true, status: "planned", durMin: 30, place: "Evening Hall", priority: 100 },
];

const startOf = (i: PlanItem) => toMin(i.time) ?? 0;
const endOf = (i: PlanItem) => startOf(i) + (i.durMin ?? 30);
const onDay = (i: PlanItem, day: number) => (i.fixed && i.day === undefined) || i.day === day;

function collides(a: { start: number; end: number; place?: string }, b: PlanItem): boolean {
  const gap = travelMinutes(a.place, b.place);
  return a.start < endOf(b) + gap && startOf(b) < a.end + gap;
}

export interface PlanOpts {
  day?: number; durMin?: number; place?: string; npc?: string; priority?: number;
  npcAvailable?: (npc: string, absMinute: number, durationMinutes: number, place?: string) => boolean;
  tier?: Tier; // current interruption tier (emergency forbids leaving the Hall)
}

/** Add a planner item with conflict detection, displacement, NPC availability and travel time. */
export function addPlanItem(items: PlanItem[], label: string, time: string, opts: PlanOpts = {}): { items: PlanItem[]; result: PlanResult; id?: string } {
  const start0 = toMin(time);
  if (start0 === null) return { items, result: { ok: false, reason: `"${time}" is not a valid HH:MM time.` } };
  const day = opts.day ?? 0;
  const dur = Math.max(5, opts.durMin ?? 30);
  const prio = opts.priority ?? 50;
  const leaving = opts.place && !["Evening Hall", "Reception Hall"].includes(opts.place);
  if (opts.tier === "emergency" && leaving) return { items, result: { ok: false, reason: "An emergency is open; leaving the Hall is not possible until it is answered." } };
  if (opts.place === "Surface Latch" && opts.tier === "critical") return { items, result: { ok: false, reason: "Security constraint: no surface movement during a critical alert." } };
  let start = start0;
  let displaced: string[] = [];
  let list = items.slice();
  const id = `P-${day}-${String(start0).padStart(4, "0")}-${list.length}`;
  const dayItems = () => list.filter((i) => onDay(i, day) && i.status === "planned");
  for (let guard = 0; guard < 100; guard++) {
    if (start + dur > 23 * 60 + 30) return { items, result: { ok: false, reason: "No free slot remains before the night rest." } };
    const probe = { start, end: start + dur, place: opts.place };
    const activeItems = dayItems();
    const hits = activeItems.filter((i) => collides(probe, i));
    const sameNpcHits = opts.npc
      ? activeItems.filter((i) => i.npc?.trim().toLocaleLowerCase() === opts.npc!.trim().toLocaleLowerCase()
        && start < endOf(i) + travelMinutes(i.place, opts.place)
        && startOf(i) < start + dur + travelMinutes(opts.place, i.place))
      : [];
    const npcBlocker = sameNpcHits.sort((a, b) => startOf(a) - startOf(b))[0];
    const npcAvailable = opts.npc && opts.npcAvailable
      ? opts.npcAvailable(opts.npc, absMin(day, start), dur, opts.place)
      : true;
    const npcBusy = Boolean(opts.npc && (!npcAvailable || sameNpcHits.length));
    if (!hits.length && !npcBusy) break;
    const fixedHit = hits.find((h) => h.fixed);
    const strongerHit = hits.find((h) => !h.fixed && (h.priority ?? 50) >= prio);
    if (npcBusy || fixedHit || strongerHit) {
      // An unavailable NPC or a conflicting booking moves this item; it never
      // displaces another appointment for the same person.
      const blocker = fixedHit ?? strongerHit ?? npcBlocker;
      start = blocker ? endOf(blocker) + travelMinutes(blocker.place, opts.place) : start + 30;
      continue;
    }
    // every hit is a movable, lower-priority item: displace them
    displaced = hits.map((h) => h.label);
    list = list.map((i) => (hits.includes(i) ? { ...i, status: "missed" as const } : i));
    break;
  }
  const item: PlanItem = { id, time: fromMin(start), label, fixed: false, status: "planned", day, durMin: dur, place: opts.place, npc: opts.npc, priority: prio };
  const moved = start !== start0;
  const reason = moved
    ? `Collision: moved to ${item.time}${displaced.length ? "" : " (clear of fixed items, travel time and availability)"}.`
    : displaced.length ? `Higher priority: displaced ${displaced.join(", ")}.` : "Scheduled.";
  return { items: [...list, item], id, result: { ok: true, reason, rescheduledTo: moved ? item.time : undefined, displaced } };
}

/** Items that come due in (fromAbs, toAbs], ordered by timestamp. */
export function dueBetween(items: PlanItem[], fromAbs: number, toAbs: number): Array<{ item: PlanItem; at: number }> {
  const out: Array<{ item: PlanItem; at: number }> = [];
  const d0 = Math.floor(fromAbs / 1440);
  const d1 = Math.floor(toAbs / 1440);
  for (let d = d0; d <= d1; d++) {
    for (const i of items) {
      if (i.status !== "planned" || !onDay(i, d)) continue;
      const at = absMin(d, startOf(i));
      if (at > fromAbs && at <= toAbs) out.push({ item: i, at });
    }
  }
  return out.sort((a, b) => a.at - b.at || b.item.priority! - a.item.priority!);
}

/** Next planned item strictly after `fromAbs`. */
export function nextScheduled(items: PlanItem[], fromAbs: number): { item: PlanItem; at: number } | null {
  const horizon = dueBetween(items, fromAbs, fromAbs + 3 * 1440);
  return horizon[0] ?? null;
}
/** Absolute minute of the next occurrence of HH:MM strictly after `fromAbs`. */
export function nextClockTime(fromAbs: number, hhmm: string): number | null {
  const t = toMin(hhmm);
  if (t === null) return null;
  const day = Math.floor(fromAbs / 1440);
  const cand = absMin(day, t);
  return cand > fromAbs ? cand : cand + 1440;
}
/** Next Marketday given the weekday index of day 0 (0=Ironday ... 5=Marketday). */
export function nextMarketday(fromAbs: number, weekdayOfDay0 = 0): number {
  const day = Math.floor(fromAbs / 1440);
  for (let d = day; d < day + 8; d++) {
    const wd = (((d + weekdayOfDay0) % 7) + 7) % 7;
    if (wd === 5 && absMin(d, 7 * 60) > fromAbs) return absMin(d, 7 * 60);
  }
  return fromAbs + 7 * 1440;
}
