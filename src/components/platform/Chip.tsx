import { Clock3, Coins, Hourglass, ShieldAlert } from "lucide-react";

const ICONS = {
  cost: Coins,
  risk: ShieldAlert,
  delay: Hourglass,
  time: Clock3,
} as const;

export function Chip({ kind, value }: { kind: keyof typeof ICONS; value: string }) {
  const Icon = ICONS[kind];
  return (
    <span className="chip">
      <Icon className="size-4" aria-hidden />
      <span>{value}</span>
    </span>
  );
}
