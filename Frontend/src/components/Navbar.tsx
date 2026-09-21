// Frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { serviceData } from "@/data/servicesData";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const email = (user?.email || "");
  const allowedDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();
  const allowedEmails = useMemo(() => (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").toLowerCase().split(/[,;\s]+/).filter(Boolean), []);
  const userEmail = (typeof email === "string" ? email : "").toLowerCase();
  const isAdmin = !!userEmail && ((allowedDomain && userEmail.endsWith(`@${allowedDomain}`)) || (allowedEmails.length > 0 && allowedEmails.includes(userEmail)));
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || user.email || "User");
    } else {
      // try localStorage fallback (in case hook's refresh hasn't run yet)
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.name || parsed.email || null);
        } catch {
          setDisplayName(null);
        }
      } else setDisplayName(null);
    }
  }, [user]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md text-brand-textB border-b border-brand-primary/10 shadow-sm overflow-visible transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center gap-4">
          <h1 className={`text-xl font-bold text-brand-primary font-display`}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image src="/icons/logo.jpg" alt="Impulse Lab logo" width={48} height={48} priority className="rounded-md" />
              <span className="hidden sm:inline">Impulse Lab</span>
            </Link>
          </h1>
          {/* Desktop search (center) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const qRaw = query.trim();
              if (!qRaw) {
                router.push("/services");
                return;
              }
              const q = qRaw.toLowerCase();
              const services = Object.values(serviceData);
              const exactTitle = services.find((s) => s.title.toLowerCase() === q);
              if (exactTitle) {
                router.push(`/services/${exactTitle.slug}`);
                return;
              }
              const exactSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase() === q));
              if (exactSub) {
                router.push(`/services/${exactSub.slug}`);
                return;
              }
              const partialTitle = services.find((s) => s.title.toLowerCase().includes(q));
              if (partialTitle) {
                router.push(`/services/${partialTitle.slug}`);
                return;
              }
              const partialSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase().includes(q)));
              if (partialSub) {
                router.push(`/services/${partialSub.slug}`);
                return;
              }
              router.push(`/services?search=${encodeURIComponent(qRaw)}`);
            }}
            className="hidden md:flex items-center mx-auto flex-1 max-w-xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests, health checkups..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-brand-neutral text-brand-textH placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all`}
              />
              <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary`}>🔎</span>
            </div>
          </form>
          {/* Right nav */}
          <nav className="ml-auto hidden md:block">
            <ul className={`flex items-center gap-6 text-brand-textB font-medium`}>
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map(({href,label}) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative group transition-colors hover:text-brand-primary`}
                  >
                    {label}
                    <span className={`absolute left-0 -bottom-1 h-0.5 w-0 transition-all duration-300 bg-brand-accent group-hover:w-full`}></span>
                  </Link>
                </li>
              ))}
              {!displayName ? (
                <li>
                  <Link href="/auth/login" className="inline-flex items-center px-5 py-2 rounded-full bg-brand-primary text-white shadow-soft hover:shadow-soft-hover hover:bg-[#0a2a32] transition-all">
                    Login
                  </Link>
                </li>
              ) : (
                <li className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className={`relative z-[60] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary hover:bg-[#0a2a32] text-white font-semibold shadow-soft border border-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[40px]`}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    <span className="truncate max-w-[10rem]">{displayName}</span>
                    <span className="text-white/90">▾</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-gray-800 shadow-xl border border-emerald-100 overflow-hidden z-[70]" role="menu">
                      <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg">👤</div>
                          <div className="min-w-0">
                            <div className="font-semibold text-emerald-900 truncate">{displayName}</div>
                            <div className="text-xs text-emerald-700/80 truncate">Signed in</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2" role="menu">
                        <Link href="/upload-prescription" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🧾 <span>My Prescriptions</span></Link>
                        <Link href="/services" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🗓️ <span>My Booking</span></Link>
                        <Link href="/account?tab=reports" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>📁 <span>My Report</span></Link>
                        <Link href="/account?tab=address" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>📍 <span>My Address</span></Link>
                        <Link href="/account?tab=membership" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>💳 <span>My Membership Cards</span></Link>
                        <Link href="/account?tab=family" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>👥 <span>My Family Members</span></Link>
                        <Link href="/account" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>👤 <span>My Profile</span></Link>
                        <Link href="/account?tab=notifications" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🔔 <span>My Notification</span></Link>
                        {isAdmin && (
                          <>
                            <div className="my-1 border-t border-gray-200" />
                            <Link href="/admin/prescriptions" role="menuitem" className="relative z-10 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100" onClick={() => setProfileOpen(false)}>🛡️ <span>Admin</span></Link>
                          </>
                        )}
                        <button
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left"
                        >
                          🚪 <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>
          {/* Mobile menu button */}
          <button
            className={`ml-auto md:hidden inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[40px] ${isScrolled ? 'bg-brand-primary hover:bg-[#0a2a32] text-white' : 'bg-gray-100 hover:bg-gray-200 text-brand-textH'} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-colors`}
            aria-label="Toggle menu"
            aria-controls="primary-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div id="primary-mobile-menu" className="md:hidden border-t border-gray-100 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const qRaw = query.trim();
                if (!qRaw) {
                  router.push("/services");
                  setMobileOpen(false);
                  return;
                }
                const q = qRaw.toLowerCase();
                const services = Object.values(serviceData);
                const exactTitle = services.find((s) => s.title.toLowerCase() === q);
                if (exactTitle) {
                  router.push(`/services/${exactTitle.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const exactSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase() === q));
                if (exactSub) {
                  router.push(`/services/${exactSub.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const partialTitle = services.find((s) => s.title.toLowerCase().includes(q));
                if (partialTitle) {
                  router.push(`/services/${partialTitle.slug}`);
                  setMobileOpen(false);
                  return;
                }
                const partialSub = services.find((s) => s.subTests.some((t) => t.name.toLowerCase().includes(q)));
                if (partialSub) {
                  router.push(`/services/${partialSub.slug}`);
                  setMobileOpen(false);
                  return;
                }
                router.push(`/services?search=${encodeURIComponent(qRaw)}`);
                setMobileOpen(false);
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests, health checkups..."
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#009B72] shadow-sm"
              />
              <button type="submit" className="ml-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#00C29A] to-[#009B72] text-white shadow hover:shadow-md min-h-[44px]">
                Search
              </button>
            </form>
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 text-[#333] hover:text-[#009B72] transition-colors">Home</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className="py-2 text-[#333] hover:text-[#009B72] transition-colors">Services</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2 text-[#333] hover:text-[#009B72] transition-colors">About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2 text-[#333] hover:text-[#009B72] transition-colors">Contact</Link>
              {isAdmin && (
                <Link href="/admin/prescriptions" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded border border-gray-200 text-[#333] text-center">
                  Admin
                </Link>
              )}
              {!displayName ? (
                <Link href="/auth/login" className="bg-gradient-to-r from-[#00C29A] to-[#009B72] text-white px-3 py-3 rounded-full text-center shadow hover:shadow-md" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="bg-red-500 px-3 py-3 rounded-full text-white">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}