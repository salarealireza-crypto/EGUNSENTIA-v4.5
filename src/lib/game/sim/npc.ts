import { absMin, clamp, fromMin, hash, rand01, toMin } from "./core.ts";

export interface ScheduleBlock { from: number; to: number; activity: string; place: string; kind: "work" | "rest" | "social" | "household" | "meal" }
export interface NpcCard { name: string; role: string; fields?: { DAY?: string; FEARS?: string; WANTS?: string } }
export interface NpcStatus {
  illUntil?: number; // absolute minute
  errandUntil?: number;
  errandPlace?: string;
  mood?: "steady" | "strained" | "bright" | "sour";
  avoiding: string[]; // names the NPC avoids
  petition?: string;
  grudge: Record<string, number>; // name -> -5..+5 relationship driven by the player's actions
}
export interface NpcNow { name: string; place: string; activity: string; kind: ScheduleBlock["kind"] | "ill" | "errand"; available: boolean; reason?: string }

export const cleanName = (raw: string) =>
  raw
    .replace(/,\s*\d+.*$/, "")
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())
    .trim();

const WINDOWS: Array<[RegExp, number, number]> = [
  [/dawn|sunrise|first light/, 5 * 60, 8 * 60],
  [/morning/, 8 * 60, 12 * 60],
  [/\bmidday\b|\bnoon\b/, 12 * 60, 14 * 60],
  [/afternoon/, 14 * 60, 18 * 60],
  [/evening/, 18 * 60, 22 * 60],
  [/night|late/, 22 * 60, 24 * 60],
];
const PLACES: Array<[RegExp, string]> = [
  [/wall|gate|border|drill/, "Eastern Wall"],
  [/dining|kitchen|meal|food hall/, "Dining Hall"],
  [/grotsen|dominion/, "Grotsen Dominion"],
  [/school|nursery|class|lesson|children/, "Nursery Wing"],
  [/infirmary|clinic|patient|medical|ward/, "Infirmary"],
  [/archive|library|record|ledger|read/, "Archive"],
  [/forge|armou?r|smith/, "Forge"],
  [/\b(council floor|office|ministry|council|desk)\b/, "Council Floor"],
  [/evening hall|banquet|petition|court/, "Evening Hall"],
  [/family|household|residential|elder room|home/, "Residential Hall"],
  [/staff meeting|administrative meeting/, "Council Floor"],
  [/market|store|stock|ration/, "Market Tunnel"],
  [/cistern|water|pump/, "West Cistern"],
  [/radio|signal|broadcast/, "Radio Booth"],
  [/rail|train|platform/, "Rail Platform"],
  [/surface|latch|watch/, "Surface Latch"],
  [/chamber|study|private/, "Residential Hall"],
];
const placeFor = (txt: string) => PLACES.find(([re]) => re.test(txt))?.[1] ?? "Council Floor";

