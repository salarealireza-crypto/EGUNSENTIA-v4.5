import { useMemo, useState, type ReactNode } from "react";
import { ATLAS, FACTION_COLORS } from "@/lib/game/v41-data";
import { submitAction } from "@/lib/game/play";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { IndustrialViz } from "./IndustrialViz";
import type { GateVisual, VaultItem } from "@/lib/game/types";

function Card({ children }: { children: ReactNode }) {
  return <article className="term-card">{children}</article>;
}

function VaultCard({ item }: { item: VaultItem }) {
  return (
    <Card>
      <p className="text-[10px] uppercase tracking-[0.16em] text-term-dim">
        {item.id} · {item.category} · {item.secrecy}
      </p>
      <p className="mt-1 text-sm text-term">{item.name}</p>
      <p className="mt-1 text-[11px] text-term-dim">
        {item.location} · {item.condition} · rad {item.radiation} · ×{item.quantity}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-term">
        Origin {item.provenance.origin}. Acquired {item.provenance.acquisition}. Now {item.use}.
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {["Keep", "Technology", "Trade", "Investigate"].map((a) => (
          <button
            key={a}
            type="button"
            className="min-h-10 px-2 text-[10px] uppercase tracking-[0.12em]"
            onClick={() => void submitAction(`Vault disposition ${item.id}: ${a}. ${item.name}.`)}
          >
            {a}
          </button>
        ))}
      </div>
    </Card>
  );
}

