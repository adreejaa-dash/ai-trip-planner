"use client";

import { useState } from "react";

type Props = {
  tripId: string;
  onRefined: () => void;
};

const SUGGESTIONS = [
  "Add more food places",
  "Make this cheaper",
  "Add more nature activities",
  "Remove early morning activities",
  "Add more cultural experiences",
];

export function RefinementPanel({ tripId, onRefined }: Props) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRefine = async () => {
    if (!instruction.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/trips/${tripId}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: instruction.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.detail || "Unable to refine your itinerary right now."
        );
      }

      setSuccess(true);
      setInstruction("");
      onRefined();

      // Clear success message after 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refine your itinerary right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass"
      style={{
        marginTop: "3rem",
        padding: "2rem",
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(79,142,247,0.2)",
      }}
    >
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        ✏️ Want to change your itinerary?
      </h3>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.875rem",
          marginBottom: "1rem",
        }}
      >
        Tell TripPlanner what you&apos;d like to change, and AI will update your
        plan.
      </p>

      {/* Suggestion chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.375rem",
          marginBottom: "1rem",
        }}
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInstruction(s)}
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: 999,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input + button */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Remove museums and add more outdoor activities"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && instruction.trim() && !loading) {
              handleRefine();
            }
          }}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={!instruction.trim() || loading}
          onClick={handleRefine}
          style={{
            flexShrink: 0,
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin-slow 0.8s linear infinite",
                }}
              />
              Refining...
            </span>
          ) : (
            "Refine"
          )}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem 1rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "var(--radius-md)",
            color: "#f87171",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem 1rem",
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: "var(--radius-md)",
            color: "#34d399",
            fontSize: "0.85rem",
          }}
        >
          ✓ Itinerary updated successfully!
        </div>
      )}
    </div>
  );
}
