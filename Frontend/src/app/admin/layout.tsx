"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "Overview", icon: "📊" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/patients", label: "Patients", icon: "🧑‍⚕️" },
  { href: "/admin/reports", label: "Reports", icon: "📄" },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: "🧾" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout: authLogout } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        const nextUrl = encodeURIComponent(pathname || "/admin/dashboard");
        router.push(`/auth/login?tab=staff&next=${nextUrl}`);
      } else {
        setAuthChecked(true);
      }
    }
  }, [user, loading, router]);

  async function logout() {
    await authLogout();
    router.push("/auth/login?tab=staff");
  }

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading admin area...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a2a32] text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-[#00C29A]">Impulse Admin</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {nav.map((n) => (
            <Link 
              key={n.href} 
              href={n.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname?.startsWith(n.href) ? "bg-[#009B72] text-white" : "text-gray-300 hover:bg-[#113a45] hover:text-white"}`}
            >
              <span className="text-xl">{n.icon}</span>
              <span className="font-medium">{n.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {pathname?.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#009B72] text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-gray-700 font-medium">{user?.name || "Admin"}</span>
            </div>
            <button 
              onClick={logout} 
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
