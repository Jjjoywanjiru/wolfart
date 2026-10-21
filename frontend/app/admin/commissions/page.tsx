import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getToken } from "@/lib/session";
import { getAllCommissions, type Commission } from "@/lib/api";
import { respondToCommission } from "./actions";

const statusLabels: Record<Commission["status"], string> = {
  REQUESTED: "Needs a reply",
  QUOTED: "Quote sent",
  DEPOSIT_PENDING: "Deposit needed",
  IN_PROGRESS: "In progress",
  READY: "Ready",
  DELIVERED: "Delivered",
  DECLINED: "Declined",
};

export default async function AdminCommissionsPage() {
  const session = await getSession();
  const token = await getToken();
  if (!session || !token) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const commissions = await getAllCommissions(token);
  const open = commissions.filter((c) => c.status === "REQUESTED").length;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Commission requests</h1>
        <Link href="/admin" className="text-sm border border-line rounded px-3 py-1">
          Back to dashboard
        </Link>
      </div>
      <p className="text-sm text-muted mb-6">{open} waiting for a reply</p>

      {commissions.length === 0 ? (
        <p className="text-muted">No requests yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {commissions.map((c) => (
            <li key={c.id} className="border border-line rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {c.customer.name}{" "}
                  <span className="text-muted font-normal">({c.customer.email})</span>
                </span>
                <span className="text-xs border border-line rounded px-2 py-0.5">
                  {statusLabels[c.status]}
                </span>
              </div>
              <p className="text-xs text-muted mb-2">
                {c.preferredMedium} · Budget ${Number(c.budgetMin).toLocaleString()} to $
                {Number(c.budgetMax).toLocaleString()}
                {c.desiredDate &&
                  ` · Needed by ${new Date(c.desiredDate).toLocaleDateString("en-GB")}`}
              </p>
              <p className="text-sm mb-3">{c.description}</p>

              {(c.status === "REQUESTED" || c.status === "QUOTED") && (
                <form action={respondToCommission} className="flex items-center gap-2 text-sm">
                  <input type="hidden" name="id" value={c.id} />
                  <span className="text-muted">$</span>
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    defaultValue={c.quotedPrice ?? c.budgetMax}
                    className="w-28 border border-line rounded px-2 py-1"
                  />
                  <button
                    type="submit"
                    name="intent"
                    value="quote"
                    className="bg-primary text-primary-foreground rounded px-3 py-1"
                  >
                    {c.status === "QUOTED" ? "Update quote" : "Send quote"}
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value="decline"
                    formNoValidate
                    className="border border-line rounded px-3 py-1 text-red-700"
                  >
                    Decline
                  </button>
                </form>
              )}
              {c.status !== "REQUESTED" && c.status !== "QUOTED" && c.quotedPrice && (
                <p className="text-sm text-muted">
                  Quoted ${Number(c.quotedPrice).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}