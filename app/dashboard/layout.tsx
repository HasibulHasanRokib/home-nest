import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/get-current-user";
import { Role, UserStatus } from "@/lib/generated/prisma/enums";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/sign-in");

  if (user.role !== Role.ADMIN && user.status === UserStatus.OPEN) {
    redirect(`/profile/create/${user.currentStep}`);
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader role={user.role} />
        <div className="flex flex-1 flex-col">
          <div className=" flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 lg:p-10 p-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
