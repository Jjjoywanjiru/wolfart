import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtwork } from "@/lib/api";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const art = await getArtwork(id);
  if (!art) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
      <div className="relative h-80 bg-surface rounded-lg overflow-hidden flex items-center justify-center text-muted">
        {art.images[0] ? (
          <Image
            src={art.images[0]}
            alt={art.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          "No image"
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{art.title}</h1>
        <p className="text-muted mt-1">
          {art.medium} · {art.dimensions}
        </p>
        <p className="text-2xl font-semibold mt-4">
          ${Number(art.price).toLocaleString()}
        </p>
        <h2 className="font-medium mt-6">Materials</h2>
        <p className="text-muted">{art.materials}</p>
        {art.tools && (
          <>
            <h2 className="font-medium mt-4">Tools</h2>
            <p className="text-muted">{art.tools}</p>
          </>
        )}
        <h2 className="font-medium mt-4">About this piece</h2>
        <p className="text-muted">{art.description}</p>
      </div>
    </main>
  );
}