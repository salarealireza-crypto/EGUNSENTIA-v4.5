import type { CalendarEvent } from "../types";

export type CeremonyStatus = "planned" | "held" | "missed" | "cancelled";
export interface CeremonyRecord {
  id: string;
  title: string;
  dayIndex: number;
  date: string;
  year: string;
  start: string;
  end: string;
  place: string;
  attendees: string[];
  costMarks: number;
  importance: "Low" | "Medium" | "High" | "Critical";
  status: CeremonyStatus;
  createdAtDay: number;
  recordedOutcome?: string;
}

export interface CeremonyDraft {
  title: string;
  dayIndex: number;
  start: string;
  end: string;
  place: string;
  attendees: string[];
  costMarks: number;
  importance?: CeremonyRecord["importance"];
}

export interface CeremonyScheduleResult {
  ok: boolean;
  ceremonies: CeremonyRecord[];
  calendar: CalendarEvent[];
  ceremony?: CeremonyRecord;
  message: string;
}

function isCeremonyStatus(value: unknown): value is CeremonyStatus {
  return value === "planned" || value === "held" || value === "missed" || value === "cancelled";
}

function isCeremonyImportance(value: unknown): value is CeremonyRecord["importance"] {
  return value === "Low" || value === "Medium" || value === "High" || value === "Critical";
}

function minutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  return hours < 24 && mins < 60 ? hours * 60 + mins : null;
}

function dateForDay(dayIndex: number): { date: string; year: string } {
  const months = ["First Light", "Ironmonth", "Wellmonth", "Sporemonth", "Furnacetide", "Bannermonth", "Deepmonth", "Ashmonth", "Feastmonth", "Chainmonth", "Silentmonth", "Endmonth"];
  const absolute = 49 + dayIndex;
  const yearOffset = Math.floor(absolute / 365);
  const dayOfYear = ((absolute % 365) + 365) % 365;
  if (dayOfYear >= 360) return { date: `Dead Day ${dayOfYear - 359}`, year: `${105 + yearOffset} AW` };
  return { date: `${(dayOfYear % 30) + 1} ${months[Math.floor(dayOfYear / 30)]}`, year: `${105 + yearOffset} AW` };
}

export function scheduleCeremony(
  ceremonies: CeremonyRecord[],
  calendar: CalendarEvent[],
  draft: CeremonyDraft,
  currentDay: number,
  npcAvailable: (name: string, dayIndex: number, startMinute: number, durationMinutes: number, place: string) => boolean,
): CeremonyScheduleResult {
  const title = typeof draft.title === "string" ? draft.title.trim().slice(0, 100) : "";
  const place = typeof draft.place === "string" ? draft.place.trim().slice(0, 100) : "";
  const start = minutes(draft.start);
  const end = minutes(draft.end);
  const rawAttendees = Array.isArray(draft.attendees) ? draft.attendees : [];
  const attendees = [...new Set(rawAttendees.filter((name): name is string => typeof name === "string").map((name) => name.trim()).filter(Boolean))].slice(0, 20);
  const costMarks = draft.costMarks;
  if (!title || !place) return { ok: false, ceremonies, calendar, message: "Enter a ceremony title and place." };
  if (!Number.isSafeInteger(draft.dayIndex) || draft.dayIndex < currentDay || draft.dayIndex > currentDay + 365) return { ok: false, ceremonies, calendar, message: "Choose a date within the next campaign year." };
  if (start === null || end === null || end <= start || end - start > 12 * 60) return { ok: false, ceremonies, calendar, message: "Choose a valid same-day time window of up to 12 hours." };
  if (!Number.isSafeInteger(costMarks) || costMarks < 0 || costMarks > 1_000_000) return { ok: false, ceremonies, calendar, message: "Ceremony cost must be a whole number between 0 and 1,000,000 marks." };
  if (!Array.isArray(draft.attendees) || draft.attendees.length > 20 || attendees.length !== rawAttendees.filter((name) => typeof name === "string" && name.trim()).length) return { ok: false, ceremonies, calendar, message: "Use no more than 20 distinct attendees." };
  if (draft.importance !== undefined && !["Low", "Medium", "High", "Critical"].includes(draft.importance)) return { ok: false, ceremonies, calendar, message: "Choose a valid ceremony importance." };

  const date = dateForDay(draft.dayIndex);
  const conflict = ceremonies.find((row) => row.status === "planned" && row.dayIndex === draft.dayIndex && start < (minutes(row.end) ?? 0) && (minutes(row.start) ?? 0) < end && (row.place.toLowerCase() === place.toLowerCase() || attendees.some((name) => row.attendees.some((old) => old.toLowerCase() === name.toLowerCase()))));
  if (conflict) return { ok: false, ceremonies, calendar, message: `This time conflicts with ${conflict.title} or one of its attendees.` };
  const calendarConflict = calendar.find((row) => (row.status === "planned" || row.status === "started") && row.date === date.date && (!row.year || row.year === date.year) && start < (minutes(row.end) ?? 0) && (minutes(row.start) ?? 0) < end && (row.place.toLowerCase() === place.toLowerCase() || attendees.some((name) => row.attendees?.some((old) => old.toLowerCase() === name.toLowerCase()))));
  if (calendarConflict) return { ok: false, ceremonies, calendar, message: `This time conflicts with the calendar event ${calendarConflict.name}.` };
  const duration = end - start;
  const busy = attendees.find((name) => name.toLowerCase() !== "christian red iv" && !npcAvailable(name, draft.dayIndex, start, duration, place));
  if (busy) return { ok: false, ceremonies, calendar, message: `${busy} is not available for the full ceremony interval.` };

  const baseId = `CER-${draft.dayIndex}-${String(start).padStart(4, "0")}`;
  let id = baseId;
  for (let suffix = 2; ceremonies.some((row) => row.id === id); suffix += 1) id = `${baseId}-${suffix}`;
  const ceremony: CeremonyRecord = {
    id, title, dayIndex: draft.dayIndex, ...date, start: draft.start, end: draft.end,
    place, attendees, costMarks, importance: draft.importance ?? "Medium", status: "planned", createdAtDay: currentDay,
  };
  const calendarEvent: CalendarEvent = {
    id: `CAL-${id}`, name: title, date: date.date, year: date.year, start: draft.start, end: draft.end,
    place, type: "Ceremony", importance: ceremony.importance, status: "planned", reminder: true,
    attendees, costMarks, ceremonyId: id,
  };
  return { ok: true, ceremonies: [ceremony, ...ceremonies].slice(0, 100), calendar: [calendarEvent, ...calendar].slice(0, 200), ceremony, message: `${title} scheduled for ${date.date} ${date.year}.` };
}

