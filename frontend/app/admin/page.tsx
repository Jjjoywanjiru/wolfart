import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworks } from "@/lib/api";
import { logout } from "./actions";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const artworks = await getArtworks();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted">Signed in as {session.name}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm border border-line rounded px-3 py-1">
            Log out
          </button>
        </form>
      </div>

      <h2 className="font-medium mb-3">Artworks ({artworks.length})</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            <th className="py-2">Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((art) => (
            <tr key={art.id} className="border-b border-line">
              <td className="py-2">{art.title}</td>
              <td>{art.category}</td>
              <td>${Number(art.price).toLocaleString()}</td>
              <td>{art.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}