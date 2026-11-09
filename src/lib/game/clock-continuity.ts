import { advanceDailyContinuity, clockFromDayIndex, resourceConsumptionForTick, type SimState } from "./time";
import { CAST_LIFE_NAMES } from "./presence";
import { crisisMoraleEffect, crisisStockEffect } from "./sim/crisis.ts";
import { rollNpcDay, normalizeP4, type P4State } from "./p4-simulation";
import type { GateStatus, ResourceBlock, WorldState } from "./types";

export interface ClockContinuityResult {
  world: WorldState;
  p4: P4State;
  continuity: SimState;
  elapsedMinutes: number;
}

/**
 * Apply the world-side consequences of an already simulated P4 clock advance.
 * Both direct clock controls and Wait orders use this same path so crossing midnight
 * cannot skip household, calendar, child, relic, radio, trade, resource, or NPC-day work.
 */
export function applyClockContinuity(
  state: SimState,
  worldAfterCommand: WorldState,
  p4Before: P4State,
  p4AfterAdvance: P4State,
  fromAbs: number,
  reachedAbs: number,
): ClockContinuityResult {
  const reached = Math.max(fromAbs, reachedAbs);
  const elapsedMinutes = reached - fromAbs;
  const newDay = Math.floor(reached / 1440);
  const minuteOfDay = ((reached % 1440) + 1440) % 1440;
  const hh = String(Math.floor(minuteOfDay / 60)).padStart(2, "0");
  const mm = String(minuteOfDay % 60).padStart(2, "0");
  const clock = clockFromDayIndex(newDay, `${hh}:${mm}`);
  const days = elapsedMinutes / 1440;

  const continuity: SimState = { ...structuredClone(state), world: structuredClone(worldAfterCommand) };
  for (let day = state.world.dayIndex + 1; day <= newDay; day += 1) {
    advanceDailyContinuity(continuity, day);
  }

  const grow = (resource: ResourceBlock): ResourceBlock => ({
    ...resource,
    stock: Math.max(0, Math.min(resource.capacity, resource.stock + days * (resource.production - resourceConsumptionForTick(resource)))),
  });
  const nextWorld: WorldState = {
    ...continuity.world,
    dayIndex: newDay,
    clock: {
      ...continuity.world.clock,
      weekday: clock.weekday,
      date: clock.date,
      year: clock.year,
      time: `${hh}:${mm}`,
    },
    water: grow(worldAfterCommand.water),
    food: grow(worldAfterCommand.food),
    energy: grow(worldAfterCommand.energy),
    treasury: {
      ...worldAfterCommand.treasury,
      marks: Math.max(0, worldAfterCommand.treasury.marks + days * (worldAfterCommand.treasury.income - worldAfterCommand.treasury.expenses)),
    },
  };

  const p4 = rollNewDays(p4AfterAdvance, state.world.dayIndex, newDay);
  const world = applyCrisisStocks(nextWorld, p4Before, p4);
  continuity.gates = applyCrisisGateEffects(continuity.gates, p4Before, p4);
  continuity.world = world;
  return { world, p4, continuity, elapsedMinutes };
}

/** Apply stock deltas only for crisis history entries added by this clock advance. */
export function applyCrisisStocks(world: WorldState, before: P4State, after: P4State): WorldState {
  const added = (after.crisisHistory ?? []).slice(before.crisisHistory?.length ?? 0);
  if (!added.length) return world;
  let next = world;
  for (const entry of added) {
    const delta = crisisStockEffect(entry.kind, entry.outcome);
    const bump = (block: ResourceBlock, fraction: number): ResourceBlock =>
      fraction === 0 ? block : { ...block, stock: Math.max(0, Math.min(block.capacity, block.stock + fraction * block.capacity)) };
    next = {
      ...next,
      water: bump(next.water, delta.water),
      food: bump(next.food, delta.food),
      energy: bump(next.energy, delta.energy),
      indices: {
        ...next.indices,
        Morale: Math.max(0, Math.min(10, (Number.isFinite(next.indices?.Morale) ? next.indices.Morale : 5) + crisisMoraleEffect(entry.kind, entry.outcome))),
      },
    };
  }
  return next;
}


/** Apply only gate outcomes newly recorded by this simulation step. */
export function applyCrisisGateEffects(gates: GateStatus[], before: P4State, after: P4State): GateStatus[] {
  const added = (after.crisisHistory ?? []).slice(before.crisisHistory?.length ?? 0);
  if (!added.some((entry) => entry.kind === "gate")) return gates;
  let next = gates;
  for (const entry of added) {
    if (entry.kind !== "gate") continue;
    const targets = new Set(entry.affectedGateIds?.length ? entry.affectedGateIds : next.filter((gate) => gate.visual === "breach").map((gate) => gate.id));
    if (!targets.size) continue;
    next = next.map((gate) => {
      if (!targets.has(gate.id)) return gate;
      if (entry.outcome === "resolved") {
        if (gate.visual !== "breach") return gate;
        return {
          ...gate,
          visual: "combat",
          condition: "Breach contained; repairs pending",
          threat: "Contained",
          incident: "A gate-breach response was recorded as resolved; structural repair remains pending.",
        };
      }
      return {
        ...gate,
        visual: "destroyed",
        condition: "Destroyed",
        threat: "Gate fallen",
        incident: "The gate-breach response failed; the crisis record marks this gate as fallen.",
      };
    });
  }
  return next;
}

/** One life roll per newly entered world day. Earlier days are left as saved. */
export function rollNewDays(p4: P4State, fromDay: number, toDay: number): P4State {
  let next = normalizeP4(p4);
  for (let day = fromDay + 1; day <= toDay; day += 1) next = rollNpcDay(next, CAST_LIFE_NAMES, day);
  return next;
}
