"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useTripPlannerForm } from "@/hooks/useTripPlannerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { TRAVEL_STYLES, BUDGET_LEVELS, ACCOMMODATION_TYPES, TRAVELER_OPTIONS, CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  MapPin, Calendar, Users, ArrowRight, ArrowLeft,
  Sparkles, CheckCircle2, DollarSign, Home
} from "lucide-react";

// ─── Step indicator ─────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  const steps = [
    { label: "Destination", icon: MapPin },
    { label: "Preferences", icon: Sparkles },
    { label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          Step {step} of {total}
        </p>
        <p className="text-sm font-medium">{steps[step - 1].label}</p>
      </div>
      <Progress value={(step / total) * 100} className="h-1.5" />
      <div className="flex justify-between mt-3">
        {steps.map((s, i) => {
          const done = i + 1 < step;
          const active = i + 1 === step;
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-all duration-300",
                  done && "border-emerald-500 bg-emerald-500/20 text-emerald-400",
                  active && "border-brand-400 bg-brand-500/20 text-brand-300",
                  !done && !active && "border-border text-muted-foreground"
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <span className={cn("text-[10px] font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Destination & Dates ────────────────────────────
function Step1({ form, errors, setField }: ReturnType<typeof useTripPlannerForm> & { form: ReturnType<typeof useTripPlannerForm>["form"] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Where are you headed?</h2>
        <p className="text-sm text-muted-foreground">Enter your destination and travel dates.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination *</Label>
          <Input
            id="destination"
            placeholder="e.g. Tokyo, Japan"
            value={form.destination}
            onChange={(e) => setField("destination", e.target.value)}
            error={errors.destination}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Departing from (optional)</Label>
          <Input
            id="origin"
            placeholder="e.g. New York, USA"
            value={form.origin ?? ""}
            onChange={(e) => setField("origin", e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
              error={errors.startDate}
              icon={<Calendar className="h-4 w-4" />}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => setField("endDate", e.target.value)}
              error={errors.endDate}
              icon={<Calendar className="h-4 w-4" />}
              min={form.startDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers *</Label>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setField("numTravelers", n)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition-all duration-200",
                  form.numTravelers === n
                    ? "border-brand-500 bg-brand-500/15 text-brand-300"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-white/20 hover:bg-secondary/60"
                )}
              >
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">{n}</span>
              </button>
            ))}
            {/* 6+ button to reveal extended picker */}
            <button
              type="button"
              onClick={() => setField("numTravelers", 6)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition-all duration-200",
                form.numTravelers > 5
                  ? "border-brand-500 bg-brand-500/15 text-brand-300"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-white/20 hover:bg-secondary/60"
              )}
            >
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">6+</span>
            </button>
          </div>
          {form.numTravelers > 5 && (
            <div className="space-y-2 mt-2">
              <Label htmlFor="travelerCount">Exact count</Label>
              <select
                id="travelerCount"
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.numTravelers}
                onChange={(e) => setField("numTravelers", parseInt(e.target.value))}
              >
                {TRAVELER_OPTIONS.filter((o) => o.value >= 6).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Preferences ─────────────────────────────────────
function Step2({ form, toggleStyle, setBudget, toggleAccommodation, setField }: ReturnType<typeof useTripPlannerForm>) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Tell us how you travel</h2>
        <p className="text-sm text-muted-foreground">We&apos;ll tailor your itinerary to your style.</p>
      </div>

      {/* Travel Styles */}
      <div className="space-y-3">
        <Label>Travel Style <span className="text-muted-foreground text-xs">(pick all that apply)</span></Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TRAVEL_STYLES.map((style) => {
            const selected = form.preferences.styles.includes(style.value);
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => toggleStyle(style.value)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200",
                  selected
                    ? "border-brand-500 bg-brand-500/15 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-white/20 hover:bg-secondary/60"
                )}
              >
                <span className="text-base">{style.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{style.label}</span>
                {selected && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-brand-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label>Budget Level</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BUDGET_LEVELS.map((b) => {
            const selected = form.preferences.budget === b.value;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => setBudget(b.value)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200",
                  selected
                    ? "border-emerald-500 bg-emerald-500/15 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-white/20"
                )}
              >
                <span className="text-lg">{b.icon}</span>
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-[10px] text-muted-foreground">{b.range}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accommodation */}
      <div className="space-y-3">
        <Label>Accommodation <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <div className="flex flex-wrap gap-2">
          {ACCOMMODATION_TYPES.map((a) => {
            const selected = form.preferences.accommodation.includes(a.value);
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => toggleAccommodation(a.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200",
                  selected
                    ? "border-purple-500 bg-purple-500/15 text-purple-300"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-white/20"
                )}
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency">
          <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Preferred Currency</span>
        </Label>
        <select
          id="currency"
          className="w-full sm:w-64 rounded-xl border border-border bg-secondary/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={form.preferences.currency}
          onChange={(e) => setField("preferences", { ...form.preferences, currency: e.target.value })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Step 3: Review & Notes ──────────────────────────────────
function Step3({ form, setField }: ReturnType<typeof useTripPlannerForm>) {
  const nights = form.startDate && form.endDate
    ? Math.max(0, Math.floor((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Review your trip details</h2>
        <p className="text-sm text-muted-foreground">Looks good? Add any extra notes for the AI.</p>
      </div>

      {/* Summary card */}
      <Card className="glass-card border-white/8">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Destination</span>
            <span className="font-medium text-sm">{form.destination || "—"}</span>
          </div>
          {form.origin && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Departing from</span>
              <span className="font-medium text-sm">{form.origin}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="font-medium text-sm">
              {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Travelers</span>
            <span className="font-medium text-sm">{form.numTravelers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Budget</span>
            <Badge variant="emerald" className="capitalize">{form.preferences.budget}</Badge>
          </div>
          {form.preferences.styles.length > 0 && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-muted-foreground shrink-0">Styles</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {form.preferences.styles.map((s) => (
                  <Badge key={s} variant="brand" className="capitalize text-[10px]">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <Textarea
          id="notes"
          placeholder="e.g. We love street food, prefer mornings free, interested in hidden gems rather than tourist traps..."
          value={form.additionalNotes ?? ""}
          onChange={(e) => setField("additionalNotes", e.target.value)}
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          The more context you give, the better your itinerary will be.
        </p>
      </div>
    </div>
  );
}

// ─── Main Planner Form Page ──────────────────────────────────
function PlannerFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formHook = useTripPlannerForm();
  const { form, errors, step, totalSteps, setField, nextStep, prevStep, handleSubmit } = formHook;

  // Pre-fill destination from URL query param
  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) setField("destination", dest);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
    } else {
      const valid = handleSubmit();
      if (valid) {
        // Navigate to itinerary page (no API call yet)
        router.push("/itinerary?status=generating");
      }
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 page-enter">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="brand" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Trip Planner
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Plan your next adventure
          </h1>
          <p className="text-muted-foreground text-base">
            Answer a few questions and we&apos;ll build your perfect itinerary.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator step={step} total={totalSteps} />
          </div>

          {/* Form Steps */}
          <form onSubmit={onSubmit}>
            {step === 1 && <Step1 {...formHook} />}
            {step === 2 && <Step2 {...formHook} />}
            {step === 3 && <Step3 {...formHook} />}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/50">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  onClick={prevStep}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                variant={step === totalSteps ? "gradient" : "default"}
                size="default"
                className="min-w-[140px]"
              >
                {step === totalSteps ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Itinerary
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is never stored or shared. · No account needed.
        </p>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading planner…</div>
      </div>
    }>
      <PlannerFormContent />
    </Suspense>
  );
}
