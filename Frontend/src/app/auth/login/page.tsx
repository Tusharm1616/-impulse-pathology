"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "staff" ? "staff" : "patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      if (activeTab === "staff") {
        if (data?.user?.role !== "admin") {
          setError("This login is for authorized staff only");
          return;
        }
        router.push("/admin/dashboard");
      } else {
        alert("✅ Login successful!");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.name === 'AbortError') {
        setError("Server is waking up, please try again.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 pb-2 text-center font-medium ${activeTab === 'patient' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('patient'); setError(""); }}
          >
            Patient Login
          </button>
          <button
            className={`flex-1 pb-2 text-center font-medium ${activeTab === 'staff' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('staff'); setError(""); }}
          >
            🛡️ Staff Login
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-brand-textH font-display">
          {activeTab === 'staff' ? '🛡️ Staff Login' : 'Login to Your Account'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

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

        {activeTab === 'patient' && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t"></div>
              <span className="mx-2 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t"></div>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}