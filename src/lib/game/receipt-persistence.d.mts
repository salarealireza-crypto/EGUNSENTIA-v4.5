import type { ReceiptPersistence, ReceiptSlip } from "./p4-simulation";

export function receiptFingerprint(slip: unknown): string;
export function receiptPersistenceFromStorage(
  slip: ReceiptSlip | null | undefined,
  storage: "persistent" | "ephemeral" | null | undefined,
): ReceiptPersistence;
