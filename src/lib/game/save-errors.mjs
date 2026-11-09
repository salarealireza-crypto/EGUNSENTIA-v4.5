const SAVE_FAILURES = Object.freeze({
  network: "The account save could not reach the Hall. Your copy on this device remains safe; the account copy may be behind.",
  authorization: "Your account session could not authorize the save. Your device copy remains safe; reconnect your account before syncing.",
  validation: "The account save rejected the campaign data. Your device copy remains safe; the campaign was not marked as saved.",
  storage: "The account storage refused the save. Your device copy remains safe; try again later.",
});

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
  return { kind, notice: SAVE_FAILURES[kind] };
}

export const SAVE_FAILURE_NOTICE_INTERVAL_MS = 60_000;
