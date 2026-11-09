/**
 * Restore a list from a campaign snapshot.
 * An empty list is valid saved state; only an absent or malformed legacy value
 * should fall back to the current campaign defaults.
 */
export function restoreSnapshotArray<T>(value: unknown, fallback: readonly T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : [...fallback];
}
