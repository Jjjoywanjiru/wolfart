import { cookies } from "next/headers";
import { API_URL, type SessionUser } from "@/lib/api";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function getSession(): Promise<SessionUser | null> {
  const token = await getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}