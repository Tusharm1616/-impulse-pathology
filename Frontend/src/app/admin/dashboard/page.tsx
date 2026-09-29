"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{patients:number; bookings:number; byStatus:Record<string,number>}>({
    patients:0, bookings:0, byStatus:{}
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [p, b] = await Promise.all([
          apiFetch<any[]>("/api/patients"),
          apiFetch<any[]>("/api/bookings"),
        ]);
        
        const bookingsList = b || [];
        const statusCounts: Record<string, number> = {};
        bookingsList.forEach((bk: any) => {
          const st = bk.status || 'Confirmed'; // default status
          statusCounts[st] = (statusCounts[st] || 0) + 1;
        });

        setStats({ 
          patients: p?.length || 0, 
          bookings: bookingsList.length,
          byStatus: statusCounts
        });
        setRecentBookings(bookingsList.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="text-sm text-gray-600">Total Patients</div>
          <div className="text-3xl font-bold text-[#009B72]">{stats.patients}</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="text-sm text-gray-600">Total Bookings</div>
          <div className="text-3xl font-bold text-[#009B72]">{stats.bookings}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Bookings by Status</h2>
          {loading ? <div className="text-gray-500">Loading...</div> : (
            <ul className="space-y-2">
              {Object.entries(stats.byStatus).length === 0 && <li className="text-gray-500">No bookings yet.</li>}
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-gray-700 capitalize">{status}</span>
                  <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">5 Most Recent Bookings</h2>
          {loading ? <div className="text-gray-500">Loading...</div> : (
            <ul className="divide-y">
              {recentBookings.length === 0 && <li className="text-gray-500">No recent bookings.</li>}
              {recentBookings.map((b:any)=> (
                <li key={b.id} className="py-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{b.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">{b.status || 'Confirmed'}</span>
                  </div>
                  <div className="text-sm text-gray-600">{b.service} - {b.date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
