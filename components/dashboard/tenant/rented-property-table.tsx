import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/lib/generated/prisma/client";
import { CookingPot, Eye } from "lucide-react";

type RentedPropertyRelation = Prisma.PropertyGetPayload<{
  include: {
    owner: true;
    rental: true;
  };
}>;

interface RentedPropertyProps {
  properties: RentedPropertyRelation[];
}

export function RentedPropertyTable({ properties }: RentedPropertyProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CookingPot />
            </EmptyMedia>
            <EmptyTitle>No Properties Found</EmptyTitle>
            <EmptyDescription>
              You haven't rented any properties yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }
  return (
    <div>
      <Table>
        <TableHeader>
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
                    <Button variant="ghost" size="icon-sm">
                      <Link href={`/properties/${property.slug}`}>
                        <Eye className="h-4 w-4 hover:text-green-600" />
                        <span className="sr-only">View property</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
