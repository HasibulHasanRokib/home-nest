import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Role, UserStatus } from "@/lib/generated/prisma/enums";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getRequiredSession } from "@/lib/session";

async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getRequiredSession();

  if (
    session.user.role !== Role.ADMIN &&
    session.user.status === UserStatus.OPEN
  ) {
    redirect("/profile/create");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar role={session.user.role as Role} />
      <SidebarInset>
        <DashboardHeader role={session.user.role as Role} />
        <div className="flex flex-1 flex-col">
          <div className=" flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 lg:p-10 p-4 animate-in fade-in zoom-in-95 ">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default async function Layout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}
