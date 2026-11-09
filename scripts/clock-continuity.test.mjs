import assert from "node:assert/strict";
import test from "node:test";

const imp = (path) => import(new URL(`../${path}`, import.meta.url));
const [{ applyClockContinuity }, { defaultP4State }, { dayOneWorld }, { clockFromDayIndex }] = await Promise.all([
  imp("src/lib/game/clock-continuity.ts"),
  imp("src/lib/game/p4-simulation.ts"),
  imp("src/lib/game/kernel.ts"),
  imp("src/lib/game/time.ts"),
]);

function simState(world = dayOneWorld()) {
  return {
    world,
    inbox: [], news: [], worldNews: [], calendar: [], stalkers: [], finds: [], sorties: [],
    kin: [], household: [], gates: [], trades: [], films: [], events: [], personalVault: [],
    factionVault: [], children: [], threads: [], secretClocks: [], chronicle: [], radio: [],
  };
}

function worldAt(day, time, base = dayOneWorld()) {
  const clock = clockFromDayIndex(day, time);
  return { ...base, dayIndex: day, clock: { ...base.clock, weekday: clock.weekday, date: clock.date, year: clock.year, time } };
}

function belowCapacityWorld() {
  const world = dayOneWorld();
  return {
    ...world,
    water: { ...world.water, stock: world.water.capacity - 100 },
    food: { ...world.food, stock: world.food.capacity - 10 },
    energy: { ...world.energy, stock: world.energy.capacity - 100 },
  };
}

test("crossing midnight applies one daily continuity pass and fractional resource production", () => {
  const beforeWorld = belowCapacityWorld();
  const beforeP4 = defaultP4State();
  const state = simState(beforeWorld);
  const advanced = applyClockContinuity(state, worldAt(1, "01:00", beforeWorld), beforeP4, beforeP4, 23 * 60, 25 * 60);
  assert.equal(advanced.world.dayIndex, 1);
  assert.equal(advanced.world.clock.time, "01:00");
  assert.equal(advanced.elapsedMinutes, 120);
  assert.ok(Math.abs(advanced.world.water.stock - (beforeWorld.water.stock + (50 * 2) / 24)) < 1e-8);
  assert.ok(Math.abs(advanced.world.food.stock - (beforeWorld.food.stock + (0.8 * 2) / 24)) < 1e-8);
  assert.ok(Math.abs(advanced.world.treasury.marks - (beforeWorld.treasury.marks + (300 * 2) / 24)) < 1e-8);
  assert.equal(advanced.continuity.world.dayIndex, 1);
});

test("a partial-day clock advance changes resources proportionally without rolling a new day", () => {
  const beforeWorld = belowCapacityWorld();
  const p4 = defaultP4State();
  const advanced = applyClockContinuity(simState(beforeWorld), worldAt(0, "12:00", beforeWorld), p4, p4, 7 * 60, 12 * 60);
  assert.equal(advanced.world.dayIndex, 0);
  assert.equal(advanced.elapsedMinutes, 300);
  assert.ok(Math.abs(advanced.world.water.stock - (beforeWorld.water.stock + (50 * 5) / 24)) < 1e-8);
  assert.equal(advanced.p4.now?.day, p4.now?.day);
});

test("daily continuity starts critical calendar events on the entered date", () => {
  const base = belowCapacityWorld();
  const target = worldAt(1, "01:00", base);
  const event = { id: "event-critical", name: "Critical Hearing", date: target.clock.date, importance: "Critical", status: "planned" };
  const state = { ...simState(base), calendar: [event] };
  const p4 = defaultP4State();
  const advanced = applyClockContinuity(state, target, p4, p4, 23 * 60, 25 * 60);
  assert.equal(advanced.continuity.calendar[0].status, "started");
});

test("Wait orders and direct clock controls share the same continuity helper", async () => {
  const fs = await import("node:fs/promises");
  const store = await fs.readFile(new URL("../src/lib/game/store.ts", import.meta.url), "utf8");
  const waitStart = store.indexOf("if (option.category === \"Wait\")");
  const waitBranch = store.slice(waitStart, store.indexOf("setV45Setting:", waitStart));
  const directBranch = store.slice(store.indexOf("function runClockAdvance(minutes: number)"), store.indexOf("export function localCommand"));
  assert.match(waitBranch, /applyClockContinuity\(/);
  assert.match(directBranch, /applyClockContinuity\(/);
});
