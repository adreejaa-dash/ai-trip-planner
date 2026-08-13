import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripPlanner — AI-Powered Travel Itinerary Planner",
  description:
    "Generate personalized, day-wise travel itineraries based on your destination, budget, and interests. Powered by Google Gemini AI.",
  keywords: "AI trip planner, travel itinerary, Gemini AI, travel planner, budget travel",
  openGraph: {
    title: "TripPlanner — AI-Powered Travel Itinerary Planner",
    description: "Generate personalized travel itineraries with AI in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
