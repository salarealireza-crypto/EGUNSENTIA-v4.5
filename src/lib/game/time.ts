import { appendLedgerEvents } from "./sim/event-ledger.ts";
import type {
  EventLedgerEntry,
  FilmItem,
  GameSnapshot,
  HouseholdStatus,
  NewsItem,
  TimeDigest,
  TradeOffer,
  VaultItem,
  WorldNewsItem,
} from "./types";

export const WEEKDAYS = ["Ironday", "Wellday", "Voiceday", "Stoneday", "Watchday", "Marketday", "Ashday"] as const;
export const MONTHS = [
  "First Light",
  "Ironmonth",
  "Wellmonth",
  "Sporemonth",
  "Furnacetide",
  "Bannermonth",
  "Deepmonth",
  "Ashmonth",
  "Feastmonth",
  "Chainmonth",
  "Silentmonth",
  "Endmonth",
] as const;

const START_YEAR = 105;
const START_MONTH = 1; // Ironmonth
const START_DAY = 20;

export function parseAdvance(raw: string): number | null {
  const q = raw.trim().toLowerCase();
  const until = q.match(/^advance\s+to\s+(.+)/);
  if (until) {
    if (/briefing|morning/.test(until[1])) return 0;
    if (/next major/.test(until[1])) return 3;
  }
  const m = q.match(/^advance\s+(\d+)\s*(hour|hours|day|days|week|weeks|month|months|year|years)s?\.?$/);
  if (!m) {
    if (/^advance\s+one\s+week/.test(q)) return 7;
    if (/^advance\s+one\s+month/.test(q)) return 30;
    if (/^advance\s+one\s+year/.test(q)) return 365;
    if (/^advance\s+six\s+months/.test(q)) return 180;
    if (/^advance\s+3\s+years/.test(q)) return 365 * 3;
    return null;
  }
  const n = Number(m[1]);
  const u = m[2];
  // Hours are NOT rounded to days any more: use parseAdvanceSpec() for hour/target requests.
  if (u.startsWith("hour")) return null;
  if (u.startsWith("day")) return n;
  if (u.startsWith("week")) return n * 7;
  if (u.startsWith("month")) return n * 30;
  if (u.startsWith("year")) return n * 365;
  return null;
}

export type AdvanceSpec =
  | { kind: "hours"; n: number }
  | { kind: "until"; target: "next-item" | "marketday" | { time: string } };

const NUM_WORDS: Record<string, number> = { one: 1, an: 1, a: 1, two: 2, three: 3, four: 4, six: 6, eight: 8, twelve: 12 };

