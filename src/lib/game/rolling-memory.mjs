/** Build a bounded rolling summary from the newest eight turn entries. */
export function buildRollingMemorySummary(entries, maxChars = 1200) {
  if (!Array.isArray(entries) || !Number.isSafeInteger(maxChars) || maxChars < 1) return "";
  const recent = entries.filter((entry) => entry && entry.kind === "turn").slice(-8);
  const joined = recent
    .map((entry) => {
      const line = typeof entry.line === "string" ? entry.line : "";
      const at = typeof entry.at === "string" ? entry.at : "";
      return `${at ? `${at} — ` : ""}${line}`.trim();
    })
    .filter(Boolean)
    .join(" ");
  // Keep the newest end of the summary, never the oldest prefix.
  return joined.slice(-maxChars);
}
