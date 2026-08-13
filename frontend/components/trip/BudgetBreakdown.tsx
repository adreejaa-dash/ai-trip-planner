"use client";

import type { BudgetBreakdown as BudgetBreakdownType } from "@/lib/types";

type Props = {
  breakdown: BudgetBreakdownType | null;
  budget: number;
  currency: string;
};

const CATEGORIES = [
  { key: "accommodation" as const, label: "Accommodation", icon: "🏨", color: "var(--accent-purple)" },
  { key: "food" as const, label: "Food & Dining", icon: "🍛", color: "var(--accent-orange)" },
  { key: "transportation" as const, label: "Transportation", icon: "🚕", color: "var(--accent-cyan)" },
  { key: "activities" as const, label: "Activities", icon: "🎟️", color: "var(--accent-blue)" },
  { key: "miscellaneous" as const, label: "Miscellaneous", icon: "📦", color: "var(--accent-pink)" },
];

export function BudgetBreakdown({ breakdown, budget, currency }: Props) {
  if (!breakdown) return null;

  const currencySymbol = currency === "INR" ? "₹" : currency;
  const remaining = budget - breakdown.total;
  const usagePercent = Math.min(100, (breakdown.total / budget) * 100);

  return (
    <div
      className="glass"
      style={{
        padding: "2rem",
        borderRadius: "var(--radius-xl)",
        marginTop: "2rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}
      >
        💰 Budget Breakdown
      </h2>

      {/* Total bar */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <span style={{ color: "var(--muted)" }}>
            Estimated Total:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              {currencySymbol}
              {breakdown.total.toLocaleString()}
            </strong>
          </span>
          <span style={{ color: "var(--muted)" }}>
            Budget:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              {currencySymbol}
              {budget.toLocaleString()}
            </strong>
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: "var(--surface-2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background:
                remaining >= 0
                  ? "var(--gradient-primary)"
                  : "linear-gradient(135deg, #f87171, #ef4444)",
              borderRadius: 4,
              width: `${usagePercent}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            color: remaining >= 0 ? "#34d399" : "#f87171",
            fontWeight: 600,
          }}
        >
          {remaining >= 0
            ? `${currencySymbol}${remaining.toLocaleString()} remaining`
            : `${currencySymbol}${Math.abs(remaining).toLocaleString()} over budget`}
        </div>
      </div>

      {/* Category cards */}
      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {CATEGORIES.map((cat) => {
          const amount = breakdown[cat.key];
          const percent =
            breakdown.total > 0
              ? Math.round((amount / breakdown.total) * 100)
              : 0;
          return (
            <div
              key={cat.key}
              style={{
                padding: "1.25rem",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                  }}
                >
                  {cat.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {currencySymbol}
                {amount.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  marginTop: "0.25rem",
                }}
              >
                {percent}% of total
              </div>
              {/* Mini bar */}
              <div
                style={{
                  height: 3,
                  background: "var(--surface-3)",
                  borderRadius: 2,
                  marginTop: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: cat.color,
                    borderRadius: 2,
                    width: `${percent}%`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