/** Hour-level and target-level advance requests. Day-or-longer requests stay with parseAdvance(). */
export function parseAdvanceSpec(raw: string): AdvanceSpec | null {
  const q = raw.trim().toLowerCase().replace(/\.$/, "");
  const h = q.match(/^(?:advance|wait|skip)\s+(?:for\s+)?(\d+(?:\.\d+)?|one|an|a|two|three|four|six|eight|twelve)\s*(?:hour|hours|hr|hrs|h)$/);
  if (h) {
    const n = /^\d/.test(h[1]) ? Number(h[1]) : NUM_WORDS[h[1]];
    return n > 0 ? { kind: "hours", n } : null;
  }
  if (/^(?:advance|wait|skip)\s+(?:to|until)\s+(?:the\s+)?next\s+(?:scheduled\s+)?(?:item|plan|appointment)$/.test(q)) return { kind: "until", target: "next-item" };
  if (/^(?:advance|wait|skip)\s+(?:to|until)\s+(?:the\s+)?marketday$/.test(q)) return { kind: "until", target: "marketday" };
  const t = q.match(/^(?:advance|wait|skip)\s+(?:to|until)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (t) {
    let hh = Number(t[1]);
    const mm = Number(t[2] ?? 0);
    if (t[3] === "pm" && hh < 12) hh += 12;
    if (t[3] === "am" && hh === 12) hh = 0;
    if (hh > 23 || mm > 59) return null;
    return { kind: "until", target: { time: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}` } };
  }
  return null;
}

export function clockFromDayIndex(dayIndex: number, time = "07:00") {
  const abs = START_DAY - 1 + START_MONTH * 30 + dayIndex;
  const yearOffset = Math.floor(abs / 365);
  const doy = ((abs % 365) + 365) % 365;
  const weekday = WEEKDAYS[((0 + dayIndex) % 7 + 7) % 7];
  const year = START_YEAR + yearOffset;
  // Canon: 12 months of 30 days plus 5 Dead Days at the end of the year.
  if (doy >= 360) {
    const dead = `Dead Day ${doy - 359}`;
    return { weekday, date: dead, year: `${year} AW`, time, label: `${weekday}, ${dead} ${year} AW` };
  }
  const month = Math.floor(doy / 30);
  const day = (doy % 30) + 1;
  return {
    weekday,
    date: `${day} ${MONTHS[month]}`,
    year: `${year} AW`,
    time,
    label: `${weekday}, ${day} ${MONTHS[month]} ${year} AW`,
  };
}

export interface SimState {
  world: GameSnapshot["world"];
  inbox: GameSnapshot["inbox"];
  news: GameSnapshot["news"];
  worldNews: GameSnapshot["worldNews"];
  calendar: GameSnapshot["calendar"];
  stalkers: GameSnapshot["stalkers"];
  finds: GameSnapshot["finds"];
  sorties: GameSnapshot["sorties"];
  kin: GameSnapshot["kin"];
  household: GameSnapshot["household"];
  gates: GameSnapshot["gates"];
  trades: GameSnapshot["trades"];
  films: GameSnapshot["films"];
  events: GameSnapshot["events"];
  personalVault: GameSnapshot["personalVault"];
  factionVault: GameSnapshot["factionVault"];
  children: GameSnapshot["children"];
  threads: GameSnapshot["threads"];
  secretClocks: GameSnapshot["secretClocks"];
  chronicle: GameSnapshot["chronicle"];
  radio: GameSnapshot["radio"];
}

export function simulateAdvance(state: SimState, days: number): {
  next: SimState;
  digest: TimeDigest;
} {
  const fromDay = state.world.dayIndex;
  const major: string[] = [];
  let interrupt: string | undefined;
  const next: SimState = structuredClone(state);

  const maxDays = Math.min(days, 365 * 20);
  for (let d = 1; d <= maxDays; d += 1) {
    next.world.dayIndex += 1;
    tickResources(next);
    advanceDailyContinuity(next, next.world.dayIndex, major);

    const hard = hardInterrupt(next);
    if (hard) {
      interrupt = hard;
      major.push(`INTERRUPT ${clockFromDayIndex(next.world.dayIndex).label}: ${hard}`);
      break;
    }
  }

  const to = clockFromDayIndex(next.world.dayIndex);
  next.world.clock.location = next.world.clock.location || "the Dome";
  const skipEvent: EventLedgerEntry = {
    id: `EV-skip-${fromDay}-${next.world.dayIndex}`,
    date: next.world.clock.date,
    year: next.world.clock.year,
    time: next.world.clock.time,
    location: "Red Claw territory",
    type: "INFRASTRUCTURE",
    actors: ["world systems"],
    cause: `Time advanced ${next.world.dayIndex - fromDay} day(s) by command`,
    immediate: major.slice(0, 6).join(" · ") || "Quiet continuity. No hard interrupt.",
    evidence: "time skip simulation",
    knowledge: "player",
  };
  next.events = appendLedgerEvents(next.events, skipEvent);

  if (!major.length) {
    major.push("Quiet period. Work, meals, watches and maintenance continued without a crisis the Fist had to decide.");
  }

  const elapsedDays = next.world.dayIndex - fromDay;
  const digest: TimeDigest = {
    fromDay,
    toDay: next.world.dayIndex,
    elapsed: `${elapsedDays} day${elapsedDays === 1 ? "" : "s"} → ${to.label}`,
    major: major.slice(0, 16),
    interrupt,
  };
  return { next, digest };
}

/** Apply non-resource daily world continuity for a crossed in-world day.
 * Shared by day skips and the hour-level clock so both paths trigger the same dated systems.
 */
export function advanceDailyContinuity(s: SimState, dayIndex: number, major: string[] = []): void {
  s.world.dayIndex = dayIndex;
  const clock = clockFromDayIndex(dayIndex);
  s.world.clock = {
    ...s.world.clock,
    weekday: clock.weekday,
    date: clock.date,
    year: clock.year,
    time: "07:00",
  };
  tickHousehold(s);
  tickCalendar(s, clock.label, major);
  tickChildren(s);
  if (dayIndex - s.world.lastWeeklyRelicDay >= 7) {
    weeklyRelic(s, clock, major);
    s.world.lastWeeklyRelicDay = dayIndex;
  }
  if (dayIndex % 7 === 0) tickRadio(s, clock);
  expireTrades(s, clock, major);
}

/** Effective consumption for one simulation tick; policy never rewrites the saved baseline. */
export function resourceConsumptionForTick(resource: Pick<SimState["world"]["water"], "consumption" | "policy">): number {
  return resource.policy === "ration" ? Math.max(0, resource.consumption * 0.92) : resource.consumption;
}

function tickResources(s: SimState) {
  for (const key of ["water", "food", "energy"] as const) {
    const r = s.world[key];
    const trend = r.production - resourceConsumptionForTick(r);
    const nextStock = Math.max(0, Math.min(r.capacity, r.stock + trend));
    s.world[key] = { ...r, stock: nextStock };
  }
  s.world.treasury.marks = Math.max(
    0,
    s.world.treasury.marks + s.world.treasury.income - s.world.treasury.expenses,
  );
}

function tickHousehold(s: SimState) {
  s.household = s.household.map((h) => {
    const misses: HouseholdStatus["misses"] =
      h.chosenEvening ? "low" : h.misses === "low" ? "medium" : "high";
    return {
      ...h,
      misses,
      lastInteraction: h.chosenEvening ? `dawn ${s.world.clock.date}` : h.lastInteraction,
      tonight: h.tonight,
    };
  });
  const householdMoodById = new Map(s.household.filter((h) => h.id).map((h) => [h.id!, h.mood]));
  s.kin = s.kin.map((k) => {
    const mood = k.id ? householdMoodById.get(k.id) : undefined;
    return mood === undefined ? k : { ...k, mood };
  });
}

function calendarDateMatches(entryDate: string, clock: ReturnType<typeof clockFromDayIndex>): boolean {
  type ParsedDate = { day: number; ordinal: number; year?: number };
  const parsePart = (raw: string, inheritedMonth?: string): ParsedDate | null => {
    const value = raw.trim().replace(/\s+(?:dawn|morning|noon|evening|night|rumor)$/i, "");
    const yearMatch = value.match(/\s+(\d{3,4})\s+AW$/i);
    const year = yearMatch ? Number(yearMatch[1]) : undefined;
    const withoutYear = value.replace(/\s+\d{3,4}\s+AW$/i, "").trim();
    const deadDay = withoutYear.match(/^Dead Day\s+(\d)$/i);
    if (deadDay) {
      const day = Number(deadDay[1]);
      return day >= 1 && day <= 5 ? { day, ordinal: 360 + day, year } : null;
    }
    const match = withoutYear.match(/^(\d{1,2})(?:\s+(.+))?$/);
    if (!match) return null;
    const day = Number(match[1]);
    const month = (match[2] ?? inheritedMonth)?.trim().replace(/\s+/g, " ");
    if (!month) return null;
    const monthIndex = MONTHS.findIndex((item) => item.toLowerCase() === month.toLowerCase());
    if (monthIndex >= 0 && day >= 1 && day <= 30) return { day, ordinal: monthIndex * 30 + day, year };
    const dead = month.match(/^Dead Day\s+(\d)$/i);
    if (dead && day === 1) {
      const deadDay = Number(dead[1]);
      if (deadDay >= 1 && deadDay <= 5) return { day: deadDay, ordinal: 360 + deadDay, year };
    }
    return null;
  };

  const currentYear = Number(clock.year.match(/\d{3,4}/)?.[0]);
  const current = parsePart(clock.date);
  if (!current) return false;
  const rangeParts = entryDate.split(/\s*[–—-]\s*/);
  if (rangeParts.length === 1) {
    const target = parsePart(entryDate);
    return !!target && target.ordinal === current.ordinal && (target.year === undefined || target.year === currentYear);
  }
  if (rangeParts.length !== 2) return false;
  // A compact range such as "19–20 Ironmonth" inherits the month on the short endpoint.
  const leftHasMonth = /^\d{1,2}\s+.+$/.test(rangeParts[0].trim());
  const rightHasMonth = /^\d{1,2}\s+.+$/.test(rangeParts[1].trim());
  const leftMonth = leftHasMonth ? rangeParts[0].trim().replace(/^\d{1,2}\s+/, "") : undefined;
  const rightMonth = rightHasMonth ? rangeParts[1].trim().replace(/^\d{1,2}\s+/, "") : undefined;
  const start = parsePart(rangeParts[0], leftMonth ?? rightMonth);
  const end = parsePart(rangeParts[1], rightMonth ?? leftMonth);
  if (!start || !end) return false;
  // Date ranges may cross the five Dead Days and into the following year.
  // An omitted endpoint year is inferred from the endpoint order; explicit
  // years always take precedence and must form a forward range.
  let startYear = start.year ?? currentYear;
  let endYear = end.year ?? currentYear;
  if (start.year !== undefined && end.year === undefined && end.ordinal < start.ordinal) {
    endYear = start.year + 1;
  } else if (start.year === undefined && end.year !== undefined && start.ordinal > end.ordinal) {
    startYear = end.year - 1;
  } else if (start.year === undefined && end.year === undefined && end.ordinal < start.ordinal) {
    // For an unqualified cross-year range, anchor the occurrence to the
    // current calendar year: dates at/after the start belong to this year's
    // opening half; dates at/before the end belong to the prior year's start.
    if (current.ordinal >= start.ordinal) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else if (current.ordinal <= end.ordinal) {
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      return false;
    }
  }
  if (endYear < startYear || endYear - startYear > 1) return false;
  const startAbsolute = startYear * 365 + start.ordinal;
  const endAbsolute = endYear * 365 + end.ordinal;
  const currentAbsolute = currentYear * 365 + current.ordinal;
  return currentAbsolute >= startAbsolute && currentAbsolute <= endAbsolute;
}

function tickCalendar(s: SimState, _label: string, major: string[]) {
  const clock = clockFromDayIndex(s.world.dayIndex);
  s.calendar = s.calendar.map((e) => {
    if (e.status !== "planned") return e;
    if (calendarDateMatches(e.date, clock) && e.importance === "Critical") {
      major.push(`Calendar: ${e.name} reached ${e.date}. Decision required.`);
      return { ...e, status: "started" as const };
    }
    return e;
  });
}

function tickChildren(s: SimState) {
  // Birthdays with an actual saved date use the child's own anniversary.
  // Old records without birthDay keep the former campaign-year boundary rule.
  const legacyYearBoundary = s.world.dayIndex > 0 && s.world.dayIndex % 365 === 0;
  s.children = s.children.map((child) => {
    if (child.status !== "living") return child;
    if (Number.isSafeInteger(child.birthDay)) {
      const ageYears = Math.max(0, Math.floor((s.world.dayIndex - child.birthDay!) / 365));
      return ageYears === child.ageYears ? child : { ...child, ageYears };
    }
    return legacyYearBoundary ? { ...child, ageYears: child.ageYears + 1 } : child;
  });

  const childById = new Map(s.children.map((child) => [child.id, child]));
  s.kin = s.kin.map((person) => {
    const child = person.id ? childById.get(person.id) : undefined;
    if (!child || child.status !== "living") return person;
    return {
      ...person,
      role: person.role.replace(/\d+/, String(child.ageYears)),
      ageYears: child.ageYears,
    };
  });
}

const RELIC_POOL = [
  { name: "Bent metro sign, line unknown", kind: "relic" as const, condition: "rusted enamel", radiation: "low" },
  { name: "Sealed film canister, label burnt", kind: "relic" as const, condition: "canister intact", radiation: "clean" },
  { name: "Surveyor's chain, pre-war marks", kind: "tool" as const, condition: "wear-polished", radiation: "clean" },
  { name: "Child's shoe last, industrial", kind: "other" as const, condition: "wood split", radiation: "clean" },
  { name: "Pump gasket, still flexible", kind: "tool" as const, condition: "usable", radiation: "clean" },
  { name: "Page of a civic hymn", kind: "log" as const, condition: "brittle", radiation: "clean" },
];

function weeklyRelic(s: SimState, clock: { label: string; date: string }, major: string[]) {
  const team = s.stalkers.filter((x) => x.status === "ready").slice(0, 4);
  if (team.length < 4 || s.world.surface.weekSorties >= s.world.surface.weekLimit) {
    s.world.surface.weekSorties = 0;
    return;
  }
  const pick = RELIC_POOL[s.world.dayIndex % RELIC_POOL.length];
  const id = `F-${String(s.finds.length + 1).padStart(2, "0")}-${s.world.dayIndex}`;
  s.finds.unshift({
    id,
    name: pick.name,
    condition: pick.condition,
    radiation: pick.radiation,
    queue: "cleansing",
    release: clock.date,
    foundBy: team[0]?.name,
    kind: pick.kind,
  });
  const vault: VaultItem = {
    id: `FV-r-${s.world.dayIndex}`,
    name: pick.name,
    category: pick.kind.toUpperCase(),
    owner: "faction",
    location: "Cleansing Bay",
    condition: pick.condition,
    era: "surface recovery",
    secrecy: "open",
    use: "processing",
    value: "unassessed",
    radiation: pick.radiation,
    quantity: 1,
    provenance: {
      origin: "east of the Latch",
      previousOwner: "unknown",
      acquisition: `weekly cycle ${clock.label}`,
      processing: "cleansing",
      location: "Cleansing Bay",
    },
  };
  s.factionVault.unshift(vault);
  s.sorties.unshift({
    id: `S-auto-${s.world.dayIndex}`,
    team: team.map((t) => t.name),
    objective: "Weekly recovery within 600 m of the Latch",
    route: "Throat → north ruin street",
    hours: 4,
    rangeM: 480,
    result: "find",
    debrief: `${pick.name} recovered. No contact declared.`,
    at: clock.date,
  });
  s.world.surface.weekSorties = 0;
  major.push(`Relic cycle: ${pick.name} entered cleansing.`);
  if (pick.name.includes("film")) {
    const film: FilmItem = {
      id: `FL-r-${s.world.dayIndex}`,
      title: "Unlisted canister",
      genre: "unknown",
      era: "unknown",
      origin: "surface",
      condition: "not yet screened",
      summary: "Recovered canister. Not added to playable archive until identification completes. Content UNKNOWN.",
      known: false,
      provenance: vault.provenance.acquisition,
      reactions: "Kolb has not opened it.",
    };
    s.films.push(film);
  }
}

function tickRadio(s: SimState, clock: { label: string }) {
  s.radio = s.radio.map((st) => {
    if (st.id === "sixth") {
      return { ...st, signal: 2, nowPlaying: "Tone only after midnight. Still unowned." };
    }
    if (st.id === "fist") {
      return { ...st, nowPlaying: `Samer — ${clock.label.split(",")[0]} ledger` };
    }
    return st;
  });
}

/** Emit a persistent reminder at first eligibility, then at most once every seven in-world days.
 * Natural-language deadlines (for example "before Council recess") are not precise enough to
 * auto-expire an offer; the player must still decide its outcome.
 */
export function collectTradeReminders(trades: TradeOffer[], dayIndex: number): {
  trades: TradeOffer[];
  reminders: string[];
} {
  const reminders: string[] = [];
  const nextTrades = trades.map((trade) => {
    if (trade.status !== "open" || !trade.deadline.toLowerCase().includes("recess") || dayIndex <= 2) return trade;
    if (trade.lastReminderDay !== undefined && dayIndex - trade.lastReminderDay < 7) return trade;
    reminders.push(`Trade ${trade.id} still open: ${trade.representative} waits. Not auto-accepted.`);
    return { ...trade, lastReminderDay: dayIndex };
  });
  return { trades: nextTrades, reminders };
}

function expireTrades(s: SimState, _clock: { date: string }, major: string[]) {
  const result = collectTradeReminders(s.trades, s.world.dayIndex);
  s.trades = result.trades;
  major.push(...result.reminders);
}

function hardInterrupt(s: SimState): string | undefined {
  if (s.world.water.stock < s.world.water.capacity * 0.08) return "Water stock below critical reserve. The Fist must decide.";
  if (s.gates.some((g) => g.visual === "breach" || g.visual === "destroyed")) {
    return "A gate is no longer in normal state.";
  }
  const cistern = s.secretClocks.find((c) => c.id === "SC-cistern");
  if (cistern && cistern.value >= cistern.max) return "West cistern secret clock reached its cap. Decision required.";
  const envoy = s.secretClocks.find((c) => c.id === "SC-envoy");
  if (envoy && envoy.value >= envoy.max) return "Survivor union ultimatum matured. Decision required.";
  return undefined;
}

export function digestScene(digest: TimeDigest): string {
  const lines = digest.major.map((m) => `— ${m}`).join("\n");
  const hold = digest.interrupt
    ? `\n\nThe skip stopped. ${digest.interrupt} Christian's answer is required. The world will not invent it.`
    : "\n\nQuiet work continued where no decision of the Fist was required. Delegated offices held their remits. No Christian dialogue was written.";
  return `Time moved.\n\nElapsed: ${digest.elapsed}\n\n${lines}${hold}`;
}

export function newsFromDigest(digest: TimeDigest): { news: NewsItem[]; worldNews: WorldNewsItem[] } {
  const news: NewsItem[] = digest.major.slice(0, 4).map((m, i) => ({
    id: `n-skip-${digest.toDay}-${i}`,
    source: "Samer Vogt — catch-up",
    time: "07:00",
    body: m,
    tag: "OFFICIAL",
    reliability: "high",
  }));
  return { news, worldNews: [] };
}
