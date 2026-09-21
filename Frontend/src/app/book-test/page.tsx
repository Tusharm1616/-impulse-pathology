"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { serviceData } from "@/data/servicesData";

export default function BookTestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedService = searchParams.get("service") || "";
  const selectedSlug = searchParams.get("slug") || "";

  const service = serviceData[selectedSlug];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: selectedService,
    date: "",
    subTests: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubTestToggle = (test: string) => {
    setFormData((prev) => {
      const isSelected = prev.subTests.includes(test);
      return {
        ...prev,
        subTests: isSelected
          ? prev.subTests.filter((t) => t !== test)
          : [...prev.subTests, test],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (service && service.subTests.length > 0 && formData.subTests.length === 0) {
      alert("⚠️ Please select at least one sub-test before booking.");
      return;
    }

    router.push(
      `/booking-success?service=${encodeURIComponent(formData.service)}&date=${
        formData.date
      }&subTests=${encodeURIComponent(formData.subTests.join(", "))}`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-2">Book Your Test</h1>
        <p className="text-lg opacity-90">Quick • Easy • Reliable</p>
      </section>

      {/* Booking Form */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-10 grid md:grid-cols-2 gap-10 border border-gray-200"
        >
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Right Column - Test Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Test Details
            </h2>
            <input
              type="text"
              name="service"
              value={formData.service}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
            />
            {service && (
              <div>
                <p className="mb-2 text-gray-700 font-medium">
                  Choose Sub-Tests <span className="text-red-500">*</span>
                </p>
                <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                  {service.subTests.map((test, i) => (
                    <label
                      key={i}
                      className="flex justify-between items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.subTests.includes(test.name)}
                          onChange={() => handleSubTestToggle(test.name)}
                          className="h-5 w-5 text-teal-600"
                        />
                        <span className="text-gray-700">{test.name}</span>
                      </div>
                      <span className="text-blue-600 font-medium">₹{test.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-105"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}