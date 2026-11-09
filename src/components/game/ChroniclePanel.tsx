import { useState } from "react";
import { Pin, Pencil, Trash2, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game/store";
import { flushSave } from "@/lib/game/play";
import { cn } from "@/lib/utils";

export function ChroniclePanel() {
  const chronicle = useGame((s) => s.chronicle);
  const pin = useGame((s) => s.pinChronicle);
  const edit = useGame((s) => s.editChronicle);
  const del = useGame((s) => s.deleteChronicle);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const turns = chronicle.filter((c) => c.kind === "turn");
  const canon = chronicle.filter((c) => c.kind === "canon");

  const exportText = () => {
    const body = [
      "EGUNSENTIA V15 — CHRONICLE",
      "",
      "== TURNS ==",
      ...turns.map((c) => `${c.pinned ? "[PIN] " : ""}${c.at} — ${c.line}`),
      "",
      "== CANON CHANGES ==",
      ...canon.map((c) => `${c.at} — ${c.line}`),
      "",
    ].join("\n");
    const blob = new Blob([body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "egunsentia-chronicle-V15.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-elevated">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Memory</p>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold">Chronicle</h2>
          <Button size="sm" variant="outline" onClick={exportText}>
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
        <p className="mt-1 font-mono text-[10px] text-fg-subtle">Pinned lines are never dropped.</p>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-4">
          <section>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Canon changes</p>
            {canon.length === 0 ? (
              <p className="text-sm text-fg-muted">No lasting facts recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {canon.map((c) => (
                  <li key={c.id} className="rounded-[12px] bg-bg px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)]">
                    <span className="font-mono text-[10px] text-accent-soft">{c.at}</span>
                    <p className="mt-1">{c.line}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Turns</p>
            <ol className="space-y-2">
              {turns.map((c) => (
                <li key={c.id} className="rounded-[12px] bg-bg p-3 shadow-[var(--shadow-border)]">
                  {editing === c.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="min-h-16 w-full rounded-lg bg-bg-subtle px-3 py-2 text-sm text-fg outline-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            edit(c.id, draft.trim() || c.line);
                            setEditing(null);
                            void flushSave();
                          }}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">{c.at}</p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className={cn("rounded p-1.5", c.pinned ? "text-accent-soft" : "text-fg-subtle")}
                            aria-label="Pin"
                            onClick={() => {
                              pin(c.id);
                              void flushSave();
                            }}
                          >
                            <Pin className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            className="rounded p-1.5 text-fg-subtle"
                            aria-label="Edit"
                            onClick={() => {
                              setEditing(c.id);
                              setDraft(c.line);
                            }}
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          {c.pinned ? null : (
                            <button
                              type="button"
                              className="rounded p-1.5 text-fg-subtle"
                              aria-label="Delete"
                              onClick={() => {
                                del(c.id);
                                void flushSave();
                              }}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-fg">{c.line}</p>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
