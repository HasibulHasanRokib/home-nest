import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 mb-2" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Properties Table */}
      <Card>
        <div className="space-y-2">
          <Skeleton className="h-6 w-56 mb-2" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-2">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
