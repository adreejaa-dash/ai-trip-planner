"use client";

import { Itinerary } from "@/types";
import { cn } from "@/lib/utils";
import { MapPin, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapMarker {
  id: string;
  label: string;
  dayNumber: number;
  activityIndex: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

// Static pin positions for the Tokyo demo
const TOKYO_PINS: MapMarker[] = [
  { id: "shinjuku",   label: "Shinjuku",      dayNumber: 1, activityIndex: 0, x: 32, y: 38 },
  { id: "asakusa",    label: "Asakusa",        dayNumber: 2, activityIndex: 0, x: 58, y: 22 },
  { id: "shibuya",    label: "Shibuya",        dayNumber: 3, activityIndex: 0, x: 28, y: 52 },
  { id: "harajuku",   label: "Harajuku",       dayNumber: 3, activityIndex: 1, x: 26, y: 46 },
  { id: "akihabara",  label: "Akihabara",      dayNumber: 5, activityIndex: 0, x: 52, y: 32 },
  { id: "roppongi",   label: "Roppongi",       dayNumber: 7, activityIndex: 0, x: 34, y: 56 },
  { id: "ginza",      label: "Ginza",          dayNumber: 6, activityIndex: 0, x: 46, y: 50 },
  { id: "odaiba",     label: "Odaiba",         dayNumber: 6, activityIndex: 1, x: 54, y: 70 },
];

const DAY_COLORS = [
  "bg-brand-500 border-brand-400",
  "bg-emerald-500 border-emerald-400",
  "bg-purple-500 border-purple-400",
  "bg-orange-500 border-orange-400",
  "bg-pink-500 border-pink-400",
  "bg-teal-500 border-teal-400",
  "bg-amber-500 border-amber-400",
];

interface MapViewProps {
  itinerary?: Itinerary;
  activeDayIndex?: number;
  className?: string;
}

export function MapView({ itinerary, activeDayIndex, className }: MapViewProps) {
  const destination = itinerary?.destination.city ?? "Tokyo";
  const country = itinerary?.destination.country ?? "Japan";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Map container */}
      <div className="relative rounded-2xl border border-border/60 bg-card/40 overflow-hidden" style={{ height: "420px" }}>
        {/* Simulated map background */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 40% 40%, rgba(51,168,252,0.04) 0%, transparent 70%), linear-gradient(145deg, hsl(222,47%,7%) 0%, hsl(222,47%,10%) 100%)",
          }}
        >
          {/* Grid lines simulating streets */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-major" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-minor)" />
            <rect width="100%" height="100%" fill="url(#grid-major)" />
            {/* Simulated diagonal avenue */}
            <line x1="0" y1="100%" x2="60%" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            <line x1="20%" y1="100%" x2="90%" y2="10%" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            {/* Simulated river/bay */}
            <path d="M 50% 80% Q 60% 75% 70% 85% Q 80% 90% 90% 82%" fill="none" stroke="rgba(51,168,252,0.25)" strokeWidth="8" strokeLinecap="round"/>
          </svg>

          {/* Destination label watermark */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-secondary/80 backdrop-blur-sm border border-border/60 rounded-xl px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-xs font-medium">{destination}, {country}</span>
          </div>

          {/* Map pins */}
          {TOKYO_PINS.map((pin) => {
            const colorClass = DAY_COLORS[(pin.dayNumber - 1) % DAY_COLORS.length];
            const isActive = activeDayIndex !== undefined && pin.dayNumber === activeDayIndex + 1;
            return (
              <div
                key={pin.id}
                className="absolute group cursor-pointer"
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {/* Pulse ring for active day */}
                {isActive && (
                  <div className={cn("absolute inset-0 rounded-full animate-ping opacity-40", colorClass.split(" ")[0])} style={{ transform: "scale(1.8)" }} />
                )}
                {/* Pin dot */}
                <div className={cn("relative flex h-6 w-6 items-center justify-center rounded-full border-2 text-white text-[9px] font-bold shadow-lg transition-transform duration-200 group-hover:scale-125 z-10", colorClass, isActive && "scale-125")}>
                  {pin.dayNumber}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                  <div className="bg-background/95 border border-border/80 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl">
                    <span className="text-muted-foreground">Day {pin.dayNumber} · </span>
                    {pin.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Zoom controls placeholder */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-secondary/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">+</button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-secondary/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">−</button>
          </div>
        </div>
      </div>

      {/* Map legend */}
      <div className="flex flex-wrap gap-2">
        {TOKYO_PINS.map((pin) => {
          const colorClass = DAY_COLORS[(pin.dayNumber - 1) % DAY_COLORS.length];
          const isActive = activeDayIndex !== undefined && pin.dayNumber === activeDayIndex + 1;
          return (
            <div key={pin.id} className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all duration-200", isActive ? "border-white/20 bg-white/10 text-foreground" : "border-border/50 text-muted-foreground")}>
              <span className={cn("h-2 w-2 rounded-full shrink-0", colorClass.split(" ")[0])} />
              <span>Day {pin.dayNumber}</span>
              <span className="opacity-60">·</span>
              <span>{pin.label}</span>
            </div>
          );
        })}
      </div>

      {/* Open in maps CTA */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/40">
        <div>
          <p className="text-sm font-medium">Full interactive map</p>
          <p className="text-xs text-muted-foreground">Powered by Google Maps · Available after connecting your API key</p>
        </div>
        <Button variant="outline-brand" size="sm" className="gap-1.5 shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Maps
        </Button>
      </div>
    </div>
  );
}
