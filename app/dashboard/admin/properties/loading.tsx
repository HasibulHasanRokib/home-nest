import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter + Table Skeleton */}
      <Card className="p-4 space-y-4">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-7 gap-4 p-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-7 gap-4 p-2 border-t border-border"
          >
            {[...Array(7)].map((_, col) => (
              <Skeleton key={col} className="h-4 w-full" />
            ))}
          </div>
        ))}

        {/* Pagination Skeleton */}
        <div className="flex justify-end mt-4 gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-12 rounded-md" />
          ))}
        </div>
      </Card>
    </div>
  );
}
