/**
 * Runtime receipt helpers. Persistence is never inferred from the receipt payload:
 * it is derived only from a confirmed load/save storage classification.
 */
export function receiptFingerprint(slip) {
  if (!slip || typeof slip !== "object" || Array.isArray(slip)) return "";
  try {
    const value = JSON.stringify(slip);
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

export function receiptPersistenceFromStorage(slip, storage) {
  if (!slip || typeof slip !== "object" || Array.isArray(slip)) return "device-only";
  if (storage === "persistent") return "account-committed";
  if (storage === "ephemeral") return "ephemeral";
  return "device-only";
}
