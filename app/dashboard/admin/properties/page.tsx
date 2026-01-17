import { prisma } from "@/lib/prisma";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
} from "@/components/ui/item";
import { PropertyFilter } from "@/components/dashboard/owner/property-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import PaginationControl from "@/components/pagination";
import Link from "next/link";
import { DeleteProperty } from "@/components/dashboard/owner/delete-property";

const getStatusBadge = (status: PropertyStatus) => {
  switch (status) {
    case PropertyStatus.AVAILABLE:
      return (
        <Badge className="bg-green-100 text-green-700 border border-green-200">
          Available
        </Badge>
      );

    case PropertyStatus.PENDING:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
          Pending
        </Badge>
      );

    case PropertyStatus.REJECTED:
      return (
        <Badge className="bg-red-100 text-red-700 border border-red-200">
          Rejected
        </Badge>
      );

    case PropertyStatus.RENTED:
      return (
        <Badge className="bg-green-100 text-green-700 border border-gray-200">
          Rented
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return notFound();
  }

  const propertySearchParams = await searchParams;
  const page = Number(propertySearchParams.page) || 1;
  const limit = Number(propertySearchParams.limit) || 5;
  const search = (propertySearchParams.search as string) || "";
  const propertyStatus = (propertySearchParams.status as string) || undefined;

  const offset = (page - 1) * limit;

  const properties = await prisma.property.findMany({
    where: {
      ...(propertyStatus
        ? { status: propertyStatus.toUpperCase() as PropertyStatus }
        : {}),
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      rental: {
        include: {
          tenant: true,
        },
      },
      owner: true,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  const totalProperties = await prisma.property.count({
    where: {
      ...(propertyStatus
        ? { status: propertyStatus.toUpperCase() as PropertyStatus }
        : {}),
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
  });

  const totalPages = Math.ceil(totalProperties / limit);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Property Approvals
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve property listings
        </p>
      </div>
      <Item variant="outline" className="space-y-5">
        <ItemHeader>
          <PropertyFilter role={currentUser.role} />
        </ItemHeader>
        <ItemContent>
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Tenant</TableHead>
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
                    <TableCell className="font-medium">
                      {property.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {property.location}
                    </TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell className="font-medium">
                      ৳ {property.price.toLocaleString("en-BD")}/mo
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link href={`/profile/${property.ownerId}`}>
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
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {property.rental?.tenant ? (
                        <Link href={`/profile/${property.rental.tenant.id}`}>
                          <div className="flex items-center gap-1">
                            <img
                              src={property.rental.tenant.image || ""}
                              alt="property.rental.tenant.name"
                              className="w-8 h-8 object-cover rounded-full"
                            />
                            <p className="font-medium truncate hover:underline underline-offset-2 hover:text-blue-600">
                              {property.rental.tenant.name}
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No tenant</span>
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
                        {currentUser.role !== "ADMIN" && (
                          <>
                            <Link
                              href={`/dashboard/owner/my-properties/${property.id}/edit`}
                            >
                              <Button variant="ghost" size="icon-sm">
                                <Edit className="h-4 w-4 hover:text-blue-600" />
                                <span className="sr-only">Edit property</span>
                              </Button>
                            </Link>

                            <DeleteProperty propertyId={property.id} />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ItemContent>
        <ItemFooter>
          {totalPages > 0 && (
            <PaginationControl
              page={page}
              limit={limit}
              totalPages={totalPages}
              total={totalProperties}
            />
          )}
        </ItemFooter>
      </Item>
    </div>
  );
}
