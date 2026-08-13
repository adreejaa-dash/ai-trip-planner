"use client";

import { useEffect, useState } from "react";

// ── GeneratingState ───────────────────────────────────────────────────────────
// Shown while the AI is building the itinerary. Animates through a checklist of
// research stages and a progress bar that fills over ~11 seconds.

const STAGES = [
  "Researching top attractions...",
  "Optimising your route...",
  "Finding hidden gems...",
  "Curating food recommendations...",
  "Building your day-by-day plan...",
  "Adding local tips & tricks...",
  "Finalising your itinerary...",
];

type Props = {
  destination: string;
};

export function GeneratingState({ destination }: Props) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        animation: "fadeIn 0.6s ease forwards",
      }}
    >
      {/* Animated orb */}
      <div
        style={{
          position: "relative",
          width: 160,
          height: 160,
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--gradient-primary)",
            opacity: 0.15,
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: "50%",
            background: "var(--gradient-primary)",
            opacity: 0.25,
            animation: "pulse-glow 2s ease-in-out infinite 0.5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 24,
            borderRadius: "50%",
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
          }}
        >
          ✈
        </div>
        {/* Orbiting dot */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "spin-slow 3s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--accent-cyan)",
              boxShadow: "0 0 10px var(--accent-cyan)",
            }}
          />
        </div>
      </div>

      <h2
        style={{
          fontFamily: "var(--font-outfit, 'Outfit'), sans-serif",
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        Crafting your{destination ? ` ${destination}` : ""} itinerary
      </h2>
      <p
        style={{
          color: "var(--muted)",
          marginBottom: "3rem",
          fontSize: "1.05rem",
        }}
      >
        Gemini AI is researching and building your perfect plan...
      </p>

      {/* Stage checklist */}
      <div
        className="glass"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem 2.5rem",
          minWidth: 340,
        }}
      >
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 0",
              opacity: i > stageIndex ? 0.3 : 1,
              transition: "opacity 0.4s",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background:
                  i < stageIndex
                    ? "var(--accent-blue)"
                    : i === stageIndex
                    ? "var(--gradient-primary)"
                    : "var(--surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                color: "white",
                flexShrink: 0,
                transition: "background 0.4s",
              }}
            >
              {i < stageIndex ? "✓" : ""}
            </div>
            <span
              style={{
                fontSize: "0.875rem",
                color:
                  i === stageIndex ? "var(--foreground)" : "var(--muted)",
              }}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 340,
          height: 4,
          background: "var(--surface-2)",
          borderRadius: 2,
          marginTop: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--gradient-primary)",
            borderRadius: 2,
            width: `${((stageIndex + 1) / STAGES.length) * 100}%`,
            transition: "width 1.5s ease",
          }}
        />
      </div>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.8rem",
          marginTop: "0.75rem",
        }}
      >
        {Math.round(((stageIndex + 1) / STAGES.length) * 100)}% complete
      </p>
    </div>
  );
}
