const MAX_BYTES = 1_400_000;
const MAX_DEPTH = 40;
const MAX_NODES = 120_000;
const REQUIRED_ARRAYS = [
  "inbox", "news", "worldNews", "cases", "threads", "chronicle", "relations",
  "secretClocks", "calendar", "edicts", "stalkers", "finds", "sorties", "mysteries",
  "foreignReports", "kin", "log", "quickActions", "personalVault", "factionVault",
  "events", "household", "gates", "trades", "radio", "films", "intel", "memories",
  "reputations", "pregnancies", "children",
];
const REQUIRED_OBJECTS = ["world", "p4"];
const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** @param {unknown} value */
function inspectTree(value) {
  const stack = [{ value, depth: 0 }];
  let nodes = 0;
  while (stack.length) {
    const current = stack.pop();
    nodes += 1;
    if (nodes > MAX_NODES) throw new TypeError("The campaign contains too many data entries.");
    if (current.depth > MAX_DEPTH) throw new TypeError("The campaign data is nested too deeply.");
    if (Array.isArray(current.value)) {
      for (const item of current.value) stack.push({ value: item, depth: current.depth + 1 });
    } else if (isRecord(current.value)) {
      const prototype = Object.getPrototypeOf(current.value);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError("The campaign contains an unsupported object.");
      }
      for (const [key, item] of Object.entries(current.value)) {
        if (FORBIDDEN_KEYS.has(key)) throw new TypeError("The campaign contains an unsupported data field.");
        stack.push({ value: item, depth: current.depth + 1 });
      }
    } else if (typeof current.value === "number" && !Number.isFinite(current.value)) {
      throw new TypeError("The campaign contains an invalid number.");
    } else if (current.value === undefined || typeof current.value === "bigint" || typeof current.value === "function" || typeof current.value === "symbol") {
      throw new TypeError("The campaign contains unsupported data.");
    }
  }
}

function validateOptionalRecord(parent, key, label) {
  if (parent[key] !== undefined && !isRecord(parent[key])) {
    throw new TypeError(`Invalid campaign data: ${label}.`);
  }
  return parent[key];
}

function validateNumericFields(record, fields, label, { nonNegative = false, integer = false } = {}) {
  if (!record) return;
  for (const field of fields) {
    const value = record[field];
    if (value === undefined) continue;
    if (typeof value !== "number" || !Number.isFinite(value) || (nonNegative && value < 0) || (integer && !Number.isSafeInteger(value))) {
      throw new TypeError(`Invalid campaign data: ${label}.${field}.`);
    }
  }
}

/** Validate the nested world fields that drive clocks, resources, and simulation arithmetic. */
function validateWorldShape(world) {
  validateNumericFields(world, ["dayIndex", "lastWeeklyRelicDay"], "world", { nonNegative: true, integer: true });

  const clock = validateOptionalRecord(world, "clock", "world clock");
  if (clock) {
    for (const field of ["weekday", "date", "year", "time", "location", "floor"]) {
      const value = clock[field];
      if (value !== undefined && (typeof value !== "string" || value.length > 120)) {
        throw new TypeError(`Invalid campaign data: world.clock.${field}.`);
      }
    }
  }

  for (const key of ["water", "food", "energy"]) {
    const resource = validateOptionalRecord(world, key, `world ${key}`);
    validateNumericFields(resource, ["stock", "capacity", "production", "consumption"], `world.${key}`, { nonNegative: true });
  }

  for (const [key, fields] of Object.entries({
    treasury: ["marks", "income", "expenses"],
    arms: ["suitsReady", "inRepair", "rifles", "ammo"],
    population: ["house", "soldiers", "bound", "redClaws", "known"],
    blocs: ["oldGuard", "banners", "works"],
    surface: ["weekSorties", "weekLimit"],
  })) {
    const record = validateOptionalRecord(world, key, `world ${key}`);
    validateNumericFields(record, fields, `world.${key}`, { nonNegative: true });
  }

  const indices = validateOptionalRecord(world, "indices", "world indices");
  if (indices) {
    for (const [key, value] of Object.entries(indices)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(`Invalid campaign data: world.indices.${key}.`);
      }
    }
  }
}

/** Validate optional absolute campaign-day birthdays without inventing dates for legacy records. */
function validateChildrenBirthDays(children) {
  if (!Array.isArray(children)) return;
  for (const [index, child] of children.entries()) {
    if (!isRecord(child)) continue;
    if (child.birthDay !== undefined && !Number.isSafeInteger(child.birthDay)) {
      throw new TypeError(`Invalid campaign data: children[${index}].birthDay.`);
    }
  }
}


