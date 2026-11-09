import { useEffect, useState } from "react";
import { Share2, Smartphone, Volume2, VolumeX } from "lucide-react";
import { ActionBar } from "./ActionBar";
import { AndroidNav, type MobileTab } from "./AndroidNav";
import { CastPanel } from "./CastPanel";
import { ChroniclePanel } from "./ChroniclePanel";
import { ClawMark } from "./ClawMark";
import { InstallSheet } from "./InstallSheet";
import { PlatformDock } from "./PlatformDock";
import { SceneView } from "./SceneView";
import { ThreadsPanel } from "./ThreadsPanel";
import { TitleScreen } from "./TitleScreen";
import { GameToasts } from "./Toasts";
import { APP_NAME, useAndroidApp } from "@/lib/game/android";
import { grokStatus } from "@/lib/game/voice";
import { migrateLegacySave, useGame } from "@/lib/game/store";
import { loadSave } from "@/lib/game/save";
import { receiptPersistenceFromStorage } from "@/lib/game/receipt-persistence.mjs";
import { blockRemoteSaves, flushSave, markRemoteSaveBaseline, resumeRemoteSaves } from "@/lib/game/play";
import { attachSnapshotAutosave } from "@/lib/game/save-autosave";
import { attachSaveLifecycle } from "@/lib/game/save-lifecycle";
import { SaveConflictBanner, type SaveConflict } from "./SaveConflictBanner";
import { isAudioUnlocked, playSfx, setAmbient, setMasterGain, unlockAudio } from "@/lib/game/sound";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";
import type { DockTab } from "@/lib/game/types";

const TABS: { id: DockTab; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "cast", label: "Cast" },
  { id: "threads", label: "Threads" },
  { id: "chronicle", label: "Chronicle" },
];

function readLocalSaveMeta() {
  try {
    const raw = localStorage.getItem("egunsentia-v45-demo");
    if (!raw) return { remoteRevision: null as number | null };
    const parsed = JSON.parse(raw) as { state?: { remoteRevision?: number | null } };
    const revision = parsed.state?.remoteRevision;
    return {
      remoteRevision: typeof revision === "number" && Number.isSafeInteger(revision) && revision >= 0
        ? revision
        : null,
    };
  } catch {
    return { remoteRevision: null as number | null };
  }
}

