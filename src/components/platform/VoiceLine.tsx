import { pickVoice, type VoiceInput } from "@/lib/platform/voice";

export function VoiceLine({ advisorId, input }: { advisorId: string; input: VoiceInput }) {
  const line = pickVoice(advisorId, input);
  return (
    <p className="voice-line">
      <span className="voice-name">{advisorId}</span>
      <span>{line}</span>
    </p>
  );
}
