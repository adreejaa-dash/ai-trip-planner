import { TravelStyle, BudgetLevel, AccommodationType } from "@/types";

// ─── Travel Style Options ─────────────────────────────────────

export const TRAVEL_STYLES: { value: TravelStyle; label: string; icon: string; description: string }[] = [
  { value: "adventure", label: "Adventure", icon: "⛺", description: "Hiking, outdoor activities, exploration" },
  { value: "cultural", label: "Cultural", icon: "🏛️", description: "Museums, history, local traditions" },
  { value: "relaxation", label: "Relaxation", icon: "🌊", description: "Beaches, spas, slow travel" },
  { value: "food-and-drink", label: "Food & Drink", icon: "🍜", description: "Local cuisine, restaurants, markets" },
  { value: "nature", label: "Nature", icon: "🌿", description: "National parks, wildlife, scenic views" },
  { value: "business", label: "Business", icon: "💼", description: "Work-friendly, conferences, networking" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧", description: "Kid-friendly, activities for all ages" },
  { value: "budget", label: "Budget", icon: "💰", description: "Cost-conscious, great value experiences" },
  { value: "luxury", label: "Luxury", icon: "✨", description: "Premium hotels, fine dining, VIP access" },
];

// ─── Budget Levels ────────────────────────────────────────────

export const BUDGET_LEVELS: { value: BudgetLevel; label: string; range: string; icon: string }[] = [
  { value: "budget", label: "Budget", range: "Under $100/day", icon: "🌱" },
  { value: "moderate", label: "Moderate", range: "$100–$250/day", icon: "⚖️" },
  { value: "upscale", label: "Upscale", range: "$250–$500/day", icon: "🌟" },
  { value: "luxury", label: "Luxury", range: "$500+/day", icon: "💎" },
];

// ─── Accommodation Types ──────────────────────────────────────

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string; icon: string }[] = [
  { value: "hotel", label: "Hotel", icon: "🏨" },
  { value: "hostel", label: "Hostel", icon: "🛏️" },
  { value: "airbnb", label: "Airbnb", icon: "🏡" },
  { value: "resort", label: "Resort", icon: "🌴" },
  { value: "boutique", label: "Boutique", icon: "🏮" },
  { value: "camping", label: "Camping", icon: "⛺" },
];

// ─── Currencies ───────────────────────────────────────────────

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

// ─── Traveler Counts ─────────────────────────────────────────

export const TRAVELER_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: i === 0 ? "Just me (solo)" : `${i + 1} traveler${i > 0 ? "s" : ""}`,
}));

// ─── Featured Destinations (UI only) ────────────────────────

export const FEATURED_DESTINATIONS = [
  {
    name: "Tokyo, Japan",
    tagline: "Where tradition meets technology",
    tags: ["Cultural", "Food", "Adventure"],
    gradient: "from-rose-600/20 to-orange-600/20",
    emoji: "🗼",
  },
  {
    name: "Santorini, Greece",
    tagline: "Iconic sunsets over the Aegean",
    tags: ["Relaxation", "Luxury", "Nature"],
    gradient: "from-blue-600/20 to-cyan-600/20",
    emoji: "🏛️",
  },
  {
    name: "Bali, Indonesia",
    tagline: "Spiritual beauty meets tropical bliss",
    tags: ["Nature", "Wellness", "Budget"],
    gradient: "from-emerald-600/20 to-teal-600/20",
    emoji: "🌴",
  },
  {
    name: "New York, USA",
    tagline: "The city that never sleeps",
    tags: ["Cultural", "Food", "Entertainment"],
    gradient: "from-purple-600/20 to-indigo-600/20",
    emoji: "🗽",
  },
];

// ─── Stats (Landing Page) ────────────────────────────────────

export const LANDING_STATS = [
  { value: "50K+", label: "Trips Planned" },
  { value: "120+", label: "Destinations" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2min", label: "Avg. Generation Time" },
];

// ─── Features (Landing Page) ─────────────────────────────────

export const LANDING_FEATURES = [
  {
    icon: "🧠",
    title: "AI-Powered Planning",
    description:
      "Our AI understands your travel style, budget, and preferences to craft a perfectly tailored itinerary.",
  },
  {
    icon: "⚡",
    title: "Instant Generation",
    description:
      "Get a complete multi-day itinerary in under 2 minutes — not hours of tedious research.",
  },
  {
    icon: "✏️",
    title: "Fully Customizable",
    description:
      "Swap activities, adjust timings, and fine-tune every detail until your trip is exactly right.",
  },
  {
    icon: "📱",
    title: "Access Anywhere",
    description:
      "Your itinerary lives in the cloud — accessible on any device, anytime, even offline.",
  },
  {
    icon: "💰",
    title: "Budget-Aware",
    description:
      "Get cost estimates for every activity and accommodation, so you always know what to expect.",
  },
  {
    icon: "🗺️",
    title: "Local Insights",
    description:
      "Hidden gems, best-time-to-visit tips, and insider knowledge baked into every recommendation.",
  },
];
