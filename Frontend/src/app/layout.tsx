// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { ThemeProvider } from "../components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impulselab.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Impulse Pathology Lab",
    template: "%s | Impulse Pathology Lab",
  },
  description: "Accurate Diagnostics. Trusted Results. Your health, our priority.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Impulse Pathology Lab",
    description: "Accurate Diagnostics. Trusted Results.",
    siteName: "Impulse Pathology Lab",
    images: [{ url: "/icons/logo.png", width: 512, height: 512, alt: "Impulse Lab" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impulse Pathology Lab",
    description: "Accurate Diagnostics. Trusted Results.",
    images: ["/icons/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icons/logo.png",
    shortcut: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans flex flex-col min-h-screen bg-brand-neutral text-brand-textB`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          {/* Quick Contact Button */}
          <a
            href="https://wa.me/[PLACEHOLDER_PHONE]"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-110 hover:bg-green-600"
            aria-label="Contact us on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
