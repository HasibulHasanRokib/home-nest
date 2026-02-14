import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Prisma } from "@/lib/generated/prisma/client";
import { Eye } from "lucide-react";
import Link from "next/link";

type PropertiesWithRelation = Prisma.PropertyGetPayload<{
  include: {
    owner: true;
    rental: {
      include: { tenant: true };
    };
  };
}>;

interface PropertyTableProps {
  properties: PropertiesWithRelation[];
}

export function PropertiesTable({ properties }: PropertyTableProps) {
  return (
    <div className="min-h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
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
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">
                <Avatar>
                  <AvatarImage src={property.images[0]} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {property.location}
              </TableCell>
              <TableCell>
                <Badge>{property.status}</Badge>
              </TableCell>
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
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/properties/${property.slug}`}>
                    <Eye className="h-4 w-4 " />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
