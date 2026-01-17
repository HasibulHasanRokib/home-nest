import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              {/* Property */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Tenant */}
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-4 w-32" />

                <Card className="p-4 space-y-3">
                  <div className="flex gap-3 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>

                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </Card>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
