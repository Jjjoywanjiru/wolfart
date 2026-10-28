import { formatMoney } from "@/lib/format";

export default function QuotedPrice({
  amount,
  deposit,
}: {
  amount: string;
  deposit?: string | null;
}) {
  return (
    <div className="mt-3 rounded-lg bg-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">Quoted price</p>
      <p className="text-2xl font-semibold">{formatMoney(amount)}</p>
      {deposit && (
        <p className="text-sm text-muted mt-1">Deposit: {formatMoney(deposit)}</p>
      )}
    </div>
  );
}