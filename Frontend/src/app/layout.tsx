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
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
