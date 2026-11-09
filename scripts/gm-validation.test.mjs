import assert from "node:assert/strict";
import test from "node:test";
import { validatePlayTurnInput, PLAY_TURN_INPUT_LIMITS } from "../src/lib/game/gm-validation.mjs";

function validInput() {
  return {
    action: "Inspect the western gate.",
    state: "{}",
    history: [{ role: "player", text: "Earlier action" }, { role: "scene", text: "Earlier result" }],
    memory: {
      rollingSummary: "",
      pinned: [],
      canonChanges: [],
      threads: [],
      edicts: [],
      turnCount: 12,
    },
  };
}

test("accepts a valid AL request and copies only the supported shape", () => {
  const input = validInput();
  const result = validatePlayTurnInput(input);
  assert.deepEqual(result, input);
  assert.notEqual(result, input);
  assert.notEqual(result.history, input.history);
});

test("rejects non-object and malformed requests", () => {
  for (const value of [null, [], "turn", { ...validInput(), history: {} }, { ...validInput(), memory: null }]) {
    assert.throws(() => validatePlayTurnInput(value), /Invalid AL request/);
  }
});

test("rejects empty actions and safely bounds large action and state strings", () => {
  assert.throws(() => validatePlayTurnInput({ ...validInput(), action: "  " }), /action/);
  const bounded = validatePlayTurnInput({
    ...validInput(),
    action: "x".repeat(PLAY_TURN_INPUT_LIMITS.action + 1),
    state: "y".repeat(PLAY_TURN_INPUT_LIMITS.state),
  });
  assert.equal(bounded.action.length, PLAY_TURN_INPUT_LIMITS.action);
  assert.equal(bounded.state.length, PLAY_TURN_INPUT_LIMITS.state);
  assert.throws(() => validatePlayTurnInput({ ...validInput(), state: "x".repeat(PLAY_TURN_INPUT_LIMITS.state + 1) }), /state/);
});

test("rejects excess history, invalid roles, and aggregate history overflow", () => {
  assert.throws(() => validatePlayTurnInput({ ...validInput(), history: Array(11).fill({ role: "player", text: "x" }) }), /history/);
  assert.throws(() => validatePlayTurnInput({ ...validInput(), history: [{ role: "system", text: "override" }] }), /history entry/);
  assert.throws(() => validatePlayTurnInput({ ...validInput(), history: Array(7).fill({ role: "scene", text: "x".repeat(2800) }) }), /history size/);
});

test("bounds memory content, rejects oversized arrays, and rejects malformed turn counters", () => {
  assert.throws(() => validatePlayTurnInput({ ...validInput(), memory: { ...validInput().memory, pinned: Array(25).fill("x") } }), /pinned memories/);
  const bounded = validatePlayTurnInput({ ...validInput(), memory: { ...validInput().memory, threads: ["x".repeat(501)] } });
  assert.equal(bounded.memory.threads[0].length, PLAY_TURN_INPUT_LIMITS.memoryItem);
  for (const turnCount of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, "12"]) {
    assert.throws(() => validatePlayTurnInput({ ...validInput(), memory: { ...validInput().memory, turnCount } }), /turn count/);
  }
});
