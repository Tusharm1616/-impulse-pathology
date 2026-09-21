"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Patient = { id: string; name: string; phone?: string; dob?: string };

export default function AdminPatientsPage() {
  const [items, setItems] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<Patient[]>("/patients");
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
      const created = await apiFetch<Patient>("/patients", {
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

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>

      <form onSubmit={addPatient} className="rounded-xl bg-white border border-gray-200 p-4 grid sm:grid-cols-4 gap-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Full name" className="px-3 py-2 rounded-md border border-gray-300" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 rounded-md border border-gray-300" />
        <input value={dob} onChange={(e)=>setDob(e.target.value)} type="date" placeholder="DOB" className="px-3 py-2 rounded-md border border-gray-300" />
        <button disabled={saving} className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold disabled:opacity-60">{saving?"Saving...":"Add Patient"}</button>
      </form>

      <div className="rounded-xl bg-white border border-gray-200">
        <div className="px-4 py-3 border-b text-sm text-gray-600">{loading ? "Loading..." : `${items.length} result(s)`}{error && <span className="text-red-600 ml-2">{error}</span>}</div>
        <div className="divide-y">
          {items.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600">{p.phone || ""} {p.dob ? `• ${p.dob}`: ""}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-800" onClick={()=>alert('Edit mock')}>Edit</button>
                <button className="px-3 py-1 rounded-md border border-red-300 text-red-700" onClick={()=>alert('Delete mock')}>Delete</button>
              </div>
            </div>
          ))}
          {!loading && items.length===0 && (
            <div className="px-4 py-6 text-gray-700">No patients yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
