import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Role } from "@/lib/generated/prisma/enums";
import { DashboardUser } from "./dashboard-user";

export async function DashboardHeader({ role }: { role: Role }) {
  return (
    <header className="flex sticky top-0 z-50 bg-background h-16 shrink-0 items-center gap-2 border-b  ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {role === Role.OWNER
            ? "Owner Dashboard"
            : role === Role.TENANT
              ? "Tenant Dashboard"
              : "Admin Dashboard"}
        </h1>
        <div className="ml-auto  items-center gap-2 hidden sm:flex">
          <DashboardUser />
        </div>
      </div>
    </header>
  );
}
