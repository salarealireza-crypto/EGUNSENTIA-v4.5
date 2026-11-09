import test from "node:test";
import assert from "node:assert/strict";
import { advanceDailyContinuity, clockFromDayIndex } from "../src/lib/game/time.ts";

function state() {
  return {
    world: {
      dayIndex: 0, lastWeeklyRelicDay: 0,
      clock: { weekday: "Ironday", date: "20 Ironmonth", year: "105 AW", time: "07:00", location: "the Dome" },
      water: { stock: 100, capacity: 100, production: 0, consumption: 0, policy: "normal" },
      food: { stock: 100, capacity: 100, production: 0, consumption: 0, policy: "normal" },
      energy: { stock: 100, capacity: 100, production: 0, consumption: 0, policy: "normal" },
      treasury: { marks: 100, income: 0, expenses: 0 },
      surface: { weekSorties: 0, weekLimit: 3 },
    },
    inbox: [], news: [], worldNews: [], calendar: [
      { name: "Council hearing", date: clockFromDayIndex(1).date, status: "planned", importance: "Critical" },
    ],
    stalkers: [], finds: [], sorties: [], kin: [], household: [], gates: [], trades: [], films: [], events: [],
    personalVault: [], factionVault: [], children: [{ name: "Living child", status: "living", ageYears: 8 }],
    threads: [], secretClocks: [], chronicle: [], radio: [],
  };
}

test("hourly clock day crossings trigger dated critical calendar events", () => {
  const s = state();
  const major = [];
  advanceDailyContinuity(s, 1, major);
  assert.equal(s.calendar[0].status, "started");
  assert.match(major.join(" "), /Council hearing reached/);
  assert.equal(s.world.dayIndex, 1);
});

test("shared daily continuity applies birthday boundaries once", () => {
  const s = state();
  advanceDailyContinuity(s, 365, []);
  assert.equal(s.children[0].ageYears, 9);
  advanceDailyContinuity(s, 366, []);
  assert.equal(s.children[0].ageYears, 9);
});
