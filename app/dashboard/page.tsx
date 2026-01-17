import { redirect } from "next/navigation";
import { Role } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  if (user.role === Role.ADMIN) {
    redirect("/dashboard/admin");
  }

  if (user.role === Role.TENANT) {
    redirect("/dashboard/tenant");
  }

  if (user.role === Role.OWNER) {
    redirect("/dashboard/owner");
  }

  redirect("/unauthorized");
}
