import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center page-enter">
      <div className="container max-w-lg text-center px-4">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary border border-border">
          <Compass className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold mb-3">Page not found</h2>
        <p className="text-muted-foreground text-base mb-8">
          Looks like you took a wrong turn. This destination doesn&apos;t exist — but we can help you find where you&apos;re going.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="gradient" asChild>
            <Link href="/plan">
              Plan a Trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
