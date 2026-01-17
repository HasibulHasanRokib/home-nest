import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32 text-center space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto" />

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="rounded-xl border p-4 shadow-lg space-y-3 sm:flex sm:gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto" />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto" />
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {[1, 2].map((side) => (
              <div key={side} className="space-y-6">
                <Skeleton className="h-8 w-48 rounded-full" />

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 p-6 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}

                <Skeleton className="h-10 w-48" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
