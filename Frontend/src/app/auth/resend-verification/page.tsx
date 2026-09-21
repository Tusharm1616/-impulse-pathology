"use client";

import { useState } from "react";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend verification email.");
        return;
      }

      setMessage("✅ Verification email sent successfully! Check your inbox.");
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Resend Verification Email
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already verified?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  );
}