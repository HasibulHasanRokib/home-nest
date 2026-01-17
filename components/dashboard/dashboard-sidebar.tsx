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

export async function DashboardSidebar() {
  const user = await getCurrentUser();
  if (!user) return null;

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
        <DashboardUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
