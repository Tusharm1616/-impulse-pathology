"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  a11y: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setA11y: (v: boolean) => void;
  toggleA11y: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

function applyClasses(theme: Theme, a11y: boolean) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("a11y-mode", a11y);
}

function getSystemPref(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved || getSystemPref();
  });
  const [a11y, setA11yState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("a11y") === "true";
  });

  useEffect(() => {
    applyClasses(theme, a11y);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    applyClasses(theme, a11y);
    try { localStorage.setItem("a11y", String(a11y)); } catch {}
  }, [a11y]);

  const value = useMemo<Ctx>(() => ({
    theme,
    a11y,
    setTheme: (t) => setThemeState(t),
    toggleTheme: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    setA11y: (v) => setA11yState(v),
    toggleA11y: () => setA11yState((v) => !v),
  }), [theme, a11y]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
