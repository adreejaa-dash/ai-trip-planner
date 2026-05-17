import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "TripMind — AI-Powered Travel Itinerary Planner",
    template: "%s | TripMind",
  },
  description:
    "Plan your perfect trip in minutes with TripMind's AI travel planner. Get personalized day-by-day itineraries, budget estimates, and local tips for any destination.",
  keywords: [
    "AI travel planner",
    "itinerary generator",
    "trip planning",
    "travel assistant",
    "vacation planner",
  ],
  authors: [{ name: "TripMind" }],
  openGraph: {
    type: "website",
    title: "TripMind — AI-Powered Travel Itinerary Planner",
    description:
      "Plan your perfect trip in minutes with TripMind's AI travel planner.",
    siteName: "TripMind",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripMind — AI-Powered Travel Itinerary Planner",
    description: "Plan your perfect trip in minutes with TripMind.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
