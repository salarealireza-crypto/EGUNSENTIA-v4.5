import assert from "node:assert/strict";
import test from "node:test";

const imp = (path) => import(new URL(`../${path}`, import.meta.url));
const [{ runOption }, { OPTION_CATALOG }, { defaultP4State, advanceClock }, { dayOneWorld }, { DEFAULT_WORLD, absMin }] = await Promise.all([
  imp("src/lib/platform/options/execute.ts"),
  imp("src/lib/platform/options/catalog.ts"),
  imp("src/lib/game/p4-simulation.ts"),
  imp("src/lib/game/kernel.ts"),
  imp("src/lib/game/sim/core.ts"),
]);

function input(option, p4, world, turnCount) {
  return { option, p4, world, gates: [], trades: [], events: [], news: [], chronicle: [], turnCount, worldInputs: DEFAULT_WORLD };
}

test("repeating the same command creates distinct pending consequence records", () => {
  const option = OPTION_CATALOG["12"].find((item) => item.id === "12-OPT-03");
  assert.ok(option);
  const first = runOption(input(option, defaultP4State(), dayOneWorld(), 0));
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const second = runOption(input(option, first.p4, first.world, 1));
  assert.equal(second.ok, true);
  if (!second.ok) return;
  assert.equal(second.p4.queue.length, 2);
  assert.notEqual(second.p4.queue[0].id, second.p4.queue[1].id);
  assert.equal(new Set(second.p4.queue.map((item) => item.id)).size, 2);
});

test("each repeated command's delayed consequence resolves exactly once", () => {
  const option = OPTION_CATALOG["12"].find((item) => item.id === "12-OPT-03");
  assert.ok(option);
  const first = runOption(input(option, defaultP4State(), dayOneWorld(), 0));
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const second = runOption(input(option, first.p4, first.world, 1));
  assert.equal(second.ok, true);
  if (!second.ok) return;
  const expectedLabel = second.p4.queue[0].label;
  const advanced = advanceClock(second.p4, absMin(0, 7 * 60), absMin(3, 7 * 60), DEFAULT_WORLD, { allowCritical: true });
  assert.equal(advanced.fired.filter((label) => label === expectedLabel).length, 2);
  assert.equal(advanced.p4.queue.length, 0);
});
