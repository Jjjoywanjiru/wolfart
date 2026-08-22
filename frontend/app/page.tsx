type Artwork = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: "AVAILABLE" | "BOOKED" | "SOLD";  
  
  //a TypeScript type definition — it says exactly what shape an artwork object must have, and status: "AVAILABLE" | "BOOKED" | "SOLD" restricts that field to only those three exact strings. any typo "Available" (wrong casing) elsewhere in the file, TypeScript will flag it immediately instead of letting it silently break at runtime.

};

const artworks : Artwork[] = [
  {id: "1", title: "Sunset Overdrive", category: "Landscape", price: 500, status: "AVAILABLE"},
  {id: "2", title: "Urban Jungle", category: "Cityscape", price: 750,
    status: "BOOKED"},
  {id: "3", title: "Abstract Dreams", category: "Abstract", price: 300, status: "SOLD"},
  {id: "4", title: "Ocean Breeze", category: "Seascape", price: 600, status: "AVAILABLE"},
];

const statusStyles: Record<Artwork["status"], string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  BOOKED: "bg-amber-100 text-yellow-800",
  SOLD: "bg-red-100 text-red-800",
};

export default function CatalogPage() {
  return (
    <main className = "max-w-5xl mx-auto px-6 py-10">
      <h1 className = "text-3xl font-bold mb-6">Handcrafted</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
              No image
            </div>
            <div className="p-3">
              <p className="font-medium text-sm">{art.title}</p>
              <p className="text-xs text-neutral-500 mb-2">
                {art.category} · ${art.price}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded ${statusStyles[art.status]}`}>
                {art.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}