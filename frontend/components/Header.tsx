import Link from "next/link";
import { siteName } from "@/lib/site";
import { getSession } from "@/lib/session";
import { logout } from "@/app/admin/actions";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          {siteName}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/">Shop</Link>
          <Link href="/commission">Commission</Link>
          {session ? (
            <>
              {session.role === "ADMIN" && <Link href="/admin">Dashboard</Link>}
              <form action={logout}>
                <button type="submit">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}