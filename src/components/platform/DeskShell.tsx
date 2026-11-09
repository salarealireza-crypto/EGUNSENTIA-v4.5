import type { ReactNode } from "react";
import { Bookmark, ChevronLeft } from "lucide-react";
import type { GaugeReading } from "@/lib/platform/gauges";
import type { VoiceInput } from "@/lib/platform/voice";
import { GaugeRow } from "./Gauge";
import { VoiceLine } from "./VoiceLine";

export function DeskHeader({
  place,
  title,
  advisorId,
  voice,
  gauges,
  unseen,
  onLook,
  favorite,
  onFavorite,
}: {
  place: string;
  title: string;
  advisorId: string;
  voice: VoiceInput;
  gauges: GaugeReading[];
  unseen?: string[];
  onLook?: (key: string) => void;
  favorite?: boolean;
  onFavorite?: () => void;
}) {
  return (
    <header className="desk-header">
      <div className="desk-title-row">
        <div>
          <p className="desk-eyebrow">{place}</p>
          <h1 className="type-title">{title}</h1>
        </div>
        {onFavorite ? (
          <button type="button" className="icon-hit" aria-label={favorite ? "Remove favorite" : "Favorite this desk"} onClick={onFavorite}>
            <Bookmark className={favorite ? "size-5 fill-current" : "size-5"} />
          </button>
        ) : null}
      </div>
      <VoiceLine advisorId={advisorId} input={voice} />
      {gauges.length ? <GaugeRow readings={gauges} unseen={unseen} onLook={onLook} /> : null}
    </header>
  );
}

export function DeskShell({
  wing,
  onBack,
  backLabel,
  children,
  footer,
  ...header
}: {
  wing: string;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
} & Parameters<typeof DeskHeader>[0]) {
  return (
    <section className="desk-shell" data-wing={wing}>
      {onBack ? (
        <button type="button" className="back-hit" onClick={onBack}>
          <ChevronLeft className="size-5" aria-hidden />
          {backLabel ?? "Back"}
        </button>
      ) : null}
      <DeskHeader {...header} />
      <div className="desk-body">{children}</div>
      {footer}
    </section>
  );
}
