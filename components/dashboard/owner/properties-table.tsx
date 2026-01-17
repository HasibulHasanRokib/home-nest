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

import {
  Property,
  PropertyStatus,
  Rental,
  Role,
  User,
} from "@/lib/generated/prisma/client";
import { DeleteProperty } from "./delete-property";
import Link from "next/link";

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

type PropertyWithTenant = Property & {
  rental:
    | (Rental & {
        tenant: User;
      })
    | null;
};

export function PropertiesTable({
  properties,
  role,
}: {
  properties: PropertyWithTenant[];
  role: Role;
}) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rent</TableHead>
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
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {property.location}
              </TableCell>
              <TableCell>{getStatusBadge(property.status)}</TableCell>
              <TableCell className="font-medium">
                ৳ {property.price.toLocaleString("en-BD")}/mo
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
                  {role !== "ADMIN" && (
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
  );
}
