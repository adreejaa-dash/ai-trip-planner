import { Skeleton } from "@/components/ui/skeleton";

export default function PlanLoading() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container max-w-2xl">
        {/* Header skeleton */}
        <div className="text-center mb-10 space-y-4">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-10 w-80 mx-auto" />
          <Skeleton className="h-5 w-60 mx-auto" />
        </div>

        {/* Form card skeleton */}
        <div className="glass-card p-6 sm:p-8 space-y-8">
          {/* Progress bar */}
          <Skeleton className="h-1.5 w-full" />
          
          {/* Form fields */}
          <div className="space-y-6">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((i) => (
                <Skeleton key={i} className="h-16 flex-1" />
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end pt-4 border-t border-border/50">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
