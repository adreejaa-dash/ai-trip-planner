// ============================================================
// TripMind — Core Data Types
// ============================================================

// ─── Geo & Location ──────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  country: string;
  countryCode: string;
  coordinates?: Coordinates;
  timezone?: string;
  placeId?: string;
}

// ─── Travel Preferences ──────────────────────────────────────

export type TravelStyle =
  | "adventure"
  | "cultural"
  | "relaxation"
  | "food-and-drink"
  | "nature"
  | "business"
  | "family"
  | "budget"
  | "luxury";

export type BudgetLevel = "budget" | "moderate" | "upscale" | "luxury";

export type TransportMode =
  | "flight"
  | "train"
  | "bus"
  | "car"
  | "ferry"
  | "walking";

export interface TravelPreferences {
  styles: TravelStyle[];
  budget: BudgetLevel;
  currency: string;
  accommodation: AccommodationType[];
  transport: TransportMode[];
  dietary?: string[];
  accessibility?: string[];
  interests?: string[];
}

export type AccommodationType =
  | "hotel"
  | "hostel"
  | "airbnb"
  | "resort"
  | "boutique"
  | "camping";

// ─── Trip Planner Form ───────────────────────────────────────

export interface TripPlannerFormData {
  destination: string;
  origin?: string;
  startDate: string;       // ISO date string YYYY-MM-DD
  endDate: string;         // ISO date string YYYY-MM-DD
  numTravelers: number;
  preferences: TravelPreferences;
  additionalNotes?: string;
}

export interface TripPlannerFormErrors {
  destination?: string;
  startDate?: string;
  endDate?: string;
  numTravelers?: string;
  preferences?: string;
}

// ─── Itinerary Activities ────────────────────────────────────

export type ActivityCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "accommodation"
  | "entertainment"
  | "shopping"
  | "nature"
  | "culture"
  | "wellness"
  | "adventure";

export type ActivityStatus = "confirmed" | "suggested" | "optional" | "cancelled";

export interface ActivityCost {
  amount: number;
  currency: string;
  perPerson: boolean;
  included?: boolean;  // Included in package price
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  status: ActivityStatus;
  startTime?: string;    // "09:00"
  endTime?: string;      // "11:00"
  duration?: number;     // minutes
  location: Location;
  cost?: ActivityCost;
  rating?: number;       // 0-5
  imageUrl?: string;
  bookingUrl?: string;
  tips?: string[];
  tags?: string[];
}

// ─── Day Plan ────────────────────────────────────────────────

export interface DayPlan {
  id: string;
  date: string;           // ISO date YYYY-MM-DD
  dayNumber: number;
  title: string;
  summary: string;
  theme?: string;
  activities: Activity[];
  accommodation?: Activity;
  transport?: Activity[];
  weatherNote?: string;
  estimatedCost?: ActivityCost;
}

// ─── Itinerary ───────────────────────────────────────────────

export type ItineraryStatus =
  | "draft"
  | "generating"
  | "complete"
  | "error";

export interface ItinerarySummary {
  totalDays: number;
  totalActivities: number;
  estimatedBudget: ActivityCost;
  topHighlights: string[];
  destinationTags: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: Location;
  origin?: Location;
  startDate: string;
  endDate: string;
  numTravelers: number;
  preferences: TravelPreferences;
  days: DayPlan[];
  summary?: ItinerarySummary;
  status: ItineraryStatus;
  generatedAt?: string;   // ISO datetime
  updatedAt?: string;     // ISO datetime
  notes?: string;
}

// ─── UI State Types ──────────────────────────────────────────

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export interface PlannerStep {
  id: number;
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
}

// ─── Navigation ──────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

// ─── Chat ────────────────────────────────────────────────────

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;  // ISO datetime
  isTyping?: boolean;
}

export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
}

// ─── Budget ──────────────────────────────────────────────────

export interface BudgetCategory {
  label: string;
  icon: string;
  amount: number;
  currency: string;
  percentage: number;
  color: string;  // Tailwind color class fragment e.g. "brand"
}

export interface BudgetBreakdownData {
  total: number;
  currency: string;
  perPerson: number;
  perDay: number;
  categories: BudgetCategory[];
  numTravelers: number;
  numDays: number;
}

// ─── Itinerary UI ─────────────────────────────────────────────

export type ItineraryTab = "itinerary" | "budget" | "map";

export interface ItineraryUIState {
  activeTab: ItineraryTab;
  activeDayIndex: number;
  chatOpen: boolean;
  isLoaded: boolean;
}
