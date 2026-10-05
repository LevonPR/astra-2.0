import data from "../data/hub.json";

export type LedgerEntry = {
  id: string;
  kind: "receipt" | "refund" | "expense";
  amountCents: number;
  status: "pending" | "verified";
  reviewedBy: string;
  evidenceRef: string;
  date: string;
};

export function summarizeLedger(entries: LedgerEntry[]) {
  let collectedCents = 0, refundedCents = 0, expenseCents = 0;
  for (const entry of entries) {
    if (entry.status !== "verified") continue;
    if (!Number.isSafeInteger(entry.amountCents) || entry.amountCents <= 0 ||
        !entry.evidenceRef?.trim() || !entry.reviewedBy?.trim()) {
      throw new Error("Verified ledger entries require positive integer cents and review evidence");
    }
    if (entry.kind === "receipt") collectedCents += entry.amountCents;
    else if (entry.kind === "refund") refundedCents += entry.amountCents;
    else if (entry.kind === "expense") expenseCents += entry.amountCents;
    else throw new Error("Unknown ledger entry kind");
  }
  const netRevenueCents = collectedCents - refundedCents;
  return { collectedCents, refundedCents, expenseCents, netRevenueCents,
    cashContributionCents: netRevenueCents - expenseCents };
}

export const hub = data;
export function hubSnapshot() {
  return { ...hub, metrics: summarizeLedger(hub.ledger as LedgerEntry[]),
    accountingNote: "Verified entries recorded in this repository only. Not connected to a bank or payment processor. Cash contribution excludes unrecorded costs and taxes.",
    authority: "Read-only snapshot. Changes require repository review; task readiness is not assignment or financial approval." };
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function proposalUrl(title: string, taskId?: string) {
  const params = new URLSearchParams({ template: "hub-proposal.yml", title: `[HUB] ${taskId ? taskId + " — " : ""}${title}` });
  return `https://github.com/LevonPR/astra-2.0/issues/new?${params}`;
}
