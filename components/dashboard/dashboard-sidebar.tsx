import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Role } from "@/lib/generated/prisma/enums";
import { DashboardLinks } from "@/components/dashboard/dashboard-links";

export async function DashboardSidebar({ role }: { role: Role }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem className="px-4">
            <Logo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardLinks role={role} />
      </SidebarContent>
      <SidebarFooter className="border-t h-12 flex justify-center items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} - All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
