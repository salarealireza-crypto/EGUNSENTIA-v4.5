export function SteamOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return <div className="steam-layer" aria-hidden="true" />;
}
