import { Skeleton } from "@/components/ui/skeleton";

export default function ItineraryLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-10" />
          <span className="text-muted-foreground text-sm">/</span>
          <Skeleton className="h-4 w-16" />
          <span className="text-muted-foreground text-sm">/</span>
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[280px,1fr] gap-6">
          {/* Sidebar */}
          <div className="glass-card p-5 space-y-4 h-fit">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
            <Skeleton className="h-px w-full" />
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-8 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Days */}
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <div className="ml-12 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex gap-4 rounded-xl border border-border/50 bg-card/40 p-4">
                      <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
