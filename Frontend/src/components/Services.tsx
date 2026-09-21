"use client";

import { FaVial, FaTint, FaXRay, FaHeartbeat, FaVirus } from "react-icons/fa";
import { IconType } from "react-icons";

type Service = {
  icon: IconType;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: FaVial,
    title: "Blood Test",
    description: "Comprehensive blood analysis with accurate reports.",
  },
  {
    icon: FaTint,
    title: "Urine Test",
    description: "Quick and reliable urine analysis for better diagnostics.",
  },
  {
    icon: FaXRay,
    title: "X-Ray",
    description: "High-quality digital X-rays for accurate imaging results.",
  },
  {
    icon: FaHeartbeat,
    title: "ECG",
    description: "Precise heart monitoring with advanced ECG technology.",
  },
  {
    icon: FaVirus,
    title: "Covid Test",
    description: "Fast and trusted RT-PCR and Antigen Covid testing.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          Our Services
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon; // assign to component
            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <Icon size={40} className="text-blue-600" />
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a
                  href="#contact"
                  className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Learn More
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}