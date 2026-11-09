import { useEffect, useMemo, useState } from "react";
import { Bookmark, ChevronRight, Search, X } from "lucide-react";
import { useGame } from "@/lib/game/store";
import { flushSave } from "@/lib/game/play";
import { receiptFingerprint as getReceiptFingerprint } from "@/lib/game/receipt-persistence.mjs";
import { castAbsentees } from "@/lib/game/presence";
import {
  attentionForPanel,
  attentionForWing,
  buildDeskQueue,
  buildLooked,
  crisisPanel,
  crisisTouches,
  deskGaugeKeys,
  deskStatusLine,
  pulseReadings,
  readingsFor,
  type DeskItem,
  type HomeSnapshot,
} from "@/lib/platform/home";
import { WING_PLACE, type Archetype } from "@/lib/platform/desks";
import { isLow } from "@/lib/platform/gauges";
import { PANEL_BY_ID, PANEL_REGISTRY, WING_ADVISORS, WINGS, type Wing } from "@/lib/platform/registry";
import { optionsForPanel } from "@/lib/platform/options/lookup";
import { lockReason } from "@/lib/platform/options/execute";
import type { RichOption } from "@/lib/platform/options/effects";
import { Chip } from "@/components/platform/Chip";
import { Cutaway } from "@/components/platform/Cutaway";
import { DeskShell } from "@/components/platform/DeskShell";
import { PulseRow, OnYourDesk, SinceLooked } from "@/components/platform/HomeSections";
import { Receipt } from "@/components/platform/Receipt";
import { Slip, SlipStack } from "@/components/platform/Slip";
import { Stamp } from "@/components/platform/Stamp";
import { VoiceLine } from "@/components/platform/VoiceLine";
import { WingRoom } from "@/components/platform/WingRoom";
import { V45PanelBody } from "./V45PanelBody";

const FAVORITES_KEY = "egunsentia.platform.favorites";

type Screen = "home" | "wing" | "desk";

type ConfirmOrder = { id: string; title: string } | null;

