"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateTrip } from "@/lib/api";

const INTEREST_OPTIONS = [
  { id: "history", label: "🏛 History", color: "var(--accent-blue)" },
  { id: "nature", label: "🌿 Nature", color: "#34d399" },
  { id: "food", label: "🍜 Food", color: "var(--accent-orange)" },
  { id: "shopping", label: "🛍 Shopping", color: "var(--accent-pink)" },
  { id: "adventure", label: "🧗 Adventure", color: "#34d399" },
  { id: "culture", label: "🎭 Culture", color: "var(--accent-purple)" },
  { id: "nightlife", label: "🌙 Nightlife", color: "var(--accent-cyan)" },
  { id: "architecture", label: "🏗 Architecture", color: "var(--accent-blue)" },
  { id: "relaxation", label: "🌅 Relaxation", color: "var(--accent-purple)" },
];

const CURRENCY_OPTIONS = [
  { id: "INR", label: "₹ INR", symbol: "₹" },
  { id: "USD", label: "$ USD", symbol: "$" },
  { id: "EUR", label: "€ EUR", symbol: "€" },
  { id: "GBP", label: "£ GBP", symbol: "£" },
];

export default function PlanPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState(10000);
  const [currency, setCurrency] = useState("INR");
  const [interests, setInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete state
  const [destQuery, setDestQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: number; name: string; admin1?: string; country?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (destQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destQuery)}&count=5&language=en`);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [destQuery]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const currencySymbol =
    CURRENCY_OPTIONS.find((c) => c.id === currency)?.symbol || "₹";

  const isValid =
    destination.trim().length >= 2 &&
    duration >= 1 &&
    duration <= 30 &&
    budget > 0 &&
    interests.length >= 1;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const trip = await generateTrip({
        destination: destination.trim(),
        duration,
        budget,
        currency,
        interests,
      });
      router.push(`/itinerary?id=${trip.id}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to generate your itinerary right now. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          top: -150,
          right: -100,
          background:
            "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Navbar */}
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
            href="/"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            ← Home
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            animation: "fadeInUp 0.6s ease forwards",
          }}
        >
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              marginBottom: "0.75rem",
            }}
          >
            Plan your{" "}
            <span className="gradient-text">dream trip</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
            Enter your preferences and AI will build your perfect itinerary.
          </p>
        </div>

        {/* Form card */}
        <div
          className="glass"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem",
            animation: "fadeInUp 0.7s ease forwards",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
          >
            {/* Destination */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                📍 Destination *
              </label>
              <input
                id="destination"
                type="text"
                className="input-field"
                placeholder="e.g. Bhubaneswar, Paris, Tokyo..."
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setDestQuery(e.target.value);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    marginTop: "0.25rem",
                    zIndex: 50,
                    maxHeight: 250,
                    overflowY: "auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  {isSearching ? (
                    <div style={{ padding: "0.75rem", fontSize: "0.875rem", color: "var(--muted)" }}>Loading...</div>
                  ) : suggestions.length === 0 ? (
                    <div style={{ padding: "0.75rem", fontSize: "0.875rem", color: "var(--muted)" }}>No results found</div>
                  ) : (
                    suggestions.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          padding: "0.75rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          borderBottom: "1px solid var(--border)",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const locName = [s.name, s.admin1, s.country].filter(Boolean).join(", ");
                          setDestination(locName);
                          setDestQuery("");
                          setShowSuggestions(false);
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{s.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          {[s.admin1, s.country].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Duration + Budget row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                  }}
                >
                  📅 Duration (days) *
                </label>
                <input
                  id="duration"
                  type="number"
                  className="input-field"
                  min={1}
                  max={30}
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
                    )
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                  }}
                >
                  💰 Budget *
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    id="currency"
                    className="input-field"
                    style={{ width: 90, flexShrink: 0 }}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="budget"
                    type="number"
                    className="input-field"
                    min={1000}
                    step={1000}
                    placeholder="10000"
                    value={budget}
                    onChange={(e) =>
                      setBudget(Math.max(1000, parseFloat(e.target.value) || 1000))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Duration badge */}
            {duration > 0 && (
              <div
                className="badge badge-blue"
                style={{ alignSelf: "flex-start" }}
              >
                {duration} day{duration !== 1 ? "s" : ""} · {currencySymbol}
                {budget.toLocaleString()} budget
              </div>
            )}

            {/* Interests */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                ✨ Interests (select at least one) *
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      id={`interest-${interest.id}`}
                      onClick={() => toggleInterest(interest.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "999px",
                        border: `1px solid ${
                          selected ? interest.color : "var(--border)"
                        }`,
                        background: selected
                          ? `${interest.color}20`
                          : "var(--surface-2)",
                        color: selected
                          ? interest.color
                          : "var(--foreground)",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: selected ? 600 : 400,
                        transition: "all 0.2s",
                      }}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  color: "#f87171",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              id="generate-btn"
              className="btn-primary"
              disabled={!isValid || submitting}
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.0625rem",
              }}
            >
              {submitting ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin-slow 0.8s linear infinite",
                    }}
                  />
                  Creating your personalized itinerary...
                </span>
              ) : (
                "✨ Generate Itinerary"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
