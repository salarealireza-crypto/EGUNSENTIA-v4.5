import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
register("./ts-resolve-hook.mjs", import.meta.url);
const imp = (path) => import(new URL(`../${path}`, import.meta.url).href);
const [P, X, K] = await Promise.all([
  imp("src/lib/game/p4-simulation.ts"),
  imp("src/lib/platform/options/execute.ts"),
  imp("src/lib/game/kernel.ts"),
]);

test("option queue stores the exact hour deadline, not the next midnight", () => {
  const p4 = P.defaultP4State();
  const world = K.dayOneWorld();
  const option = {
    id: "TEST-QUEUE-8H", panelId: "45", title: "Test delayed consequence", summary: "test", category: "Negotiate",
    costs: { marks: 0, hours: 1 }, requires: [], risk: "low", uncertainty: "none",
    forecast: { knownEffects: [], unknownEffects: [] }, delay: "hours", cooldown: 0, confirm: "test",
    effects: [{ type: "queue", afterHours: 8, consequenceId: "test-queue", becauseOf: "TEST-QUEUE-8H" }], hooks: {},
  };
  const result = X.runOption({
    option, p4, world, gates: [], trades: [], events: [], news: [], chronicle: [], turnCount: 0,
    worldInputs: { water: 0.7, food: 0.7, energy: 0.7, gates: {} },
  });
  assert.equal(result.ok, true);
  assert.equal(result.p4.queue[0].dueMin, 15 * 60);
  assert.equal(result.p4.queue[0].dueDay, 0);
});

test("exact delayed consequence does not fire before its hour and fires at its deadline", () => {
  const p4 = P.defaultP4State();
  p4.queue = [{ id: "Q-exact", dueDay: 0, dueMin: 15 * 60, label: "Exact-hour notice", source: "test", visibility: "public" }];
  const before = P.advanceClock(p4, 7 * 60, 14 * 60);
  assert.deepEqual(before.fired, []);
  assert.equal(before.p4.queue.length, 1);
  const due = P.advanceClock(before.p4, 14 * 60, 15 * 60);
  assert.deepEqual(due.fired, ["Exact-hour notice"]);
  assert.equal(due.p4.queue.length, 0);
});

test("legacy day-only queue entries keep their midnight deadline", () => {
  const p4 = P.defaultP4State();
  p4.queue = [{ id: "Q-legacy", dueDay: 1, label: "Legacy notice", source: "legacy", visibility: "public" }];
  const before = P.advanceClock(p4, 23 * 60, 1440 - 1);
  assert.deepEqual(before.fired, []);
  const due = P.advanceClock(before.p4, 1440 - 1, 1440);
  assert.deepEqual(due.fired, ["Legacy notice"]);
});
