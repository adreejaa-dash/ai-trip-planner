"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TripListItem } from "@/lib/types";
import { listTrips } from "@/lib/api";

export default function TripsPage() {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listTrips();
        setTrips(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your trips."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <Link
          href="/plan"
          className="btn-primary"
          style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
        >
          ✈ New Trip
        </Link>
      </nav>

      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
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
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              fontWeight: 800,
              marginBottom: "0.75rem",
            }}
          >
            Your <span className="gradient-text">Saved Trips</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
            View and revisit your AI-generated itineraries.
          </p>
        </div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--muted)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid var(--surface-3)",
                borderTopColor: "var(--accent-blue)",
                borderRadius: "50%",
                animation: "spin-slow 0.8s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            Loading your trips...
          </div>
        )}

        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
            }}
          >
            <p
              style={{
                color: "#f87171",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
            <Link href="/plan" className="btn-primary">
              Plan a new trip
            </Link>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺</div>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.3rem",
                marginBottom: "1rem",
              }}
            >
              No trips yet
            </h3>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1.5rem",
              }}
            >
              Plan your first trip and it will appear here.
            </p>
            <Link href="/plan" className="btn-primary">
              ✈ Plan Your First Trip
            </Link>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {trips.map((trip) => {
              const currencySymbol =
                trip.currency === "INR" ? "₹" : trip.currency;
              const createdDate = trip.created_at
                ? new Date(trip.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "";
              return (
                <Link
                  key={trip.id}
                  href={`/itinerary?id=${trip.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.2rem",
                            color: "var(--foreground)",
                          }}
                        >
                          {trip.destination}
                        </h3>
                        <span
                          className="badge badge-blue"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {trip.duration} day
                          {trip.duration !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {trip.summary && (
                        <p
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                            maxWidth: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {trip.summary}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginTop: "0.5rem",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}
                      >
                        <span>
                          💰 {currencySymbol}
                          {trip.budget.toLocaleString()}
                        </span>
                        <span>
                          ✨ {trip.interests.join(", ")}
                        </span>
                        {createdDate && <span>📅 {createdDate}</span>}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "var(--accent-blue)",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                        marginLeft: "1rem",
                      }}
                    >
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
