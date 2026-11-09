import test from "node:test";
import assert from "node:assert/strict";
import { simulateAdvance } from "../src/lib/game/time.ts";

function campaignState() {
  return {
    world: {
      dayIndex: 0,
      lastWeeklyRelicDay: 0,
      clock: { weekday: "Ironday", date: "20 Ironmonth", year: "105 AW", time: "07:00", location: "the Dome" },
      water: { stock: 1000, capacity: 1000, production: 10, consumption: 5, policy: "normal" },
      food: { stock: 1000, capacity: 1000, production: 10, consumption: 5, policy: "normal" },
      energy: { stock: 1000, capacity: 1000, production: 10, consumption: 5, policy: "normal" },
      treasury: { marks: 1000, income: 10, expenses: 5 },
      surface: { weekSorties: 0, weekLimit: 3 },
    },
    inbox: [], news: [], worldNews: [], calendar: [], stalkers: [], finds: [], sorties: [],
    kin: [], household: [], gates: [], trades: [], films: [], events: [], personalVault: [],
    factionVault: [], children: [
      { name: "Living child", status: "living", ageYears: 8 },
      { name: "Lost child", status: "dead", ageYears: 11 },
    ],
    threads: [], secretClocks: [], chronicle: [], radio: [],
  };
}

test("multi-year campaign advances age living children once per crossed year", () => {
  const { next, digest } = simulateAdvance(campaignState(), 730);
  assert.equal(next.world.dayIndex, 730);
  assert.equal(next.children[0].ageYears, 10);
  assert.equal(next.children[1].ageYears, 11);
  assert.equal(digest.toDay, 730);
});

test("a skip ending between year boundaries still processes each crossed birthday", () => {
  const { next } = simulateAdvance(campaignState(), 800);
  assert.equal(next.children[0].ageYears, 10);
  assert.equal(next.children[1].ageYears, 11);
});
