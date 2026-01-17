import { getCurrentUser } from "@/lib/get-current-user";
import { PropertyForm } from "@/components/dashboard/owner/property-form";
import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    return notFound();
  }

  const property = await prisma.property.findFirst({
    where: {
      id,
      ownerId: currentUser.id,
    },
  });

  if (!property) return notFound();

  return (
    <PropertyForm
      mode="edit"
      initialData={property}
      propertyId={property.id}
      credits={currentUser.credits}
    />
  );
}
