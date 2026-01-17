import { getCurrentUser } from "@/lib/get-current-user";
import { PropertyDetails } from "@/components/properties/property-details";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/auth/sign-in");

  const { slug } = await params;
  const property = await prisma.property.findFirst({
    where: {
      slug,
    },
    include: {
      propertyUnlocks: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
          image: true,
        },
      },
    },
  });

  if (!property) return notFound();

  const ownerRating = await prisma.profileReview.findFirst({
    where: { userId: property?.ownerId },
  });

  const propertyReviews = await prisma.propertyReview.findMany({
    where: { propertyId: property?.id },
    include: {
      reviewer: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  const booking = await prisma.bookingRequest.findFirst({
    where: {
      propertyId: property.id,
      tenantId: currentUser.id,
    },
  });

  const isUnlocked =
    currentUser.role === "ADMIN" ||
    property.ownerId === currentUser?.id ||
    property.propertyUnlocks.some((unlock) => unlock.userId === currentUser.id);

  return (
    <main className="bg-muted/30 min-h-screen">
      <PropertyDetails
        property={property}
        credits={currentUser?.credits ?? 0}
        isUnlocked={isUnlocked}
        role={currentUser?.role}
        ownerRating={ownerRating?.rating || 0}
        propertyReviews={propertyReviews}
        currentUser={currentUser}
        bookingStatus={booking?.status}
      />
    </main>
  );
}
