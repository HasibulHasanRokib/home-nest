import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Skeleton className="w-full aspect-video rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-lg" />
            ))}
          </div>

          {/* Property Info */}
          <Card>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-1/2" /> {/* Title */}
              <Skeleton className="h-4 w-1/3" /> {/* Location */}
              <Skeleton className="h-6 w-32" /> {/* Price */}
              <Skeleton className="h-4 w-full" /> {/* Description */}
              <Skeleton className="h-4 w-2/3" /> {/* Amenities heading */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" /> {/* Reviewer name */}
                  <Skeleton className="h-3 w-full" /> {/* Review text */}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Owner Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-full mt-2" />
            </CardContent>
          </Card>

          {/* Booking / Request Card */}
          <Card>
            <CardContent className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full mt-2" />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
