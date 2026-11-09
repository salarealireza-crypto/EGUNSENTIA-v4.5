export const COMPACT_STATE_BUDGET = 7_600;

const TRIM_PRIORITY = [
  "films",
  "foreignReports",
  "intel",
  "finds",
  "sorties",
  "events",
  "worldNews",
  "news",
  "calendar",
  "trades",
  "cases",
  "inbox",
  "threads",
  "edicts",
  "relations",
  "secretClocks",
  "stalkers",
  "mysteries",
];

/**
 * Fit a projected campaign state into the AL request budget. Arrays are
 * already ordered newest/most relevant first, so trimming always removes
 * their tail. Core world values, family identity, children and gate states
 * are not candidates for trimming.
 * @param {Record<string, unknown>} compact
 * @param {number} [budget]
 */
export function fitCompactStateBudget(compact, budget = COMPACT_STATE_BUDGET) {
  if (!compact || typeof compact !== "object" || Array.isArray(compact)) {
    throw new TypeError("Compact campaign state must be an object.");
  }
  if (!Number.isSafeInteger(budget) || budget < 256) {
    throw new RangeError("Compact campaign state budget is invalid.");
  }

  for (const key of TRIM_PRIORITY) {
    let serialized = JSON.stringify(compact);
    while (serialized.length > budget) {
      const value = compact[key];
      if (!Array.isArray(value) || value.length === 0) break;
      value.pop();
      serialized = JSON.stringify(compact);
    }
    if (serialized.length <= budget) return compact;
  }

  if (JSON.stringify(compact).length > budget) {
    throw new RangeError("Decision-critical campaign state exceeds the AL request budget.");
  }
  return compact;
}
