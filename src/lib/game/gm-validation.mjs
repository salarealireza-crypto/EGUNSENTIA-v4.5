const LIMITS = Object.freeze({
  action: 1600,
  state: 8_000,
  historyItems: 10,
  historyText: 2800,
  historyTotal: 18_000,
  summary: 4000,
  memoryItems: 24,
  memoryItem: 500,
});

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function record(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @param {number} max
 * @param {string} field
 * @param {{ allowEmpty?: boolean }} [options]
 * @returns {string}
 */
function boundedText(value, max, field, { allowEmpty = true } = {}) {
  if (typeof value !== "string" || value.length > max || (!allowEmpty && !value.trim())) {
    throw new TypeError(`Invalid AL request: ${field}.`);
  }
  return value;
}

/** @param {unknown} value @param {string} field @returns {string[]} */
function boundedList(value, field) {
  if (!Array.isArray(value) || value.length > LIMITS.memoryItems) {
    throw new TypeError(`Invalid AL request: ${field}.`);
  }
  return value.map((item) => boundedText(item, 20_000, field).slice(0, LIMITS.memoryItem));
}

/**
 * @typedef {{ action: string, state: string, history: { role: "player" | "scene", text: string }[], memory: { rollingSummary: string, pinned: string[], canonChanges: string[], threads: string[], edicts: string[], turnCount: number } }} PlayTurnInput
 */

/** Runtime validation and bounded copy for untrusted browser input to AL. @param {unknown} input @returns {PlayTurnInput} */
export function validatePlayTurnInput(input) {
  if (!record(input)) throw new TypeError("Invalid AL request.");
  const action = boundedText(input.action, 32_000, "action", { allowEmpty: false }).slice(0, LIMITS.action);
  const state = boundedText(input.state, LIMITS.state, "state");
  if (!Array.isArray(input.history) || input.history.length > LIMITS.historyItems) {
    throw new TypeError("Invalid AL request: history.");
  }
  let historyLength = 0;
  const history = input.history.map((beat) => {
    if (!record(beat) || (beat.role !== "player" && beat.role !== "scene")) {
      throw new TypeError("Invalid AL request: history entry.");
    }
    const text = boundedText(beat.text, 100_000, "history text").slice(0, LIMITS.historyText);
    historyLength += text.length;
    return { role: beat.role, text };
  });
  if (historyLength > LIMITS.historyTotal) {
    throw new TypeError("Invalid AL request: history size.");
  }
  if (!record(input.memory)) throw new TypeError("Invalid AL request: memory.");
  const turnCount = input.memory.turnCount;
  if (typeof turnCount !== "number" || !Number.isSafeInteger(turnCount) || turnCount < 0 || turnCount > 1_000_000_000) {
    throw new TypeError("Invalid AL request: turn count.");
  }
  const memory = {
    rollingSummary: boundedText(input.memory.rollingSummary, 20_000, "memory summary").slice(0, LIMITS.summary),
    pinned: boundedList(input.memory.pinned, "pinned memories"),
    canonChanges: boundedList(input.memory.canonChanges, "canon changes"),
    threads: boundedList(input.memory.threads, "threads"),
    edicts: boundedList(input.memory.edicts, "edicts"),
    turnCount,
  };
  return { action, state, history, memory };
}

export const PLAY_TURN_INPUT_LIMITS = LIMITS;
