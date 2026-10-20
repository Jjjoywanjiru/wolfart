"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

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

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { error: `${file.name} is not an image` };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { error: `${file.name} is larger than 8 MB` };
    }
  }

  let images: string[] = [];
  try {
    images = await Promise.all(files.map(uploadImage));
  } catch {
    return { error: "Photo upload failed. Check the Cloudinary settings and try again." };
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
      images,
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