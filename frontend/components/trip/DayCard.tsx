"use client";

import { useState } from "react";
import { DayPlan, Activity, ActivityCategory } from "@/types";
import { cn, formatCurrency, formatDuration, getCategoryColor, slugToLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock, MapPin, DollarSign, Star, ChevronDown, ChevronUp,
  Lightbulb, ExternalLink, CloudSun,
} from "lucide-react";

// ─── Activity Category Icons ──────────────────────────────────

const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  sightseeing: "🏛️",
  food: "🍜",
  transport: "🚄",
  accommodation: "🏨",
  entertainment: "🎭",
  shopping: "🛍️",
  nature: "🌿",
  culture: "🎨",
  wellness: "🧘",
  adventure: "⛺",
};

// ─── Single Activity Item ─────────────────────────────────────

function ActivityItem({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  const [tipsOpen, setTipsOpen] = useState(false);
  const categoryColor = getCategoryColor(activity.category);
  const icon = CATEGORY_ICONS[activity.category] ?? "📍";

  return (
    <div className="group relative">
      <div className="flex gap-3 sm:gap-4">
        {/* Timeline dot + connector */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border text-base group-hover:border-white/20 transition-colors">
            {icon}
          </div>
          {!isLast && <div className="mt-2 w-px flex-1 bg-border/60 min-h-[24px]" />}
        </div>

        {/* Content */}
        <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
          {/* Header row */}
          <div className="flex flex-wrap items-start gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-snug">{activity.title}</h4>
              {activity.startTime && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {activity.startTime}
                  {activity.endTime && ` – ${activity.endTime}`}
                  {activity.duration && (
                    <span className="ml-1 opacity-60">({formatDuration(activity.duration)})</span>
                  )}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", categoryColor)}>
                {slugToLabel(activity.category)}
              </span>
              {activity.rating && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 font-medium">
                  <Star className="h-2.5 w-2.5 fill-amber-400" />
                  {activity.rating}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{activity.description}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {activity.location.city && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {activity.location.city}
              </span>
            )}
            {activity.cost && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {activity.cost.amount === 0
                  ? "Free"
                  : `${formatCurrency(activity.cost.amount, activity.cost.currency)}${activity.cost.perPerson ? "/person" : " total"}`}
              </span>
            )}
            {activity.bookingUrl && (
              <a
                href={activity.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Book now <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setTipsOpen((v) => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Lightbulb className="h-3 w-3 text-amber-400" />
                {tipsOpen ? "Hide tips" : `${activity.tips.length} insider tip${activity.tips.length > 1 ? "s" : ""}`}
                {tipsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              {tipsOpen && (
                <ul className="mt-1.5 space-y-1">
                  {activity.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-0.5 shrink-0 text-amber-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DayCard Component ────────────────────────────────────────

interface DayCardProps {
  day: DayPlan;
  isActive?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function DayCard({ day, isActive = false, defaultOpen = false, className }: DayCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      id={`day-${day.dayNumber}`}
      className={cn(
        "rounded-2xl border transition-all duration-300",
        isActive
          ? "border-brand-500/40 bg-brand-500/5"
          : "border-border/60 bg-card/40 hover:border-white/15",
        className
      )}
    >
      {/* Day Header — always visible */}
      <button
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        {/* Day number badge */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
            isActive
              ? "border-brand-500/60 bg-brand-500/20 text-brand-300"
              : "border-border bg-secondary text-muted-foreground"
          )}
        >
          {day.dayNumber}
        </div>

        {/* Title & meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-base">{day.title}</h3>
            {day.theme && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 hidden sm:inline-flex">
                {day.theme}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{day.summary}</p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {day.estimatedCost && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              ~{formatCurrency(day.estimatedCost.amount, day.estimatedCost.currency)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{day.activities.length} activities</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 sm:px-5 pb-5">
          <Separator className="mb-4" />

          {/* Weather note */}
          {day.weatherNote && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <CloudSun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              {day.weatherNote}
            </div>
          )}

          {/* Summary */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{day.summary}</p>

          {/* Activities */}
          <div>
            {day.activities.map((activity, i) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={i === day.activities.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
