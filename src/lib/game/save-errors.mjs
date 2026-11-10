const SAVE_FAILURES = Object.freeze({
  network: "The account save could not reach the Hall. Your copy on this device remains safe; the account copy may be behind.",
  authorization: "Your account session could not authorize the save. Your device copy remains safe; reconnect your account before syncing.",
  validation: "The account save rejected the campaign data. Your device copy remains safe; the campaign was not marked as saved.",
  storage: "The account storage refused the save. Your device copy remains safe; try again later.",
});

/** Return only validator-authored field/error labels; never echo arbitrary server text. */
function safeValidationDetail(raw) {
  const path = raw.match(/Invalid campaign data: ([A-Za-z0-9_.\[\]-]{1,120})\./i);
  if (path) return `Invalid field: ${path[1]}.`;

  const fixed = [
    "Invalid campaign save.",
    "Invalid campaign version.",
    "Invalid campaign summary.",
    "Invalid campaign turn counter.",
    "Invalid campaign save revision.",
    "The campaign contains too many data entries.",
    "The campaign data is nested too deeply.",
    "The campaign contains an unsupported object.",
    "The campaign contains an unsupported data field.",
    "The campaign contains an invalid number.",
    "The campaign contains unsupported data.",
    "The campaign could not be serialized.",
    "The campaign is too large to store.",
  ];
  return fixed.find((message) => raw.toLowerCase().includes(message.toLowerCase())) ?? null;
}

/** Map technical persistence failures to safe, non-sensitive player notices. */
export function describeSaveFailure(error) {
  const raw = error instanceof Error ? `${error.name}: ${error.message}` : String(error ?? "");
  const text = raw.toLowerCase();
  let kind = "storage";
  if (/failed to fetch|network|offline|timeout|timed out|connection reset|econn|socket|fetch failed|load failed/.test(text)) {
    kind = "network";
  } else if (/unauthori[sz]ed|forbidden|not authenticated|authentication|session expired|sign.?in required/.test(text)) {
    kind = "authorization";
  } else if (/invalid campaign|validation|unsupported data|too large|could not be serialized|campaign data/.test(text)) {
    kind = "validation";
  }
  const detail = kind === "validation" ? safeValidationDetail(raw) : null;
  return {
    kind,
    notice: detail ? `${SAVE_FAILURES[kind]} Detail: ${detail}` : SAVE_FAILURES[kind],
  };
}

export const SAVE_FAILURE_NOTICE_INTERVAL_MS = 60_000;
