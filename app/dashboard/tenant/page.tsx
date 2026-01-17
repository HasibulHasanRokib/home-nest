import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function TenantDashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "TENANT") {
    return notFound();
  }

  const rejected = await prisma.bookingRequest.count({
    where: {
      tenantId: currentUser.id,
      status: "REJECTED",
    },
  });

  const pending = await prisma.bookingRequest.count({
    where: {
      tenantId: currentUser.id,
      status: "PENDING",
    },
  });

  const approved = await prisma.bookingRequest.count({
    where: {
      tenantId: currentUser.id,
      status: "APPROVED",
      property: {
        status: "AVAILABLE",
      },
    },
  });

  const bookingStats = [
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle,
      description: "Ready to move in",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    },

    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      description: "Not approved",
      color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    },
  ];

  const properties = await prisma.property.findMany({
    where: {
      status: "RENTED",
      rental: {
        tenantId: currentUser.id,
      },
    },
    include: {
      owner: true,
      rental: true,
    },
  });

  return (
    <div className=" space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your rental applications and bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {bookingStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle> My Rented Properties</CardTitle>
          <CardDescription>
            Manage your current and past rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow className="hover:bg-background">
                  <TableCell colSpan={6}>
                    <p className="text-center font-semibold mt-8">
                      No property found!
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium truncate">
                      {property.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate">
                      {property.location}
                    </TableCell>
                    <TableCell>
                      <Badge>{property.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {property.rental?.startDate
                        ? formatDate(property.rental.startDate)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {property.rental?.endDate
                        ? formatDate(property.rental.endDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳ {property.price.toLocaleString("en-BD")}/mo
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {property.owner && (
                        <Link href={`/profile/${property.owner.id}`}>
                          <div className="flex items-center gap-1">
                            <img
                              src={property.owner.image || ""}
                              alt="property.rental.tenant.name"
                              className="w-8 h-8 object-cover rounded-full"
                            />
                            <p className="font-medium truncate hover:underline underline-offset-2 hover:text-blue-600">
                              {property.owner.name}
                            </p>
                          </div>
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/properties/${property.slug}`}>
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="h-4 w-4 hover:text-green-600" />
                            <span className="sr-only">View property</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
