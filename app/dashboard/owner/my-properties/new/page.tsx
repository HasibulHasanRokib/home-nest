import { Metadata } from "next";
import { getRequiredSession } from "@/lib/session";
import { PropertyForm } from "@/components/dashboard/owner/property-form";

export const metadata: Metadata = {
  title: "Add Property - Dashboard",
  description: "Add a new property to your dashboard",
};

export default async function Page() {
  const session = await getRequiredSession();
  return <PropertyForm credits={session.user.credits || 0} />;
}
