"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ API base URL from .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://impulselab.com";

  // ✅ Handle email/password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ Store JWT token and user in localStorage
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Update auth context
      await login(email, password);

      alert("✅ Login successful!");
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google & Facebook login
  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (err) {
      console.error("Social login error:", err);
      setError(`Failed to login with ${provider}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brand-neutral">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-brand-textH font-display">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* ✅ Email + Password Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-brand-primary text-white py-2 rounded-md hover:bg-[#0a2a32] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* ✅ Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            <FaGoogle className="text-lg" /> Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin("facebook")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaFacebook className="text-lg" /> Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-blue-500 hover:underline font-medium">
            Create a new account
          </a>
        </p>
      </div>
    </div>
  );
}