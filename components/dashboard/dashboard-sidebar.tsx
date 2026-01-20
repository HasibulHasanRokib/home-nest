import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../logo";

import { getCurrentUser } from "@/lib/get-current-user";
import { DashboardUser } from "./dashboard-user";
import { DashboardLinks } from "./dashboard-links";
import { prisma } from "@/lib/prisma";

export async function DashboardSidebar() {
  const user = await getCurrentUser();

  if (!user) return null;

  const pkg = await prisma.package.findFirst({
    where: { userId: user.id, active: true },
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardLinks role={user.role} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <DashboardUser user={user} pkg={pkg} />
      </SidebarFooter>
    </Sidebar>
  );
}
