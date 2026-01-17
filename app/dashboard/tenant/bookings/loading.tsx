import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-4 w-64" />

      {/* Booking Cards */}
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="space-y-4 col-span-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-2">
              <Card className="p-4 mb-3">
                <Skeleton className="h-3 w-28 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </Card>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
