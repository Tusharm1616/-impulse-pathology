
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  TrophyIcon,
  CheckBadgeIcon,
  HeartIcon,
  UsersIcon,
  BeakerIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  BoltIcon,
  ScaleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

 

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Pathologist",
      exp: "15+ Years",
      spec: "Clinical Pathology",
      img: "/team/dr-sharma.png",
    },
    {
      name: "Dr. Michael Chen",
      role: "Laboratory Director",
      exp: "12+ Years",
      spec: "Molecular Diagnostics",
      img: "/images/team/dr-chen.jpg",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Senior Microbiologist",
      exp: "10+ Years",
      spec: "Microbiology",
      img: "/images/team/dr-priya.jpg",
    },
    {
      name: "Dr. Robert Williams",
      role: "Biochemistry Head",
      exp: "14+ Years",
      spec: "Clinical Biochemistry",
      img: "/images/team/dr-robert.jpg",
    },
  ];

  // Mobile-only horizontal scroller for Team
  const teamRef = useRef<HTMLDivElement | null>(null);
  const isUserInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const container = teamRef.current;
    if (!container) return;

    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    let interval: number | null = null;

    const stepScroll = () => {
      if (!container || isDesktop() || isUserInteractingRef.current) return;
      const first = container.querySelector<HTMLElement>("[data-team-card]");
      if (!first) return;
      const cardWidth = first.getBoundingClientRect().width;
      const gap = 16; // gap-4
      const step = Math.round(cardWidth + gap);
      const maxScroll = container.scrollWidth - container.clientWidth;
      const atEnd = container.scrollLeft + step >= maxScroll - 2; // tolerance
      if (atEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const start = () => {
      if (interval) return;
      interval = window.setInterval(stepScroll, 3000);
    };
    const stop = () => {
      if (interval !== null) {
        window.clearInterval(interval);
        interval = null;
      }
    };

    // Pause on interaction, resume after idle
    const onInteractStart = () => {
      isUserInteractingRef.current = true;
      stop();
      if (resumeTimeoutRef.current !== null) window.clearTimeout(resumeTimeoutRef.current);
    };
    const onInteractEnd = () => {
      if (resumeTimeoutRef.current !== null) window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = window.setTimeout(() => {
        isUserInteractingRef.current = false;
        start();
      }, 1500);
    };

    container.addEventListener("touchstart", onInteractStart, { passive: true });
    container.addEventListener("touchend", onInteractEnd, { passive: true });
    container.addEventListener("mousedown", onInteractStart);
    container.addEventListener("mouseup", onInteractEnd);
    container.addEventListener("wheel", onInteractStart, { passive: true });

    const handleResize = () => {
      if (isDesktop()) {
        stop();
      } else {
        start();
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("touchstart", onInteractStart as any);
      container.removeEventListener("touchend", onInteractEnd as any);
      container.removeEventListener("mousedown", onInteractStart as any);
      container.removeEventListener("mouseup", onInteractEnd as any);
      container.removeEventListener("wheel", onInteractStart as any);
      if (resumeTimeoutRef.current !== null) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fffb] text-[#0b2545]">
      {/* SECTION 1: About Header */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#002f4b] to-[#009972]">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold"
            >
              About Impulse Lab
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 max-w-3xl mx-auto text-white/90"
            >
              Pioneering excellence in diagnostic healthcare with cutting-edge technology, compassionate care, and unwavering commitment to your health and wellness.
            </motion.p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { icon: <TrophyIcon className="h-6 w-6 text-white" />, text: "15+ Years of Excellence in Healthcare" },
                { icon: <CheckBadgeIcon className="h-6 w-6 text-white" />, text: "99.9% Accuracy in Test Results" },
                { icon: <HeartIcon className="h-6 w-6 text-white" />, text: "50,000+ Lives Touched" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 shadow-sm border border-white/15"
                >
                  <div className="flex-shrink-0">{s.icon}</div>
                  <p className="text-sm md:text-base text-white">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Story of Excellence</h2>
            <p className="mt-4 text-[#0b2545]/80">
              Founded in 2009, Impulse Lab began with a simple yet powerful vision: to make high-quality diagnostic services accessible to everyone. Over the years, our dedication to precision, compassion, and innovation has transformed us into a trusted leader in diagnostic healthcare.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { year: "2009", label: "Foundation" },
                { year: "2015", label: "Accreditation" },
                { year: "2020", label: "Digital Transformation" },
              ].map((m, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-4">
                  <div className="text-[#009972] font-semibold">{m.year}</div>
                  <div className="text-sm text-[#0b2545]/70">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img src="/about/lab-team.jpg" alt="Impulse Lab team at work" className="w-full rounded-2xl shadow-md object-cover" />
          </div>
        </div>
      </section>

      {/* SECTION 3: Mission and Vision */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-emerald-100 bg-[#f8fffb] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#009972]">
              <BeakerIcon className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Our Mission</h3>
            </div>
            <p className="mt-3 text-[#0b2545]/80">
              To provide accurate, reliable, and timely diagnostic services that empower healthcare professionals and patients to make informed decisions for better health outcomes.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#2c7be5]">
              <AcademicCapIcon className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Our Vision</h3>
            </div>
            <p className="mt-3 text-[#0b2545]/80">
              To be the most trusted and innovative pathology laboratory, setting new standards in diagnostic excellence and patient-centered care.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Our Core Values</h2>
          <p className="mt-3 text-[#0b2545]/70">These fundamental principles guide every decision we make and every service we provide.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Accuracy", desc: "Precision in every test", icon: <ShieldCheckIcon className="h-7 w-7 text-[#009972]" /> },
              { title: "Compassion", desc: "Caring for patients with empathy", icon: <HeartIcon className="h-7 w-7 text-[#009972]" /> },
              { title: "Innovation", desc: "Embracing technology", icon: <BoltIcon className="h-7 w-7 text-[#009972]" /> },
              { title: "Integrity", desc: "Transparent practices", icon: <ScaleIcon className="h-7 w-7 text-[#009972]" /> },
            ].map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-white shadow-md p-6 border border-emerald-100 text-left"
              >
                <div className="flex items-center gap-3">{v.icon}<h4 className="font-semibold">{v.title}</h4></div>
                <p className="mt-2 text-sm text-[#0b2545]/70">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Meet Our Expert Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-center"
          >
            Meet Our Expert Team
          </motion.h2>
          <p className="mt-3 text-center text-[#0b2545]/70 max-w-3xl mx-auto">
            Our team of highly qualified medical professionals brings decades of combined experience in pathology, laboratory medicine, and diagnostic excellence.
          </p>

          {/* Mobile horizontal carousel */}
          <div className="mt-8 md:hidden -mx-6 px-6">
            <div
              ref={teamRef}
              className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {teamMembers.map((m, i) => (
                <div
                  key={i}
                  data-team-card
                  className="snap-start shrink-0 w-[260px] rounded-2xl border border-emerald-100 bg-white shadow-md overflow-hidden"
                >
                  <img src={m.img} alt={m.name} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-[#0b2545]/70">{m.role}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#0b2545]/70">
                      <UsersIcon className="h-4 w-4 text-[#2c7be5]" /> <span>{m.exp}</span>
                      <span className="mx-2">•</span>
                      <BeakerIcon className="h-4 w-4 text-[#009972]" /> <span>{m.spec}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="mt-10 hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((m, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="rounded-2xl border border-emerald-100 bg-white shadow-md overflow-hidden">
                <img src={m.img} alt={m.name} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-[#0b2545]/70">{m.role}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#0b2545]/70">
                    <UsersIcon className="h-4 w-4 text-[#2c7be5]" /> <span>{m.exp}</span>
                    <span className="mx-2">•</span>
                    <BeakerIcon className="h-4 w-4 text-[#009972]" /> <span>{m.spec}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Experience & Accreditations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-[#f8fffb] border border-emerald-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              "25+ Medical Professionals",
              "200+ Years Combined Experience",
              "15+ Specialized Departments",
              "24/7 Expert Support",
            ].map((s, i) => (
              <div key={i} className="text-sm md:text-base font-medium text-[#0b2545]">{s}</div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold">Certifications & Accreditations</h3>
            <p className="mt-2 text-[#0b2545]/70">Our commitment to excellence is validated by prestigious certifications from leading healthcare organizations worldwide.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "NABL Accreditation", since: "Since 2015" },
                { title: "ISO 15189:2012", since: "Since 2016" },
                { title: "CAP Certification", since: "Since 2018" },
                { title: "HIPAA Compliance", since: "Since 2019" },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl border border-emerald-100 bg-white shadow-sm p-5">
                  <div className="flex items-center gap-2 text-[#009972]">
                    <CheckCircleIcon className="h-5 w-5" />
                    <h4 className="font-semibold">{c.title}</h4>
                  </div>
                  <p className="mt-2 text-sm text-[#0b2545]/70">Recognized for quality, accuracy, and patient data protection.</p>
                  <div className="mt-3 text-xs text-[#0b2545]/60">{c.since}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Quality Assurance Promise */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#002f4b] to-[#009972]">
          <div className="max-w-7xl mx-auto px-6 py-16 text-white grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Quality Assurance Promise</h3>
              <p className="mt-3 text-white/90">We maintain the highest standards of quality through rigorous testing protocols, continuous monitoring, and regular audits.</p>
              <ul className="mt-5 space-y-2 text-white/95">
                {[
                  "Daily quality control checks",
                  "External quality assessment programs",
                  "Regular equipment calibration",
                  "Continuous staff training programs",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 mt-0.5 text-white" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center shadow-sm">
                <div className="text-3xl font-bold">99.9% Accuracy Rate</div>
                <p className="mt-2 text-white/90 text-sm">Verified by external quality assessment programs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Trusted Partnerships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-bold text-center">Trusted Partnerships</h3>
          <p className="mt-2 text-center text-[#0b2545]/70 max-w-3xl mx-auto">We collaborate with leading healthcare institutions to provide comprehensive diagnostic services and advance medical research.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Apollo Hospitals", role: "Healthcare Partner" },
              { name: "Max Healthcare", role: "Diagnostic Partner" },
              { name: "Fortis Healthcare", role: "Laboratory Services" },
              { name: "AIIMS Delhi", role: "Research Collaboration" },
            ].map((p, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-md border border-blue-100 p-6">
                <div className="flex items-center gap-2 text-[#2c7be5]">
                  <BuildingOffice2Icon className="h-6 w-6" />
                  <h4 className="font-semibold">{p.name}</h4>
                </div>
                <p className="mt-2 text-sm text-[#0b2545]/70">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}