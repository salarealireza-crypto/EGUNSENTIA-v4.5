import { CUTAWAY_DEPTH, CUTAWAY_ORDER } from "@/lib/platform/home";
import { WING_PLACE } from "@/lib/platform/desks";
import type { Wing } from "@/lib/platform/registry";

export function Cutaway({
  attention,
  crisisWings,
  onOpen,
}: {
  attention: Record<Wing, number>;
  crisisWings: Wing[];
  onOpen: (wing: Wing) => void;
}) {
  return (
    <section className="cutaway" aria-label="The Cutaway">
      <h2 className="type-title">The Cutaway</h2>
      <p className="type-lead cutaway-lead">Depth is secrecy. Choose a room.</p>
      <div className="cutaway-stage">
        <svg className="cutaway-svg" viewBox="0 0 72 520" aria-hidden>
          <rect x="30" y="8" width="12" height="500" fill="currentColor" opacity="0.35" />
          <path d="M36 70 H8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 168 H64" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 250 H8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 332 H64" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 414 H16" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M36 490 H8" stroke="currentColor" strokeWidth="2" fill="none" />
          {CUTAWAY_ORDER.map((wing, i) => (
            <circle key={wing} cx="36" cy={36 + i * 64} r="4" fill="currentColor" />
          ))}
        </svg>
        <ol className="cutaway-rooms">
          {CUTAWAY_ORDER.map((wing) => (
            <li key={wing} style={{ marginLeft: `${CUTAWAY_DEPTH[wing] * 12}px` }}>
              <RoomButton wing={wing} count={attention[wing]} crisis={crisisWings.includes(wing)} onOpen={onOpen} />
            </li>
          ))}
        </ol>
      </div>
      <ol className="cutaway-list">
        {CUTAWAY_ORDER.map((wing) => (
          <li key={wing}>
            <RoomButton wing={wing} count={attention[wing]} crisis={crisisWings.includes(wing)} onOpen={onOpen} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function RoomButton({
  wing,
  count,
  crisis,
  onOpen,
}: {
  wing: Wing;
  count: number;
  crisis: boolean;
  onOpen: (wing: Wing) => void;
}) {
  const meta = WING_PLACE[wing];
  const label = `${meta.place}. ${meta.mood} ${count ? `${count} needing you.` : "Quiet."}${crisis ? " A crisis touches this room." : ""}`;
  return (
    <button
      type="button"
      className={crisis ? "hotspot is-crisis" : "hotspot"}
      data-wing={wing}
      aria-label={label}
      onClick={() => onOpen(wing)}
    >
      <span className="hotspot-copy">
        <span className="hotspot-place">{meta.place}</span>
        <span className="hotspot-mood">{meta.mood}</span>
      </span>
      {count > 0 ? <span className="attn-badge">{count}</span> : <span className="hotspot-quiet">Quiet</span>}
    </button>
  );
}