export function V41PanelBody({ panel }: { panel: string }) {
  const household = useGame((s) => s.household);
  const chooseEvening = useGame((s) => s.chooseEvening);
  const personalVault = useGame((s) => s.personalVault);
  const factionVault = useGame((s) => s.factionVault);
  const gates = useGame((s) => s.gates);
  const trades = useGame((s) => s.trades);
  const radio = useGame((s) => s.radio);
  const radioFreq = useGame((s) => s.radioFreq);
  const setRadioFreq = useGame((s) => s.setRadioFreq);
  const films = useGame((s) => s.films);
  const tonightFilm = useGame((s) => s.tonightFilm);
  const setTonightFilm = useGame((s) => s.setTonightFilm);
  const events = useGame((s) => s.events);
  const intel = useGame((s) => s.intel);
  const finds = useGame((s) => s.finds);
  const reputations = useGame((s) => s.reputations);
  const children = useGame((s) => s.children);
  const lastDigest = useGame((s) => s.lastDigest);
  const memories = useGame((s) => s.memories);
  const [atlasQ, setAtlasQ] = useState("");
  const [atlasDomain, setAtlasDomain] = useState("ALL");

  const tuned = useMemo(() => {
    return [...radio].sort(
      (a, b) => Math.abs(a.frequency - radioFreq) - Math.abs(b.frequency - radioFreq),
    )[0];
  }, [radio, radioFreq]);

  const atlasHits = useMemo(() => {
    const q = atlasQ.toLowerCase();
    return ATLAS.filter((e) => {
      if (atlasDomain !== "ALL" && e.domain !== atlasDomain) return false;
      if (!q) return true;
      return `${e.title} ${e.summary}`.toLowerCase().includes(q);
    });
  }, [atlasQ, atlasDomain]);

  if (panel === "08") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Household affection · reports only · does not speak for the Fist
        </p>
        {household.map((h) => (
          <Card key={h.name}>
            <div className="flex items-start gap-3">
              <span
                className="mt-1 inline-block size-10 shrink-0 rounded-sm"
                style={{ background: h.portraitHue }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-term">{h.name}</p>
                <p className="text-[11px] text-term-dim">{h.title}</p>
                <p className="mt-1 text-[11px]">
                  Mood {h.mood} · {h.relation} · misses {h.misses} · trend {h.trend}
                </p>
                <p className="mt-1 text-[11px] text-term-dim">Last: {h.lastInteraction}</p>
                <p className="mt-1 text-sm leading-relaxed">Concern: {h.concern}</p>
                {h.request ? <p className="mt-1 text-sm">Request: {h.request}</p> : null}
                <p className="mt-1 text-[11px] text-term-dim">Tonight: {h.tonight}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">
                  {h.chosenEvening ? "Scheduled with the Fist this evening" : "Not the chosen evening"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="min-h-10 px-2 text-[10px] uppercase"
                    onClick={() => {
                      chooseEvening(h.name);
                      void submitAction(`Tonight's household schedule: remain available for ${h.name}. Do not invent my words.`);
                    }}
                  >
                    Choose evening
                  </button>
                  <button
                    type="button"
                    className="min-h-10 px-2 text-[10px] uppercase"
                    onClick={() => void submitAction(`Seek ordinary conversation with ${h.name}.`)}
                  >
                    Go to her
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "09") {
    return (
      <div className="space-y-3">
        <IndustrialViz mode="vault" accent="#f0b429" />
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">Personal vault · House lock</p>
        {personalVault.map((v) => (
          <VaultCard key={v.id} item={v} />
        ))}
      </div>
    );
  }

  if (panel === "10") {
    return (
      <div className="space-y-3">
        <IndustrialViz mode="vault" accent="#f5d76e" />
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">Faction vault · provenance bound</p>
        {factionVault.map((v) => (
          <VaultCard key={v.id} item={v} />
        ))}
      </div>
    );
  }

  if (panel === "11") {
    const domains = ["ALL", ...Array.from(new Set(ATLAS.map((e) => e.domain)))];
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">Living archive · rumor is not canon</p>
        <input
          value={atlasQ}
          onChange={(e) => setAtlasQ(e.target.value)}
          placeholder="Search atlas…"
          className="min-h-11 w-full bg-term-bg px-2 text-sm text-term outline-none"
        />
        <div className="flex flex-wrap gap-1">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              className={cn("min-h-9 px-2 text-[10px] uppercase", atlasDomain === d && "bg-term text-term-bg")}
              onClick={() => setAtlasDomain(d)}
            >
              {d}
            </button>
          ))}
        </div>
        {atlasHits.map((e) => (
          <Card key={e.id}>
            <p className="text-[10px] uppercase tracking-[0.16em] text-term-dim">
              {e.domain} · {e.state}
            </p>
            <p className="mt-1 text-sm">{e.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-term">{e.summary}</p>
            <p className="mt-1 text-[10px] text-term-dim">{e.evidence}</p>
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "13") {
    return (
      <div className="space-y-3">
        <IndustrialViz mode="radio" accent="#3ee07a" />
        <p className="text-[11px] uppercase tracking-[0.14em] text-term-dim">
          Tuner {radioFreq.toFixed(1)} · {tuned?.name} ({tuned?.faction})
        </p>
        <input
          type="range"
          min={86}
          max={110}
          step={0.1}
          value={radioFreq}
          onChange={(e) => setRadioFreq(Number(e.target.value))}
          className="w-full"
          aria-label="Radio frequency"
        />
        <div className="flex flex-wrap gap-1">
          {radio.map((s) => (
            <button
              key={s.id}
              type="button"
              className={cn(
                "min-h-10 px-2 text-[10px] uppercase tracking-[0.12em]",
                Math.abs(s.frequency - radioFreq) < 0.15 && "bg-term text-term-bg",
              )}
              style={{ color: FACTION_COLORS[s.faction] }}
              onClick={() => setRadioFreq(s.frequency)}
            >
              {s.frequency} {s.name}
            </button>
          ))}
        </div>
        {tuned ? (
          <Card>
            <p className="text-[10px] uppercase tracking-[0.16em]">{tuned.identity}</p>
            <p className="mt-2 text-sm">{tuned.nowPlaying}</p>
            <p className="mt-1 text-[11px] text-term-dim">
              Signal {tuned.signal}/10 · A broadcast is not proof.
            </p>
            {tuned.id === "sixth" ? (
              <p className="mt-2 text-[11px]">
                After midnight a repeating tone. Owner unknown. Mystery 5 clue — not a station.
              </p>
            ) : null}
          </Card>
        ) : null}
      </div>
    );
  }

  if (panel === "14") {
    const current = films.find((f) => f.id === tonightFilm);
    return (
      <div className="space-y-3">
        <IndustrialViz mode="projector" accent="#c084fc" />
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Night entertainment · films are relics
        </p>
        {current ? (
          <Card>
            <p className="text-[10px] uppercase">Tonight · {current.genre}</p>
            <p className="mt-1 text-sm">{current.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed">{current.summary}</p>
          </Card>
        ) : (
          <p className="text-[11px] text-term-dim">No film chosen.</p>
        )}
        {films.map((f) => (
          <Card key={f.id}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">
              {f.genre} · {f.era} · {f.known ? "known" : "not yet identified"}
            </p>
            <p className="mt-1 text-sm">{f.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed">{f.summary}</p>
            <p className="mt-1 text-[11px] text-term-dim">{f.provenance}</p>
            {f.reactions ? <p className="mt-1 text-[11px]">{f.reactions}</p> : null}
            {f.known ? (
              <button
                type="button"
                className="mt-2 min-h-10 text-[10px] uppercase"
                onClick={() => {
                  setTonightFilm(f.id);
                  void submitAction(`Projector night: the household may watch ${f.title}. Do not invent my reaction.`);
                }}
              >
                Play tonight
              </button>
            ) : (
              <p className="mt-2 text-[10px] uppercase text-term-dim">Held until identification</p>
            )}
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "18") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Four gates · visual bound to state
        </p>
        {gates.map((g) => (
          <Card key={g.id}>
            <IndustrialViz mode="gate" gateState={g.visual as GateVisual} accent={g.visual === "normal" ? "#2dd4bf" : "#ff5a4e"} />
            <p className="mt-2 text-sm">
              {g.name} · {g.visual.toUpperCase()}
            </p>
            <p className="text-[11px] text-term-dim">{g.purpose}</p>
            <p className="mt-1 text-[11px]">
              {g.commander} · {g.shift} · threat {g.threat}
            </p>
            <p className="text-[11px]">Traffic: {g.traffic}</p>
            <p className="text-[11px]">Ammo {g.ammo} · {g.restriction}</p>
            {g.incident ? <p className="mt-1 text-sm">{g.incident}</p> : null}
            <div className="mt-2 flex flex-wrap gap-1">
              {["Inspect", "Restrict traffic", "Reinforce"].map((a) => (
                <button
                  key={a}
                  type="button"
                  className="min-h-10 px-2 text-[10px] uppercase"
                  onClick={() => void submitAction(`Border command ${g.name}: ${a}.`)}
                >
                  {a}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "19") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">Event ledger · confirmed causality</p>
        {events.map((e) => (
          <Card key={e.id}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">
              {e.id} · {e.type} · {e.knowledge}
            </p>
            <p className="mt-1 text-[11px] text-term-dim">
              {e.date} {e.time} · {e.location}
            </p>
            <p className="mt-1 text-sm">{e.immediate}</p>
            <p className="mt-1 text-[11px]">Cause: {e.cause}</p>
            <p className="text-[11px] text-term-dim">{e.actors.join(", ")}</p>
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "20") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Black layer · existence known to the Fist and Elara only · name reserved
        </p>
        {intel.map((r) => (
          <Card key={r.id}>
            <p className="text-[10px] uppercase tracking-[0.14em]">
              {r.id} · {r.confidence} · {r.sourceType}
            </p>
            <p className="mt-1 text-sm">{r.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed">FACT: {r.fact}</p>
            <p className="mt-1 text-[11px] text-term-dim">Corroboration: {r.corroboration}</p>
            <p className="text-[11px] text-term-dim">Contradiction: {r.contradiction}</p>
            <p className="mt-1 text-[12px]">Interpretation: {r.interpretation}</p>
            <p className="mt-1 text-[10px] uppercase text-term-dim">Watch {r.watch} · not public news</p>
          </Card>
        ))}
        <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">Recent memories (NPC-local)</p>
        {memories.slice(0, 6).map((m) => (
          <p key={m.npc + m.date} className="text-[11px] text-term-dim">
            {m.npc}: {m.event}
          </p>
        ))}
      </div>
    );
  }

  if (panel === "21") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">Foreign trade · no magic markets</p>
        {trades.map((t) => (
          <Card key={t.id}>
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: FACTION_COLORS[t.faction] }}>
              {t.faction} · {t.status}
            </p>
            <p className="mt-1 text-sm">
              {t.representative}, {t.position}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed">{t.request}</p>
            <p className="mt-1 text-[11px]">Offers {t.offered}</p>
            <p className="text-[11px]">Wants {t.wanted}</p>
            <p className="text-[11px] text-term-dim">
              {t.terms} · {t.relation}
            </p>
            <p className="mt-1 text-[11px]">Risk: {t.risk}</p>
            <p className="text-[11px] text-term-dim">Deadline {t.deadline}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {["Accept", "Reject", "Counteroffer", "Request clarification", "Defer"].map((a) => (
                <button
                  key={a}
                  type="button"
                  className="min-h-10 px-2 text-[10px] uppercase"
                  onClick={() => void submitAction(`Foreign trade ${t.id}: ${a}. ${t.request}`)}
                >
                  {a}
                </button>
              ))}
            </div>
          </Card>
        ))}
        <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">Reputation (per audience)</p>
        {reputations.map((r) => (
          <p key={r.audience + r.name} className="text-[11px]">
            {r.audience}: {r.standing}/10 — {r.note}
          </p>
        ))}
      </div>
    );
  }

  if (panel === "22") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Relic bay · weekly cycle · cleansing before the Fist
        </p>
        {finds.map((f) => (
          <Card key={f.id}>
            <p className="text-sm">{f.name}</p>
            <p className="text-[11px] text-term-dim">
              {f.condition} · rad {f.radiation} · {f.queue} · {f.foundBy}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {["Personal vault", "Faction vault", "Technology", "Trade", "Further investigation"].map((a) => (
                <button
                  key={a}
                  type="button"
                  className="min-h-10 px-2 text-[10px] uppercase"
                  onClick={() => void submitAction(`Relic ${f.id} disposition: ${a}.`)}
                >
                  {a}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (panel === "24") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-term-dim">
          Long-horizon time · simulation, not a rewritten world
        </p>
        <p className="text-[12px] leading-relaxed">
          The world continues through work, watches, meals and maintenance. Hard interrupts stop the skip. The Fist's
          speech is never invented.
        </p>
        <div className="flex flex-wrap gap-1">
          {[
            ["1 day", "Advance 1 day"],
            ["1 week", "Advance 1 week"],
            ["1 month", "Advance 1 month"],
            ["6 months", "Advance 6 months"],
            ["1 year", "Advance 1 year"],
          ].map(([label, cmd]) => (
            <button
              key={label}
              type="button"
              className="min-h-11 bg-term px-3 text-[10px] uppercase tracking-[0.12em] text-term-bg"
              onClick={() => void submitAction(cmd)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-term-dim">Children (age with years, not scenes)</p>
        {children.map((c) => (
          <p key={c.id} className="text-[11px]">
            {c.name} · {c.ageYears} · {c.mother} · {c.status}
          </p>
        ))}
        {lastDigest ? (
          <Card>
            <p className="text-[10px] uppercase">Last skip</p>
            <p className="mt-1 text-sm">{lastDigest.elapsed}</p>
            <ul className="mt-2 list-disc pl-4 text-[11px]">
              {lastDigest.major.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {lastDigest.interrupt ? <p className="mt-2 text-sm">Stopped: {lastDigest.interrupt}</p> : null}
          </Card>
        ) : null}
      </div>
    );
  }

  return null;
}
