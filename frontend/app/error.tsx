"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center page-enter">
      <div className="container max-w-lg text-center px-4">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="font-display text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground text-base mb-2">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="gradient" onClick={reset}>
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
