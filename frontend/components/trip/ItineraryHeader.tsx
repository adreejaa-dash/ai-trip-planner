"use client";

import type { Trip } from "@/lib/types";

type Props = {
  trip: Trip;
};

export function ItineraryHeader({ trip }: Props) {
  const totalActivities = (trip.days ?? []).reduce(
    (acc, d) => acc + d.activities.length,
    0
  );

  const currencySymbol = trip.currency === "INR" ? "₹" : trip.currency;
  const estimatedTotal = trip.budget_breakdown?.total ?? 0;
  const remaining = trip.budget - estimatedTotal;

  const stats = [
    {
      icon: "📅",
      label: `${trip.duration} day${trip.duration !== 1 ? "s" : ""}`,
      sub: `${totalActivities} activities planned`,
    },
    {
      icon: "💰",
      label: `${currencySymbol}${estimatedTotal.toLocaleString()} / ${currencySymbol}${trip.budget.toLocaleString()}`,
      sub:
        remaining >= 0
          ? `${currencySymbol}${remaining.toLocaleString()} remaining`
          : `${currencySymbol}${Math.abs(remaining).toLocaleString()} over budget`,
    },
    {
      icon: "✨",
      label: trip.interests.join(", "),
      sub: "interests",
    },
  ];

  return (
    <div
      style={{
        padding: "3rem 0 2rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="badge badge-blue"
        style={{ marginBottom: "1rem", display: "inline-flex" }}
      >
        ✓ Itinerary Ready
      </div>

      <h1
        style={{
          fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          marginBottom: "0.75rem",
        }}
      >
        Your{" "}
        <span className="gradient-text">{trip.destination}</span>{" "}
        Adventure
      </h1>

      {trip.summary && (
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            maxWidth: 700,
            marginBottom: "1.5rem",
          }}
        >
          {trip.summary}
        </p>
      )}

      {/* Stats pills */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass"
            style={{
              padding: "0.875rem 1.25rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>{stat.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {stat.label}
              </div>
              {stat.sub && (
                <div
                  style={{ color: "var(--muted)", fontSize: "0.75rem" }}
                >
                  {stat.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
