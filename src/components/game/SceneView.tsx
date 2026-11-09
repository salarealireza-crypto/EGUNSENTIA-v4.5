import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, RefreshCw, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { flushSave, regenerateReply, submitAction } from "@/lib/game/play";
import { parseChatArchive, serializeChatArchive } from "@/lib/game/chat-archive";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

const SPEAKERS: Record<string, string> = {
  Dagmar: "var(--color-spk-dagmar)",
  Adelheid: "var(--color-spk-adelheid)",
  Vera: "var(--color-spk-vera)",
  Elara: "var(--color-spk-elara)",
  Samer: "var(--color-spk-samer)",
  Samuel: "var(--color-spk-samer)",
  Wilhelmina: "var(--color-spk-adelheid)",
  Ansgar: "var(--color-spk-elara)",
  Ilka: "var(--color-spk-vera)",
  Liese: "var(--color-spk-other)",
  Konrad: "var(--color-spk-other)",
};

function speakerOf(p: string): { name?: string; color?: string } {
  const after = p.match(/"[^"]+"[,.]?\s+([A-Z][a-zA-Z]+)/);
  const name = after?.[1];
  if (name && SPEAKERS[name]) return { name, color: SPEAKERS[name] };
  if (name) return { name, color: "var(--color-spk-other)" };
  return {};
}

function TypeScene({ text, active }: { text: string; active: boolean }) {
  const reduce =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(active && !reduce ? 0 : text.length);
  useEffect(() => {
    if (!active || reduce) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(id);
          return text.length;
        }
        return Math.min(text.length, v + Math.max(3, Math.floor(text.length / 80)));
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [text, active, reduce]);
  const shown = text.slice(0, n);
  const paras = shown.split(/\n\n+/);
  return (
    <>
    <button type="button" className="w-full text-left" onClick={() => setN(text.length)}>
      <div className="scene-prose text-[16.5px] leading-[1.65] text-fg sm:text-[17.5px]">
        {paras.map((p, i) => {
          const sp = speakerOf(p);
          return (
            <p
              key={i}
              className={cn(p.trimStart().startsWith('"') && "pl-3 italic")}
              style={sp.color ? { color: sp.color } : undefined}
            >
              {sp.name ? <span className="mr-2 font-mono text-[10px] not-italic uppercase tracking-[0.14em] opacity-70">{sp.name}</span> : null}
              {p}
            </p>
          );
        })}
      </div>
    </button>
    </>
  );
}

