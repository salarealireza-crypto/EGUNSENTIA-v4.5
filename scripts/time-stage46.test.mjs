import assert from "node:assert/strict";
import test from "node:test";
import { clockFromDayIndex, resourceConsumptionForTick, simulateAdvance, advanceDailyContinuity } from "../src/lib/game/time.ts";

function baseState(dayIndex = 0) {
  return {
    world: {
      dayIndex,
      lastWeeklyRelicDay: dayIndex,
      clock: { weekday: "Ironday", date: "20 Ironmonth", year: "105 AW", time: "07:00", location: "the Dome" },
      water: { stock: 100, capacity: 100, production: 0, consumption: 1, policy: "normal" },
      food: { stock: 100, capacity: 100, production: 0, consumption: 1, policy: "normal" },
      energy: { stock: 100, capacity: 100, production: 0, consumption: 1, policy: "normal" },
      treasury: { marks: 0, income: 0, expenses: 0 },
      surface: { weekSorties: 0, weekLimit: 3 },
    },
    inbox: [], news: [], worldNews: [], calendar: [], stalkers: [], finds: [], sorties: [], kin: [], household: [], gates: [], trades: [], films: [], events: [], personalVault: [], factionVault: [], children: [], threads: [], secretClocks: [], chronicle: [], radio: [],
  };
}

test("hard interrupt uses the computed day label, not an undeclared clock", () => {
  const state = baseState(0);
  state.world.water.stock = 1;
  const result = simulateAdvance(state, 1);
  assert.match(result.digest.major[0], /^INTERRUPT Wellday, 21 Ironmonth 105 AW:/);
  assert.match(result.digest.interrupt, /Water stock below critical reserve/);
});

test("ration never raises consumption, including fractional and zero baselines", () => {
  assert.equal(resourceConsumptionForTick({ consumption: 0, policy: "ration" }), 0);
  assert.ok(resourceConsumptionForTick({ consumption: 0.5, policy: "ration" }) < 0.5);
  assert.equal(resourceConsumptionForTick({ consumption: 0.5, policy: "normal" }), 0.5);
});

test("calendar uses exact dates, inclusive ranges and optional year", () => {
  const state = baseState(0);
  state.calendar = [
    { id: "exact", name: "Exact", date: "20 Ironmonth", status: "planned", importance: "Critical" },
    { id: "substring", name: "False match", date: "2 Ironmonth", status: "planned", importance: "Critical" },
    { id: "compact-range", name: "Compact range", date: "19–21 Ironmonth", status: "planned", importance: "Critical" },
    { id: "wrong-year", name: "Wrong year", date: "20 Ironmonth 106 AW", status: "planned", importance: "Critical" },
  ];
  advanceDailyContinuity(state, 0, []);
  assert.equal(state.calendar.find((e) => e.id === "exact").status, "started");
  assert.equal(state.calendar.find((e) => e.id === "substring").status, "planned");
  assert.equal(state.calendar.find((e) => e.id === "compact-range").status, "started");
  assert.equal(state.calendar.find((e) => e.id === "wrong-year").status, "planned");
  assert.equal(clockFromDayIndex(0).date, "20 Ironmonth");

  const deadDayState = baseState(311);
  deadDayState.calendar = [{ id: "dead", name: "Memorial", date: "Dead Day 1", status: "planned", importance: "Critical" }];
  advanceDailyContinuity(deadDayState, 311, []);
  assert.equal(deadDayState.calendar[0].status, "started");
});

test("saved birthdays age a child on that child's anniversary and update kin by stable id", () => {
  const state = baseState(0);
  state.children = [{ id: "CH-ada", name: "Ada Red", mother: "Unknown", ageYears: 0, birthDay: 10, status: "living", notes: "" }];
  state.kin = [{ id: "CH-ada", name: "Ada's ledger entry", role: "Daughter, 0", mood: "curious", ageYears: 0 }];
  advanceDailyContinuity(state, 374, []);
  assert.equal(state.children[0].ageYears, 0);
  advanceDailyContinuity(state, 375, []);
  assert.equal(state.children[0].ageYears, 1);
  assert.equal(state.kin[0].ageYears, 1);
  assert.equal(state.kin[0].role, "Daughter, 1");
});

