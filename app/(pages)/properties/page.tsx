import { prisma } from "@/lib/prisma";
import PaginationControl from "@/components/pagination";
import { AdvancedFilter } from "@/components/properties/advanced-filter";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyStatus, PropertyType } from "@/lib/generated/prisma/enums";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const propertySearchParams = await searchParams;
  const page = Number(propertySearchParams.page) || 1;
  const limit = Number(propertySearchParams.limit) || 10;
  const search = (propertySearchParams.search as string) || "";
  const propertyType =
    (propertySearchParams.property_type as string) || undefined;
  const bedrooms = (propertySearchParams.bedrooms as string) || undefined;
  const bathrooms = (propertySearchParams.bathrooms as string) || undefined;
  const sortBy = (propertySearchParams.sort_by as string) || undefined;
  const minPrice = Number(propertySearchParams.min_price) || undefined;
  const maxPrice = Number(propertySearchParams.max_price) || undefined;

  const offset = (page - 1) * limit;

  const properties = await prisma.property.findMany({
    where: {
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
    },

    orderBy:
      sortBy === "price-low"
        ? { price: "asc" }
        : sortBy === "price-high"
          ? { price: "desc" }
          : { createdAt: "desc" },

    skip: offset,
    take: limit,
  });

  const totalProperties = await prisma.property.count({
    where: {
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

      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  const totalPages = Math.ceil(totalProperties / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Available Properties
        </h1>
        <p className="mt-2 text-muted-foreground">
          Showing {properties.length} results
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full lg:w-72 shrink-0">
          <AdvancedFilter />
        </aside>

        <div className="flex-1 flex flex-col">
          {properties.length ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-auto pt-6">
                  <PaginationControl
                    page={page}
                    limit={limit}
                    totalPages={totalPages}
                    total={totalProperties}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">No properties found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
