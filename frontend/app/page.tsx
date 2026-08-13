"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const DESTINATIONS = [
  "Bhubaneswar",
  "Tokyo",
  "Paris",
  "Bali",
  "Santorini",
  "Kyoto",
  "Barcelona",
  "Jaipur",
];

const FEATURES = [
  {
    icon: "✦",
    title: "AI-Crafted Itineraries",
    desc: "Gemini AI builds personalized day-by-day plans based on your interests, budget, and destination.",
    color: "var(--accent-blue)",
  },
  {
    icon: "◈",
    title: "Budget-Aware Planning",
    desc: "Set your budget and get a detailed breakdown — accommodation, food, transport, activities, all within your limit.",
    color: "var(--accent-purple)",
  },
  {
    icon: "⟡",
    title: "Interactive Refinement",
    desc: "Not happy with a suggestion? Tell the AI to change it — add more food, remove museums, make it cheaper.",
    color: "var(--accent-cyan)",
  },
  {
    icon: "❋",
    title: "Persistent Storage",
    desc: "Your itineraries are saved to PostgreSQL. Come back anytime — refresh the page, your trip is still there.",
    color: "var(--accent-orange)",
  },
];

export default function HomePage() {
  const [destIndex, setDestIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDestIndex((i) => (i + 1) % DESTINATIONS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 600, height: 600, top: -200, left: -200, background: "radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)" }} />
      <div className="orb" style={{ width: 500, height: 500, top: 100, right: -150, background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: 0, left: "30%", background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }} />

      {/* Navbar */}
      <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--foreground)" }}>TripPlanner</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/#features" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }} className="nav-link">Features</Link>
          <Link href="/#how" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }} className="nav-link">How it works</Link>
          <Link href="/trips" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>My Trips</Link>
          <Link href="/plan" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>Plan a Trip →</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "7rem 2rem 5rem", textAlign: "center", animation: "fadeInUp 0.8s ease forwards" }}>
        <div className="badge badge-blue" style={{ margin: "0 auto 2rem", display: "inline-flex" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-blue)", display: "inline-block" }} />
          Powered by Google Gemini AI
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem" }}>
          AI-powered travel planner<br />
          for{" "}
          <span
            className="gradient-text"
            style={{
              display: "inline-block",
              minWidth: 240,
              transition: "opacity 0.4s",
              opacity: visible ? 1 : 0,
            }}
          >
            {DESTINATIONS[destIndex]}
          </span>
        </h1>

        <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: 580, margin: "0 auto 3rem", lineHeight: 1.7 }}>
          Enter your destination, budget, and interests — get a personalized, day-wise itinerary with budget breakdown, travel tips, and interactive refinement.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/plan" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "1rem 2.5rem" }}>
            ✈ Start Planning
          </Link>
          <a href="#how" className="btn-secondary" style={{ fontSize: "1.0625rem" }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="badge badge-purple" style={{ margin: "0 auto 1rem", display: "inline-flex" }}>Features</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>
            Everything you need to travel smarter
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}20`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: f.color }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "1.05rem" }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="badge badge-cyan" style={{ margin: "0 auto 1rem", display: "inline-flex" }}>How it works</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>
            From idea to itinerary in 3 steps
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {[
            { step: "01", title: "Enter your preferences", desc: "Tell us your destination, trip duration, budget, and interests. Select from categories like History, Food, Culture, Adventure, and more.", icon: "✍" },
            { step: "02", title: "AI generates your plan", desc: "Gemini AI creates a structured, day-wise itinerary with real places, estimated costs, and a budget breakdown — all within your budget.", icon: "🧠" },
            { step: "03", title: "Review & refine", desc: "View your complete itinerary, then refine it — 'add more food places', 'make Day 2 cheaper', 'remove museums'. Your updated plan is saved instantly.", icon: "✏️" },
          ].map((item) => (
            <div key={item.step} className="glass" style={{ borderRadius: "var(--radius-lg)", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "4rem", fontWeight: 900, position: "absolute", top: -10, right: 20, color: "rgba(79,142,247,0.08)" }}>{item.step}</div>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.75rem" }}>{item.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="badge badge-orange" style={{ margin: "0 auto 1rem", display: "inline-flex" }}>Tech Stack</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>
            Built with modern technologies
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { name: "Next.js", desc: "React framework", icon: "⚛️" },
            { name: "FastAPI", desc: "Python backend", icon: "⚡" },
            { name: "PostgreSQL", desc: "Database", icon: "🐘" },
            { name: "Gemini AI", desc: "Google AI", icon: "✨" },
            { name: "SQLAlchemy", desc: "ORM", icon: "🔗" },
            { name: "TypeScript", desc: "Type safety", icon: "📘" },
          ].map((t) => (
            <div key={t.name} className="glass" style={{ padding: "1.25rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{t.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: 1100, margin: "0 auto 6rem", padding: "0 2rem" }}>
        <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: "4rem 3rem", textAlign: "center", background: "linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(167,139,250,0.1) 100%)", borderColor: "rgba(79,142,247,0.2)" }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "1rem" }}>
            Ready to plan your next adventure?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
            Enter your destination, budget, and interests — your personalized itinerary is seconds away.
          </p>
          <Link href="/plan" className="btn-primary" style={{ fontSize: "1.0625rem", padding: "1rem 3rem" }}>
            ✈ Plan My Trip Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass" style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✈</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>TripPlanner</span>
        </div>
        <p>Built with Next.js, FastAPI, PostgreSQL, and Google Gemini AI.</p>
      </footer>
    </div>
  );
}
