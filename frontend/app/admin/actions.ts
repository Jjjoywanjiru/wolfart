"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL, getArtwork } from "@/lib/api";
import { getToken } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const STATUSES = ["AVAILABLE", "BOOKED", "SOLD"];

async function collectImages(
  formData: FormData
): Promise<{ images: string[] } | { error: string }> {
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

  try {
    return { images: await Promise.all(files.map(uploadImage)) };
  } catch {
    return { error: "Photo upload failed. Check the Cloudinary settings and try again." };
  }
}

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

  const uploaded = await collectImages(formData);
  if ("error" in uploaded) return { error: uploaded.error };

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
      images: uploaded.images,
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

export async function updateArtwork(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Enter a valid price" };
  }

  const existing = await getArtwork(id);
  if (!existing) return { error: "Artwork not found" };

  const uploaded = await collectImages(formData);
  if ("error" in uploaded) return { error: uploaded.error };

  const res = await fetch(`${API_URL}/api/artworks/${id}`, {
    method: "PATCH",
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
      images: [...existing.images, ...uploaded.images],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.error ?? "Could not save the changes" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/artwork/${id}`);
  redirect("/admin");
}

export async function updateArtworkStatus(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status)) throw new Error("Invalid status");

  const res = await fetch(`${API_URL}/api/artworks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Could not update the status");

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteArtwork(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const id = String(formData.get("id"));

  const res = await fetch(`${API_URL}/api/artworks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Could not delete the artwork");

  revalidatePath("/");
  revalidatePath("/admin");
}