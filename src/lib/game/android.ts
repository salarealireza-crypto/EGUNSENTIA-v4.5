import { useCallback, useEffect, useState } from "react";

export const APP_NAME = "Egunsentia V4.5 Demo";
export const APP_TAGLINE = "The Fist of the Red Claws";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const ios = "standalone" in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone);
  return Boolean(media || ios);
}

export function appShareUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/`;
}

export function useAndroidApp() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setStandalone(true);
      setNotice("Installed on this device.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const media = window.matchMedia?.("(display-mode: standalone)");
    const onMedia = () => setStandalone(isStandaloneDisplay());
    media?.addEventListener?.("change", onMedia);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media?.removeEventListener?.("change", onMedia);
    };
  }, []);

  const flash = useCallback((text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 2600);
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return { ok: false as const, reason: "manual" as const };
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === "accepted") {
      setStandalone(true);
      flash("Installed on this device.");
      return { ok: true as const };
    }
    return { ok: false as const, reason: "dismissed" as const };
  }, [flash, installEvent]);

  const share = useCallback(async () => {
    const url = appShareUrl();
    const payload = {
      title: APP_NAME,
      text: `${APP_NAME} — ${APP_TAGLINE}. A standalone roleplay game. Install it, then play as Christian Red IV. The world is run by AL.`,
      url,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("App link copied.");
    } catch {
      flash(url);
    }
  }, [flash]);

  return {
    canNativeInstall: Boolean(installEvent) && !standalone,
    standalone,
    notice,
    flash,
    install,
    share,
  };
}

export type AndroidApp = ReturnType<typeof useAndroidApp>;
