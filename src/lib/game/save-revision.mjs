/** Validate the revision a client expects to replace. Revision 0 means no row existed. */
export function validateExpectedSaveRevision(value) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError("Invalid campaign save revision.");
  }
  return value;
}

/** Pure policy used by tests and request validation: stale writers must not win. */
export function isCurrentSaveRevision(expectedRevision, currentRevision) {
  return Number.isSafeInteger(expectedRevision)
    && expectedRevision >= 0
    && Number.isSafeInteger(currentRevision)
    && currentRevision >= 0
    && expectedRevision === currentRevision;
}
