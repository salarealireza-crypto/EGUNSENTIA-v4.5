export function GearSkull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const x = 32 + Math.cos(a) * 27;
        const y = 32 + Math.sin(a) * 27;
        return <rect key={deg} x={x - 3} y={y - 3} width="6" height="6" fill="currentColor" transform={`rotate(${deg} ${x} ${y})`} />;
      })}
      <ellipse cx="32" cy="30" rx="11" ry="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="27" cy="28" r="2.2" fill="currentColor" />
      <circle cx="37" cy="28" r="2.2" fill="currentColor" />
      <path d="M29 36h6v3h-6z" fill="currentColor" />
      <path d="M24 40h16 M26 43h12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
