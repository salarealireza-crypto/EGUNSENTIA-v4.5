import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { ClawMark } from "@/components/game/ClawMark";
import { APP_NAME } from "@/lib/game/android";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({
              email: normalizedEmail,
              password,
              name: name.trim() || normalizedEmail.split("@")[0] || "Owner",
            })
          : await authClient.signIn.email({
              email: normalizedEmail,
              password,
            });

      if (result.error) {
        throw new Error(result.error.message || "Authentication failed.");
      }

      // Reload the app so server-side loaders receive the new session cookie.
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <img src="/art/hall.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/40" />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
        <ClawMark className="mb-6 size-10 text-accent" />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg-muted">{APP_NAME}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-fg">Claim the Fist</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Sign in with the owner email associated with this Vercel installation. Your campaign and saves
          remain tied to that account.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur">
          {!authEnabled ? (
            <p className="text-sm text-fg-muted">Sign-in is not enabled for this deployment.</p>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/10 p-1">
                <button
                  type="button"
                  aria-pressed={mode === "sign-in"}
                  onClick={() => { setMode("sign-in"); setError(null); }}
                  className={`rounded-lg px-3 py-2 text-sm transition ${mode === "sign-in" ? "bg-primary text-primary-foreground" : "text-fg-muted hover:text-fg"}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "sign-up"}
                  onClick={() => { setMode("sign-up"); setError(null); }}
                  className={`rounded-lg px-3 py-2 text-sm transition ${mode === "sign-up" ? "bg-primary text-primary-foreground" : "text-fg-muted hover:text-fg"}`}
                >
                  Create account
                </button>
              </div>

              <form className="flex flex-col gap-4" onSubmit={(event) => void submit(event)}>
                {mode === "sign-up" && (
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-fg-muted">Name</span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="min-h-12 rounded-xl border border-white/15 bg-black/30 px-3 text-fg outline-none transition focus:border-accent"
                    />
                  </label>
                )}

                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-fg-muted">Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="The email linked to Vercel"
                    className="min-h-12 rounded-xl border border-white/15 bg-black/30 px-3 text-fg outline-none transition focus:border-accent"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-fg-muted">
                    Password{mode === "sign-up" ? " (at least 8 characters)" : ""}
                  </span>
                  <input
                    type="password"
                    autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="min-h-12 rounded-xl border border-white/15 bg-black/30 px-3 text-fg outline-none transition focus:border-accent"
                  />
                </label>

                {error && (
                  <p role="alert" className="rounded-lg border border-red-400/30 bg-red-950/40 p-3 text-sm text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                >
                  {busy ? "Working…" : mode === "sign-up" ? "Create owner account" : "Enter the Hall"}
                </button>
              </form>
              <p className="mt-4 text-center text-xs leading-relaxed text-fg-muted">
                Access is limited by the server-side owner allowlist. Use the same email address you use for Vercel.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
