// src/app/contact/page.tsx
"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-2 text-lg">We’re here to help you anytime!</p>
      </div>

      {/* Contact Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Address */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
          <div className="flex justify-center">
            <FaMapMarkerAlt className="text-blue-600 text-4xl mb-4" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Our Address</h2>
          <p className="text-gray-600">
            Near Dr. Pharande Dental Hospital, Opposite Lokmanya Hospital,
            <br />
            Chinchwad Railway Station Marg,
            <br />
            Chinchwad, Maharashtra 411033
          </p>
        </div>

        {/* Email */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
          <div className="flex justify-center">
            <FaEnvelope className="text-blue-600 text-4xl mb-4" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Email Us</h2>
          <a
            href="mailto:impulselab@gmail.com"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            impulselab@gmail.com
          </a>
        </div>

        {/* Phone */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition">
          <div className="flex justify-center">
            <FaPhoneAlt className="text-blue-600 text-4xl mb-4" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Call Us</h2>
          <a
            href="tel:+919876543210"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* WhatsApp Button */}
      <div className="flex justify-center mt-6">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition"
        >
          <FaWhatsapp className="text-2xl" />
          Chat on WhatsApp
        </a>
      </div>

      {/* Google Map Embed */}
      <div className="mt-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.449193418451!2d73.8037!3d18.6297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf123456789%3A0xabcdef123456789!2sImpulse%20Pathology%20Lab!5e0!3m2!1sen!2sin!4v1695891793847"
          width="100%"
          height="400"
          allowFullScreen
          loading="lazy"
          className="border-0 w-full"
        ></iframe>
      </div>
    </div>
  );
}