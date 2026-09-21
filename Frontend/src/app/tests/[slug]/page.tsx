"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { testsBySlug, type TestDetail as TestDetailData } from "@/data/tests";

// Shape is flexible to match your backend
type TestDetail = {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  price?: number;
  observationsCount?: number;
  tatHours?: number;
  sampleRequired?: string;
  preparation?: string;
  gender?: string;
  ageGroup?: string;
  collectionAt?: string;
  bannerUrl?: string;
  overview?: string;
  whatIs?: string;
  components?: string[];
  indications?: string[];
  purpose?: string[];
};

export default function TestDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [data, setData] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => data?.title || data?.name || String(slug).replace(/-/g, " ").toUpperCase(), [data, slug]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const local: TestDetailData | undefined = testsBySlug[String(slug)];
    if (local) {
      setData(local as TestDetail);
      setLoading(false);
    } else {
      setError("Test not found");
      setLoading(false);
    }
  }, [slug]);

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-emerald-50/30 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Left summary card */}
        <aside className="rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-900 to-emerald-700 text-white shadow border border-emerald-800/40">
          <div className="p-5 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-wide">{title}</h1>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-sm uppercase tracking-wide text-white/80 mb-2">Requirements</div>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2"><span>🧫</span><span><span className="text-white/80">Sample Required</span><br/>{data?.sampleRequired || "—"}</span></li>
                <li className="flex items-start gap-2"><span>📋</span><span><span className="text-white/80">Preparations Required</span><br/>{data?.preparation || "No specific preparation required"}</span></li>
                <li className="flex items-start gap-2"><span>⚧️</span><span><span className="text-white/80">Gender</span><br/>{data?.gender || "Male & Female"}</span></li>
                <li className="flex items-start gap-2"><span>🎚️</span><span><span className="text-white/80">Age Group</span><br/>{data?.ageGroup || "0 - 99 Years"}</span></li>
                <li className="flex items-start gap-2"><span>📍</span><span><span className="text-white/80">Collection At</span><br/>{data?.collectionAt || "Home & Lab"}</span></li>
              </ul>
            </div>

            <div className="rounded-xl bg-emerald-500 p-4 text-emerald-950" role="group" aria-label="price and actions">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-white">₹{typeof data?.price === 'number' ? data?.price : "—"}</div>
                <button className="px-4 py-1.5 rounded-md bg-white/20 text-white font-semibold hover:bg-white/30">Add to Cart</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-white">
                <div className="inline-flex items-center gap-2"><span>📄</span><span>{typeof data?.observationsCount === 'number' ? `${data?.observationsCount} Observations` : "Observations included"}</span></div>
                <div className="inline-flex items-center gap-2"><span>⏱️</span><span>{typeof data?.tatHours === 'number' ? `Results in ${data?.tatHours} Hours` : "Fast Results"}</span></div>
              </div>
              <div className="mt-3 text-xs text-white/90 bg-white/10 rounded-md px-3 py-2 flex items-center justify-between">
                <span>10% off New user? Enjoy 10% off up to Rs 200 on all tests and packages.</span>
                <span className="font-semibold">Use Code: NEW10</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right content */}
        <section>
          <div className="rounded-xl bg-white border border-emerald-100 p-4">
            <details open>
              <summary className="flex items-center justify-between cursor-pointer select-none">
                <div className="text-lg font-semibold text-gray-900">{title}</div>
                <span className="text-emerald-700">Observations Included</span>
              </summary>
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm">✅ 10,000+ Tests Done</div>
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm">🧑‍⚕️ Trusted By Doctors</div>
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm">✅ NABL Certified Labs</div>
              </div>
            </details>
          </div>

          <div className="mt-4 space-y-4">
            {loading && <div className="rounded-xl bg-white border border-gray-200 p-5">Loading...</div>}
            {error && (
              <div className="rounded-xl bg-white border border-red-200 p-5 text-red-700">
                {error}. <Link href="/" className="underline">Go back</Link>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Preparation (always show if we at least have preparation or defaults) */}
                <article className="rounded-xl bg-white border border-gray-200 p-5">
                  <h2 className="text-lg font-semibold mb-2">Preparation</h2>
                  <p className="text-gray-700">
                    {data?.preparation || "No special preparation required."}
                  </p>
                </article>

                {/* Key Info table */}
                <article className="rounded-xl bg-white border border-gray-200 p-5">
                  <h2 className="text-lg font-semibold mb-2">Key Information</h2>
                  <div className="grid sm:grid-cols-2 gap-3 text-gray-700">
                    <div><span className="font-medium">Sample Required:</span> {data?.sampleRequired || "—"}</div>
                    <div><span className="font-medium">Turnaround Time:</span> {typeof data?.tatHours === 'number' ? `${data?.tatHours} Hours` : "—"}</div>
                    <div><span className="font-medium">Observations:</span> {typeof data?.observationsCount === 'number' ? `${data?.observationsCount}` : "—"}</div>
                    <div><span className="font-medium">Gender:</span> {data?.gender || "Male & Female"}</div>
                    <div><span className="font-medium">Age Group:</span> {data?.ageGroup || "0 - 99 Years"}</div>
                    <div><span className="font-medium">Collection At:</span> {data?.collectionAt || "Home & Lab"}</div>
                  </div>
                </article>

                {data?.overview && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">Overview</h2>
                    <p className="text-gray-700 whitespace-pre-line">{data.overview}</p>
                  </article>
                )}

                {data?.whatIs && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">What is the {title}?</h2>
                    <p className="text-gray-700 whitespace-pre-line">{data.whatIs}</p>
                  </article>
                )}

                {Array.isArray(data?.components) && data!.components!.length > 0 && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">Components</h2>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      {data!.components!.map((c, i) => (<li key={i}>{c}</li>))}
                    </ul>
                  </article>
                )}

                {Array.isArray(data?.indications) && data!.indications!.length > 0 && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">Indications</h2>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      {data!.indications!.map((c, i) => (<li key={i}>{c}</li>))}
                    </ul>
                  </article>
                )}

                {Array.isArray(data?.purpose) && data!.purpose!.length > 0 && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">Purpose</h2>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      {data!.purpose!.map((c, i) => (<li key={i}>{c}</li>))}
                    </ul>
                  </article>
                )}

                {/* Friendly fallback if there are no long-form fields */}
                {!data?.overview && !data?.whatIs && !Array.isArray(data?.components) && !Array.isArray(data?.indications) && !Array.isArray(data?.purpose) && (
                  <article className="rounded-xl bg-white border border-gray-200 p-5">
                    <h2 className="text-lg font-semibold mb-2">About this test</h2>
                    <p className="text-gray-700">{title} is a diagnostic test offered at Impulse Lab. {data?.preparation ? `Preparation: ${data.preparation}` : "No special preparation is required."}</p>
                  </article>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
