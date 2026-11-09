import type { GaugeReading } from "@/lib/platform/gauges";

const ARROW = { up: "↑", down: "↓", flat: "→" } as const;

export function Gauge({
  reading,
  unseen = false,
  onLook,
}: {
  reading: GaugeReading;
  unseen?: boolean;
  onLook?: () => void;
}) {
  return (
    <button
      type="button"
      className={unseen ? "gauge gauge-unseen" : "gauge"}
      onClick={onLook}
      aria-label={`${reading.label}, ${reading.word}${reading.arrow === "flat" ? "" : reading.arrow === "up" ? ", rising" : ", falling"}`}
    >
      <span className="gauge-label">{reading.label}</span>
      <span className="gauge-word">{reading.word}</span>
      <span className="gauge-arrow" aria-hidden>
        {ARROW[reading.arrow]}
      </span>
    </button>
  );
}

export function GaugeRow({
  readings,
  unseen,
  onLook,
}: {
  readings: GaugeReading[];
  unseen?: string[];
  onLook?: (key: string) => void;
}) {
  return (
    <div className="gauge-row">
      {readings.map((reading) => (
        <Gauge
          key={reading.key}
          reading={reading}
          unseen={unseen?.includes(reading.key)}
          onLook={onLook ? () => onLook(reading.key) : undefined}
        />
      ))}
    </div>
  );
}
