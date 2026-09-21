"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/useAuth";

type Item = {
  storedAt: string;
  name?: string;
  phone?: string;
  email?: string;
  filename: string;
};

export default function AdminPrescriptionsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const useRewrite = String(process.env.NEXT_PUBLIC_USE_REWRITE || "").toLowerCase() === "true";
  const allowedDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();
  const allowedEmails = useMemo(
    () => (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").toLowerCase().split(/[,;\s]+/).filter(Boolean),
    []
  );

  const authorized = useMemo(() => {
    const email = (user?.email || user?.name || "").toLowerCase();
    if (!email) return false;
    if (allowedEmails.length && allowedEmails.includes(email)) return true;
    if (allowedDomain && email.endsWith(`@${allowedDomain}`)) return true;
    return false;
  }, [user, allowedDomain, allowedEmails]);

  useEffect(() => {
    if (!authorized) {
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const target = base ? `${base}/prescriptions/list` : "/api/prescriptions/list";
        const res = await fetch(target, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load submissions");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "Error loading submissions");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authorized, base]);

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Prescription Submissions</h1>
          <Link href="/" className="text-emerald-700 hover:underline">← Back to Home</Link>
        </div>

        {!user && (
          <p className="text-gray-700">Please <Link href="/auth/login" className="text-emerald-700 underline">log in</Link> with your official lab email to view submissions.</p>
        )}

        {user && !authorized && (
          <p className="text-gray-700">Access restricted. Use your official lab email{allowedDomain ? ` (@${allowedDomain})` : ""}.</p>
        )}

        {authorized && (
          <>
            {!base && !useRewrite && (
              <div className="mb-4 rounded-md bg-yellow-50 p-3 text-yellow-800">
                Set <code>NEXT_PUBLIC_API_BASE_URL</code> to your backend to load data.
              </div>
            )}
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : items.length === 0 ? (
              <p className="text-gray-600">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">When</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Phone</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                      <th className="px-4 py-3 font-medium text-gray-700">File</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3 text-gray-800">{new Date(it.storedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-800">{it.name || "-"}</td>
                        <td className="px-4 py-3 text-gray-800">{it.phone || "-"}</td>
                        <td className="px-4 py-3 text-gray-800">{it.email || "-"}</td>
                        <td className="px-4 py-3 text-gray-800">{it.filename}</td>
                        <td className="px-4 py-3">
                          <a
                            className="text-emerald-700 hover:underline"
                            href={(base ? `${base}` : `/api`) + `/prescriptions/file?name=${encodeURIComponent(it.filename)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
