import test from "node:test";
import assert from "node:assert/strict";
import { fitCompactStateBudget, COMPACT_STATE_BUDGET } from "../src/lib/game/compact-state.mjs";

test("AL compact-state budget trims only low-priority list tails and preserves core state", () => {
  const compact = {
    clock: { date: "20 Ironmonth", year: "105 AW" },
    water: { stock: 90, capacity: 100 },
    household: [{ id: "HH-dagmar-red", name: "Dagmar Red" }],
    children: [{ id: "CH-konrad", ageYears: 15 }],
    gates: [{ id: "north", visual: "normal" }],
    news: Array.from({ length: 20 }, (_, i) => ({ id: `N${i}`, body: "x".repeat(300) })),
  };
  const result = fitCompactStateBudget(compact, 1_200);
  assert.ok(JSON.stringify(result).length <= 1_200);
  assert.equal(result.water.stock, 90);
  assert.equal(result.household[0].id, "HH-dagmar-red");
  assert.equal(result.children[0].id, "CH-konrad");
  assert.equal(result.gates[0].visual, "normal");
  assert.ok(result.news.length < 20);
});

test("AL compact-state budget fails closed when decision-critical fields alone are too large", () => {
  assert.throws(
    () => fitCompactStateBudget({ clock: "x".repeat(1_000), household: [] }, 256),
    /exceeds the AL request budget/,
  );
  assert.equal(COMPACT_STATE_BUDGET, 7_600);
});
