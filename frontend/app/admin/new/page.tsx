import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import NewArtworkForm from "./NewArtworkForm";

export default async function NewArtworkPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Add artwork</h1>
      <NewArtworkForm />
    </main>
  );
}