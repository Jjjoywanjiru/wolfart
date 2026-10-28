"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function hit(path: string, prefix: string) {
  return prefix === "/"
    ? path === "/"
    : path === prefix || path.startsWith(`${prefix}/`);
}

export default function NavLink({
  href,
  children,
  match,
  exclude,
}: {
  href: string;
  children: ReactNode;
  match?: string[];
  exclude?: string[];
}) {
  const pathname = usePathname() ?? "";
  const active =
    (match ?? [href]).some((p) => hit(pathname, p)) &&
    !(exclude ?? []).some((p) => hit(pathname, p));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "text-foreground font-medium underline decoration-2 decoration-accent underline-offset-8"
          : "hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}