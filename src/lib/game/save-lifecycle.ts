type LifecycleTarget = Pick<EventTarget, "addEventListener" | "removeEventListener">;

/**
 * Retry the account save when a previously offline browser reconnects or the
 * player returns to the game. Page-hide writes remain best-effort; the local
 * persisted copy is the recovery source if the browser interrupts the request.
 */
export function attachSaveLifecycle(
  windowTarget: LifecycleTarget,
  documentTarget: LifecycleTarget & { visibilityState: DocumentVisibilityState },
  flushSave: () => Promise<unknown>,
  isOnline: () => boolean = () => true,
) {
  const attemptFlush = () => {
    try {
      void flushSave().catch(() => {
        // flushSave owns save error reporting; lifecycle events must stay silent.
      });
    } catch {
      // A lifecycle callback must never break browser navigation or recovery.
    }
  };

  const onOnline: EventListener = () => attemptFlush();
  const onPageHide: EventListener = () => attemptFlush();
  const onVisibilityChange: EventListener = () => {
    if (documentTarget.visibilityState === "hidden" || isOnline()) attemptFlush();
  };

  windowTarget.addEventListener("online", onOnline);
  windowTarget.addEventListener("pagehide", onPageHide);
  documentTarget.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    windowTarget.removeEventListener("online", onOnline);
    windowTarget.removeEventListener("pagehide", onPageHide);
    documentTarget.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
