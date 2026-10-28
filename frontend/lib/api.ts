export type Artwork = {
   id: string;
   title: string;
   category: string;
   medium: string;
   dimensions: string;
   materials: string;
   description: string;
   price: string;
   status: "AVAILABLE" | "BOOKED" | "SOLD";
   tools: string;
   images: string[];
};


export const API_URL = process.env.API_URL?? "http://localhost:4000";


export async function getArtworks(category?: string): Promise<Artwork[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_URL}/api/artworks${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load artworks");
  return res.json();
} 


export async function getArtwork(id: string): Promise<Artwork | null> {
  const res = await fetch(`${API_URL}/api/artworks/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load artwork");
  return res.json();
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
};

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  return (await res.json()) as { token: string; user: SessionUser };
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (res.ok) return { ok: true };
  const body = await res.json().catch(() => null);
  return { ok: false, error: body?.error ?? "Could not create the account" };
}

export type Commission = {
  id: string;
  description: string;
  preferredMedium: string;
  budgetMin: string;
  budgetMax: string;
  desiredDate: string | null;
  status:
    | "REQUESTED"
    | "QUOTED"
    | "DEPOSIT_PENDING"
    | "IN_PROGRESS"
    | "READY"
    | "DELIVERED"
    | "DECLINED";
  quotedPrice: string | null;
  order?: {
  amount: string;
  depositAmount: string | null;
  paymentStatus: "UNPAID" | "DEPOSIT_PAID" | "PAID";
} | null;
  createdAt: string;
};

export async function getMyCommissions(token: string): Promise<Commission[]> {
  const res = await fetch(`${API_URL}/api/commissions/mine`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load your requests");
  return res.json();
}

export type AdminCommission = Commission & {
  customer: { id: string; name: string; email: string };
};

export async function getAllCommissions(token: string): Promise<AdminCommission[]> {
  const res = await fetch(`${API_URL}/api/commissions`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load commission requests");
  return res.json();
}