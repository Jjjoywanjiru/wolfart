import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getToken } from "@/lib/session";
import { getMyCommissions, type Commission } from "@/lib/api";

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
        <p className="text-muted">You haven't sent any requests yet.</p>
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
                Budget ${Number(c.budgetMin).toLocaleString()} to $
                {Number(c.budgetMax).toLocaleString()}
                {c.desiredDate &&
                  ` · Needed by ${new Date(c.desiredDate).toLocaleDateString("en-GB")}`}
                {c.quotedPrice &&
                  ` · Quoted $${Number(c.quotedPrice).toLocaleString()}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}