// ── TripPlanner API client ────────────────────────────────────────────────────

import type { Trip, TripListItem, TripGenerateRequest } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.detail || `Server error: ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

/** Generate a new trip itinerary */
export async function generateTrip(data: TripGenerateRequest): Promise<Trip> {
  return request<Trip>("/api/trips/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Get a single trip by ID */
export async function getTrip(id: string): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}`);
}

/** List all saved trips */
export async function listTrips(): Promise<TripListItem[]> {
  return request<TripListItem[]>("/api/trips");
}

/** Refine an existing trip */
export async function refineTrip(id: string, instruction: string): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}/refine`, {
    method: "POST",
    body: JSON.stringify({ instruction }),
  });
}

export { ApiError };
