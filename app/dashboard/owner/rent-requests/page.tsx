import { db } from "@/lib/prisma";
import { formatBDPhone } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRequiredSession } from "@/lib/session";
import {
  User,
  Mail,
  Phone,
  CookingPot,
  ExternalLink,
  CalendarDays,
  MapPin,
} from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { UpdateBookingRequest } from "./update-booking-request";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

async function getBookingRequest(userId: string) {
  "use cache";
  return await db.bookingRequest.findMany({
    where: { ownerId: userId, property: { status: "AVAILABLE" } },
    include: {
      property: true,
      tenant: { include: { profile: { select: { mobileNumber: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function Page() {
  const session = await getRequiredSession();
  if (!session || session.user.role !== "OWNER") notFound();

  const requests = await getBookingRequest(session.user.id);

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Rent Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming booking requests for your properties.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit py-1 px-3 text-sm font-medium"
        >
          Total: {requests.length}
        </Badge>
      </header>

      {requests.length === 0 ? (
        <Empty className="border-2 border-dashed rounded-xl py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted">
              <CookingPot className="h-10 w-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No pending requests</EmptyTitle>
            <EmptyDescription>
              When tenants express interest in your properties, they will appear
              here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <Card
              key={req.id}
              className="overflow-hidden border-none shadow-sm ring-1 ring-border transition-all hover:shadow-md"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="bg-muted/30 p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" /> Property Details
                    </div>
                    <Link
                      href={`/properties/${req.property.slug}`}
                      className="group flex items-start justify-between gap-2"
                    >
                      <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                        {req.property.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge
                        className={`${
                          req.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : req.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                        } border-none shadow-none`}
                      >
                        {req.status}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground ml-auto">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-16 w-16 ring-4 ring-background shadow-sm">
                      <AvatarImage src={req.tenant.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {req.tenant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-xl">{req.tenant.name}</h4>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Mail className="h-3.5 w-3.5" /> {req.tenant.email}
                        </span>
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {formatBDPhone(
                            req.tenant.profile?.mobileNumber || "N/A",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-2 min-w-50">
                      {req.status === "PENDING" ? (
                        <UpdateBookingRequest reqId={req.id} />
                      ) : (
                        <Button variant="secondary" disabled className="w-full">
                          Request Resolved
                        </Button>
                      )}
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full font-medium"
                      >
                        <Link href={`/profile/${req.tenantId}`}>
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