export function CommandDeck() {
  const panelId = useGame((s) => s.panel);
  const setPanel = useGame((s) => s.setPanel);
  const platformOpen = useGame((s) => s.platformOpen);
  const world = useGame((s) => s.world);
  const p4 = useGame((s) => s.p4);
  const receiptPersistence = useGame((s) => s.receiptPersistence);
  const inbox = useGame((s) => s.inbox);
  const chronicle = useGame((s) => s.chronicle);
  const news = useGame((s) => s.news);
  const executeV45Option = useGame((s) => s.executeV45Option);
  const advanceHours = useGame((s) => s.advanceHours);
  const advanceUntil = useGame((s) => s.advanceUntil);
  const notice = useGame((s) => s.notice);

  const [wing, setWing] = useState<Wing>("COMMAND");
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmOrder>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [seenGauges, setSeenGauges] = useState<string[]>([]);
  const [focusItem, setFocusItem] = useState<DeskItem | null>(null);
  const [justOrdered, setJustOrdered] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const receiptKey = useMemo(() => getReceiptFingerprint(p4.lastReceipt), [p4.lastReceipt]);

  useEffect(() => {
    setReceiptOpen(Boolean(receiptKey) && p4.lastReceipt?.optionId !== "24-OPT-02");
  }, [receiptKey, p4.lastReceipt?.optionId]);
  const [activeDeskView, setActiveDeskView] = useState<string>("Today");

  const panel = PANEL_BY_ID[panelId] ?? PANEL_REGISTRY[0];

  useEffect(() => {
    setActiveDeskView("Today");
  }, [panel]);

  const snap: HomeSnapshot = useMemo(() => {
    const absentees = castAbsentees(p4, world.dayIndex, world.clock.time);
    const economy = p4.economy ?? {};
    return {
      water: world.water,
      food: world.food,
      energy: world.energy,
      treasuryMarks: world.treasury.marks,
      order: world.indices.Order ?? 0,
      morale: world.indices.Morale ?? 0,
      gaugeShift: p4.gaugeShift ?? {},
      crisis: p4.crisis?.active ? p4.crisis : null,
      letters: (p4.letters ?? []).map((e) => ({
        id: e.id,
        sender: e.sender,
        seal: e.seal,
        verified: e.verified,
      })),
      inboxOpen: inbox.filter((e) => e.status === "open").map((e) => ({
        id: e.id,
        from: e.from,
        urgency: e.urgency,
      })),
      absentees: absentees.map((e) => ({ name: e.name })),
      planner: p4.planner.map((e) => ({
        id: e.id,
        time: e.time,
        label: e.label,
        status: e.status,
      })),
      clockTime: world.clock.time,
      queue: (p4.queue ?? []).map((e) => ({
        id: e.id,
        dueDay: e.dueDay,
        label: e.label,
        becauseOf: e.becauseOf,
      })),
      day: p4.now?.day ?? world.dayIndex,
      rumors: p4.rumors ?? [],
      bottlenecks: Object.entries(economy)
        .filter(([, t]) => {
          const row = t as { stock?: number; demand?: number };
          return typeof row?.stock === "number" && typeof row?.demand === "number" && row.stock <= 0 && row.demand > 0;
        })
        .map(([key]) => key),
      chronicle: chronicle.map((e) => ({ id: e.id, line: e.line })),
      news: news.map((e) => ({ id: e.id, body: e.body, source: e.source })),
    };
  }, [p4, world, inbox, chronicle, news]);

  const readings = useMemo(() => pulseReadings(snap), [snap]);
  const deskItems = useMemo(() => buildDeskQueue(snap), [snap]);
  const lookLines = useMemo(() => buildLooked(snap), [snap]);
  const attention = useMemo(() => {
    const out = {} as Record<Wing, number>;
    for (const w of Object.keys(WINGS) as Wing[]) {
      out[w] = attentionForWing(snap, w, WINGS[w]);
    }
    return out;
  }, [snap]);
  const crisisWings = useMemo(
    () => (Object.keys(WINGS) as Wing[]).filter((w) => !!snap.crisis?.active && crisisTouches(snap.crisis?.kind, w)),
    [snap],
  );
  const voiceInput = useMemo(
    () => ({
      crisis: !!snap.crisis?.active,
      lowGauge: readings.some((r) => isLow(r.word)),
      pending: deskItems.length > 0,
      justOrdered,
    }),
    [snap.crisis, readings, deskItems.length, justOrdered],
  );
  const unseen = readings.filter((r) => r.arrow !== "flat" && !seenGauges.includes(r.key)).map((r) => r.key);
  const paletteRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? PANEL_REGISTRY.filter((p) =>
          `${p.id} ${p.title} ${p.wing} ${p.place ?? ""}`.toLowerCase().includes(q),
        )
      : PANEL_REGISTRY.slice(0, 16);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setConfirm(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  if (!platformOpen) return null;

  const openWing = (w: Wing) => {
    setWing(w);
    setScreen("wing");
    setJustOrdered(false);
    setReceiptOpen(false);
  };

  const openDesk = (id: string, focus?: DeskItem | null) => {
    const p = PANEL_BY_ID[id];
    if (!p) return;
    setPanel(id);
    setWing(p.wing);
    setFocusItem(focus ?? null);
    setScreen("desk");
    setJustOrdered(false);
    setReceiptOpen(false);
    setActiveDeskView("Today");
    setPaletteOpen(false);
  };

  const runOrder = async (id: string) => {
    const before = useGame.getState();
    const beforeTurnCount = before.turnCount;
    executeV45Option(id);
    const applied = useGame.getState();
    const receipt = applied.p4.lastReceipt;
    if (applied.turnCount === beforeTurnCount || receipt?.optionId !== id) {
      setJustOrdered(false);
      setReceiptOpen(false);
      return;
    }

    setJustOrdered(true);
    setReceiptOpen(false);
    useGame.getState().setReceiptPersistence("pending");
    applied.setNotice("Order applied locally. Waiting for account-save confirmation.");
    const outcome = await flushSave();
    if (outcome.status === "committed") {
      useGame.getState().setReceiptPersistence("account-committed");
      useGame.getState().setNotice("Order committed to persistent account storage.");
    } else if (outcome.status === "ephemeral" || (outcome.status === "unchanged" && outcome.storage === "ephemeral")) {
      useGame.getState().setReceiptPersistence("ephemeral");
      useGame.getState().setNotice("Order saved in the local preview database only; it will not survive a server restart.");
    } else {
      useGame.getState().setReceiptPersistence("device-only");
      if (outcome.status === "superseded") {
        useGame.getState().setNotice("A newer campaign snapshot superseded this save attempt. Account persistence is not yet confirmed.");
      } else if (outcome.status === "unchanged" && outcome.storage === "persistent") {
        useGame.getState().setReceiptPersistence("account-committed");
        useGame.getState().setNotice("Order is already present in the persistent account save.");
      } else if (outcome.status === "blocked") {
        useGame.getState().setNotice("The account save is blocked or a version conflict remains unresolved. The device copy remains available; no persistent confirmation was recorded.");
      } else if (outcome.status === "failed" || (outcome.status === "unchanged" && outcome.storage === null)) {
        useGame.getState().setNotice("The order remains on this device, but account persistence could not be confirmed. Check the save status before relying on it.");
      }
    }
    setReceiptOpen(true);
  };

  const severity =
    snap.crisis?.severity === "emergency" || snap.crisis?.severity === "critical"
      ? "critical"
      : snap.crisis?.severity === "important"
        ? "important"
        : "normal";

  const archetype = (panel.archetype ?? "SYSTEM") as Archetype;
  const deskWing = archetype === "SYSTEM" ? "SYSTEM" : panel.wing;
  const place = panel.place ?? WING_PLACE[panel.wing]?.place ?? "Desk";

  return (
    <div className="platform-app flex h-full min-h-0 flex-col">
      {snap.crisis?.active ? (
        <button
          type="button"
          className={`crisis-banner is-${severity}`}
          onClick={() => openDesk(crisisPanel(snap.crisis?.kind))}
        >
          <span>{snap.crisis.title}</span>
          <span>{snap.crisis.deadlineHours} hours left</span>
        </button>
      ) : null}

      <div className="platform-tools">
        <button type="button" className="search-hit" onClick={() => setPaletteOpen(true)}>
          <Search className="size-5" aria-hidden />
          <span>Search panels</span>
          <span className="search-key">/</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {screen === "home" ? (
          <div className="home-pad">
            <PulseRow
              readings={readings}
              unseen={unseen}
              onLook={(key) => setSeenGauges((prev) => (prev.includes(key) ? prev : prev.concat(key)))}
            />
            <VoiceLine advisorId={WING_ADVISORS.COMMAND} input={voiceInput} />
            <Cutaway attention={attention} crisisWings={crisisWings} onOpen={openWing} />
            <OnYourDesk items={deskItems} onOpen={(item) => openDesk(item.panelId, item)} />
            <SinceLooked lines={lookLines} />
            {favorites.length ? (
              <section className="home-block" aria-label="Marked desks">
                <h2 className="section-kicker">Marked desks</h2>
                <SlipStack>
                  {favorites.map((id) => {
                    const p = PANEL_BY_ID[id];
                    if (!p) return null;
                    return (
                      <Slip
                        key={id}
                        icon={p.icon}
                        title={p.title}
                        status={deskStatusLine(p.id, snap)}
                        onClick={() => openDesk(p.id)}
                      />
                    );
                  })}
                </SlipStack>
              </section>
            ) : null}
          </div>
        ) : null}

        {screen === "wing" ? (
          <WingRoom
            wing={wing}
            place={WING_PLACE[wing].place}
            mood={WING_PLACE[wing].mood}
            advisorId={WING_ADVISORS[wing]}
            voice={voiceInput}
            onBack={() => setScreen("home")}
            onOpen={(id) => openDesk(id)}
            desks={WINGS[wing].map((id) => {
              const p = PANEL_BY_ID[id];
              const isSystem = p.archetype === "SYSTEM";
              return {
                id: p.id,
                title: p.title,
                icon: p.icon,
                status: deskStatusLine(p.id, snap),
                badge: attentionForPanel(snap, p.id),
                wing: isSystem ? "SYSTEM" : p.wing,
              };
            })}
          />
        ) : null}

        {screen === "desk" ? (
          <DeskShell
            wing={deskWing}
            place={place}
            title={panel.title}
            advisorId={panel.advisorId}
            voice={voiceInput}
            gauges={readingsFor(snap, deskGaugeKeys(panel.id, archetype))}
            unseen={unseen}
            onLook={(key) => setSeenGauges((prev) => (prev.includes(key) ? prev : prev.concat(key)))}
            favorite={favorites.includes(panel.id)}
            onFavorite={() =>
              setFavorites((prev) =>
                prev.includes(panel.id) ? prev.filter((x) => x !== panel.id) : prev.concat(panel.id),
              )
            }
            onBack={() => setScreen("wing")}
            backLabel={WING_PLACE[panel.wing]?.place ?? "Wing"}
          >
            {receiptOpen && p4.lastReceipt && p4.lastReceipt.optionId !== "24-OPT-02" ? (
              <Receipt
                slip={p4.lastReceipt}
                persistence={receiptPersistence}
                onDismiss={() => setReceiptOpen(false)}
              />
            ) : null}
            {focusItem && focusItem.panelId === panel.id ? (
              <p className="focus-banner">
                Opened for: {focusItem.title}. {focusItem.status}
              </p>
            ) : null}
            <nav className="desk-view-tabs" aria-label={`${panel.title} views`}>
              {(["Today", "Orders", "Record", "Intel"] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  className={activeDeskView === view ? "desk-view-tab is-active" : "desk-view-tab"}
                  aria-current={activeDeskView === view ? "page" : undefined}
                  onClick={() => setActiveDeskView(view)}
                >
                  {view}
                </button>
              ))}
            </nav>
            {activeDeskView === "Intel" ? (
              <section className="desk-record-list" aria-label="Intelligence brief">
                <h2 className="section-kicker">Intelligence brief</h2>
                {(p4.reports ?? []).slice(0, 8).map((report, index) => (
                  <article className="desk-record-line" key={`report-${index}-${report.faction}`}>
                    <b>{report.faction}</b> · <span className="uppercase">{report.credibility}</span><p>{report.text}</p>
                  </article>
                ))}
                {(p4.rumors ?? []).slice(0, 8).map((rumor, index) => (
                  <p className="desk-record-line" key={`rumor-${index}-${rumor}`}>Rumor · {rumor}</p>
                ))}
                {!p4.reports?.length && !p4.rumors?.length ? <p className="desk-record-empty">No intelligence reports have reached this desk.</p> : null}
              </section>
            ) : activeDeskView === "Record" ? (
              <section className="desk-record-list" aria-label="Desk record">
                <h2 className="section-kicker">Desk record</h2>
                {(p4.log ?? []).slice(0, 12).map((line, index) => (
                  <p className="desk-record-line" key={`${index}-${line}`}>{line}</p>
                ))}
                {(p4.chronicleNotes ?? []).slice(0, 6).map((line, index) => (
                  <p className="desk-record-line" key={`chronicle-${index}-${line}`}>{line}</p>
                ))}
                {!p4.log?.length && !p4.chronicleNotes?.length ? <p className="desk-record-empty">No entries have been written here yet.</p> : null}
              </section>
            ) : activeDeskView === "Orders" || activeDeskView === "Petitions" ? (
              <section className="desk-orders-intro">
                <h2 className="section-kicker">{activeDeskView}</h2>
                <p>Orders are checked against current resources, availability and prerequisites before they can be stamped.</p>
              </section>
            ) : (
              <div className="legacy-board">
                <V45PanelBody panel={panel} />
              </div>
            )}
            <details className="orders-drawer" open={activeDeskView === "Orders" || activeDeskView === "Petitions"}>
              <summary>Orders</summary>
              {(optionsForPanel(panel.id) as readonly RichOption[]).map((opt) => {
                const locked = lockReason(opt, p4, world);
                const risky = opt.risk === "medium" || opt.risk === "high";
                return (
                <article key={opt.id} className="order-row">
                  <p className="order-title">{opt.title}</p>
                  <p className="order-summary">{opt.summary}</p>
                  <div className="chip-row">
                    <Chip kind="risk" value={opt.risk} />
                    <Chip kind="delay" value={opt.delay} />
                    {opt.costs.hours ? <Chip kind="time" value={`${opt.costs.hours}h`} /> : null}
                    {opt.costs.marks ? <Chip kind="cost" value={`${opt.costs.marks} marks`} /> : null}
                  </div>
                  <p className="order-summary">
                    Known: {opt.forecast.knownEffects.join(" · ") || "Nothing immediate."}
                  </p>
                  {locked ? <p className="order-summary">{locked}</p> : null}
                  <div className="order-actions">
                    <button
                      type="button"
                      className="stamp"
                      disabled={!!locked}
                      onClick={() => {
                        if (locked) return;
                        if (risky) setConfirm({ id: opt.id, title: opt.title });
                        else void runOrder(opt.id);
                      }}
                    >
                      {risky ? "Preview" : "Execute"}
                    </button>
                  </div>
                </article>
                );
              })}
            </details>
            <div className="verdict-row">
              <input
                aria-label="Custom Verdict"
                className="verdict-input"
                placeholder="Issue a command"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const text = e.currentTarget.value.trim();
                    if (text) useGame.getState().pushNote(`Custom Verdict queued: ${text}`);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Stamp
                label="Ask advisor"
                onPress={() =>
                  useGame.getState().pushNote(
                    `Advisor ${panel.advisorId}: recommendation requested for ${panel.title}.`,
                  )
                }
              />
            </div>
          </DeskShell>
        ) : null}
      </div>

      <div className="time-bar">
        <button type="button" className="time-hit is-primary" onClick={() => advanceHours(1)}>
          Wait 1 hour
        </button>
        <button type="button" className="time-hit" onClick={() => advanceHours(3)}>
          Plus 3 hours
        </button>
        <button type="button" className="time-hit" onClick={() => advanceUntil({ time: "20:00" })}>
          To 20:00
        </button>
        <button type="button" className="time-hit" onClick={() => advanceUntil("next-item")}>
          Next scheduled item
        </button>
        <button type="button" className="time-hit" onClick={() => advanceUntil({ time: "22:00" })}>
          To 22:00
        </button>
        <button type="button" className="time-hit" onClick={() => advanceUntil({ time: "07:00" })}>
          To 07:00
        </button>
        <button type="button" className="time-hit" onClick={() => advanceUntil("marketday")}>
          To Marketday
        </button>
      </div>

      {notice ? <p className="platform-notice">{notice}</p> : null}

      {paletteOpen ? (
        <div className="palette-sheet" onClick={() => setPaletteOpen(false)}>
          <div
            className="palette-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Search panels"
          >
            <header>
              <Search className="size-5" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="palette-input"
                placeholder="Search the registry"
                aria-label="Search the registry"
              />
              <button
                type="button"
                className="icon-hit"
                aria-label="Close search"
                onClick={() => setPaletteOpen(false)}
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="palette-list">
              {paletteRows.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="palette-row"
                  onClick={() => openDesk(p.id)}
                >
                  <span className="palette-id">{p.id}</span>
                  <span className="min-w-0 flex-1">
                    <span className="type-body block">{p.title}</span>
                    <span className="type-min block">{p.place ?? p.wing}</span>
                  </span>
                  {favorites.includes(p.id) ? (
                    <Bookmark className="size-4" aria-label="Favorite" />
                  ) : null}
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {confirm ? (
        <div className="confirm-sheet">
          <div className="confirm-card" role="dialog" aria-label="Confirm order">
            <p className="type-lead">Confirm: {confirm.title}</p>
            <p className="type-body">
              Medium or high risk. The order is stamped only if you confirm. Wait one hour stays available.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-hit is-primary"
                onClick={() => {
                  void runOrder(confirm.id);
                  setConfirm(null);
                }}
              >
                Confirm
              </button>
              <button type="button" className="confirm-hit" onClick={() => setConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
