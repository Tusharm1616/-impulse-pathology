"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPrescriptionPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an image or PDF prescription to upload.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("email", email);
      form.append("notes", notes);
      form.append("file", file);

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const target = base ? `${base}/prescriptions` : "/api/prescriptions";
      const res = await fetch(target, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Upload failed");
      }

      setMessage("Thank you! Your prescription was uploaded. Our team will contact you soon to confirm tests and schedule.");
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement | null)?.value && ((document.getElementById("file-input") as HTMLInputElement).value = "");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-emerald-700 hover:underline">← Back to Home</Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Prescription</h1>
        <p className="text-gray-600 mb-8">Upload an image or PDF of your doctor\'s prescription. Our team will review it, confirm the required tests, provide a quote, and schedule collection or a lab visit.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required pattern="^[0-9+\-() ]{7,}$" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription File (jpg, png, pdf)</label>
            <input id="file-input" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={submitting} className="px-6 py-3 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60">
              {submitting ? "Uploading..." : "Submit"}
            </button>
          </div>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </main>
  );
}
