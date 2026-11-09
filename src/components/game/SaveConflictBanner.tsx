import type { GameSnapshot } from "@/lib/game/types";

export interface SaveConflict {
  payload: GameSnapshot | null;
  revision: number;
  updatedAt: string | null;
  storage: "persistent" | "ephemeral";
}

export function SaveConflictBanner({
  conflict,
  onLoadAccount,
  onKeepLocal,
}: {
  conflict: SaveConflict;
  onLoadAccount: () => void;
  onKeepLocal: () => void;
}) {
  return (
    <section
      role="alert"
      className="fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[100] mx-auto max-w-2xl rounded-xl border border-amber-400/40 bg-bg-elevated p-4 text-fg shadow-2xl"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-300">Campaign version conflict</p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {conflict.payload
          ? "Another device has saved a different account campaign. Both copies are preserved. Choose which version should continue on this device."
          : "The account save is missing, but this device still has a campaign copy. You can restore this copy to the account."}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {conflict.payload ? (
          <button
            type="button"
            onClick={onLoadAccount}
            className="min-h-10 flex-1 rounded-lg bg-amber-300 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-950"
          >
            Load account copy
          </button>
        ) : null}
        <button
          type="button"
          onClick={onKeepLocal}
          className="min-h-10 flex-1 rounded-lg border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg"
        >
          {conflict.payload ? "Keep this device's campaign" : "Restore this device's campaign"}
        </button>
      </div>
    </section>
  );
}
