import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getRequiredSession } from "@/lib/session";
import { Role } from "@/lib/generated/prisma/enums";
import { OwnerDashboard } from "@/components/dashboard/owner/owner-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { TenantDashboard } from "@/components/dashboard/tenant/tenant-dashboard";

async function PageComponent() {
  const session = await getRequiredSession();
  switch (session.user.role) {
    case Role.OWNER:
      return <OwnerDashboard userId={session.user.id} />;
    case Role.TENANT:
      return <TenantDashboard userId={session.user.id} />;
    case Role.ADMIN:
      return <AdminDashboard />;
    default:
      return null;
  }
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <PageComponent />
    </Suspense>
  );
}
