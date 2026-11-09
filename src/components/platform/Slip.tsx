import type { ReactNode } from "react";
import { DeskIcon } from "./icons";

export type SlipVariant = "paper" | "ledger" | "dossier" | "telegram" | "evidence";

export function Slip({
  icon,
  title,
  status,
  badge,
  variant = "paper",
  wing,
  tier,
  pressed,
  onClick,
}: {
  icon?: string;
  title: string;
  status: string;
  badge?: number;
  variant?: SlipVariant;
  wing?: string;
  tier?: string;
  pressed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={pressed ? "slip is-pressed" : "slip"}
      data-variant={variant}
      data-wing={wing}
      data-tier={tier}
      onClick={onClick}
    >
      {icon ? <DeskIcon name={icon} /> : null}
      <span className="slip-copy">
        <span className="slip-title">{title}</span>
        <span className="slip-status">{status}</span>
      </span>
      {badge ? <span className="attn-badge">{badge}</span> : null}
    </button>
  );
}

export function SlipStack({ children }: { children: ReactNode }) {
  return <div className="slip-stack">{children}</div>;
}
