"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Report = { id: string; patientId?: string; patientName?: string; test?: string; url?: string; createdAt?: string; };
type Patient = { id: string; name: string; phone?: string; };

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState("");
  const [test, setTest] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [reportsList, patientsList] = await Promise.all([
        apiFetch<Report[]>("/api/reports"),
        apiFetch<Patient[]>("/api/patients")
      ]);
      setItems(reportsList);
      setPatients(patientsList);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function uploadReport(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Select a file");
    if (!patientId) return alert("Select a patient");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("patientId", patientId);
      if (test) fd.append("test", test);
      fd.append("file", file);
      const created = await apiFetch<Report>("/api/reports", { method: "POST", body: fd });
      
      const pat = patients.find(p => p.id === patientId);
      setItems((prev) => [ { ...created, patientId, patientName: pat?.name, test, url: created.url || "#", createdAt: new Date().toISOString() }, ...prev ]);
      setPatientId(""); setTest(""); setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('reportFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  // Lookup phone from patients list if not returned by reports API
  function getPatientPhone(pid?: string) {
    if (!pid) return "-";
    const p = patients.find(pat => pat.id === pid);
    return p?.phone || "No phone";
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Upload New Report</h2>
        </div>
        <form onSubmit={uploadReport} className="p-6 grid sm:grid-cols-[2fr_1fr_2fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Patient</label>
            <select 
              value={patientId} 
              onChange={(e)=>setPatientId(e.target.value)} 
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009B72]"
              required
            >
              <option value="">Select a patient...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.phone ? `(${p.phone})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Test Name</label>
            <input 
              value={test} 
              onChange={(e)=>setTest(e.target.value)} 
              placeholder="e.g., Blood Test" 
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009B72]" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Report PDF</label>
            <input 
              id="reportFile"
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e)=>setFile(e.target.files?.[0] || null)} 
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009B72]" 
              required
            />
          </div>
          <button disabled={uploading} className="px-6 py-2 rounded-md bg-[#009B72] text-white font-semibold hover:bg-[#008262] transition-colors disabled:opacity-60 h-[42px]">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Uploaded Reports</h2>
          <span className="text-sm text-gray-600">{loading ? "Loading..." : `${items.length} report(s)`}</span>
        </div>
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 bg-white">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Test Name</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.patientName || "Unknown Patient"}</div>
                    <div className="text-sm text-gray-500">{getPatientPhone(r.patientId)}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {r.test || "General Report"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={r.url || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
              {!loading && items.length===0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No reports uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
