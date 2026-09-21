"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.replace(next);
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-emerald-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Admin Login</h1>
        {error && <div className="mb-3 rounded-md bg-red-50 text-red-700 px-3 py-2">{error}</div>}
        <label className="block mb-3">
          <span className="text-sm text-gray-700">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-700">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full px-3 py-2 rounded-md border border-gray-300" />
        </label>
        <button disabled={loading} className="w-full py-2 rounded-md bg-emerald-600 text-white font-semibold disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
