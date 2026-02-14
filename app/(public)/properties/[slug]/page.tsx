import { Suspense } from "react";
import { db } from "@/lib/prisma";
import { Spinner } from "@/components/ui/spinner";
import { getRequiredSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getPropertyStats } from "@/lib/data/property-stats";
import { Metadata } from "next";
import { PropertyDetails } from "@/components/properties/property-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyStats(slug);
  return {
    title: property?.title,
  };
}

async function PageComponent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getRequiredSession();
  if (!session) {
    redirect("/auth/sign-in");
  }

  const { slug } = await params;
  const property = await getPropertyStats(slug);

  if (!property) notFound();

  const [propertyReviews, booking] = await Promise.all([
    db.propertyReview.findMany({
      where: { propertyId: property.id },
      include: { reviewer: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.bookingRequest.findFirst({
      where: { propertyId: property.id, tenantId: session.user.id },
    }),
  ]);

  const isUnlocked =
    session.user.role === "ADMIN" ||
    property.ownerId === session.user.id ||
    property.propertyUnlocks.some(
      (unlock) => unlock.userId === session.user.id,
    );
  return (
    <PropertyDetails
      property={property}
      user={session.user}
      isUnlocked={isUnlocked}
      bookingStatus={booking?.status}
      propertyReviews={propertyReviews}
      credits={session.user.credits || 0}
    />
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <PageComponent params={params} />
    </Suspense>
  );
}
