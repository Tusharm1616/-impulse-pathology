"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Patient = { id: string; name: string; phone?: string; email?: string; dob?: string; };

export default function AdminPatientsPage() {
  const [items, setItems] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);

  // History view state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<{ bookings: any[]; reports: any[]; prescriptions: any[] }>({
    bookings: [], reports: [], prescriptions: []
  });
  const [loadingHistory, setLoadingHistory] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<Patient[]>("/api/patients");
      setItems(list);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addPatient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch<Patient>("/api/patients", {
        method: "POST",
        body: JSON.stringify({ name, phone, dob }),
      });
      setItems((prev) => [created, ...prev]);
      setName(""); setPhone(""); setDob("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function viewHistory(p: Patient) {
    setSelectedPatient(p);
    setLoadingHistory(true);
    try {
      const [allBookings, allReports, allPrescriptions] = await Promise.all([
        apiFetch<any[]>("/api/bookings").catch(() => []),
        apiFetch<any[]>("/api/reports").catch(() => []),
        apiFetch<any[]>("/api/prescriptions/list").catch(() => []),
      ]);

      const phoneMatch = p.phone || "---NO_MATCH---";
      const emailMatch = p.email || "---NO_MATCH---";
      const idMatch = p.id;

      const pBookings = (allBookings || []).filter(b => b.phone === phoneMatch || b.email === emailMatch || b.patientId === idMatch);
      const pReports = (allReports || []).filter(r => r.patientId === idMatch || r.phone === phoneMatch || r.email === emailMatch);
      const pPrescriptions = (allPrescriptions || []).filter(pr => pr.phone === phoneMatch || pr.email === emailMatch);

      setHistory({ bookings: pBookings, reports: pReports, prescriptions: pPrescriptions });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div className="space-y-5 relative">
      <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>

      <form onSubmit={addPatient} className="rounded-xl bg-white border border-gray-200 p-4 grid sm:grid-cols-4 gap-3 shadow-sm">
        <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Full name" className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#009B72] focus:outline-none" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#009B72] focus:outline-none" />
        <input value={dob} onChange={(e)=>setDob(e.target.value)} type="date" placeholder="DOB" className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#009B72] focus:outline-none" />
        <button disabled={saving} className="px-4 py-2 rounded-md bg-[#009B72] text-white font-semibold hover:bg-[#008262] transition-colors disabled:opacity-60">{saving?"Saving...":"Add Patient"}</button>
      </form>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-gray-600 bg-gray-50">{loading ? "Loading..." : `${items.length} result(s)`}{error && <span className="text-red-600 ml-2">{error}</span>}</div>
        <div className="divide-y">
          {items.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => viewHistory(p)}>
              <div>
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600">{p.phone || "No phone"} {p.dob ? `• ${p.dob}`: ""}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-[#009B72] text-sm font-medium hover:underline px-2 py-1">View History →</button>
              </div>
            </div>
          ))}
          {!loading && items.length===0 && (
            <div className="px-4 py-6 text-gray-700 text-center">No patients found.</div>
          )}
        </div>
      </div>

      {/* Slide-over for History */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
          <div className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col transform transition-transform border-l border-gray-200">
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h2>
                <div className="text-sm text-gray-500">{selectedPatient.phone || "No phone"} • ID: <span className="font-mono text-xs">{selectedPatient.id}</span></div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-700 p-2 text-2xl leading-none">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingHistory ? (
                <div className="text-center text-gray-500 py-10">Loading history...</div>
              ) : (
                <>
                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Bookings ({history.bookings.length})</h3>
                    <div className="space-y-3">
                      {history.bookings.length === 0 ? <p className="text-gray-500 text-sm">No bookings found.</p> : null}
                      {history.bookings.map(b => (
                        <div key={b.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900">{b.service}</div>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{b.status || 'Confirmed'}</span>
                          </div>
                          <div className="text-xs text-gray-500">{b.date}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Reports ({history.reports.length})</h3>
                    <div className="space-y-3">
                      {history.reports.length === 0 ? <p className="text-gray-500 text-sm">No reports found.</p> : null}
                      {history.reports.map(r => (
                        <div key={r.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                          <div className="font-medium text-gray-900">{r.test || "Report"}</div>
                          {r.url && <a href={r.url} target="_blank" className="text-xs text-blue-600 hover:underline">View</a>}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Prescriptions ({history.prescriptions.length})</h3>
                    <div className="space-y-3">
                      {history.prescriptions.length === 0 ? <p className="text-gray-500 text-sm">No prescriptions found.</p> : null}
                      {history.prescriptions.map((pr, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{pr.filename}</div>
                            <div className="text-xs text-gray-500">{new Date(pr.storedAt).toLocaleDateString()}</div>
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