export function recordCeremonyOutcome(
  ceremonies: CeremonyRecord[],
  calendar: CalendarEvent[],
  id: string,
  outcome: Exclude<CeremonyStatus, "planned">,
  currentDay: number,
  currentTime: string,
  note = "",
): { ok: boolean; ceremonies: CeremonyRecord[]; calendar: CalendarEvent[]; ceremony?: CeremonyRecord; message: string } {
  const ceremony = ceremonies.find((row) => row.id === id);
  if (!ceremony) return { ok: false, ceremonies, calendar, message: "Ceremony not found." };
  if (ceremony.status !== "planned") return { ok: false, ceremonies, calendar, message: "This ceremony already has a recorded outcome." };
  const start = minutes(ceremony.start)!;
  const end = minutes(ceremony.end)!;
  const now = minutes(currentTime);
  const nowAbs = currentDay * 1440 + (now ?? 0);
  const startAbs = ceremony.dayIndex * 1440 + start;
  const endAbs = ceremony.dayIndex * 1440 + end;
  if (outcome === "cancelled" && nowAbs >= startAbs) return { ok: false, ceremonies, calendar, message: "A ceremony cannot be cancelled after it has started." };
  if (outcome === "held" && nowAbs < startAbs) return { ok: false, ceremonies, calendar, message: "A future ceremony cannot be marked as held." };
  if (outcome === "missed" && nowAbs < endAbs) return { ok: false, ceremonies, calendar, message: "The ceremony window has not ended yet." };
  const updated = { ...ceremony, status: outcome, ...(note.trim() ? { recordedOutcome: note.trim().slice(0, 500) } : {}) };
  const nextCalendar = calendar.map((event) => event.ceremonyId === id ? { ...event, status: outcome === "held" ? "done" as const : outcome } : event);
  return {
    ok: true,
    ceremonies: ceremonies.map((row) => row.id === id ? updated : row),
    calendar: nextCalendar,
    ceremony: updated,
    message: `${ceremony.title}: ${outcome}.`,
  };
}

export function normalizeCeremonies(value: unknown): CeremonyRecord[] {
  if (!Array.isArray(value)) return [];
  const result: CeremonyRecord[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Partial<CeremonyRecord>;
    const start = typeof item.start === "string" ? item.start : "";
    const end = typeof item.end === "string" ? item.end : "";
    const startMinute = minutes(start);
    const endMinute = minutes(end);
    if (typeof item.id !== "string" || !item.id.trim() || typeof item.title !== "string" || !item.title.trim()) continue;
    if (typeof item.dayIndex !== "number" || !Number.isSafeInteger(item.dayIndex) || item.dayIndex < 0) continue;
    if (typeof item.date !== "string" || typeof item.year !== "string" || typeof item.place !== "string" || !item.place.trim()) continue;
    if (startMinute === null || endMinute === null || endMinute <= startMinute || endMinute - startMinute > 12 * 60) continue;
    if (typeof item.costMarks !== "number" || !Number.isSafeInteger(item.costMarks) || item.costMarks < 0 || item.costMarks > 1_000_000 || !isCeremonyStatus(item.status)) continue;
    const attendees = Array.isArray(item.attendees) ? item.attendees.filter((name): name is string => typeof name === "string" && Boolean(name.trim())).map((name) => name.trim().slice(0, 100)).slice(0, 20) : [];
    const createdAtDay = typeof item.createdAtDay === "number" && Number.isSafeInteger(item.createdAtDay) && item.createdAtDay >= 0 ? item.createdAtDay : item.dayIndex;
    result.push({
      id: item.id.slice(0, 120), title: item.title.trim().slice(0, 100), dayIndex: item.dayIndex,
      date: item.date.slice(0, 80), year: item.year.slice(0, 24), start, end, place: item.place.trim().slice(0, 100),
      attendees, costMarks: item.costMarks, importance: isCeremonyImportance(item.importance) ? item.importance : "Medium",
      status: item.status, createdAtDay,
      ...(typeof item.recordedOutcome === "string" ? { recordedOutcome: item.recordedOutcome.slice(0, 500) } : {}),
    });
  }
  return result;
}
