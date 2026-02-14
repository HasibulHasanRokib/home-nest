import { PropertyForm } from "@/components/dashboard/owner/property-form";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Params = Promise<{ id: string }>;

async function PageComponent({ params }: { params: Params }) {
  const { id } = await params;
  const session = await getRequiredSession();
  const property = await db.property.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });
  if (!property) return notFound();

  return (
    <PropertyForm
      credits={session.user.credits || 0}
      mode="edit"
      propertyId={id}
      initialData={property}
    />
  );
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Spinner />}>
      <PageComponent params={params} />
    </Suspense>
  );
}
