import { ChevronLeft } from "lucide-react";
import type { VoiceInput } from "@/lib/platform/voice";
import { Slip, SlipStack } from "./Slip";
import { VoiceLine } from "./VoiceLine";

export interface WingDeskSlip {
  id: string;
  title: string;
  icon: string;
  status: string;
  badge: number;
  wing: string;
}

export function WingRoom({
  wing,
  place,
  mood,
  advisorId,
  voice,
  desks,
  onOpen,
  onBack,
}: {
  wing: string;
  place: string;
  mood: string;
  advisorId: string;
  voice: VoiceInput;
  desks: WingDeskSlip[];
  onOpen: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <section className="wing-room" data-wing={wing}>
      <button type="button" className="back-hit" onClick={onBack}>
        <ChevronLeft className="size-5" aria-hidden />
        The Cutaway
      </button>
      <p className="desk-eyebrow">{wing === "SYSTEM" ? "Utility" : "Wing"}</p>
      <h1 className="type-title">{place}</h1>
      <p className="type-lead wing-mood">{mood}</p>
      <VoiceLine advisorId={advisorId} input={voice} />
      <SlipStack>
        {desks.map((desk) => (
          <Slip
            key={desk.id}
            icon={desk.icon}
            title={desk.title}
            status={desk.status}
            badge={desk.badge}
            wing={desk.wing}
            variant="paper"
            onClick={() => onOpen(desk.id)}
          />
        ))}
      </SlipStack>
    </section>
  );
}
