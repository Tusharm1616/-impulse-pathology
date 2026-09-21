"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify-email?token=${token}`)
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(() => setMessage("Verification failed"));
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p>{message}</p>
    </div>
  );
}