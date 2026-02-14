import { db } from "@/lib/prisma";
import { PaginationControl } from "@/components/pagination-control";
import { AdvancedFilter } from "@/components/properties/advanced-filter";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyStatus, PropertyType } from "@/lib/generated/prisma/enums";
import { Suspense } from "react";
import { Prisma } from "@/lib/generated/prisma/client";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Properties",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function PropertyLists({ searchParams }: { searchParams: SearchParams }) {
  const propertySearchParams = await searchParams;
  const page = Number(propertySearchParams.page) || 1;
  const limit = Number(propertySearchParams.limit) || 6;
  const search = (propertySearchParams.search as string) || "";
  const propertyType =
    (propertySearchParams.property_type as string) || undefined;
  const bedrooms = (propertySearchParams.bedrooms as string) || undefined;
  const bathrooms = (propertySearchParams.bathrooms as string) || undefined;
  const sortBy = (propertySearchParams.sort_by as string) || undefined;
  const minPrice = Number(propertySearchParams.min_price) || undefined;
  const maxPrice = Number(propertySearchParams.max_price) || undefined;
  const offset = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = {
    status: PropertyStatus.AVAILABLE,

    ...(propertyType
      ? { propertyType: propertyType.toUpperCase() as PropertyType }
      : {}),

    ...(bedrooms
      ? {
          bedrooms: bedrooms === "4" ? { gte: 4 } : Number(bedrooms),
        }
      : {}),

    ...(bathrooms
      ? {
          bathrooms: bathrooms === "4" ? { gte: 4 } : Number(bathrooms),
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),

    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [properties, totalProperties] = await Promise.all([
    db.property.findMany({
      where,
      orderBy:
        sortBy === "price-low"
          ? { price: "asc" }
          : sortBy === "price-high"
            ? { price: "desc" }
            : { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    db.property.count({
      where,
    }),
  ]);

  if (properties.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-lg font-medium">No properties found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-10 flex justify-end border-t pt-6">
        <PaginationControl
          page={page}
          limit={limit}
          total={totalProperties}
          pathname="/properties"
        />
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Available Properties
        </h1>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full lg:w-72 shrink-0">
          <Suspense fallback={<Spinner />}>
            <AdvancedFilter />
          </Suspense>
        </aside>

        <div className="flex-1 flex flex-col relative">
          <Suspense fallback={<PropertyListSkeleton />}>
            <PropertyLists searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
export function PropertyListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-75 w-full animate-pulse rounded-xl bg-muted"
        />
      ))}
    </div>
  );
}
