"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MapPin, Compass, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "Plan a Trip" },
  { href: "/itinerary", label: "My Trips" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <Compass className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Trip<span className="gradient-text">Mind</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/plan">
              <MapPin className="h-3.5 w-3.5" />
              Plan Trip
            </Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="ghost" size="sm" className="w-full justify-center">
              Sign In
            </Button>
            <Button variant="gradient" size="sm" className="w-full justify-center" asChild>
              <Link href="/plan" onClick={() => setMobileOpen(false)}>
                <MapPin className="h-3.5 w-3.5" />
                Plan a Trip
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
