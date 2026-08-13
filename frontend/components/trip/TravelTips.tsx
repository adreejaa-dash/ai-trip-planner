"use client";

type Props = {
  tips: string[];
};

export function TravelTips({ tips }: Props) {
  if (tips.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "3rem",
        paddingTop: "2rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}
      >
        💡 Travel Tips
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {tips.map((tip, i) => (
          <div
            key={i}
            className="glass"
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              color: "var(--muted)",
            }}
          >
            <span
              style={{
                color: "var(--accent-cyan)",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              →
            </span>
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}
