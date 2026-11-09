import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { appendLedgerEvents, crisisHistoryIdentity, crisisHistoryToLedgerEvent, eventsForLedgerDay, ledgerDayKey, ledgerDayOptions } from "../src/lib/game/sim/event-ledger.ts";
import { normalizeCeremonies, scheduleCeremony, recordCeremonyOutcome } from "../src/lib/game/sim/ceremony.ts";
import { addInvestigationNote, createInvestigationCase, linkInvestigationClue, normalizeInvestigationCases, setInvestigationStatus } from "../src/lib/game/sim/investigation-cases.ts";
import { clockFromDayIndex } from "../src/lib/game/time.ts";

const event = (id, date, time, year = "105 AW") => ({
  id, date, year, time, location: "Test Hall", type: "TEST", actors: ["Test actor"],
  cause: "Test cause", immediate: `Event ${id}`, evidence: "test fixture", knowledge: "player",
});

test("Event Ledger append is idempotent and preserves original rows on duplicate IDs", () => {
  const original = event("EV-1", "20 Ironmonth", "07:00");
  const replacement = { ...original, immediate: "rewritten history" };
  const first = appendLedgerEvents([], [original]);
  const second = appendLedgerEvents(first, [replacement, event("EV-2", "20 Ironmonth", "08:00"), { id: "EV-bad", date: "20 Ironmonth", time: "09:00", immediate: "Missing required shape" }, { ...event("EV-bad-actors", "20 Ironmonth", "09:30"), actors: "not-an-array" }, { ...event("EV-bad-knowledge", "20 Ironmonth", "09:45"), knowledge: "classified" }]);
  assert.equal(second.length, 2);
  assert.equal(second[1].immediate, original.immediate);
  assert.equal(second[0].id, "EV-2");
});

test("Event Ledger enforces a finite retention cap", () => {
  const rows = Array.from({ length: 20 }, (_, index) => event(`EV-${index}`, "20 Ironmonth", "07:00"));
  assert.equal(appendLedgerEvents([], rows, 7).length, 7);
});

test("Day replay groups same date strings by year and orders events chronologically without mutation", () => {
  const rows = [event("EV-b", "20 Ironmonth", "13:00", "106 AW"), event("EV-a", "20 Ironmonth", "07:00", "106 AW"), event("EV-old", "20 Ironmonth", "09:00", "105 AW")];
  const before = JSON.stringify(rows);
  const options = ledgerDayOptions(rows);
  assert.equal(options.length, 2);
  assert.equal(options[0].label, "20 Ironmonth 106 AW");
  const key = ledgerDayKey(rows[0]);
  assert.deepEqual(eventsForLedgerDay(rows, key).map((row) => row.id), ["EV-a", "EV-b"]);
  assert.equal(JSON.stringify(rows), before);
});

test("crisis history produces stable year-aware Event Ledger events", () => {
  const atMin = 1440 * 12 + 615;
  const history = { kind: "gate", outcome: "failed", atMin, affectedGateIds: ["east", "north"] };
  const first = crisisHistoryToLedgerEvent(history);
  const second = crisisHistoryToLedgerEvent({ ...history, affectedGateIds: ["north", "east"] });
  assert.equal(first.id, second.id);
  const expected = clockFromDayIndex(12, "10:15");
  assert.equal(first.date, expected.date);
  assert.equal(first.year, expected.year);
  assert.equal(first.time, "10:15");
  assert.match(first.location, /east, north/);
  assert.equal(crisisHistoryIdentity(history), crisisHistoryIdentity({ ...history, affectedGateIds: ["north", "east"] }));
});

test("ceremony scheduling validates date, interval, shared venue and attendee availability", () => {
  const available = () => true;
  const scheduled = scheduleCeremony([], [], { title: "Test observance", dayIndex: 0, start: "12:00", end: "13:00", place: "Reception Hall", attendees: [], costMarks: 25 }, 0, available);
  assert.equal(scheduled.ok, true);
  assert.equal(scheduled.ceremony?.date, clockFromDayIndex(0).date);
  assert.equal(scheduled.ceremony?.year, clockFromDayIndex(0).year);
  assert.equal(scheduled.calendar[0].ceremonyId, scheduled.ceremony?.id);

  const overlap = scheduleCeremony(scheduled.ceremonies, scheduled.calendar, { title: "Overlapping", dayIndex: 0, start: "12:30", end: "13:30", place: "Reception Hall", attendees: [], costMarks: 0 }, 0, available);
  assert.equal(overlap.ok, false);
  assert.match(overlap.message, /conflict/i);

  const absent = scheduleCeremony([], [], { title: "Meeting", dayIndex: 0, start: "12:00", end: "13:00", place: "Archive", attendees: ["Dagmar Red"], costMarks: 0 }, 0, () => false);
  assert.equal(absent.ok, false);
  assert.match(absent.message, /not available/i);
});

test("ceremony outcome cannot be recorded early; held/missed/cancelled map to calendar safely", () => {
  const scheduled = scheduleCeremony([], [], { title: "Test observance", dayIndex: 0, start: "12:00", end: "13:00", place: "Reception Hall", attendees: [], costMarks: 25 }, 0, () => true);
  const row = scheduled.ceremony;
  assert.ok(row);
  assert.equal(recordCeremonyOutcome(scheduled.ceremonies, scheduled.calendar, row.id, "held", 0, "11:00").ok, false);
  assert.equal(recordCeremonyOutcome(scheduled.ceremonies, scheduled.calendar, row.id, "missed", 0, "12:30").ok, false);
  const held = recordCeremonyOutcome(scheduled.ceremonies, scheduled.calendar, row.id, "held", 0, "13:10", "Recorded as completed by the player.");
  assert.equal(held.ok, true);
  assert.equal(held.ceremony?.status, "held");
  assert.equal(held.calendar[0].status, "done");
  assert.match(held.ceremony?.recordedOutcome ?? "", /player/);
  assert.equal(recordCeremonyOutcome(held.ceremonies, held.calendar, row.id, "cancelled", 0, "14:00").ok, false);
});

