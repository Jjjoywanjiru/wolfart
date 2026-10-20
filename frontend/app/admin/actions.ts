"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/session";


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

export async function createArtwork(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const token = await getToken();
  if (!token) redirect("/login");

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Enter a valid price" };
  }

  const res = await fetch(`${API_URL}/api/artworks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.get("title"),
      category: formData.get("category"),
      medium: formData.get("medium"),
      dimensions: formData.get("dimensions"),
      materials: formData.get("materials"),
      tools: formData.get("tools"),
      description: formData.get("description"),
      price,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.error ?? "Could not save the artwork" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}