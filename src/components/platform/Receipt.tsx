import { useEffect, useRef } from "react";
import type { ReceiptPersistence, ReceiptSlip } from "@/lib/game/p4-simulation";
export type { ReceiptPersistence } from "@/lib/game/p4-simulation";

const SECTIONS: { label: string; key: keyof Pick<ReceiptSlip, "done" | "spent" | "hear" | "written"> }[] = [
  { label: "DONE", key: "done" },
  { label: "SPENT", key: "spent" },
  { label: "YOU WILL HEAR", key: "hear" },
  { label: "WRITTEN TO", key: "written" },
];


export function Receipt({
  slip,
  onDismiss,
  persistence,
}: {
  slip: ReceiptSlip;
  onDismiss: () => void;
  persistence?: ReceiptPersistence;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "start" });
  }, [slip.optionId]);
  return (
    <article ref={ref} className="slip receipt-slip" data-variant="ledger" data-receipt="open" aria-label={`Receipt: ${slip.title}`}>
      <div className="slip-copy">
        <p className="slip-title">{slip.title}</p>
        {persistence === "pending" ? (
          <p className="slip-status" role="status">Applied on this device; waiting for account-save confirmation.</p>
        ) : persistence === "account-committed" ? (
          <p className="slip-status" role="status">Committed to persistent account storage.</p>
        ) : persistence === "ephemeral" ? (
          <p className="slip-status" role="status">Saved only in the ephemeral local preview database; it will not survive a server restart.</p>
        ) : persistence === "device-only" ? (
          <p className="slip-status" role="status">Device copy only. A persistent account save was not confirmed.</p>
        ) : null}
        {SECTIONS.map((section) => (
          <section key={section.key}>
            <h3 className="section-kicker">{section.label}</h3>
            {slip[section.key].length ? (
              slip[section.key].map((line) => (
                <p key={line} className="slip-status">
                  {line}
                </p>
              ))
            ) : (
              <p className="slip-status">None.</p>
            )}
          </section>
        ))}
      </div>
      <button type="button" className="stamp" onClick={onDismiss}>
        Dismiss
      </button>
    </article>
  );
}
