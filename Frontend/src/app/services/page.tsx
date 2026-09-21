"use client";

import Link from "next/link";
import { serviceData } from "@/data/servicesData";

export default function ServicesPage() {
  const services = Object.values(serviceData);

  return (
    <main className="min-h-[100dvh] bg-[#f8fffb] pt-24 md:pt-28">
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-12">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0b2545]">Our Diagnostic Services</h1>
          <p className="mt-3 md:mt-4 text-gray-600 max-w-3xl mx-auto">Comprehensive lab testing across Hematology, Biochemistry, Clinical Pathology, and more. Trusted, accurate, and timely results.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon as any;
            return (
              <Link
                key={i}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl border border-emerald-100 shadow-md hover:shadow-lg transition-shadow p-6 md:p-7 flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-[#009972] flex items-center justify-center shadow-sm">
                    <Icon className="text-2xl" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#0b2545]">{service.title}</h2>
                </div>
                <p className="mt-3 text-gray-600 flex-1">{service.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <span className={`inline-block h-2 w-2 rounded-full bg-[#2c7be5]`}></span>
                    {service.subTests.length} tests
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#009972] text-white text-sm font-medium shadow-sm group-hover:opacity-95">View Details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}