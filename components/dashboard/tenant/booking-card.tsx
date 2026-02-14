import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";
import { Calendar, Eye, MapPin, Info } from "lucide-react";
import Link from "next/link";
import { BookingCancel } from "@/components/dashboard/tenant/booking-cancel";
import { ProceedToPayment } from "./proceed-to-payment";

type BookingRequestRelation = Prisma.BookingRequestGetPayload<{
  include: {
    property: true;
    owner: true;
  };
}>;

interface BookingCardProps {
  booking: BookingRequestRelation;
}

export function BookingCard({ booking }: BookingCardProps) {
  const statusColors = {
    APPROVED:
      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200",
    PENDING:
      "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200",
    REJECTED:
      "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200",
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3">
          {/* Main Info Section */}
          <div className="md:col-span-2 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {booking.property.title}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-primary/60" />
                  {booking.property.location}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`w-fit capitalize px-3 py-1 font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}
              >
                {booking.status.toLowerCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/50">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Monthly Rent
                </p>
                <p className="text-xl font-black text-primary">
                  ৳ {booking.property.price.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1 border-l pl-6">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Available From
                </p>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {formatDate(booking.property.availableFrom)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded px-3 w-fit">
              <Info className="w-3.5 h-3.5" />
              <span>Requested on {formatDate(booking.createdAt)}</span>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between gap-6">
            <Link href={`/profile/${booking.ownerId}`} className="group">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Property Owner
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm transition-transform group-hover:scale-105">
                    <AvatarImage
                      src={booking.owner.image || ""}
                      alt={booking.owner.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {booking.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-bold  truncate group-hover:text-primary transition-colors capitalize">
                      {booking.owner.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate ">
                      {booking.owner.email}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-xs font-semibold h-9"
                asChild
              >
                <Link href={`/properties/${booking.property.slug}`}>
                  <Eye className="w-3.5 h-3.5" />
                  View Property
                </Link>
              </Button>

              {booking.status === "APPROVED" ? (
                <ProceedToPayment property={booking.property} />
              ) : booking.status === "PENDING" ? (
                <BookingCancel bookingId={booking.id} />
              ) : (
                <Button disabled className="w-full h-9 opacity-50 grayscale">
                  Rejected
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
