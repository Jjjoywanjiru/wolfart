"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/session";

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