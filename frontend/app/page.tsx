import { getArtworks, type Artwork } from "@/lib/api";
import Link from "next/link";

const statusStyles: Record<Artwork["status"], string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  BOOKED: "bg-amber-100 text-amber-800",
  SOLD: "bg-red-100 text-red-800",
};

export default async function CatalogPage() {
  const artworks = await getArtworks();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Handcrafted</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {artworks.map((art) => (
          <Link key={art.id} href={`/artwork/${art.id}`}>
           <div className="border border-line rounded-lg overflow-hidden">
              <div className="h-32 bg-surface flex items-center justify-center text-muted text-sm">
                No image
              </div>
            <div className="p-3">
              <p className="font-medium text-sm">{art.title}</p>
              <p className="text-xs text-muted mb-2">
                {art.category} · ${Number(art.price).toLocaleString()}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded ${statusStyles[art.status]}`}>
                {art.status}
              </span>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </main>
  );
}