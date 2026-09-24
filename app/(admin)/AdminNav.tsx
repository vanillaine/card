"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const LINKS = [
  { href: "/dashboard", label: "Homepage" },
  { href: "/pages", label: "Page descriptions" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="border-b border-line px-6 py-3 flex items-center gap-4 flex-wrap max-mobile:px-4">
      <span className="font-tingtong text-lg text-white mr-2">Vanillaine admin</span>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm ${pathname === link.href ? "text-white font-medium" : "text-text-muted hover:text-white"}`}
        >
          {link.label}
        </Link>
      ))}
      <span className="ml-auto flex items-center gap-3">
        <span className="admin-hint mt-0">{email}</span>
        <button
          className="admin-btn"
          onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/login") } })}
        >
          Sign out
        </button>
      </span>
    </nav>
  );
}
