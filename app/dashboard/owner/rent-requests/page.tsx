import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, CookingPot } from "lucide-react";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBDPhone } from "@/lib/utils";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { RequestStatus } from "@/components/dashboard/owner/request-status";

export default async function RentRequestsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "OWNER") {
    return notFound();
  }

  const bookingRequests = await prisma.bookingRequest.findMany({
    where: {
      ownerId: currentUser.id,
      property: {
        status: "AVAILABLE",
      },
    },
    include: {
      property: true,
      tenant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold  mb-2">Your Rent Requests</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your renting requests
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4">
          {bookingRequests.length === 0 && (
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
          {bookingRequests.map((booking) => (
            <Card key={booking.id} className="p-6 ">
              <div className="grid md:grid-cols-4 gap-6 items-center">
                {/* Property Title and Status */}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Property
                  </p>
                  <h3 className="text-lg font-bold  mb-2">
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

                {/* Tenant Profile Card */}
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-3 uppercase">
                    Tenant Information
                  </p>
                  <Card className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 border-slate-200 dark:border-slate-600">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={booking.tenant.image || "/placeholder.svg"}
                          alt={booking.tenant.name}
                        />
                        <AvatarFallback>
                          {booking.tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {booking.tenant.name}
                        </p>
                        <p className="text-xs text-slate-500 mb-2">
                          Prospective Tenant
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Mail className="w-4 h-4 text-slate-500" />
                        {booking.tenant.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {formatBDPhone(booking.tenant.mobileNumber)}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {booking.status === "PENDING" ? (
                    <RequestStatus bookingId={booking.id} />
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full opacity-60"
                    >
                      {booking.status === "APPROVED"
                        ? "Already Approved"
                        : "Already Rejected"}
                    </Button>
                  )}
                  <Link href={`/profile/${booking.tenantId}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
