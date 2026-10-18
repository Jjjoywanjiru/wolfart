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


const API_URL = process.env.API_URL?? "http://localhost:4000";


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

