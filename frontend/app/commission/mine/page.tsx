import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getToken } from "@/lib/session";
import { getMyCommissions, type Commission } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import QuotedPrice from "@/components/QuotedPrice";
import { acceptQuote } from "../actions";

const statusLabels: Record<Commission["status"], string> = {
  REQUESTED: "Waiting for the artist",
  QUOTED: "Quote sent",
  DEPOSIT_PENDING: "Deposit needed",
  IN_PROGRESS: "In progress",
  READY: "Ready",
  DELIVERED: "Delivered",
  DECLINED: "Declined",
};

export default async function MyCommissionsPage() {
  const session = await getSession();
  const token = await getToken();
  if (!session || !token) redirect("/login");
  if (session.role === "ADMIN") redirect("/admin/commissions");

  const commissions = await getMyCommissions(token);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My requests</h1>
        <Link href="/commission" className="text-sm border border-line rounded px-3 py-1">
          New request
        </Link>
      </div>

      {commissions.length === 0 ? (
        <p className="text-muted">You haven&apos;t sent any requests yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {commissions.map((c) => (
            <li key={c.id} className="border border-line rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{c.preferredMedium}</span>
                <span className="text-xs border border-line rounded px-2 py-0.5">
                  {statusLabels[c.status]}
                </span>
              </div>
              <p className="text-sm mb-2">{c.description}</p>
              <p className="text-xs text-muted">
                Budget {formatMoney(c.budgetMin)} to {formatMoney(c.budgetMax)}
                {c.desiredDate &&
                  ` · Needed by ${new Date(c.desiredDate).toLocaleDateString("en-GB")}`}
              </p>

              {c.quotedPrice && (
                <QuotedPrice
                  amount={c.quotedPrice}
                  deposit={c.order?.depositAmount}
                />
              )}

              {c.status === "QUOTED" && c.quotedPrice && (
                <form action={acceptQuote} className="mt-3 flex items-center gap-3 text-sm">
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground rounded px-3 py-1"
                  >
                    Accept quote
                  </button>
                  <span className="text-muted">
                    You&apos;ll then pay a deposit before work starts.
                  </span>
                </form>
              )}
              {c.status === "DEPOSIT_PENDING" && (
                <p className="mt-3 text-sm">
                  Please pay the deposit above before work can start.
                </p>
              )}
              {c.status === "IN_PROGRESS" && (
                <p className="mt-3 text-sm">
                  Your deposit has been received and the artist has started work.
                </p>
              )}
              {c.status === "READY" && c.order && (
                <p className="mt-3 text-sm">
                  {c.order.paymentStatus === "PAID"
                    ? "Paid in full. Your piece is ready for delivery."
                    : `Your piece is ready. Balance due: ${formatMoney(
                        Number(c.order.amount) - Number(c.order.depositAmount ?? 0)
                      )}`}
                </p>
              )}
              {c.status === "DELIVERED" && <p className="mt-3 text-sm">Delivered. Thank you!</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}