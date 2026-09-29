"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Item = {
  storedAt: string;
  name?: string;
  phone?: string;
  email?: string;
  filename: string;
};

export default function AdminPrescriptionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<any[]>("/api/prescriptions/list", { cache: "no-store" });
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "Error loading submissions");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Uploaded Prescriptions</h2>
          <span className="text-sm text-gray-600">{loading ? "Loading..." : `${items.length} prescription(s)`}</span>
        </div>
        
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 bg-white">
                <th className="px-6 py-3 font-medium">Date Uploaded</th>
                <th className="px-6 py-3 font-medium">Patient Details</th>
                <th className="px-6 py-3 font-medium">File Name</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading prescriptions...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No prescriptions uploaded yet.</td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(it.storedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{it.name || "Unknown Patient"}</div>
                      <div className="text-sm text-gray-500">{it.phone || "-"} • {it.email || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {it.filename}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={(base ? `${base}` : "") + `/api/prescriptions/file?name=${encodeURIComponent(it.filename)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
