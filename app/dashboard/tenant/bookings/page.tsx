import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Calendar, MapPin, CookingPot } from "lucide-react";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CancelBookingButton } from "@/components/dashboard/tenant/booking-cancel";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ProceedToPayment } from "@/components/dashboard/tenant/proceed-to-payment";

export default async function BookingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "TENANT") {
    return notFound();
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: {
      tenantId: currentUser.id,
      property: {
        status: "AVAILABLE",
      },
    },
    include: {
      property: true,
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold  mb-2">Your Bookings List</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your bookings and properties
        </p>
      </div>

      <div className="space-y-6 ">
        <div className="grid gap-6 ">
          {bookings.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CookingPot />
                </EmptyMedia>
                <EmptyTitle>No Booking Requests Yet</EmptyTitle>
                <EmptyDescription>
                  You haven’t sent or received any booking requests so far. When
                  you do, they’ll show up right here for easy tracking.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="grid md:grid-cols-3 gap-8 p-6">
                <div className="space-y-4 col-span-2">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold">
                        {booking.property.title}
                      </h3>
                      <Badge
                        variant={
                          booking.status === "APPROVED"
                            ? "default"
                            : booking.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          booking.status === "APPROVED"
                            ? "bg-green-500 hover:bg-green-600"
                            : booking.status === "PENDING"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-red-500 hover:bg-red-600"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.property.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y ">
                    <div>
                      <p className="text-sm  font-medium">Monthly Rent</p>
                      <p className="text-2xl font-bold  flex items-center gap-1">
                        ৳ {booking.property.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm  font-medium">Available from</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Calendar className="w-5 h-5" />
                        {new Date(
                          booking.property.availableFrom,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-1">
                    <p className="text-xs  font-medium">Booking Requested</p>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/profile/${booking.ownerId}`}>
                    <Card className="p-4 mb-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium  uppercase">
                        Property Owner
                      </p>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                          <AvatarImage
                            src={booking.owner.image || "/placeholder.svg"}
                            alt={booking.owner.name}
                          />
                          <AvatarFallback>
                            {booking.owner.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-xl capitalize">
                            {booking.owner.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {booking.owner.email}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  <Link href={`/properties/${booking.property.slug}`}>
                    <Button variant="outline" className="w-full gap-2 mb-2">
                      <Eye className="w-4 h-4" />
                      View Property
                    </Button>
                  </Link>

                  {booking.status === "APPROVED" ? (
                    <ProceedToPayment property={booking.property} />
                  ) : booking.status === "PENDING" ? (
                    <CancelBookingButton bookingId={booking.id} />
                  ) : (
                    <Button disabled className="w-full opacity-60">
                      Request Rejected
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
