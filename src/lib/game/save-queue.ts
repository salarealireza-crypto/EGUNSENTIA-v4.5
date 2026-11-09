/** Serialize remote save writes and discard queued snapshots superseded by newer ones. */
export function createLatestSaveQueue<T>(write: (snapshot: T) => Promise<unknown>) {
  let chain: Promise<boolean> = Promise.resolve(false);
  let latestRevision = 0;

  return (snapshot: T): Promise<boolean> => {
    const revision = ++latestRevision;
    chain = chain
      .catch(() => false)
      .then(async () => {
        // A newer snapshot arrived while this one was waiting its turn.
        if (revision !== latestRevision) return false;
        const result = await write(snapshot);
        if (result !== null && typeof result === "object" && "ok" in result && result.ok === false) {
          const message = "error" in result && typeof result.error === "string"
            ? result.error
            : "The remote campaign save was rejected.";
          throw new Error(message);
        }
        // Do not report an older in-flight write as the latest save if a newer
        // snapshot arrived while the request was being processed.
        return revision === latestRevision;
      });
    return chain;
  };
}
