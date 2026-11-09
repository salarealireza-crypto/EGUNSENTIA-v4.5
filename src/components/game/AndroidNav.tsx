import { BookOpen, GitBranch, Landmark, LayoutGrid, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DockTab } from "@/lib/game/types";

export type MobileTab = "hall" | DockTab;

const ITEMS: { id: MobileTab; label: string; icon: typeof Landmark }[] = [
  { id: "hall", label: "Hall", icon: Landmark },
  { id: "platform", label: "Platform", icon: LayoutGrid },
  { id: "cast", label: "Cast", icon: Users },
  { id: "threads", label: "Threads", icon: GitBranch },
  { id: "chronicle", label: "Chronicle", icon: BookOpen },
];

export function AndroidNav({
  tab,
  onTab,
}: {
  tab: MobileTab;
  onTab: (tab: MobileTab) => void;
}) {
  return (
    <nav
      className="grid shrink-0 grid-cols-5 border-t border-line bg-bg-elevated pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 lg:hidden"
      aria-label="App sections"
    >
      {ITEMS.map((item) => {
        const active = tab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTab(item.id)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 text-[9px] uppercase tracking-[0.1em]",
              active ? "text-fg" : "text-fg-subtle",
            )}
          >
            <Icon className={cn("size-5", active ? "text-accent-soft" : "text-fg-subtle")} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
