// ── TripPlanner domain types ─────────────────────────────────────────────────

export type Activity = {
  time: string;
  place: string;
  activity: string;
  description: string;
  estimated_cost: number;
};

export type DayPlan = {
  day: number;
  title: string;
  activities: Activity[];
};

export type BudgetBreakdown = {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  total: number;
};

export type Trip = {
  id: string;
  destination: string;
  duration: number;
  budget: number;
  currency: string;
  interests: string[];
  summary: string | null;
  budget_breakdown: BudgetBreakdown | null;
  days: DayPlan[];
  travel_tips: string[];
  created_at: string | null;
};

export type TripListItem = {
  id: string;
  destination: string;
  duration: number;
  budget: number;
  currency: string;
  interests: string[];
  summary: string | null;
  created_at: string | null;
};

export type TripGenerateRequest = {
  destination: string;
  duration: number;
  budget: number;
  currency: string;
  interests: string[];
};

export type TripRefineRequest = {
  instruction: string;
};
