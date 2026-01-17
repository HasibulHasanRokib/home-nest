import { getCurrentUser } from "@/lib/get-current-user";
import { PropertyForm } from "@/components/dashboard/owner/property-form";
import { Role } from "@/lib/generated/prisma/enums";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Add Property - Dashboard",
  description: "Add a new property to your dashboard",
};

export default async function AddPropertyPage() {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    (currentUser.role !== Role.OWNER && currentUser.role !== Role.ADMIN)
  ) {
    notFound();
  }
  return <PropertyForm credits={currentUser.credits} />;
}
