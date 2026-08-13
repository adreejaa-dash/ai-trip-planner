"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Trip } from "@/lib/types";
import { getTrip } from "@/lib/api";
import { GeneratingState } from "@/components/trip/GeneratingState";
import { ItineraryHeader } from "@/components/trip/ItineraryHeader";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { TravelTips } from "@/components/trip/TravelTips";
import { BudgetBreakdown } from "@/components/trip/BudgetBreakdown";
import { RefinementPanel } from "@/components/trip/RefinementPanel";

// ── Empty-state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺</div>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          No itinerary found
        </h2>
        <Link href="/plan" className="btn-primary">
          Plan a new trip
        </Link>
      </div>
    </div>
  );
}

// ── Error-state ───────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400, padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.5rem",
            marginBottom: "0.75rem",
          }}
        >
          Something went wrong
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          {message}
        </p>
        <Link href="/plan" className="btn-primary">
          Try again
        </Link>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ✈
        </div>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--foreground)",
          }}
        >
          TripPlanner
        </span>
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          href="/trips"
          style={{
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          My Trips
        </Link>
        <Link
          href="/plan"
          className="btn-secondary"
          style={{ fontSize: "0.825rem", padding: "0.5rem 1rem" }}
        >
          ✈ New Trip
        </Link>
      </div>
    </nav>
  );
}

// ── Day tabs ──────────────────────────────────────────────────────────────────

function DayTabs({
  days,
  activeDay,
  onSelect,
}: {
  days: Trip["days"];
  activeDay: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        scrollbarWidth: "none",
      }}
    >
      {days.map((day, i) => (
        <button
          key={i}
          id={`day-tab-${i + 1}`}
          onClick={() => onSelect(i)}
          style={{
            flexShrink: 0,
            padding: "0.5rem 1.25rem",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${
              activeDay === i ? "var(--accent-blue)" : "var(--border)"
            }`,
            background:
              activeDay === i ? "rgba(79,142,247,0.15)" : "var(--surface-2)",
            color:
              activeDay === i ? "var(--accent-blue)" : "var(--muted)",
            fontWeight: activeDay === i ? 700 : 400,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Day {day.day}
        </button>
      ))}
    </div>
  );
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export default function ItineraryContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getTrip(id);
      setTrip(data);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your itinerary."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  if (!id) return <EmptyState />;
  if (loading)
    return (
      <GeneratingState
        destination={params.get("destination") ?? "your destination"}
      />
    );
  if (error || !trip)
    return (
      <ErrorState message={error ?? "Could not load your itinerary."} />
    );

  const days = trip.days ?? [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          top: -100,
          right: -100,
          background:
            "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          bottom: 0,
          left: -100,
          background:
            "radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)",
        }}
      />

      <Navbar />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 6rem" }}>
        <ItineraryHeader trip={trip} />

        {/* Budget Breakdown */}
        <BudgetBreakdown
          breakdown={trip.budget_breakdown}
          budget={trip.budget}
          currency={trip.currency}
        />

        {/* Day-wise itinerary */}
        {days.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              📅 Daily Itinerary
            </h2>
            <DayTabs days={days} activeDay={activeDay} onSelect={setActiveDay} />
            <div style={{ marginTop: "1.5rem" }}>
              <DayTimeline
                key={activeDay}
                day={days[activeDay]}
                currency={trip.currency}
              />
            </div>
          </div>
        )}

        {/* Travel Tips */}
        <TravelTips tips={trip.travel_tips ?? []} />

        {/* Refinement Panel */}
        <RefinementPanel tripId={trip.id} onRefined={fetchTrip} />

        {/* Plan another trip */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link
            href="/plan"
            className="btn-primary"
            style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}
          >
            ✈ Plan Another Trip
          </Link>
        </div>
      </main>
    </div>
  );
}
