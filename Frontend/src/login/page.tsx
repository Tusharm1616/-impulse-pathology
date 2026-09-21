"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <form className="flex flex-col gap-3">
          <input type="email" placeholder="Email" className="border p-2 rounded" />
          <input type="password" placeholder="Password" className="border p-2 rounded" />
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or continue with</div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50"
          >
            <FcGoogle className="text-xl" /> Login with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50"
          >
            <FaGithub className="text-xl" /> Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}