test("ceremony can be cancelled before its start without changing a later event", () => {
  const scheduled = scheduleCeremony([], [], { title: "Test observance", dayIndex: 1, start: "12:00", end: "13:00", place: "Archive", attendees: [], costMarks: 0 }, 0, () => true);
  const result = recordCeremonyOutcome(scheduled.ceremonies, scheduled.calendar, scheduled.ceremony.id, "cancelled", 1, "10:00");
  assert.equal(result.ok, true);
  assert.equal(result.ceremony.status, "cancelled");
  assert.equal(result.calendar[0].status, "cancelled");
});

test("ceremony save normalizer drops invalid ranges and safely bounds legacy records", () => {
  const normalized = normalizeCeremonies([
    { id: "C1", title: " Opening ", dayIndex: 1, date: "21 Ironmonth", year: "105 AW", start: "10:00", end: "11:00", place: "Hall", attendees: [" A ", 4], costMarks: 5, importance: "High", status: "planned", createdAtDay: 0 },
    { id: "C2", title: "Invalid interval", dayIndex: 1, date: "21 Ironmonth", year: "105 AW", start: "11:00", end: "10:00", place: "Hall", attendees: [], costMarks: 5, importance: "High", status: "planned", createdAtDay: 0 },
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].title, "Opening");
  assert.deepEqual(normalized[0].attendees, ["A"]);
  assert.equal(normalized[0].importance, "High");
});

test("investigation case lifecycle records notes and evidence links without solving UNKNOWN clues", () => {
  const opened = createInvestigationCase([], "Unresolved signal report", 4);
  assert.ok(opened.created);
  const linked = linkInvestigationClue(opened.rows, opened.created.id, "CL-M5T", 4);
  assert.equal(linked.ok, true);
  const noted = addInvestigationNote(linked.rows, opened.created.id, "The available sources do not establish the signal's origin.", 4);
  assert.equal(noted.ok, true);
  const actionable = setInvestigationStatus(noted.rows, opened.created.id, "actionable", 5);
  assert.equal(actionable.ok, true);
  const archivedWithoutNote = setInvestigationStatus(actionable.rows, opened.created.id, "archived", 5, "");
  assert.equal(archivedWithoutNote.ok, false);
  const archived = setInvestigationStatus(actionable.rows, opened.created.id, "archived", 5, "Archived pending further evidence; origin remains unknown.");
  assert.equal(archived.ok, true);
  assert.match(archived.message, /no mystery was declared solved/i);
  assert.equal(linkInvestigationClue(archived.rows, opened.created.id, "CL-GATE", 6).ok, false);
});

test("investigation case normalizer rejects malformed dates and bounds legacy text", () => {
  const normalized = normalizeInvestigationCases([
    { id: "good", title: " Valid case ", status: "open", createdDay: 2, updatedDay: 3, clueIds: ["CL-1"], notes: [], archiveNote: "" },
    { id: "bad-date", title: "Bad date", status: "open", createdDay: "2", updatedDay: 3, clueIds: [], notes: [] },
    { id: "bad-order", title: "Bad order", status: "open", createdDay: 4, updatedDay: 3, clueIds: [], notes: [] },
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].id, "good");
  assert.equal(normalized[0].title, " Valid case ");
});

test("application routes ceremony, investigation and immutable replay to their dedicated panels", async () => {
  const source = await readFile(new URL("../src/components/game/V45PanelBody.tsx", import.meta.url), "utf8");
  assert.match(source, /panel\.id === "05".*CeremonyBody/);
  assert.match(source, /panel\.id === "34".*DayReplayBody/);
  assert.match(source, /panel\.id === "19".*InvestigationBody/);
  assert.match(source, /read-only reconstruction from saved Event Ledger rows/i);
  const store = await readFile(new URL("../src/lib/game/store.ts", import.meta.url), "utf8");
  const executor = await readFile(new URL("../src/lib/platform/options/execute.ts", import.meta.url), "utf8");
  assert.match(executor, /year: world\.clock\.year/);
  assert.match(executor, /events: appendLedgerEvents\(input\.events, entry\)/);
  const deltaSource = await readFile(new URL("../src/lib/game/delta.ts", import.meta.url), "utf8");
  assert.match(deltaSource, /import \{ appendLedgerEvents \} from "\.\/sim\/event-ledger\.ts"/);
  assert.match(deltaSource, /year: event\.year \?\? world\.clock\.year/);
  assert.match(deltaSource, /events = appendLedgerEvents\(events, incoming\)/);
  assert.match(store, /crisisHistoryToLedgerEvent/);
  assert.match(store, /function crisisLedgerEventsSince/);
  assert.match(store, /events: replayEvents, news: result.news/);
  assert.match(store, /EV-CLOCK-\$\{fromAbs\}-\$\{rep\.reachedMin\}/);
  assert.match(store, /scheduleCeremony:/);
  assert.match(store, /setInvestigationCaseStatus:/);
  assert.match(store, /world\.treasury\.marks < result\.ceremony\.costMarks/);
  assert.match(store, /snapshot: \(\) =>[\s\S]*events: s\.events\.slice\(0, 500\)/);
});
