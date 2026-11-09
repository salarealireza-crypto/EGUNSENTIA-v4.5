import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CAST, FEATURED_CAST } from "@/lib/game/kernel";
import { useGame } from "@/lib/game/store";
import { availabilityLabel, castNow } from "@/lib/game/presence";
import { cleanName, type NpcNow } from "@/lib/game/sim/npc";
import { submitAction } from "@/lib/game/play";
import type { CastCard } from "@/lib/game/types";

function CardBlock({ card, presence }: { card: CastCard; presence?: NpcNow }) {
  return (
    <article className="rounded-[16px] bg-bg p-4 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-center gap-2"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">{card.group}</p>{card.loreStatus ? <span className="rounded border border-amber-500/30 px-2 py-0.5 text-[9px] uppercase text-amber-200">{card.loreStatus.replaceAll("_", " ")}</span> : null}{card.householdTier ? <span className="text-[9px] uppercase text-fg-subtle">Tier {card.householdTier}</span> : null}</div>
      <h3 className="font-display text-lg font-semibold text-fg">
        {card.name}
        {card.age ? <span className="ml-2 text-sm font-normal text-fg-muted">{card.age}</span> : null}
      </h3>
      <p className="text-sm text-fg-muted">{card.role}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase">
        <span className={presence?.available ? "rounded border border-emerald-500/30 px-2 py-1 text-emerald-300" : "rounded border border-amber-500/30 px-2 py-1 text-amber-200"}>
          {presence ? availabilityLabel(presence) : "availability not in live roster"}
        </span>
        {presence ? <span className="text-fg-subtle">{presence.place} · {presence.activity}</span> : null}
      </div>
      {card.look ? <p className="mt-3 text-sm leading-relaxed text-fg">{card.look}</p> : null}
      {card.voice ? <p className="mt-2 text-sm italic text-fg-muted">{card.voice}</p> : null}
      {card.relationships ? <div className="mt-3 rounded-lg border border-line/70 bg-bg-elevated/70 p-3"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg-subtle">Recorded relationships</p><p className="mt-1 text-xs leading-relaxed text-fg-muted">{card.relationships}</p></div> : null}
      {card.day ? (
        <p className="mt-2 font-mono text-[11px] text-fg-subtle">Day · {card.day}</p>
      ) : null}
      <button
        type="button"
        className="mt-3 text-xs text-accent-soft underline-offset-4 hover:underline"
        onClick={() => void submitAction(`I look for ${card.name} and speak with them.`)}
      >
        Seek them out
      </button>
    </article>
  );
}

export function CastPanel() {
  const [q, setQ] = useState("");
  const p4 = useGame((s) => s.p4);
  const world = useGame((s) => s.world);
  const presence = useMemo(() => {
    const byName = new Map<string, NpcNow>();
    for (const row of castNow(p4, world.dayIndex, world.clock.time)) byName.set(cleanName(row.name), row);
    return byName;
  }, [p4, world.dayIndex, world.clock.time]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FEATURED_CAST;
    return CAST.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.role.toLowerCase().includes(s) ||
        c.look.toLowerCase().includes(s) ||
        (c.relationships ?? "").toLowerCase().includes(s),
    ).slice(0, 16);
  }, [q]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-elevated">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Part 4.5</p>
        <h2 className="font-display text-xl font-semibold">Cast</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the household"
          className="mt-3 h-10 w-full rounded-[10px] bg-bg px-3 text-sm text-fg outline-none shadow-[var(--shadow-border)] placeholder:text-fg-subtle"
        />
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-3 p-4">
          {list.map((c) => (
            <CardBlock key={c.name} card={c} presence={presence.get(cleanName(c.name))} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
