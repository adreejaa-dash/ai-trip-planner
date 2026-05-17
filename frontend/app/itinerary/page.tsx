"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate } from "@/lib/utils";
import {
  MapPin, Calendar, Users, Sparkles, Share2,
  Download, ArrowLeft, Clock, ChevronDown, Star,
  DollarSign, Loader2
} from "lucide-react";

// ─── Generating State ────────────────────────────────────────
function GeneratingState() {
  const steps = [
    "Analyzing destination data…",
    "Finding the best activities…",
    "Optimizing your route…",
    "Adding local insider tips…",
    "Calculating budget estimates…",
    "Finalizing your itinerary…",
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center page-enter">
      <div className="text-center max-w-md px-4">
        {/* Animated logo */}
        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-brand-400/40 animate-ping [animation-delay:400ms]" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient shadow-2xl shadow-brand-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold mb-2">Building your itinerary…</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Our AI is crafting a personalized trip plan just for you. This usually takes under 2 minutes.
        </p>

        {/* Animated step list */}
        <div className="space-y-2 text-left">
          {steps.map((s, i) => (
            <div
              key={s}
              className="flex items-center gap-3 text-sm animate-fade-in"
              style={{ animationDelay: `${i * 500}ms`, animationFillMode: "both" }}
            >
              <Loader2 className="h-3.5 w-3.5 shrink-0 text-brand-400 animate-spin" style={{ animationDelay: `${i * 200}ms` }} />
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/plan">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Card ───────────────────────────────────────────
function ActivityCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
      <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Day Plan Skeleton ───────────────────────────────────────
function DayPlanSkeleton({ dayNum }: { dayNum: number }) {
  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border">
          <span className="text-xs font-bold text-muted-foreground">{dayNum}</span>
        </div>
        <div className="space-y-1 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      {/* Activities */}
      <div className="ml-11 space-y-3">
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
        <ActivityCardSkeleton />
      </div>
    </div>
  );
}

// ─── Full Itinerary Layout ───────────────────────────────────
function ItineraryLayout() {
  // Placeholder data — will be replaced with real API data later
  const destination = "Tokyo, Japan";
  const startDate = "2025-06-15";
  const endDate = "2025-06-22";
  const numTravelers = 2;
  const daysCount = 7;

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter">
      <div className="container max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/plan" className="hover:text-foreground transition-colors">Planner</Link>
          <span>/</span>
          <span className="text-foreground">Itinerary</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="emerald">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
              <Badge variant="secondary">Draft</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              {daysCount} Days in {destination}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(startDate)} — {formatDate(endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {numTravelers} travelers
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Japan, Asia
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="gradient" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Trip summary card */}
            <Card className="glass-card border-white/8 sticky top-24">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-display font-semibold text-sm">Trip Summary</h3>
                <div className="space-y-3">
                  {[
                    { icon: Clock, label: "Duration", value: `${daysCount} days` },
                    { icon: MapPin, label: "Destination", value: destination },
                    { icon: Users, label: "Travelers", value: `${numTravelers} people` },
                    { icon: DollarSign, label: "Est. Budget", value: "$2,400" },
                    { icon: Star, label: "Activities", value: "21 planned" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                      <span className="text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Day navigation */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Jump to day</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: daysCount }, (_, i) => (
                      <button
                        key={i}
                        className={cn(
                          "rounded-lg border py-1.5 text-xs font-medium transition-all",
                          i === 0
                            ? "border-brand-500 bg-brand-500/20 text-brand-300"
                            : "border-border text-muted-foreground hover:border-white/20 hover:bg-secondary/60"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="outline-brand" size="sm" className="w-full" asChild>
                  <Link href="/plan">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Edit Trip Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Day-by-day itinerary */}
          <div className="space-y-8">
            {/* Loading skeleton days */}
            {Array.from({ length: daysCount }, (_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/20 border border-brand-500/30">
                    <span className="text-sm font-bold text-brand-400">{i + 1}</span>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-44 mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>

                {/* Activities placeholder */}
                <div className="ml-12 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex gap-4 rounded-xl border border-border/50 bg-card/40 p-4"
                    >
                      <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-full max-w-xs" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {i < daysCount - 1 && <Separator className="ml-12" />}
              </div>
            ))}

            {/* Empty state call-to-action */}
            <div className="rounded-2xl border border-dashed border-border/80 p-10 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-display font-semibold mb-2">Your itinerary will appear here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you submit your trip details, the AI will generate your personalized day-by-day plan.
              </p>
              <Button variant="gradient" size="default" asChild>
                <Link href="/plan">
                  <Sparkles className="h-4 w-4" />
                  Start Planning
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────
function ItineraryContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (status === "generating") {
    return <GeneratingState />;
  }

  return <ItineraryLayout />;
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<GeneratingState />}>
      <ItineraryContent />
    </Suspense>
  );
}