/** Build a full 24 h schedule from a cast card's DAY line. Pure + deterministic. */
export function buildSchedule(card: NpcCard): ScheduleBlock[] {
  const base: ScheduleBlock[] = [
    { from: 0, to: 6 * 60, activity: "Sleep", place: "Residential Hall", kind: "rest" },
    { from: 6 * 60, to: 7 * 60, activity: "Wash and breakfast", place: "Residential Hall", kind: "meal" },
    { from: 12 * 60 + 30, to: 13 * 60, activity: "Midday meal", place: "Dining Hall", kind: "meal" },
    { from: 18 * 60, to: 18 * 60 + 45, activity: "Evening meal", place: "Dining Hall", kind: "meal" },
    { from: 20 * 60, to: 22 * 60, activity: "Evening Hall", place: "Evening Hall", kind: "social" },
    { from: 22 * 60 + 30, to: 24 * 60, activity: "Rest", place: "Residential Hall", kind: "rest" },
  ];
  const day = card.fields?.DAY ?? "";
  const segs = day.split(/[;.]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const work: ScheduleBlock[] = [];
  for (const seg of segs) {
    const w = WINDOWS.find(([re]) => re.test(seg));
    if (!w) continue;
    const place = placeFor(seg);
    const kind: ScheduleBlock["kind"] = /evening|with |family|liese|konrad|children/.test(seg) ? "household" : "work";
    work.push({ from: w[1], to: w[2], activity: seg.charAt(0).toUpperCase() + seg.slice(1), place, kind });
  }
  if (!work.length) work.push({ from: 8 * 60, to: 17 * 60, activity: `${card.role.split(",")[0]} duties`, place: placeFor(card.role.toLowerCase()), kind: "work" });
  // Work/household blocks take precedence over overlapping base meal/social blocks; sleep remains fixed.
  const kept = base.filter((b) => b.kind === "rest" || !work.some((w) => w.from < b.to && w.to > b.from));
  return [...kept, ...work].sort((a, b) => a.from - b.from);
}

export function blockAt(sched: ScheduleBlock[], minuteOfDay: number): ScheduleBlock {
  // Later blocks in the sorted list (work) win when they overlap an earlier base block.
  let found: ScheduleBlock | undefined;
  for (const b of sched) if (minuteOfDay >= b.from && minuteOfDay < b.to) found = b;
  return found ?? sched[0];
}

/** Daily deterministic life events: illness, errands, petitions. */
export function rollDailyEvents(name: string, day: number, status?: NpcStatus): NpcStatus {
  const st: NpcStatus = { avoiding: [], grudge: {}, ...(status ?? {}) };
  const r = rand01(`${name}|${day}|life`);
  const dayStart = absMin(day, 0);
  if (r < 0.03) st.illUntil = dayStart + 1440 * (1 + Math.floor(rand01(`${name}|${day}|len`) * 3));
  else if (r < 0.15) {
    st.errandUntil = dayStart + 14 * 60 + Math.floor(rand01(`${name}|${day}|err`) * 120);
    st.errandPlace = ["Market Tunnel", "Rail Platform", "Archive", "Infirmary"][hash(`${name}|${day}`) % 4];
  } else if (r < 0.22) st.petition = "Wishes an audience about a household or ministry matter.";
  return st;
}

/** Where is an NPC and can the player reach them at an absolute minute? */
export function npcNow(card: NpcCard, abs: number, status?: NpcStatus, others?: Record<string, NpcNow>): NpcNow {
  const name = cleanName(card.name);
  const sched = buildSchedule(card);
  const mod = ((abs % 1440) + 1440) % 1440;
  const b = blockAt(sched, mod);
  if (status?.illUntil && abs < status.illUntil) return { name, place: "Infirmary", activity: "Ill; resting under care", kind: "ill", available: false, reason: "illness" };
  if (status?.errandUntil && abs < status.errandUntil && mod >= 9 * 60 && b.kind !== "rest") return { name, place: status.errandPlace ?? "Market Tunnel", activity: "Running an errand", kind: "errand", available: false, reason: "errand" };
  // avoidance of feared people: shift to a quieter place when the avoided NPC shares the block's place
  if (others && status?.avoiding?.length) {
    const clash = status.avoiding.find((o) => others[o]?.place === b.place);
    if (clash) return { name, place: "Residential Hall", activity: `Keeping clear of ${clash}`, kind: "social", available: true, reason: "avoidance" };
  }
  return { name, place: b.place, activity: b.activity, kind: b.kind, available: b.kind !== "rest" };
}

/** Relationship change from a player's act: drives avoidance and later behaviour. */
export function nudgeRelation(status: NpcStatus | undefined, other: string, delta: number): NpcStatus {
  const st: NpcStatus = { avoiding: [], grudge: {}, ...(status ?? {}) };
  st.grudge = { ...st.grudge, [other]: clamp((st.grudge[other] ?? 0) + delta, -5, 5) };
  st.avoiding = Object.entries(st.grudge).filter(([, v]) => v <= -3).map(([k]) => k);
  return st;
}

export function absentees(cards: NpcCard[], statuses: Record<string, NpcStatus>, abs: number): NpcNow[] {
  return cards.map((c) => npcNow(c, abs, statuses[cleanName(c.name)])).filter((n) => n.reason === "illness" || n.reason === "errand");
}
export { fromMin, toMin };
