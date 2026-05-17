"use client";

import { useEffect, useState } from "react";
import { BudgetBreakdownData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Users, CalendarDays, Wallet } from "lucide-react";

// ─── Color map ────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bar: string; bg: string; text: string }> = {
  emerald:  { bar: "bg-emerald-500",  bg: "bg-emerald-500/15",  text: "text-emerald-400" },
  orange:   { bar: "bg-orange-500",   bg: "bg-orange-500/15",   text: "text-orange-400" },
  brand:    { bar: "bg-brand-500",    bg: "bg-brand-500/15",    text: "text-brand-400" },
  purple:   { bar: "bg-purple-500",   bg: "bg-purple-500/15",   text: "text-purple-400" },
  pink:     { bar: "bg-pink-500",     bg: "bg-pink-500/15",     text: "text-pink-400" },
  amber:    { bar: "bg-amber-500",    bg: "bg-amber-500/15",    text: "text-amber-400" },
  teal:     { bar: "bg-teal-500",     bg: "bg-teal-500/15",     text: "text-teal-400" },
};

function getColors(color: string) {
  return COLOR_MAP[color] ?? { bar: "bg-white/40", bg: "bg-white/10", text: "text-white/70" };
}

// ─── BudgetBreakdown Component ────────────────────────────────

interface BudgetBreakdownProps {
  data: BudgetBreakdownData;
  className?: string;
}

export function BudgetBreakdown({ data, className }: BudgetBreakdownProps) {
  const { total, currency, perPerson, perDay, categories, numTravelers, numDays } = data;
  const [animated, setAnimated] = useState(false);

  // Trigger bar animation after mount
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("space-y-5", className)}>
      {/* Top summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Wallet,
            label: "Total Estimated",
            value: formatCurrency(total, currency),
            sub: "for the trip",
            color: "brand",
          },
          {
            icon: Users,
            label: "Per Person",
            value: formatCurrency(perPerson, currency),
            sub: `${numTravelers} traveler${numTravelers > 1 ? "s" : ""}`,
            color: "emerald",
          },
          {
            icon: CalendarDays,
            label: "Per Day",
            value: formatCurrency(perDay, currency),
            sub: `across ${numDays} days`,
            color: "orange",
          },
          {
            icon: TrendingUp,
            label: "Budget Level",
            value: "Moderate",
            sub: "$100–$250/day",
            color: "purple",
          },
        ].map(({ icon: Icon, label, value, sub, color }) => {
          const colors = getColors(color);
          return (
            <Card key={label} className="glass-card border-white/8">
              <CardContent className="p-4">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl mb-3", colors.bg)}>
                  <Icon className={cn("h-4 w-4", colors.text)} />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className={cn("font-display font-bold text-base", colors.text)}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category breakdown */}
      <Card className="glass-card border-white/8">
        <CardContent className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-sm mb-4">Cost Breakdown by Category</h3>

          <div className="space-y-4">
            {categories.map((cat) => {
              const colors = getColors(cat.color);
              return (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-xs font-medium", colors.text)}>
                        {cat.percentage}%
                      </span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(cat.amount, cat.currency)}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.bar)}
                      style={{ width: animated ? `${cat.percentage}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-5" />

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Budget Notes
            </h4>
            <ul className="space-y-1.5">
              {[
                "Estimates are averages based on typical moderate travel spending in Tokyo.",
                "Exchange rate used: 1 USD ≈ 149 JPY. Actual rates may vary.",
                "Accommodation assumes mid-range hotels — adjust for hostels or luxury.",
                "Activity costs exclude optional upgrades or premium experiences.",
              ].map((note) => (
                <li key={note} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Saving tips */}
      <Card className="border border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">💡</span>
            <h4 className="font-display font-semibold text-sm text-emerald-300">Money-Saving Tips</h4>
          </div>
          <ul className="space-y-1.5">
            {[
              "Get a 7-day JR Pass (~$280) if you plan the Mt. Fuji day trip and bullet train travel.",
              "Convenience stores (7-Eleven, FamilyMart) serve excellent, cheap meals under $5.",
              "Museum discounts available with a Tokyo Free Kippu transport day pass.",
              "Book TeamLab Borderless online in advance — saves ~15% on gate price.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-0.5 shrink-0 text-emerald-400">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
