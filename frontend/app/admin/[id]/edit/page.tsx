import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtwork } from "@/lib/api";
import ArtworkForm from "../../ArtworkForm";
import { updateArtwork } from "../../actions";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit {artwork.title}</h1>
      <ArtworkForm action={updateArtwork} artwork={artwork} submitLabel="Save changes" />
    </main>
  );
}