import Link from "next/link";
import { Compass, Github, Twitter, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Product: [
    { label: "Plan a Trip", href: "/plan" },
    { label: "My Itineraries", href: "/itinerary" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-20">
      <div className="container max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-brand-500/20">
                <Compass className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Trip<span className="gradient-text">Mind</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered travel itinerary planning. From destination to departure,
              we handle the details so you can focus on the experience.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Github, label: "GitHub", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TripMind. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="text-red-400">♥</span>
            for curious travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
