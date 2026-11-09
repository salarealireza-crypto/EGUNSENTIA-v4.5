import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { ClawMark } from "@/components/game/ClawMark";
import { APP_NAME } from "@/lib/game/android";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <img src="/art/hall.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/40" />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
        <ClawMark className="mb-6 size-10 text-accent" />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg-muted">{APP_NAME}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-fg">Claim the Fist</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Each player keeps their own campaign. Sign in so the Hall remembers you across this browser, the
          installed app, and a shared link.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="min-h-12 w-full rounded-[12px] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-fg-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </main>
  );
}
