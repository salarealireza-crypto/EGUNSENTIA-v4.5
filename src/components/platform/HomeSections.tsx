import type { DeskItem, LookLine } from "@/lib/platform/home";
import type { GaugeReading } from "@/lib/platform/gauges";
import { EmptyState } from "./EmptyState";
import { GaugeRow } from "./Gauge";
import { Slip, SlipStack } from "./Slip";

export function PulseRow({
  readings,
  unseen,
  onLook,
}: {
  readings: GaugeReading[];
  unseen: string[];
  onLook: (key: string) => void;
}) {
  return (
    <section className="pulse" aria-label="Pulse">
      <h2 className="section-kicker">Pulse</h2>
      <GaugeRow readings={readings} unseen={unseen} onLook={onLook} />
    </section>
  );
}

export function OnYourDesk({ items, onOpen }: { items: DeskItem[]; onOpen: (item: DeskItem) => void }) {
  return (
    <section className="home-block" aria-label="On your desk">
      <h2 className="section-kicker">On your desk</h2>
      {items.length ? (
        <SlipStack>
          {items.map((item) => (
            <Slip
              key={item.id}
              variant={item.id.startsWith("letters") ? "telegram" : item.id.startsWith("inbox") ? "paper" : "dossier"}
              title={item.title}
              status={item.status}
              tier={item.tier}
              onClick={() => onOpen(item)}
            />
          ))}
        </SlipStack>
      ) : (
        <EmptyState line="Nothing on this desk. Hesse says the cistern is quiet." />
      )}
    </section>
  );
}

export function SinceLooked({ lines }: { lines: LookLine[] }) {
  return (
    <section className="home-block" aria-label="Since you last looked">
      <h2 className="section-kicker">Since you last looked</h2>
      {lines.length ? (
        <ul className="look-list">
          {lines.map((line) => (
            <li key={line.id}>
              <span className="look-source">{line.source}</span>
              <span className="type-body">{line.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState line="The ledger, the booth and the whispers are quiet." />
      )}
    </section>
  );
}
