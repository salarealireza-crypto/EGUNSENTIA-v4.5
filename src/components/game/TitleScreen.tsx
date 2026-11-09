import { useRef, useState } from "react";
import { Share2, Smartphone, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClawMark } from "./ClawMark";
import { BootSequence } from "./BootSequence";
import { APP_NAME, type AndroidApp } from "@/lib/game/android";
import { flushSave } from "@/lib/game/play";
import { parseImportedSave, validateImportFileSize } from "@/lib/game/save-validation.mjs";
import { useGame } from "@/lib/game/store";
import type { GameSnapshot } from "@/lib/game/types";
import { UserButton } from "@/lib/auth/gates";

export function TitleScreen({
  android,
  grokLinked,
  onInstall,
  hasServerSave,
}: {
  android: AndroidApp;
  grokLinked: boolean | null;
  onInstall: () => void;
  hasServerSave: boolean;
}) {
  const start = useGame((s) => s.start);
  const reset = useGame((s) => s.reset);
  const log = useGame((s) => s.log);
  const loadSnapshot = useGame((s) => s.loadSnapshot);
  const snapshot = useGame((s) => s.snapshot);
  const hasSave = hasServerSave || log.length > 1;
  const [confirmNew, setConfirmNew] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const begin = () => {
    start();
    void flushSave();
  };

  const newCampaign = () => {
    reset();
    start();
    void flushSave();
    setConfirmNew(false);
  };

  const exportSave = () => {
    const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "egunsentia-save-V41.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSave = async (file: File) => {
    try {
      validateImportFileSize(file.size);
      const text = await file.text();
      const parsed = parseImportedSave(text) as GameSnapshot;
      loadSnapshot(parsed);
      start();
      void flushSave();
    } catch {
      android.flash("That file is not a campaign the Hall can read.");
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <img src="/art/hall.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,transparent,rgba(12,11,10,0.55))]" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col justify-end px-6 pb-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.5rem))] pt-24 sm:justify-center sm:pb-24">
        <div className="absolute right-6 top-6">
          <UserButton />
        </div>
        <ClawMark className="mb-6 size-10 text-accent stagger-item" />
        <p className="stagger-item mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-fg-muted">
          Year 105 AW · {APP_NAME}
        </p>
        <h1 className="stagger-item font-display text-5xl font-semibold tracking-[-0.04em] text-fg sm:text-7xl">
          Egunsentia
        </h1>
        <p className="stagger-item mt-3 max-w-md font-display text-xl italic text-fg-muted sm:text-2xl">
          The Fist of the Red Claws
        </p>
        <p className="stagger-item mt-6 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-base">
          You are Christian Red IV. AL runs the House, the city, and the dark above. It will not speak for you.
          Your campaign is stored with your account so a reload, a new browser, or the installed app keep the same Ironday.
        </p>
        <p className="stagger-item mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
          {grokLinked === null ? "Checking AL link" : grokLinked ? "AL voice linked" : "AL voice offline"}
          {android.standalone ? " · Installed" : " · Ready to install"}
        </p>
        <div className="stagger-item mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button size="lg" onClick={begin} className="min-h-12 px-8">
            {hasSave ? "Continue" : "Begin Ironday"}
          </Button>
          {hasSave ? (
            <Button size="lg" variant="outline" onClick={() => setConfirmNew(true)}>
              New campaign
            </Button>
          ) : null}
          {android.standalone ? null : (
            <Button size="lg" variant="outline" onClick={onInstall} className="min-h-12">
              <Smartphone className="size-4" />
              Install on Android
            </Button>
          )}
          <Button size="lg" variant="ghost" onClick={() => void android.share()} className="min-h-12">
            <Share2 className="size-4" />
            Share
          </Button>
          <Button size="lg" variant="ghost" onClick={exportSave} className="min-h-12">
            <Download className="size-4" />
            Export save
          </Button>
          <Button size="lg" variant="ghost" onClick={() => fileRef.current?.click()} className="min-h-12">
            <Upload className="size-4" />
            Import save
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importSave(f);
            }}
          />
        </div>
        <p className="stagger-item mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          Ironday · 20 Ironmonth · Floor 6 · V4.5 DEMO · UPDATE 4.5
        </p>
      </div>

      {confirmNew ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/80 px-4">
          <div className="w-full max-w-md rounded-[20px] bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl">Begin a new campaign?</h2>
            <p className="mt-2 text-sm text-fg-muted">
              This overwrites the stored Ironday for this account. Export first if you want a copy.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="min-h-12 flex-1" onClick={newCampaign}>
                Wipe and begin
              </Button>
              <Button size="lg" variant="outline" className="min-h-12 flex-1" onClick={() => setConfirmNew(false)}>
                Keep this save
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .stagger-item {
          opacity: 0;
          transform: translateY(12px);
          filter: blur(4px);
          animation: fadeInUp 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .stagger-item:nth-child(1) { animation-delay: 40ms; }
        .stagger-item:nth-child(2) { animation-delay: 80ms; }
        .stagger-item:nth-child(3) { animation-delay: 120ms; }
        .stagger-item:nth-child(4) { animation-delay: 160ms; }
        .stagger-item:nth-child(5) { animation-delay: 220ms; }
        .stagger-item:nth-child(6) { animation-delay: 280ms; }
        .stagger-item:nth-child(7) { animation-delay: 340ms; }
        .stagger-item:nth-child(8) { animation-delay: 380ms; }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .stagger-item { opacity: 1; transform: none; filter: none; animation: none; }
        }
      `}</style>
    </main>
  );
}
