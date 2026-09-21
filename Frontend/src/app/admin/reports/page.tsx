"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Report = { id: string; patientId?: string; test?: string; url?: string };

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
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
      const list = await apiFetch<Report[]>("/reports");
      setItems(list);
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
    setUploading(true);
    try {
      const fd = new FormData();
      if (patientId) fd.append("patientId", patientId);
      if (test) fd.append("test", test);
      fd.append("file", file);
      const created = await apiFetch<Report>("/reports", { method: "POST", body: fd });
      setItems((prev) => [ { ...created, patientId, test, url: created.url || "#" }, ...prev ]);
      setPatientId(""); setTest(""); setFile(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>

      <form onSubmit={uploadReport} className="rounded-xl bg-white border border-gray-200 p-4 grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3">
        <input value={patientId} onChange={(e)=>setPatientId(e.target.value)} placeholder="Patient ID" className="px-3 py-2 rounded-md border border-gray-300" />
        <input value={test} onChange={(e)=>setTest(e.target.value)} placeholder="Test Name" className="px-3 py-2 rounded-md border border-gray-300" />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="px-3 py-2 rounded-md border border-gray-300" />
        <button disabled={uploading} className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold disabled:opacity-60">{uploading?"Uploading...":"Upload"}</button>
      </form>

      <div className="rounded-xl bg-white border border-gray-200">
        <div className="px-4 py-3 border-b text-sm text-gray-600">{loading ? "Loading..." : `${items.length} report(s)`}{error && <span className="text-red-600 ml-2">{error}</span>}</div>
        <div className="divide-y">
          {items.map((r) => (
            <div key={r.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{r.test || "Report"}</div>
                <div className="text-sm text-gray-600">Patient: {r.patientId || "-"}</div>
              </div>
              <div className="flex gap-2">
                <a href={r.url || '#'} className="px-3 py-1 rounded-md border border-gray-300 text-gray-800">Download</a>
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-800" onClick={()=>alert('Email sent (mock)')}>Email</button>
              </div>
            </div>
          ))}
          {!loading && items.length===0 && (
            <div className="px-4 py-6 text-gray-700">No reports yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
