"use client";

import { useParams, useRouter } from "next/navigation";
import { serviceData } from "@/data/servicesData";

export default function ServiceDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const service = serviceData[slug as string];

  if (!service) {
    return <p className="text-center py-20 text-gray-600">Service not found</p>;
  }

  return (
    <main className="min-h-[100dvh] bg-[#f8fffb] pt-24 md:pt-28">
      {/* Hero */}
      <section className={`bg-gradient-to-r ${service.gradient} text-white text-center py-14 px-6`}>
        <div className="flex justify-center mb-3">
          <service.icon className="text-5xl" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{service.title}</h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg opacity-95">{service.description}</p>
      </section>

      {/* Details */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-12 grid gap-8">
        {/* Summary chips */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#0b2545] shadow-sm border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-[#2c7be5]"></span>
            {service.subTests.length} tests
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#0b2545] shadow-sm border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Trusted, accurate results
          </span>
        </div>

        {/* Included Tests */}
        <div className="rounded-2xl bg-white/90 backdrop-blur border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-[#0b2545] mb-4">Included Tests</h2>
          <ul className="divide-y rounded-xl overflow-hidden">
            {service.subTests.map((test, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3 px-3 bg-white hover:bg-emerald-50/50 transition-colors">
                <div className="text-gray-800">{test.name}</div>
                <div className="text-[#2c7be5] font-medium">₹{test.price}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Preparation */}
        <div className="rounded-2xl bg-white/90 backdrop-blur border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-[#0b2545] mb-4">Preparation Guidelines</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {service.subTests.map((test, i) => (
              <li key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0b2545]">
                <div className="font-medium">{test.name}</div>
                <div className="text-sm text-gray-700 mt-1">{test.preparation}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/book-test?service=${encodeURIComponent(service.title)}&slug=${service.slug}`)}
            className="inline-flex items-center gap-2 bg-[#009972] hover:bg-[#008262] text-white px-8 py-3 rounded-xl text-base md:text-lg font-semibold shadow-md transition"
          >
            Book {service.title}
            <span>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}