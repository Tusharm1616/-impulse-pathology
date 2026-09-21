"use client";

import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-lg font-bold">Impulse Pathology Lab</h1>
      </header>

      {/* Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© {new Date().getFullYear()} Impulse Pathology Lab. All rights reserved.</p>
      </footer>
    </div>
  );
}