export function GameShell() {
  const android = useAndroidApp();
  const view = useGame((s) => s.view);
  const dock = useGame((s) => s.dock);
  const setDock = useGame((s) => s.setDock);
  const world = useGame((s) => s.world);
  const platformOpen = useGame((s) => s.platformOpen);
  const muted = useGame((s) => s.muted);
  const volume = useGame((s) => s.volume);
  const interrupt = useGame((s) => s.log.at(-1)?.footer?.interrupt ?? "normal");
  const [mobileTab, setMobileTab] = useState<MobileTab>("hall");
  const [installOpen, setInstallOpen] = useState(false);
  const [grokLinked, setGrokLinked] = useState<boolean | null>(null);
  const [hasServerSave, setHasServerSave] = useState(false);
  const [saveConflict, setSaveConflict] = useState<SaveConflict | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    migrateLegacySave();
    const localMeta = readLocalSaveMeta();
    const result = Promise.resolve(useGame.persist.rehydrate());
    void result.then(async () => {
      const localState = useGame.getState();
      const localHasProgress = localState.log.length > 1 || localState.turnCount > 0;
      useGame.getState().setHydrated();
      try {
        const remote = await loadSave();
        if (remote.ok && remote.payload) {
          const sameCampaign = JSON.stringify(localState.snapshot()) === JSON.stringify(remote.payload);
          const hasKnownBase = localMeta.remoteRevision !== null;
          const baseMatchesRemote = hasKnownBase && localMeta.remoteRevision === remote.revision;
          if (localHasProgress && !sameCampaign && !baseMatchesRemote) {
            // An unknown/older local base may contain offline progress. Never silently overwrite either copy.
            markRemoteSaveBaseline(remote.payload, remote.storage);
            blockRemoteSaves();
            useGame.getState().setNotice("A different account campaign exists. Choose which copy to keep.");
            setSaveConflict({ payload: remote.payload, revision: remote.revision, updatedAt: remote.updatedAt, storage: remote.storage });
            setHasServerSave(true);
          } else if (localHasProgress && !sameCampaign && baseMatchesRemote) {
            // Local changes are based on the current account revision, so a conditional write is safe.
            markRemoteSaveBaseline(remote.payload, remote.storage);
            useGame.getState().setRemoteRevision(remote.revision);
            setHasServerSave(true);
            void flushSave();
          } else {
            // Restore the saved view too: reopening the site should resume the live campaign, not replay the title screen.
            useGame.getState().loadSnapshot(remote.payload);
            useGame.getState().setReceiptPersistence(receiptPersistenceFromStorage(remote.payload.p4?.lastReceipt, remote.storage));
            markRemoteSaveBaseline(useGame.getState().snapshot(), remote.storage);
            useGame.getState().setRemoteRevision(remote.revision);
            useGame.getState().setSavedAt(Date.now());
            setHasServerSave(true);
          }
        } else if (remote.ok && localHasProgress) {
          if (localMeta.remoteRevision !== null && localMeta.remoteRevision > 0) {
            // The account row disappeared after this device synced; retain local data and fail closed.
            markRemoteSaveBaseline(null, remote.storage);
            blockRemoteSaves();
            useGame.getState().setNotice("The account campaign is missing, but this device still has a saved copy. Export it before continuing.");
            setHasServerSave(true);
          } else {
            markRemoteSaveBaseline(null, remote.storage);
            useGame.getState().setRemoteRevision(0);
            setHasServerSave(false);
            void flushSave();
          }
        } else if (remote.ok) {
          // No account row exists yet. Do not mark the local seed snapshot as
          // remotely committed; the first real campaign mutation will insert it.
          markRemoteSaveBaseline(null, remote.storage);
          useGame.getState().setRemoteRevision(remote.revision);
          setHasServerSave(false);
        } else {
          // A corrupt or incompatible remote payload must never replace the
          // already-hydrated local campaign or be overwritten by autosave.
          markRemoteSaveBaseline(null);
          blockRemoteSaves();
          useGame.getState().setNotice(
            remote.error || "The account campaign could not be validated. Your device copy remains protected.",
          );
        }
      } catch {
        // The local campaign remains playable when the account save is unavailable.
        useGame.getState().setNotice(
          "The account campaign could not be checked. Your device copy remains available; account sync is pending.",
        );
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    return attachSnapshotAutosave(
      useGame,
      (state) => state.snapshot(),
      flushSave,
      400,
    );
  }, [ready]);

  useEffect(() => {
    void grokStatus().then((s) => setGrokLinked(s.linked)).catch(() => setGrokLinked(false));
  }, []);

  useEffect(() => {
    if (platformOpen) {
      setMobileTab("platform");
      if (isAudioUnlocked()) playSfx("power");
    }
  }, [platformOpen]);

  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      setMasterGain(volume, muted);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [muted, volume]);

  useEffect(() => {
    setMasterGain(volume, muted);
  }, [muted, volume]);

  useEffect(() => {
    if (muted) {
      setAmbient("off");
      return;
    }
    const loc = world.clock.floor.toLowerCase();
    if (loc.includes("latch") || loc.includes("throat")) setAmbient("latch");
    else if (loc.includes("hall")) setAmbient("hall");
    else setAmbient("chamber");
  }, [world.clock.floor, muted, platformOpen]);

  useEffect(() => {
    let active = true;
    const onSaveConflict = () => {
      blockRemoteSaves();
      useGame.getState().setReceiptPersistence("device-only");
      void (async () => {
        try {
          const remote = await loadSave();
          if (!active) return;
          if (!remote.ok) {
            useGame.getState().setNotice("A save conflict was detected, but the account campaign could not be read. Your device copy remains protected.");
            return;
          }
          setSaveConflict({
            payload: remote.payload,
            revision: remote.revision,
            updatedAt: remote.updatedAt,
            storage: remote.storage,
          });
          setHasServerSave(Boolean(remote.payload));
          useGame.getState().setNotice("Another device changed this campaign. Choose which copy to keep.");
        } catch {
          if (active) {
            useGame.getState().setNotice("A save conflict was detected, but the account campaign is temporarily unavailable. Your device copy remains protected.");
          }
        }
      })();
    };
    window.addEventListener("egunsentia:save-conflict", onSaveConflict);
    return () => {
      active = false;
      window.removeEventListener("egunsentia:save-conflict", onSaveConflict);
    };
  }, []);

  useEffect(() => {
    // Ask the browser to protect the local campaign from routine storage eviction.
    if (navigator.storage?.persist) void navigator.storage.persist().catch(() => false);
    // Retry account sync after reconnection and when a suspended tab is reopened.
    return attachSaveLifecycle(window, document, flushSave, () => navigator.onLine);
  }, []);

  useEffect(() => {
    if (interrupt === "critical" || interrupt === "emergency") {
      playSfx("alarm");
      try {
        navigator.vibrate?.([40, 80, 40]);
      } catch {
        /* no haptic */
      }
    }
  }, [interrupt]);

  const hour = Number.parseInt(world.clock.time.slice(0, 2), 10) || 7;
  const night = hour >= 22 || hour < 6;

  const loadAccountCopy = () => {
    if (!saveConflict?.payload) return;
    useGame.getState().loadSnapshot(saveConflict.payload);
    useGame.getState().setReceiptPersistence(receiptPersistenceFromStorage(saveConflict.payload.p4?.lastReceipt, saveConflict.storage));
    markRemoteSaveBaseline(useGame.getState().snapshot(), saveConflict.storage);
    useGame.getState().setRemoteRevision(saveConflict.revision);
    useGame.getState().setSavedAt(Date.now());
    useGame.getState().setNotice("The account campaign is now active on this device.");
    resumeRemoteSaves();
    setSaveConflict(null);
  };

  const keepDeviceCopy = () => {
    if (!saveConflict) return;
    markRemoteSaveBaseline(saveConflict.payload, saveConflict.storage);
    useGame.getState().setRemoteRevision(saveConflict.revision);
    useGame.getState().setNotice("Keeping this device's campaign. Uploading it as the account copy.");
    resumeRemoteSaves();
    setSaveConflict(null);
    void flushSave();
  };

  const onMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab !== "hall") {
      setDock(tab);
      if (tab === "platform") useGame.getState().openPlatform();
    } else {
      useGame.getState().closePlatform();
    }
  };

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg text-fg">
        <div className="flex flex-col items-center gap-3">
          <ClawMark className="size-10 text-accent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">{APP_NAME}</p>
        </div>
      </main>
    );
  }

  if (view === "title") {
    return (
      <>
        {saveConflict ? <SaveConflictBanner conflict={saveConflict} onLoadAccount={loadAccountCopy} onKeepLocal={keepDeviceCopy} /> : null}
        <TitleScreen
          android={android}
          grokLinked={grokLinked}
          onInstall={() => setInstallOpen(true)}
          hasServerSave={hasServerSave}
        />
        <InstallSheet open={installOpen} onClose={() => setInstallOpen(false)} android={android} />
        {android.notice ? <AppNotice text={android.notice} /> : null}
      </>
    );
  }

  const DockBody =
    dock === "cast" ? CastPanel : dock === "platform" ? PlatformDock : dock === "chronicle" ? ChroniclePanel : ThreadsPanel;
  const showHall = mobileTab === "hall";

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg pt-[env(safe-area-inset-top)]">
      {saveConflict ? <SaveConflictBanner conflict={saveConflict} onLoadAccount={loadAccountCopy} onKeepLocal={keepDeviceCopy} /> : null}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
        <ClawMark className="size-5 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-none">{APP_NAME}</p>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            {world.clock.weekday} {world.clock.date} · {world.clock.time} · {world.clock.floor}
          </p>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setDock(t.id);
                if (t.id === "platform") useGame.getState().openPlatform();
              }}
              className={cn(
                "rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-[background-color,color] duration-150",
                dock === t.id ? "bg-bg-subtle text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-lg p-2 text-fg-muted"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => {
            unlockAudio();
            useGame.getState().setMuted(!muted);
          }}
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        {android.standalone ? null : (
          <button
            type="button"
            className="rounded-lg p-2 text-fg-muted"
            aria-label="Install on Android"
            onClick={() => setInstallOpen(true)}
          >
            <Smartphone className="size-5" />
          </button>
        )}
        <button type="button" className="rounded-lg p-2 text-fg-muted" aria-label="Share app" onClick={() => void android.share()}>
          <Share2 className="size-5" />
        </button>
        <div className="hidden min-w-0 lg:block">
          <UserButton />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {night ? <div className="night-veil pointer-events-none absolute inset-0 z-10" /> : null}
        <section className={cn("flex min-w-0 flex-1 flex-col", !showHall && "hidden lg:flex")}>
          <div className="relative min-h-0 flex-1">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url(/art/chamber.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/92 to-bg" />
            <div className="relative h-full">
              <SceneView />
            </div>
          </div>
          <ActionBar />
        </section>

        <aside className="hidden w-[min(420px,42vw)] shrink-0 border-l border-line lg:block">
          <DockBody />
        </aside>

        <section className={cn("min-h-0 flex-1 lg:hidden", showHall && "hidden")}>
          <DockBody />
        </section>
      </div>

      <AndroidNav tab={mobileTab} onTab={onMobileTab} />
      <InstallSheet open={installOpen} onClose={() => setInstallOpen(false)} android={android} />
      <GameToasts />
      {android.notice ? <AppNotice text={android.notice} /> : null}
    </div>
  );
}

function AppNotice({ text }: { text: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[5.5rem] z-50 flex justify-center px-4 lg:bottom-8">
      <p className="rounded-full bg-bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg shadow-[var(--shadow-border)]">
        {text}
      </p>
    </div>
  );
}
