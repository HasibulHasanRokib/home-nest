import { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowDownRightIcon, CookingPot, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getRequiredSession } from "@/lib/session";
import { Prisma } from "@/lib/generated/prisma/client";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { PaginationControl } from "@/components/pagination-control";
import { PropertiesTable } from "@/components/dashboard/owner/properties-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "My Properties - Dashboard",
  description: "Manage your rental properties on your dashboard",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function MyProperties({ searchParams }: { searchParams: SearchParams }) {
  const session = await getRequiredSession();

  if (session.user.role !== "OWNER") {
    redirect("/dashboard");
  }

  const propertySearchParams = await searchParams;
  const page = Number(propertySearchParams.page) || 1;
  const limit = Number(propertySearchParams.limit) || 10;
  const search = (propertySearchParams.search as string) || "";
  const propertyStatus = Object.values(PropertyStatus).includes(
    propertySearchParams.status as PropertyStatus,
  )
    ? (propertySearchParams.status as PropertyStatus)
    : undefined;

  const offset = (page - 1) * limit;

  const where: Prisma.PropertyWhereInput = {
    ownerId: session.user.id,
    ...(propertyStatus ? { status: propertyStatus as PropertyStatus } : {}),
    OR: search
      ? [
          { title: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };

  const [properties, totalProperties] = await Promise.all([
    db.property.findMany({
      where,
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
    }),
    db.property.count({
      where,
    }),
  ]);

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
              You haven't added any properties yet.
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
        pathname="/dashboard/owner/my-properties"
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
      <div className="flex justify-between items-center mb-10 ">
        <h1 className="md:text-4xl text-xl font-bold ">
          My Properties Section <ArrowDownRightIcon className="inline-block" />
        </h1>
        <Button asChild>
          <Link href="/dashboard/owner/my-properties/new">
            <Plus />
            <span className="hidden md:inline-block"> Add property</span>
          </Link>
        </Button>
      </div>

      <Suspense key={key} fallback={<Spinner />}>
        <MyProperties searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
