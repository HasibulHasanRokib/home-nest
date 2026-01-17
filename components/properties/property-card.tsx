import { Property } from "@/lib/generated/prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/lib/get-current-user";

export async function PropertyCard({ property }: { property: Property }) {
  const currentUser = await getCurrentUser();
  return (
    <Card className="group overflow-hidden gap-3 transition-shadow rounded-xl hover:shadow-lg p-0">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute right-3 top-3 bg-background/95 text-foreground backdrop-blur">
          ৳ {property.price.toLocaleString("en-BD")}/mo
        </Badge>
      </div>

      <CardContent className="px-4 py-3">
        <h3 className="font-semibold text-lg leading-tight truncate ">
          {property.title}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground truncate ">
          <MapPin className="h-4 w-4" />
          <span>{property.location}</span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </CardContent>
      <div className="p-2">
        <Link
          href={currentUser ? `/properties/${property.slug}` : "/auth/sign-in"}
        >
          <Button className="w-full text-muted-foreground" variant={"outline"}>
            <Eye className="w-4 h-4" />
            View details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
