import assert from "node:assert/strict";
import test from "node:test";

const imp = (path) => import(new URL(`../${path}`, import.meta.url));
const [{ runOption, lockReason }, { OPTION_CATALOG }, { defaultP4State }, { dayOneWorld }, { DEFAULT_WORLD }] = await Promise.all([
  imp("src/lib/platform/options/execute.ts"),
  imp("src/lib/platform/options/catalog.ts"),
  imp("src/lib/game/p4-simulation.ts"),
  imp("src/lib/game/kernel.ts"),
  imp("src/lib/game/sim/core.ts"),
]);

function input(option, p4 = defaultP4State(), world = dayOneWorld()) {
  return {
    option, p4, world, gates: [], trades: [], events: [], news: [], chronicle: [],
    turnCount: 0, worldInputs: DEFAULT_WORLD,
  };
}

test("non-wait command options record their declared work-hour cost", () => {
  const option = OPTION_CATALOG["10"].find((item) => item.id === "10-OPT-01");
  assert.ok(option);
  assert.equal(option.category, "Investigate");
  const before = defaultP4State().spent?.hours ?? 0;
  const result = runOption(input(option));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.p4.spent?.hours, before + option.costs.hours);
  assert.ok(result.p4.lastReceipt?.spent.some((line) => /work hour is committed/i.test(line)));
});

test("Wait orders advance by their full declared duration rather than a four-hour cap", () => {
  const p4 = defaultP4State();
  const world = dayOneWorld();
  const option = Object.values(OPTION_CATALOG).flat().find((item) => item.category === "Wait" && !lockReason(item, p4, world));
  assert.ok(option);
  assert.equal(option.costs.hours, 7);
  const result = runOption(input(option, p4, world));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.world.clock.time, "14:00");
  assert.equal(result.p4.spent?.hours, 7);
  assert.ok(result.p4.lastReceipt?.spent.some((line) => /7 hours pass/i.test(line)));
});

test("an interrupted Wait order records only the hours actually elapsed", () => {
  const p4 = {
    ...defaultP4State(),
    crisis: { active: true, title: "Emergency test", severity: "emergency", deadlineHours: 6, options: ["Hold position"] },
  };
  const world = dayOneWorld();
  const option = Object.values(OPTION_CATALOG).flat().find((item) => item.category === "Wait" && !lockReason(item, p4, world));
  assert.ok(option);
  const result = runOption(input(option, p4, world));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.world.clock.time, "08:00");
  assert.equal(result.p4.spent?.hours, 1);
  assert.ok(result.p4.lastReceipt?.done.some((line) => /watch was interrupted/i.test(line)));
});

test("an option with a malformed time cost is rejected before execution", () => {
  const option = OPTION_CATALOG["10"].find((item) => item.id === "10-OPT-01");
  assert.ok(option);
  const result = runOption(input({ ...option, costs: { ...option.costs, hours: -1 } }));
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.notice, /invalid time cost/i);
});
