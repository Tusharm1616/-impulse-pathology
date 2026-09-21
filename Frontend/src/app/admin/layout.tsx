"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/patients", label: "Patients", icon: "🧑‍⚕️" },
  { href: "/admin/reports", label: "Reports", icon: "📄" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-[240px_1fr] bg-gray-50">
      <aside className="bg-white border-r border-gray-200 p-4">
        <div className="text-emerald-700 font-bold text-lg mb-4">Impulse Admin</div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname?.startsWith(n.href) ? "bg-emerald-600 text-white" : "hover:bg-gray-100 text-gray-800"}`}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
          <button onClick={logout} className="mt-2 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">🚪 Logout</button>
        </nav>
      </aside>
      <main className="p-5">{children}</main>
    </div>
  );
}
