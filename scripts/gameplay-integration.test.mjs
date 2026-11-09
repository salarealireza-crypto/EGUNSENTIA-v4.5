import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { addPlanItem } from "../src/lib/game/sim/planner.ts";
import { spawnCrisis, resolveCrisis, tickCrisis } from "../src/lib/game/sim/crisis.ts";
import { defaultP4State, planItem } from "../src/lib/game/p4-simulation.ts";
import { applyCrisisGateEffects, applyCrisisStocks } from "../src/lib/game/clock-continuity.ts";

const gate = (id, visual = "breach") => ({
  id,
  name: `${id} gate`,
  purpose: "test fixture",
  visual,
  security: "guarded",
  condition: visual,
  commander: "existing command",
  shift: "current",
  traffic: "controlled",
  threat: "high",
  ammo: "recorded",
  restriction: "none",
});

const worldStocks = () => ({
  water: { stock: 50, capacity: 100, production: 0, consumption: 0, unit: "u", policy: "normal" },
  food: { stock: 50, capacity: 100, production: 0, consumption: 0, unit: "u", policy: "normal" },
  energy: { stock: 50, capacity: 100, production: 0, consumption: 0, unit: "u", policy: "normal" },
  indices: { Morale: 7 },
});

test("planner never double-books the same NPC, even across different locations", () => {
  const first = addPlanItem([], "First appointment", "12:00", {
    day: 0, durMin: 60, npc: "Dagmar Red", place: "Reception Hall",
  });
  assert.equal(first.result.ok, true);
  const second = addPlanItem(first.items, "Second appointment", "12:30", {
    day: 0, durMin: 30, npc: "dagmar red", place: "Archive",
  });
  assert.equal(second.result.ok, true);
  const appointment = second.items.find((item) => item.label === "Second appointment");
  assert.ok(appointment);
  assert.ok(appointment.time >= "13:08", appointment.time);
  assert.equal(appointment.npc, "dagmar red");
});

test("planner checks the complete appointment duration when testing NPC availability", () => {
  const r = addPlanItem([], "Long interview", "14:30", {
    day: 0,
    durMin: 60,
    npc: "Samer Vogt",
    npcAvailable: (_npc, at, duration) => at % 1440 >= 15 * 60 && (at % 1440) + duration <= 18 * 60,
  });
  assert.equal(r.result.ok, true);
  const item = r.items.at(-1);
  assert.ok(item.time >= "15:00", item.time);
});

test("P4 planner uses the live cast schedule when a person is assigned", () => {
  const p = planItem(defaultP4State(), "Personnel briefing", "16:00", {
    npc: "Elara Red", durMin: 60, place: "Reception Hall",
  });
  assert.equal(p.lastPlan?.ok, true);
  const item = p.planner.find((row) => row.label === "Personnel briefing");
  assert.equal(item?.npc, "Elara Red");
  assert.equal(item?.time, "16:00");
});

test("gate crisis stores only the breached gates that triggered it", () => {
  const p = spawnCrisis(defaultP4State(), {
    water: 0.9, food: 0.9, energy: 0.9,
    gates: { east: "BREACHED", west: "NORMAL", north: "BREACHED" },
  }, 120);
  assert.equal(p.crisis?.kind, "gate");
  assert.deepEqual(p.crisis?.affectedGateIds, ["east", "north"]);
});

test("invalid crisis choice cannot clear the active crisis", () => {
  const open = spawnCrisis(defaultP4State(), {
    water: 0.1, food: 0.9, energy: 0.9, gates: {},
  }, 0);
  const after = resolveCrisis(open, "Invented response", 60);
  assert.ok(after.crisis?.active);
  assert.equal(after.crisisHistory?.length ?? 0, 0);
  assert.match(after.log[0], /response rejected/i);
});

test("resolved gate crisis moves only its breached gate into contained/repair state", () => {
  const open = spawnCrisis(defaultP4State(), {
    water: 0.9, food: 0.9, energy: 0.9, gates: { east: "BREACHED" },
  }, 0);
  const resolved = resolveCrisis(open, "Reinforce the gate", 60);
  const result = applyCrisisGateEffects([gate("east"), gate("north", "normal")], open, resolved);
  assert.equal(result.find((g) => g.id === "east").visual, "combat");
  assert.match(result.find((g) => g.id === "east").condition, /repairs pending/i);
  assert.equal(result.find((g) => g.id === "north").visual, "normal");
});

test("failed gate crisis marks the recorded target destroyed", () => {
  let p = spawnCrisis(defaultP4State(), {
    water: 0.9, food: 0.9, energy: 0.9, gates: { east: "BREACHED" },
  }, 0);
  p = tickCrisis(p, 3, 180);
  p = tickCrisis(p, 2, 300);
  p = tickCrisis(p, 2, 420);
  assert.equal(p.crisis, null);
  assert.equal(p.crisisHistory?.at(-1)?.outcome, "failed");
  assert.deepEqual(p.crisisHistory?.at(-1)?.affectedGateIds, ["east"]);
  const result = applyCrisisGateEffects([gate("east"), gate("south", "normal")], spawnCrisis(defaultP4State(), {
    water: 0.9, food: 0.9, energy: 0.9, gates: { east: "BREACHED" },
  }, 0), p);
  assert.equal(result.find((g) => g.id === "east").visual, "destroyed");
  assert.equal(result.find((g) => g.id === "south").visual, "normal");
});

test("crisis outcomes update morale and resource stocks through one continuity helper", () => {
  const before = defaultP4State();
  const opened = spawnCrisis(before, { water: 0.1, food: 0.9, energy: 0.9, gates: {} }, 0);
  const resolved = resolveCrisis(opened, "Ration water by ward", 60);
  const world = applyCrisisStocks(worldStocks(), before, resolved);
  assert.equal(world.indices.Morale, 8);
  assert.ok(world.water.stock > 50);
});

test("planner panel is assigned to panel 12 and world-clock panel 46 no longer hosts it", async () => {
  const source = await readFile(new URL("../src/components/game/V45PanelBody.tsx", import.meta.url), "utf8");
  assert.match(source, /panel\.id\s*===\s*["']12["'].*PlannerBody/);
  assert.match(source, /panel\.id\s*===\s*["']46["'].*WorldTimeBody/);
});
