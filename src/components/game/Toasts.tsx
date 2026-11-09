import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";

export function GameToasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[4.5rem] z-40 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={cn(
            "pointer-events-auto max-w-sm rounded-[12px] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]",
            t.kind === "alert" ? "bg-accent text-accent-fg" : "bg-bg-elevated text-fg",
          )}
          onClick={() => dismiss(t.id)}
        >
          {t.kind === "knock" ? "A knock at the door · " : t.kind === "message" ? "New message · " : ""}
          {t.text}
        </button>
      ))}
    </div>
  );
}
