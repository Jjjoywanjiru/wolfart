"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/session";

export async function submitCommission(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const token = await getToken();
  if (!token) redirect("/login");

  const budgetMin = Number(formData.get("budgetMin"));
  const budgetMax = Number(formData.get("budgetMax"));
  if (!Number.isFinite(budgetMin) || !Number.isFinite(budgetMax)) {
    return { error: "Enter both ends of your budget" };
  }
  if (budgetMax < budgetMin) {
    return { error: "The maximum budget can't be lower than the minimum" };
  }

  const res = await fetch(`${API_URL}/api/commissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      description: formData.get("description"),
      preferredMedium: formData.get("preferredMedium"),
      budgetMin,
      budgetMax,
      desiredDate: formData.get("desiredDate") || null,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.error ?? "Could not send your request" };
  }

  revalidatePath("/commission/mine");
  redirect("/commission/mine");
}

export async function acceptQuote(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));

  const res = await fetch(`${API_URL}/api/commissions/${id}/accept`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Could not accept the quote");

  revalidatePath("/commission/mine");
  revalidatePath("/admin/commissions");
}