export function formatMoney(value: string | number): string {
  const n = Number(value);
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}