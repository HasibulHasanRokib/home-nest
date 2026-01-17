import { getCurrentUser } from "@/lib/get-current-user";
import { PropertiesTable } from "@/components/dashboard/owner/properties-table";
import { PropertyStatus, Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
} from "@/components/ui/item";
import { PropertyFilter } from "@/components/dashboard/owner/property-filter";
import PaginationControl from "@/components/pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export const metadata: Metadata = {
  title: "My Properties - Dashboard",
  description: "Manage your rental properties on your dashboard",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MyPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
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
      ownerId: currentUser.id,
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
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  const totalProperties = await prisma.property.count({
    where: {
      ownerId: currentUser.id,
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
        <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your rental properties
        </p>
      </div>
      <Item variant="outline" className="space-y-5">
        <ItemHeader>
          <PropertyFilter role={currentUser.role} />
          <Link href={`/dashboard/owner/my-properties/add`}>
            <Button>
              <CirclePlus className="h-4 w-4" />
              <span>Add property</span>
            </Button>
          </Link>
        </ItemHeader>
        <ItemContent>
          <PropertiesTable properties={properties} role={currentUser.role} />
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
