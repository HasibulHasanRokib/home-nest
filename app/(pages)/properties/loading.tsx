import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* FILTER SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-20 border rounded-xl p-4 space-y-5">
            <Skeleton className="h-6 w-32" />

            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <Skeleton className="h-10 w-full" />
          </div>
        </aside>

        {/* PROPERTY GRID */}
        <div className="flex-1">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden space-y-3"
              >
                <Skeleton className="h-48 w-full" />

                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />

                  <div className="flex gap-3 mt-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                <div className="p-2">
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
