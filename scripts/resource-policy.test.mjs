import test from "node:test";
import assert from "node:assert/strict";
import { resourceConsumptionForTick } from "../src/lib/game/time.ts";

test("ration policy applies one fixed reduction without compounding the saved baseline", () => {
  const resource = { stock: 100, capacity: 200, production: 10, consumption: 20, unit: "t", policy: "ration" };
  const before = structuredClone(resource);
  const firstDay = resourceConsumptionForTick(resource);
  const secondDay = resourceConsumptionForTick(resource);
  assert.ok(Math.abs(firstDay - 18.4) < 1e-9);
  assert.ok(Math.abs(secondDay - 18.4) < 1e-9);
  assert.deepEqual(resource, before);
});

test("normal policy leaves consumption unchanged", () => {
  assert.equal(resourceConsumptionForTick({ consumption: 20, policy: "normal" }), 20);
});

test("ration policy never raises a fractional baseline to a minimum floor", () => {
  assert.equal(resourceConsumptionForTick({ consumption: 0.5, policy: "ration" }), 0.46);
});