export function SceneView() {
  const log = useGame((s) => s.log);
  const busy = useGame((s) => s.busy);
  const failedAction = useGame((s) => s.failedAction);
  const notice = useGame((s) => s.notice);
  const nightSummary = useGame((s) => s.nightSummary);
  const setSceneVariant = useGame((s) => s.setSceneVariant);
  const replaceChatLog = useGame((s) => s.replaceChatLog);
  const endRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [archiveMessage, setArchiveMessage] = useState<string | null>(null);
  const lastScene = useMemo(() => [...log].reverse().find((t) => t.role === "scene")?.id, [log]);

  const exportChat = () => {
    const blob = new Blob([serializeChatArchive(log)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `egunsentia-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setArchiveMessage("Chat archive downloaded.");
  };

  const importChat = async (file: File) => {
    try {
      const imported = parseChatArchive(await file.text());
      if (!window.confirm(`Replace the current chat with ${imported.length} archived messages? The world and campaign state will stay unchanged.`)) return;
      replaceChatLog(imported);
      void flushSave();
      setArchiveMessage(`Restored ${imported.length} messages. The campaign state was left unchanged.`);
    } catch (error) {
      setArchiveMessage(error instanceof Error ? error.message : "The chat archive could not be read.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  const regenerate = async (sceneId: string) => {
    if (busy) return;
    setRegeneratingId(sceneId);
    try {
      await regenerateReply(sceneId);
    } finally {
      setRegeneratingId(null);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log.length, busy]);

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Conversation archive</p>
            <p className="mt-1 text-xs text-fg-muted">Export or restore this chat without changing the campaign.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportChat} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs text-fg shadow-[var(--shadow-border)] hover:bg-bg-subtle" aria-label="Download chat as TXT">
              <Download className="size-4" /> Download TXT
            </button>
            <button type="button" onClick={() => importRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs text-fg shadow-[var(--shadow-border)] hover:bg-bg-subtle" aria-label="Import chat TXT">
              <Upload className="size-4" /> Import TXT
            </button>
            <input ref={importRef} type="file" accept=".txt,text/plain,application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importChat(file); }} />
          </div>
          {archiveMessage ? <p role="status" className="w-full text-xs text-fg-muted">{archiveMessage}</p> : null}
        </div>
        {log.map((turn, turnIndex) => (
          <article key={turn.id} className="min-w-0">
            {turn.role === "player" ? (
              <div className="ml-auto max-w-[36rem]">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">The Fist</p>
                <p className="rounded-[14px] bg-bg-subtle px-4 py-3 text-[15px] leading-relaxed text-fg shadow-[var(--shadow-border)]">
                  {turn.text}
                </p>
                {turn.failed && failedAction ? (
                  <button
                    type="button"
                    className="mt-2 min-h-10 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-soft"
                    onClick={() => void submitAction(failedAction, { retry: true })}
                  >
                    Retry
                  </button>
                ) : null}
              </div>
            ) : turn.role === "note" ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">{turn.text}</p>
            ) : (
              <div>
                {(() => {
                  const versions = turn.variants?.length ? turn.variants : [turn.text];
                  const activeIndex = Math.max(0, Math.min(versions.length - 1, turn.activeVariant ?? 0));
                  const previousPlayer = log.slice(0, turnIndex).some((entry) => entry.role === "player");
                  return (
                    <>
                      <TypeScene text={versions[activeIndex]} active={turn.id === lastScene} />
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <CopyButton text={versions[activeIndex]} />
                        {previousPlayer ? (
                          <>
                            <button type="button" onClick={() => { setSceneVariant(turn.id, activeIndex - 1); void flushSave(); }} disabled={activeIndex <= 0} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted hover:bg-bg-subtle disabled:opacity-30" aria-label="Previous AI answer">
                              <ChevronLeft className="size-4" /> Previous
                            </button>
                            <span className="min-w-12 text-center font-mono text-[10px] text-fg-subtle">{activeIndex + 1}/{versions.length}</span>
                            <button type="button" onClick={() => { setSceneVariant(turn.id, activeIndex + 1); void flushSave(); }} disabled={activeIndex >= versions.length - 1} className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-muted hover:bg-bg-subtle disabled:opacity-30" aria-label="Next AI answer">
                              Next <ChevronRight className="size-4" />
                            </button>
                            <button type="button" onClick={() => void regenerate(turn.id)} disabled={busy} className="inline-flex min-h-9 items-center gap-2 rounded-md px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-soft hover:bg-bg-subtle disabled:opacity-40" aria-label="Generate another AI answer">
                              <RefreshCw className={`size-3.5 ${regeneratingId === turn.id ? "animate-spin" : ""}`} />
                              {regeneratingId === turn.id ? "Generating" : "Generate again"}
                            </button>
                          </>
                        ) : null}
                      </div>
                    </>
                  );
                })()}
                {turn.dice?.length ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {turn.dice.map((d, i) => (
                      <div
                        key={`${d.reason}-${i}`}
                        className="d20-spin flex size-14 items-center justify-center rounded-lg bg-bg-subtle font-mono text-xl text-fg shadow-[var(--shadow-border)]"
                        title={`${d.die} ${d.result}${d.vs ? ` vs ${d.vs}` : ""} · ${d.reason}`}
                      >
                        {d.result}
                      </div>
                    ))}
                  </div>
                ) : null}
                {turn.footer ? (
                  <footer className="mt-6 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
                    <div>Time {turn.footer.time}</div>
                    <div>Day {turn.footer.day}</div>
                    <div>Floor {turn.footer.floor}</div>
                    <div className={cn(turn.footer.interrupt !== "normal" && "text-accent-soft")}>
                      {turn.footer.prompt}
                    </div>
                  </footer>
                ) : null}
              </div>
            )}
          </article>
        ))}
        {notice ? <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-soft">{notice}</p> : null}
        {nightSummary ? (
          <article className="rounded-[14px] bg-bg-subtle px-4 py-3 text-sm text-fg shadow-[var(--shadow-border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Night summary</p>
            <p className="mt-2 leading-relaxed">{nightSummary}</p>
            <CopyButton text={nightSummary} />
          </article>
        ) : null}
        {busy ? (
          <p className="shimmer font-mono text-[11px] uppercase tracking-[0.22em] text-fg-muted">The Hall is listening</p>
        ) : null}
        <div ref={endRef} />
      </div>
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, var(--color-fg-subtle), var(--color-fg-muted), var(--color-fg-subtle));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 1.6s linear infinite;
        }
        @keyframes shimmer {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }
      `}</style>
    </ScrollArea>
  );
}
