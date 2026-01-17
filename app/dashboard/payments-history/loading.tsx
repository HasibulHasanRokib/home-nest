import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <Skeleton className="h-8 w-64" />

      {/* Payment Cards */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-card border-border overflow-hidden rounded-lg border p-6 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left info */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Amount & Badge */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
