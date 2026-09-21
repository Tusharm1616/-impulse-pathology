"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{patients:number; reports:number}>({patients:0, reports:0});
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [p, r] = await Promise.all([
        apiFetch<any[]>("/patients"),
        apiFetch<any[]>("/reports"),
      ]);
      setStats({ patients: p.length || 0, reports: r.length || 0 });
      setRecentPatients(p.slice(0,5));
      setRecentReports(r.slice(0,5));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="text-sm text-gray-600">Total Patients</div>
          <div className="text-3xl font-bold text-emerald-700">{stats.patients}</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="text-sm text-gray-600">Reports Uploaded</div>
          <div className="text-3xl font-bold text-emerald-700">{stats.reports}</div>
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <div className="text-sm text-gray-600">Recent Activity</div>
          <div className="text-3xl font-bold text-emerald-700">{(recentPatients.length+recentReports.length)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-3">Recent Patients</h2>
          {loading ? <div>Loading...</div> : (
            <ul className="divide-y">
              {recentPatients.map((p:any)=> (
                <li key={p.id} className="py-2 flex items-center justify-between">
                  <span className="font-medium text-gray-900">{p.name}</span>
                  <span className="text-sm text-gray-600">{p.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl bg-white border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-3">Recent Reports</h2>
          {loading ? <div>Loading...</div> : (
            <ul className="divide-y">
              {recentReports.map((r:any)=> (
                <li key={r.id} className="py-2 flex items-center justify-between">
                  <span className="font-medium text-gray-900">{r.test}</span>
                  <a className="text-sm text-emerald-700 hover:underline" href={r.url || '#'}>Open</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
