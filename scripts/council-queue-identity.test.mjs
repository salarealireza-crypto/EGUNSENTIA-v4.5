import test from "node:test";
import assert from "node:assert/strict";
const imp = (path) => import(new URL(`../${path}`, import.meta.url));
const P = await imp("src/lib/game/p4-simulation.ts");
const Kernel = await imp("src/lib/game/kernel.ts");
const Core = await imp("src/lib/game/sim/core.ts");
const Execute = await imp("src/lib/platform/options/execute.ts");

test("repeated council delegations at the same minute retain separate queue identities", () => {
  const initial = P.defaultP4State();
  const first = P.decideCouncil(initial, "CM-1-delegate");
  const second = P.decideCouncil(first, "CM-1-delegate");
  assert.equal(second.queue.length, 2);
  assert.notEqual(second.queue[0].id, second.queue[1].id);
  const resolved = P.advanceClock(second, 7 * 60, 2 * 1440);
  assert.equal(resolved.fired.filter((line) => line.includes("reports on the delegated matter")).length, 2);
  assert.equal(resolved.p4.queue.length, 0);
});

test("repeated council decrees at the same campaign minute are idempotently rejected", () => {
  const initial = P.defaultP4State();
  const baseWorld = Kernel.dayOneWorld();
  const world = { ...baseWorld, clock: { ...baseWorld.clock, time: "10:00" } };
  const p4 = P.syncClock(initial, 0, 600);
  const input = { p4, world, gates: [], trades: [], events: [], news: [], chronicle: [], turnCount: 0, worldInputs: Core.DEFAULT_WORLD };
  const first = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const repeated = Execute.runCouncilDecree({ ...input, p4: first.p4 }, "CM-2");
  assert.equal(repeated.ok, false);
  assert.equal(first.p4.queue.filter((item) => item.source === "24-OPT-02").length, 1);
});

test("queue normalization safely drops malformed rows and falls back from invalid exact deadlines", () => {
  const p = P.defaultP4State();
  const restored = P.normalizeP4({
    ...p,
    queue: [
      null,
      { id: "broken", dueDay: -1, label: "bad", source: "test", visibility: "public" },
      { id: "legacy", dueDay: 2, label: "legacy", source: "test", visibility: "public", dueMin: "not-a-minute" },
      { id: "exact", dueDay: 2, dueMin: 3000, label: "exact", source: "test", visibility: "public" },
    ],
  });
  assert.deepEqual(restored.queue.map((q) => q.id), ["legacy", "exact"]);
  assert.equal(restored.queue[0].dueMin, undefined);
  assert.equal(restored.queue[1].dueMin, 3000);
});
