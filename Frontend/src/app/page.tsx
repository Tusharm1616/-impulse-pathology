"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Clock, Users, Home as HomeIcon, Smartphone, CreditCard } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { offers } from "@/data/offers";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatCounter from "@/components/StatCounter";
import { branches } from "@/data/branches";
import { popularTests, testsBySlug } from "@/data/tests";
import { serviceData } from "@/data/servicesData";

export default function Home() {
  const images = [
    // Put hero 4 first so it appears immediately
    "/Hero/hero 1.jpg",
    "/Hero/hero 2.jpg", 
    "/Hero/hero 3.jpg", 
    "/Hero/hero 4.jpg", 
  ];

  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [overrideSrcs, setOverrideSrcs] = useState<string[]>(
    images.map((s) => (s.includes(" ") ? s.replace(/ /g, "%20") : s))
  );

  // Real stats state (defaults act as placeholders)
  const [totalPatients, setTotalPatients] = useState<number>(100000);
  const [monthSamples, setMonthSamples] = useState<number>(10000);

  useEffect(() => {
    // Fixed display requested: do not fetch or update values.
  }, []);

  // Why Choose (mobile only): auto-step every 3s, pause on interaction
  useEffect(() => {
    const el = whyRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mq.matches || prefersReduce) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const hasOverflow = () => el.scrollWidth > el.clientWidth + 1;
    const getStep = () => {
      const first = el.querySelector('[data-wcard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 280;
      const gap = 24; // gap-6
      return w + gap;
    };
    const step = () => {
      if (!hasOverflow()) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + getStep();
      if (next >= max - 2) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        el.scrollBy({ left: getStep(), behavior: 'smooth' });
      }
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);
    if (hasOverflow()) start();
    const onResize = () => { if (mq.matches && hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);
    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const el = servicesRef.current;
    if (!el) return;
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;
    const segments = 3;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || (cs as any).gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-scard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 300;
      return w + getGap();
    };
    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); }) : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Branches carousel (mobile only): auto-step every 3s, pause on interaction, loop
  useEffect(() => {
    const el = branchesTrackRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mq.matches || prefersReduce) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const hasOverflow = () => el.scrollWidth > el.clientWidth + 1;
    const getStep = () => {
      const first = el.querySelector('[data-branch-card]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : window.innerWidth - 32;
      const gap = 16; // gap-4
      return w + gap;
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / 3; // tripled items
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);
    start();
    const onResize = () => { if (mq.matches) start(); else stop(); };
    window.addEventListener('resize', onResize);
    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (overrideSrcs.length <= 1) return; // no rotation if single image
    const interval = setInterval(() => {
      setActive((i) => {
        const n = overrideSrcs.length;
        for (let step = 1; step <= n; step++) {
          const j = (i + step) % n;
          if (!failed[j]) return j; // skip failed slides
        }
        return i; // all failed, stay put
      });
    }, 5000); // 5s per slide
    return () => clearInterval(interval);
  }, [overrideSrcs.length, failed]);

  // Lab Finder state and helpers
  type Nearby = {
    id: string;
    name: string;
    area: string;
    lat: number;
    lng: number;
    phone?: string;
    distKm: number;
    address?: string;
    open?: string; // e.g. "07:00"
    close?: string; // e.g. "21:00"
    tests?: string[]; // popular tests
    homeCollection?: boolean;
    rating?: number; // 1..5
  };
  const [nearby, setNearby] = useState<Nearby[] | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [showMapView, setShowMapView] = useState(false);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [filterTest, setFilterTest] = useState("");
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterHomeOnly, setFilterHomeOnly] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);
  const labTrackRef = useRef<HTMLDivElement | null>(null);
  const branchesTrackRef = useRef<HTMLDivElement | null>(null);
  const offersRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);
  const services = useMemo(() => Object.values(serviceData), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("impulse:favLabs");
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("impulse:favLabs", JSON.stringify(favs)); } catch {}
  }, [favs]);
  const toggleFav = (id: string) => setFavs((prev) => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const isOpenNow = (b: Nearby) => {
    if (!b.open || !b.close) return false;
    const now = new Date();
    const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60 + (m||0); };
    const cur = now.getHours()*60 + now.getMinutes();
    const start = toMin(b.open);
    const end = toMin(b.close);
    return cur >= start && cur <= end;
  };
  const etaText = (km?: number) => {
    if (!Number.isFinite(km)) return "";
    const mins = Math.round(((km as number) / 30) * 60); // ~30km/h city
    return `${km!.toFixed(1)} km • ${Math.max(mins,1)} min`;
  };

  // Lab carousel: auto-step every 3s, pause on interaction, loop
  useEffect(() => {
    const wrap = labTrackRef.current;
    if (!wrap) return;
    const el = wrap;
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;
    const segments = 3;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-lcard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 320;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); }) : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const el = offersRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mq.matches || prefersReduce) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const segments = 3; // we render list 3x for seamless wrap
    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-ocard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 280;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); }) : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (mq.matches && hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const testimonials = [
    { name: "Amit Patil", city: "Pune", rating: 5, text: "Excellent service! Got my reports within hours.", avatar: undefined },
    { name: "Priya Sharma", city: "Nashik", rating: 5, text: "The staff is very professional and caring.", avatar: undefined },
    { name: "Rahul Mehta", city: "Pimpri", rating: 5, text: "Booking a test online was so easy and quick.", avatar: undefined },
    { name: "Sneha Joshi", city: "Wakad", rating: 5, text: "Home collection was punctual and hassle-free.", avatar: undefined },
    { name: "Vikram Rao", city: "Hinjawadi", rating: 5, text: "Clean lab and very professional staff.", avatar: undefined },
    { name: "Neha Desai", city: "Baner", rating: 5, text: "Reports were easy to access online.", avatar: undefined },
  ];
  const testiRef = useRef<HTMLDivElement | null>(null);

  // Testimonials: multi-card horizontal carousel with 3s autoplay and manual scroll
  useEffect(() => {
    const wrap = testiRef.current;
    if (!wrap) return;
    const el = wrap.querySelector('[data-track]') as HTMLDivElement | null;
    if (!el) return;
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    const segments = 3; // render list 3x for seamless wrap
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-tcard]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 320;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) el.scrollTo({ left: 0, behavior: 'auto' });
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };
    const start = () => { if (!timer && hasOverflow()) timer = setInterval(step, 3000); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => { if (idleTimer) clearTimeout(idleTimer); idleTimer = setTimeout(() => start(), 1500); };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); }) : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  // Popular tests (hardcoded)
  type PopularCard = { title: string; price?: number; obs?: number; hours?: number; imageUrl?: string; slug: string };
  const popularScrollRef = useRef<HTMLDivElement | null>(null);

  // Step-by-step auto-scroll: every 3s scroll by one card, allow manual scroll
  useEffect(() => {
    const el = popularScrollRef.current;
    if (!el) return;
    const prefersReduce =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return; // respect user's preference

    const segments = 3; // we render list 3x
    let timer: ReturnType<typeof setInterval> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasOverflow = () => el.scrollWidth / segments > el.clientWidth + 1;
    const getGap = () => {
      const cs = window.getComputedStyle(el);
      const g = parseFloat((cs as any).columnGap || cs.gap || '0');
      return Number.isFinite(g) ? g : 0;
    };
    const getStep = () => {
      const first = el.querySelector('[data-card]') as HTMLElement | null;
      const w = first ? first.getBoundingClientRect().width : 280;
      return w + getGap();
    };
    const step = () => {
      if (!hasOverflow()) return;
      const segment = el.scrollWidth / segments;
      if (el.scrollLeft >= segment - 1) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      }
      el.scrollBy({ left: getStep(), behavior: 'smooth' });
    };

    const start = () => { if (!timer && hasOverflow()) { timer = setInterval(step, 3000); } };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const scheduleResume = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => start(), 1500);
    };
    const onInteract = () => { stop(); scheduleResume(); };

    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('wheel', onInteract, { passive: true } as any);
    el.addEventListener('touchstart', onInteract, { passive: true } as any);

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { if (hasOverflow()) start(); else stop(); })
      : null;
    ro?.observe(el);
    if (hasOverflow()) start();
    const onResize = () => { if (hasOverflow()) start(); else stop(); };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (idleTimer) clearTimeout(idleTimer);
      ro?.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Build results: prefer geolocated nearby; else filter by search
  const results = useMemo<Nearby[]>(() => {
    if (nearby) return nearby;
    const q = search.trim().toLowerCase();
    const base: Nearby[] = branches.map((b) => ({
      id: b.id,
      name: b.name,
      area: b.area,
      lat: b.lat,
      lng: b.lng,
      phone: b.phone,
      distKm: Number.NaN,
    }));
    if (!q) return base.slice(0, 6);
    return base
      .filter((b) => b.name.toLowerCase().includes(q) || b.area.toLowerCase().includes(q))
      .slice(0, 6);
  }, [nearby, search]);

  function findNearest() {
    setLocError(null);
    if (!("geolocation" in navigator)) {
      setLocError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const scored = branches.map((b) => ({
          id: b.id,
          name: b.name,
          area: b.area,
          lat: b.lat,
          lng: b.lng,
          phone: b.phone,
          distKm: haversineKm(latitude, longitude, b.lat, b.lng),
        }));
        scored.sort((a, b) => a.distKm - b.distKm);
        setNearby(scored.slice(0, 3));
      },
      (err) => {
        setLocError(err.message || "Unable to access location");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white text-center py-24 px-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center">
        {/* Slideshow background (kept behind content but within section) */}
        <div className="absolute inset-0 z-0">
          {/* Default color/gradient background fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-sky-600 to-blue-700" />
          {overrideSrcs.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              {!failed[i] && (
                <Image
                  src={src}
                  alt="Hero background"
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  quality={100}
                  placeholder="empty"
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="object-cover object-center"
                  onLoadingComplete={() => {
                    // if it loaded fine, ensure this index isn't marked failed
                    setFailed((prev) => {
                      if (!prev[i]) return prev;
                      const next = { ...prev };
                      delete next[i];
                      return next;
                    });
                  }}
                  onError={() => {
                    console.error("Hero slide failed to load:", src);
                    // Try uppercase extension fallback if available
                    if (src.toLowerCase().endsWith(".jpg")) {
                      const alt = src.replace(/\.jpg$/i, ".JPG");
                      setOverrideSrcs((prev) => {
                        const next = [...prev];
                        next[i] = alt;
                        return next;
                      });
                      return;
                    }
                    // Mark as failed and advance
                    setFailed((prev) => ({ ...prev, [i]: true }));
                    setActive((curr) => {
                      if (curr !== i) return curr;
                      const n = overrideSrcs.length;
                      for (let step = 1; step <= n; step++) {
                        const j = (curr + step) % n;
                        if (!failed[j] && j !== i) return j;
                      }
                      return curr;
                    });
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative z-10 w-full flex justify-center">
          <div className="inline-block max-w-3xl text-center bg-black/25 rounded-xl px-6 py-6 md:px-10 md:py-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              Your Health, Our Priority
            </h1>
            <p className="text-base md:text-lg mb-5">
              Accurate Diagnostics. Trusted Care.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link href="/services" className="px-6 py-3 rounded-full font-semibold shadow-soft bg-brand-primary text-white hover:bg-[#0a2a32] transition-colors">
                Book a Test
              </Link>
              <Link href="/upload-prescription" className="px-6 py-3 rounded-full font-semibold border border-white text-white hover:bg-white/10 transition-colors">
                Upload Prescription
              </Link>
            </div>
          </div>
        </div>

        {/* Features bar fixed at the bottom center of hero */}
        <div className="absolute inset-x-0 bottom-6 z-10 px-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm px-6 py-3 md:px-8 md:py-4">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 text-white/95">
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">🛡️</span>
                <span className="text-sm md:text-base font-medium">NABL Accredited</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">🏠</span>
                <span className="text-sm md:text-base font-medium">Home Sample Collection</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-lg">📄</span>
                <span className="text-sm md:text-base font-medium">Online Reports in 24 Hours</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      

      {/* Key Counters */}
      <section className="bg-brand-neutral py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Patients */}
            <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-soft">
              <StatCounter label="Total Patients" value={50000} suffix="+" animate={true} />
            </div>
            {/* This Month */}
            <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-soft">
              <StatCounter label="Samples Processed This Month" value={10000} suffix="+" animate={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Impulse Pathology? */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-brand-textH font-display">Why Choose Impulse Pathology?</h2>
          <p className="text-brand-textB mt-3 max-w-3xl mx-auto leading-relaxed">
            We are committed to providing exceptional diagnostic services with cutting-edge technology, experienced professionals, and patient-centric approach for your healthcare needs.
          </p>

          {/* Features unified array */}
          {(() => {
            const whyFeatures = [
              { title: "NABL Accredited", desc: "Our laboratory is NABL accredited ensuring highest quality standards.", icon: <ShieldCheck className="h-6 w-6 text-white" /> },
              { title: "Quick Results", desc: "Get your test reports within 24 hours with our automated systems.", icon: <Clock className="h-6 w-6 text-white" /> },
              { title: "Expert Team", desc: "Experienced pathologists with years of expertise in diagnostic medicine.", icon: <Users className="h-6 w-6 text-white" /> },
              { title: "Home Collection", desc: "Convenient sample collection from your home with trained phlebotomists.", icon: <HomeIcon className="h-6 w-6 text-white" /> },
              { title: "Digital Reports", desc: "Access your reports online anytime through our secure platform.", icon: <Smartphone className="h-6 w-6 text-white" /> },
              { title: "Affordable Pricing", desc: "Competitive pricing with various health packages and discounts.", icon: <CreditCard className="h-6 w-6 text-white" /> },
            ];
            
            return (
              <>
                {/* Features: mobile horizontal carousel */}
                <div className="mt-10 -mx-8 px-8 md:hidden">
                  <div ref={whyRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth" aria-label="Why choose features carousel">
                    {whyFeatures.map((f, i) => (
                      <div key={i} data-wcard className="snap-start shrink-0 w-[280px] rounded-xl bg-brand-neutral border border-brand-primary/10 shadow-soft p-6 transition-all">
                        <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary shadow-soft">
                          {f.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-brand-textH font-display">{f.title}</h3>
                        <p className="text-sm text-brand-textB mt-2 leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features: desktop grid */}
                <div className="mt-10 hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {whyFeatures.map((f, i) => (
                    <div key={i} className="group h-full p-6 rounded-xl bg-brand-neutral border border-brand-primary/10 shadow-soft hover:shadow-soft-hover transition-all hover:-translate-y-1 text-left">
                      <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary shadow-soft group-hover:scale-110 transition-transform">
                        {f.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-brand-textH font-display">{f.title}</h3>
                      <p className="text-sm text-brand-textB mt-2 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* Bottom statistics row */}
          <div className="mt-12 rounded-2xl bg-brand-neutral border border-brand-primary/10 p-6 shadow-soft">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { n: "50,000+", t: "Happy Patients" },
                { n: "15+", t: "Years Experience" },
                { n: "25+", t: "Collection Centers" },
                { n: "500+", t: "Test Parameters" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-brand-textH font-display">{s.n}</div>
                  <div className="text-sm text-brand-textB mt-1">{s.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Diagnostic Services (horizontal scroll) */}
      {/* Our Diagnostic Services (horizontal scroll) */}
      <section className="py-16 px-6 bg-brand-neutral">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold text-brand-textH font-display">Our Diagnostic Services</h2>
            <Link href="/services" className="hidden sm:inline-flex items-center gap-2 text-brand-primary hover:text-[#0a2a32] font-medium transition-colors">View all →</Link>
          </div>
          <div ref={servicesRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 pb-4" aria-label="Diagnostic services carousel">
            {services.map((s, i) => (
              <Link key={`${s.slug}-${i}`} data-scard href={`/services/${s.slug}`} className="snap-start shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
                <div className="group h-full p-6 rounded-2xl border border-brand-primary/10 bg-white shadow-soft hover:shadow-soft-hover transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-brand-neutral text-brand-primary flex items-center justify-center shadow-soft">
                      <s.icon className="text-2xl" />
                    </div>
                    <div className="text-xl font-semibold text-brand-textH font-display">{s.title}</div>
                  </div>
                  <p className="mt-3 text-brand-textB line-clamp-3 leading-relaxed">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm text-brand-textB">
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-accent"></span>
                      {s.subTests.length} tests
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-primary hover:bg-[#0a2a32] text-white text-xs font-semibold shadow-soft transition-colors">View →</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link data-scard href="/services" className="snap-start shrink-0 w-[280px] sm:w-[300px] md:w-[320px]">
              <div className="h-full p-6 rounded-2xl border border-brand-primary/20 bg-brand-neutral text-brand-textH shadow-soft hover:shadow-soft-hover transition-all hover:scale-[1.02] flex flex-col items-start justify-center">
                <div className="text-xl font-semibold mb-1 font-display">View All Services</div>
                <div className="text-brand-textB">Explore all categories and tests</div>
                <div className="mt-3 inline-flex items-center gap-2 text-brand-primary font-medium">Go to Services <span>→</span></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* Testimonials */}
      <section className="py-16 px-6 bg-brand-neutral">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-textH font-display mb-2">What Our Patients Say ❤️</h2>
          <p className="text-center text-brand-textB mb-8">Hear from our happy patients who trust Impulse Pathology for their health and accurate results.</p>
          <div ref={testiRef} className="relative">
            <div data-track className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth p-1 -mx-4 px-4 pb-4">
              {testimonials.map((t, i) => (
                <RevealOnScroll key={`${t.name}-${i}`} delay={(i%6)*60}>
                  <div data-tcard className="snap-start shrink-0 w-[280px] sm:w-[360px] md:w-[380px]">
                    <div className="group h-full p-5 sm:p-6 rounded-2xl border border-brand-primary/10 bg-white shadow-soft hover:shadow-soft-hover transition-all hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        {t.avatar ? (
                          <div className="relative">
                            <Image src={t.avatar} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-primary/20" />
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-full shadow-sm">Verified</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-soft ring-2 ring-brand-primary/20">
                              {t.name.charAt(0)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-full shadow-sm">Verified</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-brand-textH truncate">{t.name}</div>
                          <div className="text-xs text-brand-textB">{t.city}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1" aria-label={`${t.rating} star rating`}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <span key={s} className={s < (t.rating||5) ? 'text-[#FFB800]' : 'text-gray-200'}>★</span>
                        ))}
                      </div>
                      <p className="mt-3 text-brand-textB leading-relaxed">
                        <span className="text-brand-primary/40 mr-1 text-xl align-top">❝</span>
                        {t.text}
                        <span className="text-brand-primary/40 ml-1 text-xl align-top">❞</span>
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="text-sm text-brand-textB">
              <span className="font-semibold text-brand-primary">10,000+ </span>Patients Served • <span className="font-semibold text-brand-primary">100% </span>Accurate Reports • NABL-grade Quality
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
            <Link href="/services" className="text-emerald-700 font-medium hover:underline">View all</Link>
          </div>

          {/* Dynamic Discount Banner */}
          <div className="mb-6 rounded-xl bg-emerald-600 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-base font-semibold">Flat 60% off on Full Body Checkup till Oct 31.</div>
            <Link href="/offers/full-body-checkup" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg">
              View Offer →
            </Link>
          </div>

          {/* Mobile: horizontal carousel with autoplay */}
          <div ref={offersRef} className="flex md:hidden gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-scrolling pb-2 -mx-4 px-4" aria-label="Special offers carousel">
            {[...offers, ...offers, ...offers].map((o, i) => (
              <Link key={`${o.slug}-${i}`} data-ocard href={`/offers/${o.slug}`} className="snap-center shrink-0 w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-transform hover:-translate-y-0.5">
                {o.slug === "full-body-checkup" && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">60% OFF</span>
                )}
                {o.poster && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                    <Image src={o.poster} alt={`${o.title} Poster`} width={600} height={360} className="w-full h-36 object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{o.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{o.tag}</span>
                </div>
                <p className="text-gray-600 mt-1">{o.includes}</p>
                <p className="text-xs text-gray-500 mt-1">Valid: {o.start} – {o.end}</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-emerald-700">₹{o.price}</span>
                  <span className="text-sm line-through text-gray-400">₹{o.mrp}</span>
                </div>
                {((o.posterServices && o.posterServices.length) || (o.tests && o.tests.length)) && (
                  <div className="mt-4">
                    <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                      {((o.posterServices && o.posterServices.length ? o.posterServices : o.tests) || []).slice(0, 3).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-6">
                  <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop/tablet: grid */}
          <div className="hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <RevealOnScroll key={o.slug} delay={i * 80}>
                <Link href={`/offers/${o.slug}`} className="relative rounded-2xl bg-white shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-transform hover:-translate-y-0.5">
                  {o.slug === "full-body-checkup" && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">60% OFF</span>
                  )}
                  {o.poster && (
                    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                      <Image src={o.poster} alt={`${o.title} Poster`} width={600} height={360} className="w-full h-36 object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{o.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{o.tag}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{o.includes}</p>
                  <p className="text-xs text-gray-500 mt-1">Valid: {o.start} – {o.end}</p>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-emerald-700">₹{o.price}</span>
                    <span className="text-sm line-through text-gray-400">₹{o.mrp}</span>
                  </div>
                  {((o.posterServices && o.posterServices.length) || (o.tests && o.tests.length)) && (
                    <div className="mt-4">
                      <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                        {((o.posterServices && o.posterServices.length ? o.posterServices : o.tests) || []).slice(0, 3).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-6">
                    <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                      View Details
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-4">Prices inclusive of sample collection and reporting. Offers valid this month only.</p>
        </div>
      </section>

      {/* Most Popular Tests */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Most Popular Tests</h2>
          {(() => {
            const cards: PopularCard[] = popularTests.slice().reverse().map((t) => {
              const d = testsBySlug[t.slug];
              return {
                title: t.title,
                price: t.price,
                obs: typeof d?.observationsCount === 'number' ? d.observationsCount : t.obs,
                hours: typeof d?.tatHours === 'number' ? d.tatHours : t.hours,
                imageUrl: d?.bannerUrl || t.imageUrl,
                slug: t.slug,
              };
            });
            return (
              <div ref={popularScrollRef} className="flex gap-0 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth touch-scrolling pb-4 -mx-4 px-4" aria-label="Popular tests carousel">
                {cards.map((t, i) => (
              <div key={`${t.slug}-${i}`} data-card className="snap-center shrink-0 w-[calc(100vw-2rem)] sm:w-[280px] rounded-2xl overflow-hidden border border-brand-primary/10 bg-white shadow-soft flex flex-col hover:shadow-soft-hover transition-shadow">
                {/* Media/banner */}
                {t.imageUrl ? (
                  <div className="h-32 relative">
                    <Image src={t.imageUrl} alt={t.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-emerald-600 to-green-600" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase leading-5 max-w-[75%]">{t.title}</h3>
                    {typeof t.price !== 'undefined' && (
                      <span className="text-sm font-semibold text-white bg-emerald-700 px-2 py-1 rounded-lg">₹{t.price}</span>
                    )}
                  </div>
                  {/* Mini details pulled from testsBySlug */}
                  {(() => {
                    const d = testsBySlug[t.slug];
                    return (
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                        <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">🧫</span>Sample: {d?.sampleRequired || '—'}</div>
                        <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">📋</span>Prep: {d?.preparation || '—'}</div>
                        {typeof t.obs !== 'undefined' && (
                          <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">📄</span>{t.obs} Observations included</div>
                        )}
                        {typeof t.hours !== 'undefined' && (
                          <div className="inline-flex items-center gap-2 text-gray-700"><span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">⏱️</span>Results in {t.hours} Hours</div>
                        )}
                      </div>
                    );
                  })()}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href={`/tests/${t.slug}`} className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-primary/5 transition-colors">View Details</Link>
                    <Link href={`/tests/${t.slug}`} className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-brand-primary text-white hover:bg-[#0a2a32] transition-colors">Add to Cart</Link>
                  </div>
                </div>
              </div>
                ))}
              </div>
            );
          })()}
          <div className="mt-8 flex justify-center">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-[#0a2a32] transition-colors shadow-soft">View All Test</Link>
          </div>
        </div>
      </section>

      {/* Lab Finder */}
      <section className="relative py-16 px-6 bg-gradient-to-b from-[#E6FFFA] via-white to-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-emerald-200/20 blur-2xl" />
          <div className="absolute bottom-0 right-4 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-brand-textH font-display">Find Nearest Lab</h2>
            <p className="text-brand-textB mt-2">Quickly locate your nearest Impulse Pathology branch and connect with us instantly.</p>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
            <div className="relative w-full sm:w-[480px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your area or PIN code"
                className="w-full rounded-full border border-emerald-200/70 bg-white pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">📍</span>
            </div>
            <button
              onClick={findNearest}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-primary text-white font-semibold shadow hover:bg-[#0a2a32] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"/>
                <circle cx="12" cy="11" r="2"/>
              </svg>
              Use My Location
            </button>
          </div>
          {/* Filters and View Toggle */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3 sm:justify-start justify-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">📍</span>
                <select value={filterCity} onChange={(e)=>setFilterCity(e.target.value)} className="appearance-none pr-8 pl-8 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm shadow-sm">
                  <option value="">All Areas</option>
                  {Array.from(new Set(results.map((b:any)=>b.area))).map((a:any)=> (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🧪</span>
                <select value={filterTest} onChange={(e)=>setFilterTest(e.target.value)} className="appearance-none pr-8 pl-8 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm shadow-sm">
                  <option value="">All Tests</option>
                  {Array.from(new Set(results.flatMap((b:any)=> (b.tests||[]) as string[]))).map((t:string)=> (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
              <button onClick={()=>setFilterOpenNow(v=>!v)} className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full shadow-sm border ${filterOpenNow?'bg-emerald-600 text-white border-emerald-600':'bg-white text-gray-700 border-emerald-200'}`}>🕒 Open Now</button>
              <button onClick={()=>setFilterHomeOnly(v=>!v)} className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full shadow-sm border ${filterHomeOnly?'bg-emerald-600 text-white border-emerald-600':'bg-white text-gray-700 border-emerald-200'}`}>🏠 Home Collection</button>
            </div>
            <div className="flex justify-center md:justify-end">
              <button onClick={()=>setShowMapView(v=>!v)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white shadow-sm transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/></svg>
                {showMapView ? 'Hide Map View' : 'Switch to Map View'}
              </button>
            </div>
          </div>
          {locError && (
            <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 max-w-2xl mx-auto text-center">{locError}</div>
          )}
          {(() => {
            const norm = (s:string)=> (s||"").toString().trim().toLowerCase();
            const items = results
              .filter((b:any)=> !filterCity || norm(b.area)===norm(filterCity))
              .filter((b:any)=> !filterTest || (b.tests||[]).includes(filterTest))
              // If Home Collection is toggled on, include labs that explicitly support it or have no data (assume available)
              .filter((b:any)=> !filterHomeOnly || b.homeCollection !== false)
              // If Open Now is toggled on, include labs that are open or have no schedule data
              .filter((b:any)=> !filterOpenNow || (b.open && b.close ? isOpenNow(b) : true));
            // Determine nearest by minimum distKm
            const nearest = items.reduce((acc:any,b:any)=> (Number.isFinite(b.distKm) && (acc==null || b.distKm < acc.distKm)) ? b : acc, null);
            const active = items.find((b:any)=> b.id===activeLabId) || nearest || items[0];
            return (
              <>
                {/* Map View */}
                {showMapView && active && (
                  <div className="mb-6 overflow-hidden rounded-xl ring-1 ring-emerald-100">
                    <iframe title={`Map of ${active.name}`} src={`https://www.google.com/maps?q=${active.lat},${active.lng}&z=14&output=embed`} loading="lazy" className="w-full h-72 border-0" />
                  </div>
                )}
                <div className="relative">
                  <div ref={labTrackRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth p-1 -mx-4 px-4 pb-4">
                    {items.map((b:any, i:number) => (
                      <div key={`${b.id}-${i}`} data-lcard className="snap-start shrink-0 w-[calc(100vw-2rem)] sm:w-[360px] md:w-[380px]">
                        <div onMouseEnter={()=>setActiveLabId(b.id)} className="group p-[1px] rounded-3xl bg-brand-primary/10 shadow-soft hover:shadow-soft-hover transition-shadow">
                          <div className={`relative rounded-[20px] h-full p-4 sm:p-5 md:p-6 bg-white shadow-soft hover:shadow-md transition-all ${nearest && b.id===nearest.id ? 'ring-2 ring-brand-primary' : ''} hover:-translate-y-0.5`}>
                            <button aria-label="Toggle favorite" onClick={()=>toggleFav(b.id)} className={`absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-full border backdrop-blur bg-white/80 shadow ${favs.includes(b.id)?'text-rose-600 border-rose-200':'text-gray-500 border-gray-200'} hover:scale-105 transition-transform`}>❤</button>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-lg font-semibold text-gray-900">{b.name}</div>
                                <div className="mt-1 inline-flex items-center gap-1 text-sm text-gray-600">
                                  <span className="text-emerald-600">📍</span>
                                  <span>{b.address || b.area}</span>
                                </div>
                                <div className="mt-1 inline-flex items-center gap-1 text-xs text-amber-500">
                                  {Array.from({ length: 5 }).map((_, s) => (
                                    <span key={s} className={s < Math.round(b.rating ?? 5) ? 'text-amber-400' : 'text-gray-300'}>★</span>
                                  ))}
                                  <span className="ml-1 text-gray-700">{(b.rating ?? 4.8).toFixed(1)}/5</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {nearest && b.id===nearest.id && (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">Nearest to You</span>
                                )}
                                <div className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">{etaText(b.distKm)}</div>
                              </div>
                            </div>
                            {(b.open || b.close) && (
                              <div className="mt-2 text-xs text-gray-600">
                                Timings: {b.open || '--:--'} – {b.close || '--:--'} {filterOpenNow && isOpenNow(b) ? <span className="ml-2 text-emerald-700 font-medium">(Open Now)</span> : null}
                              </div>
                            )}
                            {(b.tests && b.tests.length>0) && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {b.tests.slice(0,4).map((t:string)=> (
                                  <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">{t}</span>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-emerald-100/70">
                              <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                                <iframe
                                  title={`${b.name} map`}
                                  src={`https://www.google.com/maps?q=${b.lat},${b.lng}&z=15&output=embed`}
                                  loading="lazy"
                                  className="w-full h-28 sm:h-32 border-0"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <a href={`https://www.google.com/maps?q=${b.lat},${b.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"/><circle cx="12" cy="11" r="2"/></svg>
                                Open in Maps
                              </a>
                              {b.phone && (
                                <a href={`tel:${b.phone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#00C29A] text-white hover:bg-emerald-700">
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"/></svg>
                                  Call
                                </a>
                              )}
                              {b.phone && (
                                <a href={`https://wa.me/${b.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#25D366] text-white hover:brightness-95">
                                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.5 3.5A10 10 0 0 0 3.1 16.2L2 22l5.9-1.1A10 10 0 1 0 20.5 3.5Zm-8.4 15.7c-1.7 0-3.3-.5-4.7-1.5l-.3-.2-2.8.5.6-2.7-.2-.3a8.1 8.1 0 1 1 7.4 4.2Zm4.2-5.9c-.2-.1-1.3-.7-1.5-.8s-.4-.1-.6.1-.7.8-.9.9-.3.1-.5 0a6.6 6.6 0 0 1-2-1.2 7.3 7.3 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.3.2-.4 0-.1 0-.3 0-.4s-.6-1.5-.8-2c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4 0-.6.3s-.8.8-.8 2 .8 2.2.9 2.4a9.5 9.5 0 0 0 3.4 3.2c.5.2.9.4 1.2.5.6.2 1.1.2 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1 0-.2-.2-.2-.4-.3Z"/></svg>
                                  WhatsApp
                                </a>
                              )}
                              <a href={`/services?lab=${encodeURIComponent(b.id)}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#0078FF] to-[#00C29A] text-white shadow hover:shadow-md">
                                🧪 Book Test Now
                              </a>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">✅ NABL Certified</span>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">🧬 ISO Approved</span>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">🧑‍⚕️ 24x7 Support</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => { const el = labTrackRef.current; if (!el) return; const first = el.querySelector('[data-lcard]') as HTMLElement | null; const gap = (()=>{ const cs = window.getComputedStyle(el); const g = parseFloat((cs as any).columnGap || cs.gap || '0'); return Number.isFinite(g)?g:0; })(); const step = (first? first.getBoundingClientRect().width:320) + gap; el.scrollBy({ left: -step, behavior: 'smooth' }); }}
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-gray-200 hover:bg-white"
                  >‹</button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={() => { const el = labTrackRef.current; if (!el) return; const first = el.querySelector('[data-lcard]') as HTMLElement | null; const gap = (()=>{ const cs = window.getComputedStyle(el); const g = parseFloat((cs as any).columnGap || cs.gap || '0'); return Number.isFinite(g)?g:0; })(); const step = (first? first.getBoundingClientRect().width:320) + gap; el.scrollBy({ left: step, behavior: 'smooth' }); }}
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-gray-200 hover:bg-white"
                  >›</button>
                </div>
                {!nearby && items.length === 0 && (
                  <p className="text-gray-600 mt-4 text-center">No branches match your search.</p>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Branches */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-[#E6FFFA] via-white to-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-emerald-200/20 blur-2xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-blue-200/20 blur-2xl" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl font-extrabold text-center text-brand-textH font-display">Our Branches</h2>
            <p className="mt-2 text-center text-brand-textB">Visit our main center or drop by your nearest branch. We’re open every day.</p>
          </RevealOnScroll>

          {/* Mobile: horizontal auto-scrolling cards */}
          <div className="mt-10 md:hidden relative">
            <div ref={branchesTrackRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4">
              {Array.from({length:3}).flatMap(()=>['main','list']).map((kind, idx)=> (
                <div key={idx} data-branch-card className="snap-start shrink-0 w-[calc(100vw-2rem)]">
                  {kind === 'main' ? (
                    <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#00C29A] to-[#00A1FF] shadow-lg">
                      <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white">
                        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(100px 100px at 10% 10%, rgba(255,255,255,0.15), transparent), radial-gradient(120px 120px at 90% 20%, rgba(255,255,255,0.1), transparent)"}} />
                        <div className="relative p-6">
                          <h3 className="text-xl font-semibold tracking-wide">Main Branch</h3>
                          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/95 text-emerald-700 px-5 py-3 font-bold text-lg shadow">
                            <span>🏥</span>
                            <span>LAXMI CHOWK, HINJAWADI</span>
                          </div>
                          <div className="mt-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-sm">
                              <span>⏰</span>
                              <span>Mon–Sun: 7:00 AM – 10:00 PM</span>
                            </div>
                          </div>
                          <div className="mt-5">
                            <a href={`https://www.google.com/maps?q=${encodeURIComponent('LAXMI CHOWK, HINJAWADI Impulse Pathology')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/90 text-emerald-700 px-4 py-2 font-medium shadow hover:shadow-md">
                              <span>📍</span>
                              <span>View on Map</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl p-[1px] bg-gradient-to-br from-emerald-100 to-blue-100 shadow-md">
                      <div className="rounded-[22px] bg-white p-6">
                        <h3 className="text-xl font-semibold tracking-wide text-gray-900">Other Branches</h3>
                        <ul className="mt-4 divide-y divide-emerald-100/70">
                          {["KASPATEWASTI, WAKAD","HINJAWADI, PH-3","BHUMKAR CHOWK, WAKAD","DATTA MANDIR ROAD, WAKAD"].map((b)=> (
                            <li key={b} className="py-3 first:pt-0 last:pb-0">
                              <a href={`https://www.google.com/maps?q=${encodeURIComponent(b + ' Impulse Pathology')}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-gray-800">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">📍</span>
                                <span className="font-medium group-hover:text-emerald-700 group-hover:underline underline-offset-4">{b}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-sm text-gray-600">⏰ All branches: Mon–Sun, 7:00 AM – 10:00 PM</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: two-column grid */}
          <div className="mt-10 hidden md:grid md:grid-cols-2 gap-6">
            {/* Main Branch */}
            <RevealOnScroll>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#00C29A] to-[#00A1FF] shadow-lg">
                <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white">
                  <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(100px 100px at 10% 10%, rgba(255,255,255,0.15), transparent), radial-gradient(120px 120px at 90% 20%, rgba(255,255,255,0.1), transparent)"}} />
                  <div className="relative p-6 sm:p-8">
                    <h3 className="text-xl font-semibold tracking-wide">Main Branch</h3>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/95 text-emerald-700 px-5 py-3 font-bold text-lg shadow">
                      <span>🏥</span>
                      <span>LAXMI CHOWK, HINJAWADI</span>
                    </div>
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-sm">
                        <span>⏰</span>
                        <span>Mon–Sun: 7:00 AM – 10:00 PM</span>
                      </div>
                    </div>
                    <div className="mt-5">
                      <a href={`https://www.google.com/maps?q=${encodeURIComponent('LAXMI CHOWK, HINJAWADI Impulse Pathology')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/90 text-emerald-700 px-4 py-2 font-medium shadow hover:shadow-md">
                        <span>📍</span>
                        <span>View on Map</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Branch List */}
            <RevealOnScroll delay={120}>
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-emerald-100 to-blue-100 shadow-md">
                <div className="rounded-[22px] bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-semibold tracking-wide text-gray-900">Other Branches</h3>
                  <ul className="mt-4 divide-y divide-emerald-100/70">
                    {[
                      "KASPATEWASTI, WAKAD",
                      "HINJAWADI, PH-3",
                      "BHUMKAR CHOWK, WAKAD",
                      "DATTA MANDIR ROAD, WAKAD",
                    ].map((b) => (
                      <li key={b} className="py-3 first:pt-0 last:pb-0">
                        <a href={`https://www.google.com/maps?q=${encodeURIComponent(b + ' Impulse Pathology')}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-gray-800">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">📍</span>
                          <span className="font-medium group-hover:text-emerald-700 group-hover:underline underline-offset-4">{b}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    ⏰ All branches: Mon–Sun, 7:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Bottom Actions */}
          <RevealOnScroll delay={200}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+919309883798" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00C29A] to-[#00A1FF] text-white font-semibold shadow hover:shadow-lg transition-transform hover:scale-[1.02]">
                <span>📞</span>
                <span>Call Now</span>
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 shadow-sm transition-transform hover:scale-[1.02]">
                <span>✉️</span>
                <span>Contact Form</span>
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