/** Validate the optional, versioned adult private-relations save block. */
function validatePrivateRelations(payload) {
  if (payload.privateRelations === undefined) return; // Older saves receive defaults in loadSnapshot().
  if (!isRecord(payload.privateRelations) || payload.privateRelations.schemaVersion !== 1) {
    throw new TypeError("Invalid campaign data: privateRelations.");
  }
  for (const [key, limit] of [["relationships", 32], ["requests", 100], ["consequences", 200]]) {
    const rows = payload.privateRelations[key];
    if (!Array.isArray(rows) || rows.length > limit) {
      throw new TypeError(`Invalid campaign data: privateRelations.${key}.`);
    }
  }
}

/** Reject impossible or oversized File.size values before reading the file into memory. */
export function validateImportFileSize(size) {
  if (!Number.isSafeInteger(size) || size < 0 || size > MAX_BYTES) {
    throw new TypeError("The campaign file is invalid or too large.");
  }
  return size;
}

/** Validate an untrusted campaign snapshot and return its bounded JSON representation. */
/** @param {unknown} payload @returns {string} */
export function serializeSavePayload(payload) {
  if (!isRecord(payload)) throw new TypeError("Invalid campaign save.");
  if (typeof payload.version !== "string" || payload.version.length > 80) {
    throw new TypeError("Invalid campaign version.");
  }
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(payload[key])) throw new TypeError(`Invalid campaign data: ${key}.`);
  }
  for (const key of REQUIRED_OBJECTS) {
    if (!isRecord(payload[key])) throw new TypeError(`Invalid campaign data: ${key}.`);
  }
  if (typeof payload.rollingSummary !== "string" || payload.rollingSummary.length > 20_000) {
    throw new TypeError("Invalid campaign summary.");
  }
  if (!Number.isSafeInteger(payload.turnCount) || payload.turnCount < 0) {
    throw new TypeError("Invalid campaign turn counter.");
  }
  inspectTree(payload);
  validateWorldShape(payload.world);
  validateChildrenBirthDays(payload.children);
  validatePrivateRelations(payload);
  let serialized;
  try {
    serialized = JSON.stringify(payload);
  } catch {
    throw new TypeError("The campaign could not be serialized.");
  }
  if (typeof serialized !== "string" || new TextEncoder().encode(serialized).length > MAX_BYTES) {
    throw new TypeError("The campaign is too large to store.");
  }
  return serialized;
}


/**
 * Validate an imported browser save while allowing collections introduced by
 * newer builds to be absent. `loadSnapshot()` supplies canonical defaults for
 * missing legacy fields after this bounded structural check.
 * @param {string} serialized
 * @returns {Record<string, unknown>}
 */
export function parseImportedSave(serialized) {
  if (typeof serialized !== "string") {
    throw new TypeError("The campaign file is invalid or too large.");
  }
  validateImportFileSize(new TextEncoder().encode(serialized).length);
  let payload;
  try {
    payload = JSON.parse(serialized);
  } catch {
    throw new TypeError("The campaign file is not valid JSON.");
  }
  if (!isRecord(payload)) throw new TypeError("The campaign file has an invalid root.");
  if (typeof payload.version !== "string" || payload.version.length > 80) {
    throw new TypeError("The campaign file has an unsupported version field.");
  }
  if (!isRecord(payload.world)) throw new TypeError("The campaign file has invalid world data.");
  if (payload.p4 !== undefined && !isRecord(payload.p4)) {
    throw new TypeError("The campaign file has invalid simulation data.");
  }
  if (payload.rollingSummary !== undefined && (typeof payload.rollingSummary !== "string" || payload.rollingSummary.length > 20_000)) {
    throw new TypeError("The campaign summary is invalid.");
  }
  if (payload.turnCount !== undefined && (!Number.isSafeInteger(payload.turnCount) || payload.turnCount < 0)) {
    throw new TypeError("The campaign turn counter is invalid.");
  }
  for (const key of REQUIRED_ARRAYS) {
    if (payload[key] !== undefined && !Array.isArray(payload[key])) {
      throw new TypeError(`Invalid campaign data: ${key}.`);
    }
  }
  inspectTree(payload);
  validateWorldShape(payload.world);
  validateChildrenBirthDays(payload.children);
  validatePrivateRelations(payload);
  return payload;
}

/** Validate persisted JSON before exposing it to the client. */
/** @param {unknown} serialized @returns {Record<string, unknown>} */
export function parseStoredSave(serialized) {
  if (typeof serialized !== "string" || new TextEncoder().encode(serialized).length > MAX_BYTES) {
    throw new TypeError("The stored campaign is invalid or too large.");
  }
  let payload;
  try {
    payload = JSON.parse(serialized);
  } catch {
    throw new TypeError("The stored campaign could not be read.");
  }
  // Stored historical saves may predate newer optional arrays or P4 fields.
  // The caller restores them over the canonical blank snapshot, which supplies
  // defaults without discarding any fields that are already present.
  return parseImportedSave(JSON.stringify(payload));
}