test("legacy children without birthdays keep the previous year-boundary aging rule", () => {
  const state = baseState(364);
  state.children = [
    { id: "CH-old", name: "Legacy Child", mother: "Unknown", ageYears: 8, status: "living", notes: "" },
    { id: "CH-hidden", name: "Hidden Child", mother: "Unknown", ageYears: 11, status: "hidden", notes: "" },
  ];
  advanceDailyContinuity(state, 365, []);
  assert.equal(state.children[0].ageYears, 9);
  assert.equal(state.children[1].ageYears, 11);
});

test("household affection does not drift passively and kin mood links by stable identity", () => {
  const state = baseState(0);
  state.household = [{ id: "HH-person-1", name: "New display name", title: "Household", mood: "calm", relation: "known", affection: 5, trend: "steady", misses: "low", lastInteraction: "yesterday", concern: "none", available: true, tonight: "home", chosenEvening: false, portraitHue: "none" }];
  state.kin = [{ id: "HH-person-1", name: "Former display name", role: "Household member", mood: "tense" }];
  advanceDailyContinuity(state, 1, []);
  assert.equal(state.household[0].affection, 5);
  assert.equal(state.kin[0].mood, "calm");
});


test("all hard interrupt families stop a long advance on the triggering day", () => {
  const scenarios = [
    ["gate breach", (state) => { state.gates = [{ visual: "breach" }]; }],
    ["gate destruction", (state) => { state.gates = [{ visual: "destroyed" }]; }],
    ["full cistern", (state) => { state.secretClocks = [{ id: "SC-cistern", value: 5, max: 5 }]; }],
    ["envoy ultimatum", (state) => { state.secretClocks = [{ id: "SC-envoy", value: 4, max: 4 }]; }],
  ];
  for (const [label, prepare] of scenarios) {
    const state = baseState(0);
    prepare(state);
    const result = simulateAdvance(state, 20);
    assert.equal(result.digest.toDay, 1, `${label} must stop the first simulated day`);
    assert.ok(result.digest.interrupt, `${label} must produce a hard interrupt`);
    assert.match(result.digest.major[0], /^INTERRUPT Wellday, 21 Ironmonth 105 AW:/);
  }
});

test("water interruption wins simultaneous triggers and prevents later-day events", () => {
  const state = baseState(0);
  state.world.water.stock = 8;
  state.gates = [{ visual: "breach" }];
  state.secretClocks = [
    { id: "SC-cistern", value: 5, max: 5 },
    { id: "SC-envoy", value: 4, max: 4 },
  ];
  state.calendar = [{
    id: "tomorrow", name: "Tomorrow event", date: clockFromDayIndex(2).date,
    status: "planned", importance: "Critical",
  }];
  const result = simulateAdvance(state, 10);
  assert.equal(result.digest.toDay, 1);
  assert.match(result.digest.interrupt, /Water stock below critical reserve/);
  assert.equal(result.next.calendar[0].status, "planned");
  assert.equal(result.next.events[0].cause, "Time advanced 1 day(s) by command");
});

test("hard interrupt uses the destination label across the year boundary", () => {
  const state = baseState(310);
  state.gates = [{ visual: "breach" }];
  const result = simulateAdvance(state, 8);
  assert.equal(result.digest.toDay, 311);
  assert.equal(result.digest.major[0], `INTERRUPT ${clockFromDayIndex(311).label}: A gate is no longer in normal state.`);
});

test("calendar date ranges can span the five Dead Days into the next year", () => {
  const first = baseState(314);
  first.calendar = [{ id: "cross-year", name: "New-year watch", date: "Dead Day 4–2 Ironmonth", status: "planned", importance: "Critical" }];
  advanceDailyContinuity(first, 314, []);
  assert.equal(first.calendar[0].status, "started");

  const middle = baseState(315);
  middle.calendar = [{ id: "cross-year", name: "New-year watch", date: "Dead Day 4–2 Ironmonth", status: "planned", importance: "Critical" }];
  advanceDailyContinuity(middle, 315, []);
  assert.equal(middle.calendar[0].status, "started");

  const last = baseState(347);
  last.calendar = [{ id: "cross-year", name: "New-year watch", date: "Dead Day 4–2 Ironmonth", status: "planned", importance: "Critical" }];
  advanceDailyContinuity(last, 347, []);
  assert.equal(last.calendar[0].status, "started");

  const outside = baseState(348);
  outside.calendar = [{ id: "cross-year", name: "New-year watch", date: "Dead Day 4–2 Ironmonth", status: "planned", importance: "Critical" }];
  advanceDailyContinuity(outside, 348, []);
  assert.equal(outside.calendar[0].status, "planned");
});
