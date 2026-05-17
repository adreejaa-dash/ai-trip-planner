"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ItineraryTab } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DayCard } from "@/components/trip/DayCard";
import { BudgetBreakdown } from "@/components/trip/BudgetBreakdown";
import { ChatPanel } from "@/components/trip/ChatPanel";
import { MapView } from "@/components/trip/MapView";
import { useItinerary } from "@/hooks/useItinerary";
import { MOCK_ITINERARY, MOCK_BUDGET, CHAT_SUGGESTIONS } from "@/lib/mockData";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import {
  MapPin, Calendar, Users, Sparkles, Share2,
  Download, ArrowLeft, Clock, Star,
  DollarSign, Loader2, MessageSquare, X,
  Map, Wallet, List,
} from "lucide-react";

// ─── Generating State ─────────────────────────────────────────

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
        <div className="space-y-2 text-left">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3 text-sm animate-fade-in" style={{ animationDelay: `${i * 500}ms`, animationFillMode: "both" }}>
              <Loader2 className="h-3.5 w-3.5 shrink-0 text-brand-400 animate-spin" style={{ animationDelay: `${i * 200}ms` }} />
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/plan"><ArrowLeft className="h-4 w-4" /> Go back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Navigation ───────────────────────────────────────────

const TABS: { id: ItineraryTab; label: string; icon: typeof List }[] = [
  { id: "itinerary", label: "Itinerary", icon: List },
  { id: "budget",    label: "Budget",    icon: Wallet },
  { id: "map",       label: "Map",       icon: Map },
];

// ─── Full Itinerary Layout ────────────────────────────────────

function ItineraryLayout() {
  const itinerary = MOCK_ITINERARY;
  const budget = MOCK_BUDGET;
  const {
    activeTab, setActiveTab,
    activeDayIndex, scrollToDay,
    chatOpen, setChatOpen,
    messages, chatInput, setChatInput, isTyping, sendMessage,
  } = useItinerary();

  const dest = itinerary.destination;
  const daysCount = itinerary.days.length;
  const totalActivities = itinerary.summary?.totalActivities ?? 0;

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter">
      <div className="container max-w-7xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/plan" className="hover:text-foreground transition-colors">Planner</Link>
          <span>/</span>
          <span className="text-foreground">{dest.city}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="emerald">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
              <Badge variant="secondary">Complete</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              {daysCount} Days in {dest.city}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {itinerary.numTravelers} travelers
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {dest.country}, Asia
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                {totalActivities} activities planned
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setChatOpen((v) => !v)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Refine with AI
            </Button>
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

        {/* Main 3-column layout */}
        <div className={cn("grid gap-6 transition-all duration-300", chatOpen ? "lg:grid-cols-[240px,1fr,320px]" : "lg:grid-cols-[240px,1fr]")}>

          {/* ── Sidebar ── */}
          <aside className="space-y-4">
            <div className="glass-card border-white/8 p-5 space-y-4 sticky top-24">
              <h3 className="font-display font-semibold text-sm">Trip Summary</h3>
              <div className="space-y-3">
                {[
                  { icon: Clock, label: "Duration", value: `${daysCount} days` },
                  { icon: MapPin, label: "Destination", value: `${dest.city}, ${dest.country}` },
                  { icon: Users, label: "Travelers", value: `${itinerary.numTravelers} people` },
                  { icon: DollarSign, label: "Est. Budget", value: formatCurrency(budget.total, budget.currency) },
                  { icon: Star, label: "Activities", value: `${totalActivities} planned` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </span>
                    <span className="text-xs font-medium max-w-[120px] text-right leading-tight">{value}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Highlights */}
              {itinerary.summary?.topHighlights && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Top Highlights</p>
                  <ul className="space-y-1.5">
                    {itinerary.summary.topHighlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <span className="text-brand-400 mt-0.5 shrink-0">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Day navigation */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Jump to day</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {itinerary.days.map((day, i) => (
                    <button
                      key={day.id}
                      onClick={() => scrollToDay(i)}
                      className={cn(
                        "rounded-lg border py-1.5 text-xs font-medium transition-all duration-200",
                        activeDayIndex === i
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
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="min-w-0">
            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-secondary/30 border border-border/50 w-fit">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    activeTab === id
                      ? "bg-background text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Itinerary Tab */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                {itinerary.days.map((day, i) => (
                  <DayCard
                    key={day.id}
                    day={day}
                    isActive={activeDayIndex === i}
                    defaultOpen={i === 0}
                    className="scroll-mt-28"
                  />
                ))}
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === "budget" && (
              <BudgetBreakdown data={budget} />
            )}

            {/* Map Tab */}
            {activeTab === "map" && (
              <MapView itinerary={itinerary} activeDayIndex={activeDayIndex} />
            )}
          </main>

          {/* ── Chat Panel (slides in) ── */}
          {chatOpen && (
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
              <ChatPanel
                messages={messages}
                suggestions={CHAT_SUGGESTIONS}
                inputValue={chatInput}
                isTyping={isTyping}
                onSend={sendMessage}
                onInputChange={setChatInput}
                onClose={() => setChatOpen(false)}
                className="h-[500px] lg:h-full"
              />
            </div>
          )}
        </div>

        {/* Mobile chat toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button
            variant="gradient"
            size="default"
            className="rounded-full h-12 w-12 p-0 shadow-xl shadow-brand-500/30"
            onClick={() => setChatOpen((v) => !v)}
            aria-label={chatOpen ? "Close AI chat" : "Open AI chat"}
          >
            {chatOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile chat panel overlay */}
        {chatOpen && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 p-4 animate-fade-in">
            <ChatPanel
              messages={messages}
              suggestions={CHAT_SUGGESTIONS}
              inputValue={chatInput}
              isTyping={isTyping}
              onSend={sendMessage}
              onInputChange={setChatInput}
              onClose={() => setChatOpen(false)}
              className="h-[60vh] shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Mobile: sticky bottom day navigation (only on itinerary tab) */}
      {activeTab === "itinerary" && (
        <div className="lg:hidden fixed bottom-20 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="flex items-center gap-1 overflow-x-auto bg-background/95 backdrop-blur-lg border border-border/60 rounded-2xl p-2 shadow-xl shadow-black/30 pointer-events-auto custom-scrollbar">
            <span className="text-xs text-muted-foreground px-2 shrink-0 font-medium">Day</span>
            {itinerary.days.map((day, i) => (
              <button
                key={day.id}
                onClick={() => scrollToDay(i)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  activeDayIndex === i
                    ? "border-brand-500 bg-brand-500/20 text-brand-300"
                    : "border-border text-muted-foreground hover:border-white/20 hover:bg-secondary/60"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

function ItineraryContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [showItinerary, setShowItinerary] = useState(false);

  // Simulate generating → complete transition
  useEffect(() => {
    if (status === "generating") {
      const timer = setTimeout(() => setShowItinerary(true), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowItinerary(true);
    }
  }, [status]);

  if (!showItinerary) return <GeneratingState />;
  return <ItineraryLayout />;
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<GeneratingState />}>
      <ItineraryContent />
    </Suspense>
  );
}
