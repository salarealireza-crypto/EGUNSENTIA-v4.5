import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "@/lib/game/store";

export function ThreadsPanel() {
  const threads = useGame((s) => s.threads);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-elevated">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Quest engine</p>
        <h2 className="font-display text-xl font-semibold">Threads</h2>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-4">
          {threads.map((t) => (
            <article key={t.id} className="rounded-[16px] bg-bg p-4 shadow-[var(--shadow-border)]">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
                  {t.kind} {t.id}
                </p>
                <Badge variant={t.status === "active" ? "accent" : "default"}>{t.status}</Badge>
              </div>
              <h3 className="mt-1 font-display text-base font-semibold text-fg">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t.summary}</p>
            </article>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
