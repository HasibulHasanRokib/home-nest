import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div>
      <Card className="p-4 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-2 mt-4">
          {/* Table header */}
          <div className="grid grid-cols-7 gap-4 p-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Table rows */}
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
        </div>
      </Card>
    </div>
  );
}
