"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatically detect API URL (fallback to localhost)
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://impulselab.com";

  // Handle manual registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      alert("✅ Registration successful! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google & Facebook registration
  const handleSocialRegister = async (provider: "google" | "facebook") => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (err) {
      console.error("Social registration error:", err);
      setError(`Failed to continue with ${provider}.`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brand-neutral px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-brand-textH font-display">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className={`bg-brand-primary text-white py-2 rounded-md font-medium hover:bg-[#0a2a32] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleSocialRegister("google")}
            className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            <FaGoogle className="text-lg" /> Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialRegister("facebook")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaFacebook className="text-lg" /> Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}