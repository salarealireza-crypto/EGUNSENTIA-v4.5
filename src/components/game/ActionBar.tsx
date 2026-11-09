import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitAction } from "@/lib/game/play";
import { playSfx } from "@/lib/game/sound";
import { useGame } from "@/lib/game/store";

export function ActionBar() {
  const [value, setValue] = useState("");
  const busy = useGame((s) => s.busy);
  const quick = useGame((s) => s.quickActions);
  const failedAction = useGame((s) => s.failedAction);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setValue("");
    playSfx("click");
    await submitAction(t);
  };

  return (
    <div className="border-t border-line bg-bg-elevated/90 px-4 py-3 backdrop-blur-sm sm:px-6">
      {quick.length ? (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {quick.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="shrink-0 min-h-10 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted shadow-[var(--shadow-border)] transition-[color,box-shadow] duration-150 hover:text-fg hover:shadow-[var(--shadow-border-hover)]"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      {failedAction ? (
        <button
          type="button"
          className="mb-2 min-h-10 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-soft"
          onClick={() => void submitAction(failedAction, { retry: true })}
        >
          Retry last action
        </button>
      ) : null}
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(value);
        }}
      >
        <label className="sr-only" htmlFor="fist-action">
          What does the Fist do
        </label>
        <textarea
          id="fist-action"
          rows={2}
          value={value}
          disabled={busy}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(value);
            }
          }}
          placeholder="Speak, move, command — the Fist decides."
          className="min-h-12 w-full resize-none rounded-[14px] bg-bg-subtle px-4 py-3 text-[15px] text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-fg-subtle focus:shadow-[var(--shadow-border-hover)] disabled:opacity-60"
        />
        <Button type="submit" size="icon" disabled={busy || !value.trim()} aria-label="Send action" className="shrink-0">
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  );
}
