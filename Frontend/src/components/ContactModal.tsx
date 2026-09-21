// components/ContactModal.tsx
"use client";

import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Us Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        Contact Us
      </button>

      {/* Floating WhatsApp Icon with Pulse */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Pulse Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
          {/* WhatsApp Button */}
          <span className="relative flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition">
            <FaWhatsapp className="text-2xl" />
          </span>
        </div>
      </a>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
              📍 Impulse Pathology Lab
            </h2>

            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                <FaPhoneAlt className="text-blue-600 text-lg" />
                <span className="font-medium">+91 98765 43210</span>
              </a>

              {/* Email */}
              <a
                href="mailto:impulselab@gmail.com"
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                <FaEnvelope className="text-blue-600 text-lg" />
                <span className="font-medium">impulselab@gmail.com</span>
              </a>

              {/* WhatsApp Inside Modal */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                <FaWhatsapp className="text-xl" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}