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