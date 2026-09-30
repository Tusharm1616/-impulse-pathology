"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // History view state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<{ bookings: any[]; reports: any[]; prescriptions: any[] }>({
    bookings: [], reports: [], prescriptions: []
  });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<User[]>("/api/users");
      setItems(list);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function viewHistory(u: User) {
    setSelectedUser(u);
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const data = await apiFetch<any>(`/api/users/${u.id}/history`);
      setHistory({
        bookings: data.bookings || [],
        reports: data.reports || [],
        prescriptions: data.prescriptions || []
      });
    } catch (err: any) {
      console.error(err);
      setHistoryError(err.message || "Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div className="space-y-5 relative">
      <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-600 bg-gray-50">{loading ? "Loading..." : `${items.length} result(s)`}{error && <span className="text-red-600 ml-2">{error}</span>}</div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Registered</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => viewHistory(u)}>
                  <td className="p-4 align-top font-medium text-gray-900">{u.name}</td>
                  <td className="p-4 align-top text-gray-800 flex items-center gap-2">
                    {u.email}
                    {!u.isVerified && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">Unverified</span>}
                  </td>
                  <td className="p-4 align-top">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-top">
                    <button className="text-[#009B72] text-sm font-medium hover:underline">View History →</button>
                  </td>
                </tr>
              ))}
              {!loading && items.length===0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over for History */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col transform transition-transform border-l border-gray-200">
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                <div className="text-sm text-gray-500">{selectedUser.email} • <span className={`text-xs px-1.5 py-0.5 rounded ${selectedUser.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{selectedUser.isVerified ? "Verified" : "Unverified"}</span></div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-700 p-2 text-2xl leading-none">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingHistory ? (
                <div className="text-center text-gray-500 py-10">Loading history...</div>
              ) : historyError ? (
                <div className="text-center text-red-500 py-10">{historyError}</div>
              ) : (
                <>
                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Bookings ({history.bookings.length})</h3>
                    <div className="space-y-3">
                      {history.bookings.length === 0 ? <p className="text-gray-500 text-sm">No bookings yet.</p> : null}
                      {history.bookings.map(b => (
                        <div key={b.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900">{b.service}</div>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{b.status || 'Confirmed'}</span>
                          </div>
                          {b.subTests && b.subTests.length > 0 && <div className="text-xs text-gray-500 mb-1">{b.subTests.join(", ")}</div>}
                          <div className="text-xs text-gray-500">Date: {b.date} • Booked: {new Date(b.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Reports ({history.reports.length})</h3>
                    <div className="space-y-3">
                      {history.reports.length === 0 ? <p className="text-gray-500 text-sm">No reports yet.</p> : null}
                      {history.reports.map(r => (
                        <div key={r.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{r.test || "Report"}</div>
                            <div className="text-xs text-gray-500">Uploaded: {new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                          {r.url && <a href={r.url} target="_blank" className="text-xs text-blue-600 hover:underline">View</a>}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Prescriptions ({history.prescriptions.length})</h3>
                    <div className="space-y-3">
                      {history.prescriptions.length === 0 ? <p className="text-gray-500 text-sm">No prescriptions yet.</p> : null}
                      {history.prescriptions.map((pr, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{pr.filename}</div>
                            <div className="text-xs text-gray-500">Uploaded: {new Date(pr.storedAt).toLocaleDateString()}</div>
                          </div>
                          <a href={`/api/prescriptions/file?name=${encodeURIComponent(pr.filename)}`} target="_blank" className="text-xs text-blue-600 hover:underline">Download</a>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
