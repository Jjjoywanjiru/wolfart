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
};


const API_URL = process.env.API_URL?? "http://localhost:4000";

export async function getArtworks(): Promise<Artwork[]> {
   const response = await fetch(`${API_URL}/api/artworks`, { cache: "no-store" });
   if(!response.ok) throw new Error("Failed to load artworks");
   return response.json();
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  const res = await fetch(`${API_URL}/api/artworks/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load artwork");
  return res.json();
}