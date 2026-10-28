"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/session";

const STEPS = ["deposit_received", "ready", "balance_received", "delivered"];

export async function respondToCommission(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));
  const intent = String(formData.get("intent"));
  if (intent !== "quote" && intent !== "decline") throw new Error("Invalid action");

  const res = await fetch(`${API_URL}/api/commissions/${id}/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: intent, price: Number(formData.get("price")) }),
  });
  if (!res.ok) throw new Error("Could not update the request");

  revalidatePath("/admin/commissions");
  revalidatePath("/commission/mine");
}

export async function advanceCommission(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));
  const step = String(formData.get("step"));
  if (!STEPS.includes(step)) throw new Error("Invalid step");

  const res = await fetch(`${API_URL}/api/commissions/${id}/advance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ step }),
  });
  if (!res.ok) throw new Error("Could not update the request");

  revalidatePath("/admin/commissions");
  revalidatePath("/commission/mine");
}