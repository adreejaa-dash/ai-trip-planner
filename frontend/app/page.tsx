import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_FEATURES, LANDING_STATS, FEATURED_DESTINATIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "TripMind — AI-Powered Travel Itinerary Planner",
  description:
    "Plan your perfect trip in minutes. TripMind uses AI to generate personalized day-by-day itineraries tailored to your style, budget, and interests.",
};

export default function LandingPage() {
  return (
    <div className="page-enter">
      {/* ─── Hero Section ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/8 blur-[100px]" />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] rounded-full bg-emerald-500/6 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] rounded-full bg-purple-500/6 blur-[80px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container relative max-w-5xl text-center px-4">
          {/* Pre-headline badge */}
          <div className="mb-6 flex justify-center animate-fade-in">
            <Badge variant="brand" className="gap-2 px-4 py-1.5 text-xs font-medium rounded-full">
              <Sparkles className="h-3 w-3" />
              AI-Powered Travel Planning
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:100ms]">
            Your dream trip,{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">planned in minutes.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-in [animation-delay:200ms]">
            Tell TripMind where you want to go and how you like to travel. Our AI
            builds a personalized, day-by-day itinerary — complete with activities,
            budget estimates, and local tips.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms]">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/plan">
                Plan My Trip
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white/15 hover:border-white/30">
              See Example Trip
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-sm text-muted-foreground animate-fade-in [animation-delay:400ms]">
            No signup required · Free to try · Takes 2 minutes
          </p>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 animate-fade-in [animation-delay:500ms]">
            {LANDING_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section className="py-20 sm:py-28 container max-w-6xl">
        <div className="text-center mb-14">
          <Badge variant="brand" className="mb-4">How It Works</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Three steps to your perfect trip
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            We do the heavy lifting so you can focus on packing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: <Globe className="h-6 w-6 text-brand-400" />,
              title: "Tell us your trip",
              description:
                "Enter your destination, travel dates, number of travelers, and your preferences — budget, style, accommodation.",
            },
            {
              step: "02",
              icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
              title: "AI builds your plan",
              description:
                "Our AI analyzes thousands of options and crafts a detailed, day-by-day itinerary perfectly matched to you.",
            },
            {
              step: "03",
              icon: <Clock className="h-6 w-6 text-purple-400" />,
              title: "Customize & go",
              description:
                "Tweak activities, swap restaurants, adjust timings. Then export your itinerary and start exploring.",
            },
          ].map((item) => (
            <Card key={item.step} className="glass-card border-white/8 hover:border-white/15 transition-all duration-300 group">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <span className="font-display text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-card/30 border-y border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-14">
            <Badge variant="emerald" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Designed to make trip planning feel effortless, not overwhelming.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LANDING_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/60 bg-card/50 p-6 hover:border-white/15 hover:bg-card/80 transition-all duration-300"
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="font-display font-semibold text-base mb-2 group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Destinations ────────────────────────── */}
      <section className="py-20 sm:py-28 container max-w-6xl">
        <div className="text-center mb-14">
          <Badge variant="amber" className="mb-4">Popular Now</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Trending destinations
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start with one of these popular picks, or enter any destination you have in mind.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_DESTINATIONS.map((dest) => (
            <Link key={dest.name} href={`/plan?destination=${encodeURIComponent(dest.name)}`}>
              <div className={`group relative rounded-2xl border border-border/60 bg-gradient-to-br ${dest.gradient} p-6 h-44 cursor-pointer hover:border-white/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                <div className="relative">
                  <span className="text-3xl block mb-3 animate-float" style={{ animationDelay: `${Math.random() * 1}s` }}>
                    {dest.emoji}
                  </span>
                  <h3 className="font-display font-bold text-base text-white mb-1">{dest.name}</h3>
                  <p className="text-xs text-white/60 mb-3 line-clamp-1">{dest.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {dest.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 border border-white/15">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-white/60" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────── */}
      <section className="py-20 sm:py-28 container max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-950/80 to-indigo-950/80 p-10 sm:p-16 text-center">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 rounded-full bg-brand-500/15 blur-3xl" />
          </div>
          <div className="relative">
            <span className="text-4xl block mb-6 animate-float">✈️</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to plan your next adventure?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Join thousands of travelers who use TripMind to plan smarter, stress-free trips.
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link href="/plan">
                Start Planning Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
