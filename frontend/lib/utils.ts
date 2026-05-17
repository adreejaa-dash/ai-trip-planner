import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx, resolving conflicts properly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable form.
 * e.g. "2025-06-15" -> "June 15, 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a short date — e.g. "Jun 15"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns the number of nights between two date strings.
 */
export function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Formats a duration in minutes to "Xh Ym" or "Xm".
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Formats a currency amount.
 * e.g. formatCurrency(1250, "USD") -> "$1,250"
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Converts a TravelStyle or ActivityCategory slug to a display label.
 * e.g. "food-and-drink" -> "Food & Drink"
 */
export function slugToLabel(slug: string): string {
  const map: Record<string, string> = {
    "food-and-drink": "Food & Drink",
    adventure: "Adventure",
    cultural: "Cultural",
    relaxation: "Relaxation",
    nature: "Nature",
    business: "Business",
    family: "Family",
    budget: "Budget",
    luxury: "Luxury",
    sightseeing: "Sightseeing",
    food: "Food",
    transport: "Transport",
    accommodation: "Accommodation",
    entertainment: "Entertainment",
    shopping: "Shopping",
    culture: "Culture",
    wellness: "Wellness",
  };
  return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Returns a color class for an activity category badge.
 */
export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    sightseeing: "bg-brand-500/20 text-brand-300 border-brand-500/30",
    food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    transport: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    accommodation: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    entertainment: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    shopping: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    nature: "bg-green-500/20 text-green-300 border-green-500/30",
    culture: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    wellness: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    adventure: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return map[category] ?? "bg-white/10 text-white/60 border-white/20";
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a deterministic placeholder ID (not for production).
 */
export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
