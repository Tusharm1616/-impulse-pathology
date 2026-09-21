"use client";
import { ReactNode, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function AdminGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const useRewrite = String(process.env.NEXT_PUBLIC_USE_REWRITE || "").toLowerCase() === "true";
  const allowedDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();
  const allowedEmails = useMemo(
    () => (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").toLowerCase().split(/[,;\s]+/).filter(Boolean),
    []
  );
  const email = (user?.email || user?.name || "").toLowerCase();
  const authorized = !!email && ((allowedEmails.length && allowedEmails.includes(email)) || (allowedDomain && email.endsWith(`@${allowedDomain}`)));

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-700">Please <Link href="/auth/login" className="text-emerald-700 underline">log in</Link> with your official lab email to view admin pages.</p>
      </div>
    );
  }
  if (!authorized) {
    return (
      <div className="p-6">
        <p className="text-gray-700">Access restricted. Use your official lab email{allowedDomain ? ` (@${allowedDomain})` : ""}.</p>
      </div>
    );
  }
  if (!base && !useRewrite) {
    return (
      <div className="p-6 space-y-2">
        <div className="rounded-md bg-yellow-50 p-3 text-yellow-800">
          Set <code>NEXT_PUBLIC_API_BASE_URL</code> to your backend to load data.
        </div>
        {children}
      </div>
    );
  }
  return <>{children}</>;
}