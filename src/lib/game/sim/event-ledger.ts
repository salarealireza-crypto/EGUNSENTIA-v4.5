import type { EventLedgerEntry } from "../types";

export const EVENT_LEDGER_LIMIT = 500;
const KNOWLEDGE_LAYERS = new Set(["actual", "player", "public", "household", "medical", "authority", "rumor", "intelligence", "secret"]);

function isUsableEvent(row: unknown): row is EventLedgerEntry {
  if (!row || typeof row !== "object" || Array.isArray(row)) return false;
  const event = row as Partial<EventLedgerEntry>;
  if (typeof event.id !== "string" || !event.id.trim() || event.id.length > 160) return false;
  for (const [field, max] of [["date", 80], ["time", 24], ["location", 200], ["type", 48], ["cause", 1000], ["immediate", 1200], ["evidence", 500]] as const) {
    const value = event[field];
    if (typeof value !== "string" || value.length > max) return false;
  }
  if (!Array.isArray(event.actors) || event.actors.length > 20 || event.actors.some((actor) => typeof actor !== "string" || actor.length > 100)) return false;
  if (typeof event.knowledge !== "string" || !KNOWLEDGE_LAYERS.has(event.knowledge)) return false;
  if (event.year !== undefined && (typeof event.year !== "string" || event.year.length > 24)) return false;
  for (const field of ["later", "news", "rumor", "quest"] as const) {
    if (event[field] !== undefined && (typeof event[field] !== "string" || event[field]!.length > 1200)) return false;
  }
  return true;
}

/**
 * Append immutable ledger rows at the front, deduplicating by their stable IDs.
 * Existing rows win on duplicate IDs so a replay cannot rewrite history.
 */
export function appendLedgerEvents(
  current: EventLedgerEntry[],
  incoming: EventLedgerEntry | EventLedgerEntry[],
  limit = EVENT_LEDGER_LIMIT,
): EventLedgerEntry[] {
  const rows = Array.isArray(incoming) ? incoming : [incoming];
  const seen = new Set(current.filter((row) => row && typeof row.id === "string").map((row) => row.id));
  const fresh: EventLedgerEntry[] = [];
  for (const row of rows) {
    if (!isUsableEvent(row) || seen.has(row.id)) continue;
    seen.add(row.id);
    fresh.push(row);
  }
  return [...fresh.reverse(), ...current].slice(0, Math.max(1, Math.min(EVENT_LEDGER_LIMIT, limit)));
}

export function ledgerDayKey(entry: Pick<EventLedgerEntry, "date" | "year">): string {
  return `${entry.year ?? "LEGACY"}|${entry.date}`;
}

/** Newest date groups first, preserving first-seen order for legacy entries without year. */
export function ledgerDayOptions(events: EventLedgerEntry[]): Array<{ key: string; label: string }> {
  const seen = new Set<string>();
  const out: Array<{ key: string; label: string }> = [];
  for (const event of events) {
    if (!event || typeof event.id !== "string" || typeof event.date !== "string") continue;
    const key = ledgerDayKey(event);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label: event.year ? `${event.date} ${event.year}` : `${event.date} · year not recorded` });
  }
  return out;
}

/** Return a read-only chronological projection for one recorded in-world day. */
export function eventsForLedgerDay(events: EventLedgerEntry[], key: string): EventLedgerEntry[] {
  return events
    .filter((event) => Boolean(event && typeof event.id === "string" && typeof event.date === "string" && typeof event.time === "string") && ledgerDayKey(event) === key)
    .slice()
    .sort((a, b) => {
      const parse = (value: string) => {
        const match = /^(\d{1,2}):(\d{2})$/.exec(value);
        return match ? Number(match[1]) * 60 + Number(match[2]) : Number.MAX_SAFE_INTEGER;
      };
      return parse(a.time) - parse(b.time) || a.id.localeCompare(b.id);
    });
}

export function crisisHistoryIdentity(row: {
  kind: string;
  outcome: string;
  atMin: number;
  affectedGateIds?: string[];
}): string {
  return [row.kind, row.outcome, row.atMin, [...(row.affectedGateIds ?? [])].sort().join(",")].join("|");
}

export function crisisHistoryToLedgerEvent(row: {
  kind: string;
  outcome: "resolved" | "failed";
  atMin: number;
  affectedGateIds?: string[];
}): EventLedgerEntry {
  const dayIndex = Math.floor(row.atMin / 1440);
  const minute = ((row.atMin % 1440) + 1440) % 1440;
  const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
  // Keep the ID stable across repeated applyP4 calls and reloads.
  const gates = [...(row.affectedGateIds ?? [])].sort();
  const id = `EV-CRISIS-${row.kind}-${row.outcome}-${row.atMin}${gates.length ? `-${gates.join("-")}` : ""}`;
  const clock = clockForLedgerDay(dayIndex, time);
  return {
    id,
    date: clock.date,
    year: clock.year,
    time,
    location: gates.length ? `Gate operations: ${gates.join(", ")}` : "Dome operations",
    type: "CRISIS",
    actors: ["Crisis response teams"],
    cause: `${row.kind} crisis reached a recorded outcome`,
    immediate: `${row.kind} crisis ${row.outcome}.`,
    evidence: "Simulation crisis history",
    knowledge: "authority",
  };
}

function clockForLedgerDay(dayIndex: number, time: string): { date: string; year: string } {
  // Import-free clock projection avoids a dependency cycle with the time engine.
  const months = ["First Light", "Ironmonth", "Wellmonth", "Sporemonth", "Furnacetide", "Bannermonth", "Deepmonth", "Ashmonth", "Feastmonth", "Chainmonth", "Silentmonth", "Endmonth"];
  const absolute = 49 + dayIndex;
  const yearOffset = Math.floor(absolute / 365);
  const dayOfYear = ((absolute % 365) + 365) % 365;
  if (dayOfYear >= 360) return { date: `Dead Day ${dayOfYear - 359}`, year: `${105 + yearOffset} AW` };
  return { date: `${(dayOfYear % 30) + 1} ${months[Math.floor(dayOfYear / 30)]}`, year: `${105 + yearOffset} AW` };
}
