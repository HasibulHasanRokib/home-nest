import { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/prisma";
import { ArrowDownRightIcon, CookingPot } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PaginationControl } from "@/components/pagination-control";
import { PropertiesTable } from "@/components/dashboard/admin/properties-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "All Properties - Admin Dashboard",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function AllProperties({ searchParams }: { searchParams: SearchParams }) {
  const propertySearchParams = await searchParams;
  const page = Number(propertySearchParams.page) || 1;
  const limit = Number(propertySearchParams.limit) || 10;

  const offset = (page - 1) * limit;

  const [properties, totalProperties] = await Promise.all([
    db.property.findMany({
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
    }),
    db.property.count(),
  ]);

  if (properties.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CookingPot />
            </EmptyMedia>
            <EmptyTitle>No property add yet</EmptyTitle>
            <EmptyDescription>
              You haven’t any property so far. When owner add property, you will
              show up right here for easy tracking.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PropertiesTable properties={properties} />
      <PaginationControl
        page={page}
        limit={limit}
        total={totalProperties}
        pathname="/dashboard/admin/properties"
      />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, page, status } = await searchParams;
  const key = `${search}-${page}-${status}`;
  return (
    <div>
      <h1 className="md:text-4xl text-xl font-bold mb-10">
        Properties Section <ArrowDownRightIcon className="inline-block" />
      </h1>

      <Suspense key={key} fallback={<Spinner />}>
        <AllProperties searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
