import { Share2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, type AndroidApp } from "@/lib/game/android";

export function InstallSheet({
  open,
  onClose,
  android,
}: {
  open: boolean;
  onClose: () => void;
  android: AndroidApp;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-bg/75"
        aria-label="Close install sheet"
        onClick={onClose}
      />
      <div className="relative mx-3 mb-[max(1rem,env(safe-area-inset-bottom))] w-full max-w-md rounded-[24px] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:mb-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Android app</p>
            <h2 className="font-display text-2xl font-semibold text-fg">{APP_NAME}</h2>
          </div>
          <button type="button" className="rounded-lg p-2 text-fg-muted" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          This is a standalone game. Install it on the home screen, then open it like any other Android app.
          AL narrates the Hall. Anyone you share the published link with can install and play.
        </p>

        <ol className="mt-5 space-y-3">
          {[
            "Open this page in Chrome on Android.",
            android.canNativeInstall
              ? "Tap Install below and confirm."
              : "Tap the Chrome menu, then Install app or Add to Home screen.",
            "Launch Egunsentia V15 from the home screen. No browser chrome.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-fg">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-subtle font-mono text-[11px] text-fg-muted">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-2">
          {android.canNativeInstall ? (
            <Button
              size="lg"
              className="min-h-12 w-full"
              onClick={() => {
                void android.install().then((result) => {
                  if (result.ok) onClose();
                });
              }}
            >
              <Smartphone className="size-4" />
              Install on this phone
            </Button>
          ) : null}
          <Button
            size="lg"
            variant={android.canNativeInstall ? "outline" : "default"}
            className="min-h-12 w-full"
            onClick={() => void android.share()}
          >
            <Share2 className="size-4" />
            Share the app
          </Button>
        </div>
      </div>
    </div>
  );
}
