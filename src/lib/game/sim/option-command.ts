/** Stable identity for a generic V4.5 option execution within one world minute. */
export const OPTION_COMMAND_ID_LIMIT = 500;

export function optionCommandIdentity(optionId: string, dayIndex: number, minuteOfDay: number): string | null {
  if (typeof optionId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(optionId)) return null;
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0) return null;
  if (!Number.isSafeInteger(minuteOfDay) || minuteOfDay < 0 || minuteOfDay >= 1440) return null;
  return `v45-option:${optionId}:${dayIndex}:${minuteOfDay}`;
}

/** Append a successful command once, retaining only the newest bounded identities. */
export function appendOptionCommandIdentity(existing: unknown, commandId: string): string[] {
  const ids = Array.isArray(existing)
    ? existing.filter((value): value is string => typeof value === "string" && value.length > 0)
    : [];
  if (ids.includes(commandId)) return ids.slice(-OPTION_COMMAND_ID_LIMIT);
  return [...ids, commandId].slice(-OPTION_COMMAND_ID_LIMIT);
}
