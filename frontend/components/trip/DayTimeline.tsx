"use client";

import type { DayPlan } from "@/lib/types";

type Props = {
  day: DayPlan;
  currency: string;
};

export function DayTimeline({ day, currency }: Props) {
  const currencySymbol = currency === "INR" ? "₹" : currency;

  return (
    <div style={{ animation: "fadeIn 0.4s ease forwards" }}>
      {/* Day heading */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
          }}
        >
          Day {day.day} — {day.title}
        </h2>
      </div>

      {/* Vertical timeline */}
      <div style={{ position: "relative", paddingLeft: "2rem" }}>
        {/* Gradient line */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 12,
            bottom: 12,
            width: 2,
            background:
              "linear-gradient(to bottom, var(--accent-blue), var(--accent-purple))",
            borderRadius: 1,
          }}
        />

        {day.activities.map((activity, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              marginBottom: "1.5rem",
              animation: `fadeInUp 0.4s ease ${idx * 0.08}s both`,
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: -26,
                top: 16,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                border: "2px solid var(--background)",
                boxShadow: "0 0 8px rgba(79,142,247,0.4)",
              }}
            />

            {/* Activity card */}
            <div className="card" style={{ marginLeft: "0.5rem" }}>
              {/* Card header: time + place + cost */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--accent-blue)",
                      minWidth: 72,
                    }}
                  >
                    {activity.time}
                  </span>
                  <h3 style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {activity.place}
                  </h3>
                </div>

                {/* Cost badge */}
                <span
                  style={{
                    padding: "0.2rem 0.75rem",
                    borderRadius: 999,
                    background:
                      activity.estimated_cost === 0
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(251,146,60,0.15)",
                    color:
                      activity.estimated_cost === 0
                        ? "#34d399"
                        : "var(--accent-orange)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {activity.estimated_cost === 0
                    ? "Free"
                    : `${currencySymbol}${activity.estimated_cost.toLocaleString()}`}
                </span>
              </div>

              {/* Activity name */}
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  marginBottom: "0.375rem",
                }}
              >
                {activity.activity}
              </div>

              {/* Description */}
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
