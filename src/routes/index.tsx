import { createFileRoute } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GameShell } from "@/components/game/GameShell";
import { ClawMark } from "@/components/game/ClawMark";
import { APP_NAME } from "@/lib/game/android";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg text-fg">
        <div className="flex flex-col items-center gap-3">
          <ClawMark className="size-10 text-accent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">{APP_NAME}</p>
          <p className="h-4 w-40 animate-pulse rounded bg-bg-subtle" />
        </div>
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <GameShell />;
}
