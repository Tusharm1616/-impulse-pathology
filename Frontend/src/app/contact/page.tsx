// src/app/contact/page.tsx
"use client";

import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaWhatsapp, 
  FaClock, 
  FaDirections,
  FaExternalLinkAlt 
} from "react-icons/fa";
import {
  LAB_NAME,
  LAB_ADDRESS,
  LAB_PHONE_DISPLAY,
  LAB_PHONE_TEL,
  LAB_EMAIL,
  LAB_EMAIL_MAILTO,
  LAB_WHATSAPP_URL,
  LAB_MAPS_SEARCH_URL,
  LAB_MAPS_EMBED_URL,
  LAB_HOURS,
} from "@/lib/siteConfig";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-neutral/50 text-brand-textH">
      {/* Header Banner - Brand Teal Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#002f4b] via-[#0E3A45] to-[#009972] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs sm:text-sm font-medium tracking-wide uppercase mb-4 border border-white/20">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            Contact Us
          </h1>
          <p className="mt-3 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto">
            We’re here to help you anytime!
          </p>
        </div>
        {/* Subtle decorative glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30" 
          style={{
            background: "radial-gradient(circle at 20% 20%, rgba(0, 194, 154, 0.4), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 161, 255, 0.3), transparent 50%)"
          }}
        />
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href={LAB_PHONE_TEL}
            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#009B72] to-[#00C29A] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[180px] text-base"
          >
            <FaPhoneAlt className="text-lg" />
            <span>Call Now</span>
          </a>

          <a
            href={LAB_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[180px] text-base"
          >
            <FaWhatsapp className="text-xl" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={LAB_MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-[#0E3A45] hover:bg-[#07242c] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all min-w-[180px] text-base"
          >
            <FaDirections className="text-xl" />
            <span>Get Directions</span>
          </a>
        </div>

        {/* Info Cards Grid (3 Main Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-brand-primary/10 hover:shadow-soft-hover transition-all flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#009B72] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#009B72] group-hover:text-white transition-all shadow-sm">
              <FaMapMarkerAlt className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold font-display text-brand-textH mb-3">Our Address</h2>
            <p className="text-brand-textB text-sm sm:text-base leading-relaxed flex-grow">
              {LAB_ADDRESS}
            </p>
            <a
              href={LAB_MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#009B72] hover:text-[#0E3A45] transition-colors"
            >
              <span>View on Google Maps</span>
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-brand-primary/10 hover:shadow-soft-hover transition-all flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#009B72] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#009B72] group-hover:text-white transition-all shadow-sm">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold font-display text-brand-textH mb-3">Call Us</h2>
            <p className="text-brand-textB text-sm sm:text-base leading-relaxed mb-1">
              Direct assistance & telephone enquiries
            </p>
            <div className="mt-2 flex-grow flex items-center">
              <a
                href={LAB_PHONE_TEL}
                className="text-lg sm:text-xl font-bold text-[#0E3A45] hover:text-[#009B72] transition-colors tracking-wide"
              >
                {LAB_PHONE_DISPLAY}
              </a>
            </div>
            <a
              href={LAB_PHONE_TEL}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#009B72] hover:text-[#0E3A45] transition-colors"
            >
              <span>Dial Now</span>
              <FaPhoneAlt className="text-xs" />
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-brand-primary/10 hover:shadow-soft-hover transition-all flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#009B72] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#009B72] group-hover:text-white transition-all shadow-sm">
              <FaEnvelope className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold font-display text-brand-textH mb-3">Email Us</h2>
            <p className="text-brand-textB text-sm sm:text-base leading-relaxed mb-1">
              Send us reports, queries, or feedback
            </p>
            <div className="mt-2 flex-grow flex items-center justify-center w-full max-w-full">
              <a
                href={LAB_EMAIL_MAILTO}
                className="text-[13px] sm:text-sm lg:text-[13px] xl:text-sm font-semibold text-[#0E3A45] hover:text-[#009B72] transition-colors break-words [overflow-wrap:anywhere] max-w-full text-center leading-snug"
                title={LAB_EMAIL}
              >
                <span className="inline-block">impulsepathologylaboratory</span>
                <wbr />
                <span className="inline-block">@gmail.com</span>
              </a>
            </div>
            <a
              href={LAB_EMAIL_MAILTO}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#009B72] hover:text-[#0E3A45] transition-colors"
            >
              <span>Compose Email</span>
              <FaEnvelope className="text-xs" />
            </a>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-soft border border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#009B72] flex items-center justify-center flex-shrink-0">
              <FaClock className="text-lg" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 block">
                Working Hours
              </span>
              <span className="text-base sm:text-lg font-bold text-brand-textH">
                {LAB_HOURS}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#009B72] text-xs font-semibold border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-[#009B72] animate-pulse"></span>
            <span>24/7 Available</span>
          </div>
        </div>

        {/* Interactive Google Map Section */}
        <div className="mt-12 bg-white rounded-3xl p-4 sm:p-6 shadow-soft border border-brand-primary/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 px-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-textH flex items-center gap-2">
                <span>📍 Location Map</span>
              </h2>
              <p className="text-sm text-brand-textB mt-1">
                Find {LAB_NAME} at Marunji Road, near Gurukrupa Hospital, Laxmi Chowk
              </p>
            </div>
            <a
              href={LAB_MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-[#009B72] hover:bg-[#009B72] hover:text-white font-semibold text-sm border border-emerald-200/60 shadow-sm transition-all"
            >
              <FaDirections className="text-base" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <div className="w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100">
            <iframe
              src={LAB_MAPS_EMBED_URL}
              title={`${LAB_NAME} Location Map`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}