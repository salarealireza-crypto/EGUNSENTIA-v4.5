type SnapshotStore<State> = {
  getState: () => State;
  subscribe: (listener: (state: State, previousState: State) => void) => () => void;
};

/**
 * Persist every campaign snapshot change, regardless of which panel/action
 * produced it. The caller supplies the canonical snapshot selector so UI-only
 * metadata can remain outside the persistence trigger. Fast consecutive
 * mutations are coalesced; the save queue still owns ordering and CAS safety.
 */
export function attachSnapshotAutosave<State>(
  store: SnapshotStore<State>,
  selectSnapshot: (state: State) => unknown,
  flushSave: () => Promise<unknown>,
  delayMs = 400,
): () => void {
  const serialize = (state: State): string | null => {
    try {
      const result = JSON.stringify(selectSnapshot(state));
      return typeof result === "string" ? result : null;
    } catch {
      return null;
    }
  };

  let lastSnapshot = serialize(store.getState());
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const unsubscribe = store.subscribe((state) => {
    const nextSnapshot = serialize(state);
    if (nextSnapshot === null || nextSnapshot === lastSnapshot) return;
    lastSnapshot = nextSnapshot;

    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (disposed) return;
      try {
        void flushSave().catch(() => {
          // flushSave owns user-safe failure reporting; autosave stays non-fatal.
        });
      } catch {
        // A save callback must never break a Zustand mutation.
      }
    }, Math.max(0, delayMs));
  });

  return () => {
    disposed = true;
    if (timer !== undefined) clearTimeout(timer);
    unsubscribe();
  };
}

/** Share one pending remote write among callers holding the same snapshot key. */
export function createInFlightSaveDeduper<Result>() {
  const pending = new Map<string, Promise<Result>>();

  return (key: string, work: () => Promise<Result>): Promise<Result> => {
    const existing = pending.get(key);
    if (existing) return existing;

    let task: Promise<Result>;
    task = Promise.resolve()
      .then(work)
      .finally(() => {
        if (pending.get(key) === task) pending.delete(key);
      });
    pending.set(key, task);
    return task;
  };
}
