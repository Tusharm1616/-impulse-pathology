"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // fade out, then swap key, then fade in
    setShow(false);
    const t = setTimeout(() => {
      setKey(pathname);
      setShow(true);
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className={`transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"}`} key={key}>
      {children}
    </div>
  );
}
