"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { offers } from "@/data/offers";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OfferDetail({ params }: { params: { slug: string } }) {
  const offer = offers.find((o) => o.slug === params.slug);
  if (!offer) return notFound();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-white">
      <div className={`max-w-4xl mx-auto px-6 py-10 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="mb-6">
          <Link href="/" className="text-emerald-700 hover:underline">← Back to Home</Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{offer.title}</h1>
            <span className="h-fit text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{offer.tag}</span>
          </div>
          <p className="text-gray-600 mt-2">{offer.includes}</p>
          <p className="text-sm text-gray-500 mt-1">Valid: {offer.start} – {offer.end}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-700">₹{offer.price}</span>
            <span className="text-base line-through text-gray-400">₹{offer.mrp}</span>
          </div>

          {offer.poster && (
            <div className="mt-6 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={offer.poster}
                alt={`${offer.title} Poster - Impulse Pathology Laboratory`}
                width={1200}
                height={1200}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          {offer.description && (
            <p className="mt-6 text-gray-800 leading-relaxed">{offer.description}</p>
          )}

          {(offer.posterServices && offer.posterServices.length > 0) || (offer.tests && offer.tests.length > 0) ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Tests Included</h2>
              {offer.posterServices && offer.posterServices.length > 0 ? (
                <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-800">
                  {offer.posterServices.map((svc) => (
                    <li key={svc} className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-[2px]">✔</span>
                      <span>{svc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {offer.tests!.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-transform active:scale-[0.98]">
              Book Now
            </button>
            <Link href="/upload-prescription" className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition-transform active:scale-[0.98]">
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white shadow-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Book: {offer.title}</h3>
              <button onClick={() => !submitting && setOpen(false)} className="px-2 py-1 text-gray-600 hover:text-gray-900">✕</button>
            </div>
            <form
              className="p-5 grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setDone(null);
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const payload = Object.fromEntries(fd.entries());
                try {
                  // Placeholder: wire to backend later if needed
                  console.log({ offer: offer.slug, ...payload });
                  setDone("Your booking request has been received. We will contact you shortly.");
                  (e.currentTarget as HTMLFormElement).reset();
                } catch (err) {
                  setDone("There was an error. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input name="name" required placeholder="Full Name" className="w-full px-3 py-2 rounded-md border border-gray-300" />
                <input name="phone" required placeholder="Phone" pattern="[0-9\\-\\+ ]{8,}" className="w-full px-3 py-2 rounded-md border border-gray-300" />
              </div>
              <input name="email" type="email" placeholder="Email (optional)" className="w-full px-3 py-2 rounded-md border border-gray-300" />
              <div className="grid sm:grid-cols-2 gap-3">
                <input name="date" type="date" required className="w-full px-3 py-2 rounded-md border border-gray-300" />
                <input name="time" type="time" required className="w-full px-3 py-2 rounded-md border border-gray-300" />
              </div>
              <input name="address" placeholder="Address (for home collection)" className="w-full px-3 py-2 rounded-md border border-gray-300" />
              <textarea name="notes" placeholder="Notes" className="w-full px-3 py-2 rounded-md border border-gray-300" />
              {done && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">{done}</div>}
              <div className="mt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-800">Cancel</button>
                <button disabled={submitting} className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
