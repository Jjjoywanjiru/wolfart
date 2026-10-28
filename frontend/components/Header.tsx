import Link from "next/link";
import { siteName } from "@/lib/site";
import { getSession } from "@/lib/session";
import { logout } from "@/app/admin/actions";
import NavLink from "./NavLink";

export default async function Header() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          {siteName}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <NavLink href="/" match={["/", "/artwork"]}>
            Shop
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink href="/admin" exclude={["/admin/commissions"]}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/commissions">Customer requests</NavLink>
            </>
          ) : (
            <NavLink href="/commission" exclude={["/commission/mine"]}>
              Commission
            </NavLink>
          )}
          {session && !isAdmin && <NavLink href="/commission/mine">My requests</NavLink>}
          {session ? (
            <form action={logout}>
              <button type="submit">Log out</button>
            </form>
          ) : (
            <NavLink href="/login">Log in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}