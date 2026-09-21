"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function StatCounter({
  label,
  value,
  prefix = "",
  suffix = "",
  durationMs = 1200,
  live = false,
  animate = true,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  live?: boolean;
  animate?: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const target = Math.max(0, value | 0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!animate) {
      // No animation: show value immediately
      setVisible(true);
      setDisplay(target);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate, target]);

  useEffect(() => {
    if (!animate) {
      // Keep fixed display equal to target
      setDisplay(target);
      return;
    }
    if (!visible) return;
    const start = performance.now();
    const from = display;
    const to = target;
    const run = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (to - from) * eased);
      setDisplay(v);
      if (p < 1) req = requestAnimationFrame(run);
    };
    let req = requestAnimationFrame(run);
    return () => cancelAnimationFrame(req);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, visible, target]);

  useEffect(() => {
    if (!animate || !live) return;
    const id = setInterval(() => {
      setDisplay((d) => d + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(id);
  }, [animate, live]);

  const formatted = useMemo(() => new Intl.NumberFormat().format(display), [display]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">
        {prefix}{formatted}{suffix}
      </div>
      <div className="mt-1 text-sm md:text-base text-brand-textB font-medium">{label}</div>
    </div>
  );
}
