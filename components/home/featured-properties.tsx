import { PropertyCard } from "@/components/properties/property-card";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function FeaturedProperties() {
  const featuredProperties = await prisma.property.findMany({
    where: {
      status: PropertyStatus.AVAILABLE,
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <section
      id="properties"
      className="border-b bg-background border-border py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Handpicked homes available for rent right now
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
