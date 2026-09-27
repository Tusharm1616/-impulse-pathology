"use client";

import { useEffect, useState } from "react";
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const data = await apiFetch("/bookings");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const updated = await apiFetch(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: updated.status } : b));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  }

  if (loading) return <div className="p-4">Loading bookings...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <button onClick={fetchBookings} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Refresh</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Patient</th>
                <th className="p-4 font-semibold text-gray-600">Service</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">{booking.date}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{booking.service}</div>
                      {booking.subTests.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={booking.subTests.join(", ")}>
                          {booking.subTests.join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(booking.createdAt).toLocaleDateString()}
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
