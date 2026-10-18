// components/ContactModal.tsx
"use client";

import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import {
  LAB_NAME,
  LAB_PHONE_DISPLAY,
  LAB_PHONE_TEL,
  LAB_EMAIL,
  LAB_EMAIL_MAILTO,
  LAB_WHATSAPP_URL,
} from "@/lib/siteConfig";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Us Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 bg-[#0E3A45] hover:bg-[#07242c] text-white px-5 py-3 rounded-full shadow-lg transition z-50 text-sm font-semibold"
      >
        Contact Us
      </button>

      {/* Floating WhatsApp Icon with Pulse */}
      <a
        href={LAB_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
        aria-label="Chat with Impulse Pathology Laboratory on WhatsApp"
      >
        <div className="relative">
          {/* Pulse Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
          {/* WhatsApp Button */}
          <span className="relative flex items-center justify-center bg-[#25D366] hover:bg-[#20ba59] text-white p-4 rounded-full shadow-lg transition">
            <FaWhatsapp className="text-2xl" />
          </span>
        </div>
      </a>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center text-[#0E3A45] font-display">
              📍 {LAB_NAME}
            </h2>

            <div className="space-y-4">
              {/* Phone */}
              <a
                href={LAB_PHONE_TEL}
                className="flex items-center gap-3 bg-gray-50 hover:bg-emerald-50 px-4 py-3 rounded-xl transition border border-gray-100"
              >
                <FaPhoneAlt className="text-[#009B72] text-lg flex-shrink-0" />
                <span className="font-semibold text-gray-800 text-sm">{LAB_PHONE_DISPLAY}</span>
              </a>

              {/* Email */}
              <a
                href={LAB_EMAIL_MAILTO}
                className="flex items-center gap-3 bg-gray-50 hover:bg-emerald-50 px-4 py-3 rounded-xl transition border border-gray-100"
              >
                <FaEnvelope className="text-[#009B72] text-lg flex-shrink-0" />
                <span className="font-semibold text-gray-800 text-xs sm:text-sm break-all">{LAB_EMAIL}</span>
              </a>

              {/* WhatsApp Inside Modal */}
              <a
                href={LAB_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-4 py-3 rounded-xl transition shadow-sm"
              >
                <FaWhatsapp className="text-xl" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}