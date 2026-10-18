import Link from "next/link";
import { siteName } from "@/lib/site";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          {siteName}
        </Link>
        <nav className="flex gap-6 text-sm text-muted">
          <Link href="/">Shop</Link>
          <Link href="/commission">Commission</Link>
        </nav>
      </div>
    </header>
  );
}