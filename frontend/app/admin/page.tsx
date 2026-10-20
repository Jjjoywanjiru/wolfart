import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworks } from "@/lib/api";
import { logout, updateArtworkStatus, deleteArtwork } from "./actions";
import DeleteButton from "./DeleteButton";

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

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">Artworks ({artworks.length})</h2>
        <Link href="/admin/new" className="text-sm border border-line rounded px-3 py-1">
          Add artwork
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            <th className="py-2">Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((art) => (
            <tr key={art.id} className="border-b border-line">
              <td className="py-2">{art.title}</td>
              <td>{art.category}</td>
              <td>${Number(art.price).toLocaleString()}</td>
              <td>
                <form action={updateArtworkStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={art.id} />
                  <select
                    name="status"
                    defaultValue={art.status}
                    className="border border-line rounded px-2 py-1"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="SOLD">Sold</option>
                  </select>
                  <button type="submit" className="border border-line rounded px-2 py-1">
                    Save
                  </button>
                </form>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/${art.id}/edit`}
                    className="text-sm border border-line rounded px-2 py-1"
                  >
                    Edit
                  </Link>
                  <form action={deleteArtwork}>
                    <input type="hidden" name="id" value={art.id} />
                    <DeleteButton />
                  </form>
                </div>
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}