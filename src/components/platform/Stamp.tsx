export function Stamp({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button type="button" className="stamp" onClick={onPress}>
      {label}
    </button>
  );
}
