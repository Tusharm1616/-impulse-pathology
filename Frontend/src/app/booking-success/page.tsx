"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const service = searchParams.get("service") || "Unknown";
  const date = searchParams.get("date") || "Not Selected";
  const subTests = searchParams.get("subTests") || "None";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for booking your test with us. Below are your details:
        </p>

        <div className="text-left space-y-3 mb-6">
          <p>
            <span className="font-semibold text-gray-700">Service:</span>{" "}
            {service}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            {date}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Sub-Tests:</span>{" "}
            {subTests}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
          >
            Go Home
          </button>
          <button
            onClick={() => router.push("/services")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Book Another Test
          </button>
        </div>
      </div>
    </main>
  );
}