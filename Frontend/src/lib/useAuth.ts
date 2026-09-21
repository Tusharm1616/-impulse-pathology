"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
} | null;

export function useAuth() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.10:5000";

  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  // 🔄 Restore session when app loads
  useEffect(() => {
    (async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include", // send refresh token cookie
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.accessToken) setAccessToken(data.accessToken);
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }
      } catch (err) {
        console.error("Session restore failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [API_URL]);

  // 🧾 Register new user
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data;
    } catch (err: any) {
      console.error("Register error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const token = data.accessToken || data.token;
      if (token) setAccessToken(token);

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      router.push("/auth/login");
    }
  };

  // 🧠 Authenticated fetch with auto-refresh on 401
  const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    let res = await fetch(input, { ...init, headers, credentials: "include" });

    if (res.status === 401) {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        const d = await refreshRes.json();
        if (d?.accessToken) {
          setAccessToken(d.accessToken);
          headers.set("Authorization", `Bearer ${d.accessToken}`);
          res = await fetch(input, { ...init, headers, credentials: "include" });
        }
      }
    }

    return res;
  };

  return {
    user,
    loading,
    accessToken,
    register,
    login,
    logout,
    authFetch,
  };
}