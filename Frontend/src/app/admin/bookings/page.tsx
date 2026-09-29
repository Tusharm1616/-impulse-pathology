"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  subTests: string[];
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "Confirmed",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Completed",
  "Cancelled"
];

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "sample collected") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "processing" || s === "report ready") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "completed") return "bg-green-100 text-green-800 border-green-200";
  if (s === "cancelled") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const data = await apiFetch<Booking[]>("/api/bookings");
      // Set default status if missing
      setBookings(data.map(b => ({ ...b, status: b.status || "Confirmed" })));
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const updated = await apiFetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: updated.status } : b));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch = search ? (
        (b.name || "").toLowerCase().includes(search.toLowerCase()) || 
        (b.phone || "").includes(search)
      ) : true;
      const matchStatus = statusFilter ? b.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  if (loading) return <div className="p-4">Loading bookings...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B72]"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B72]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button onClick={fetchBookings} className="bg-[#009B72] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Patient</th>
                <th className="p-4 font-semibold text-gray-600">Test / Service</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No bookings match your filters.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap align-top">{booking.date}</td>
                    <td className="p-4 align-top">
                      <div className="font-medium text-gray-800">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-medium text-gray-800">{booking.service}</div>
                      {booking.subTests && booking.subTests.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={booking.subTests.join(", ")}>
                          {booking.subTests.join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <select 
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className={`text-sm font-medium border rounded-full px-3 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-colors appearance-none ${getStatusColor(booking.status)}`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
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
