import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-64" />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Properties Table */}
      <div className="bg-card rounded-lg overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-8 gap-4 bg-muted p-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-8 gap-4 p-3 hover:bg-background"
          >
            {[...Array(8)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
