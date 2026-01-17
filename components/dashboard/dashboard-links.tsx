"use client";

import { Role } from "@/lib/generated/prisma/enums";
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  BookMarked,
  MessageSquare,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Properties", href: "/dashboard/admin/properties", icon: Home },
  { name: "Payments", href: "/dashboard/payments-history", icon: CreditCard },
];

const ownerNavigation = [
  { name: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard },
  { name: "My Properties", href: "/dashboard/owner/my-properties", icon: Home },
  {
    name: "Rent Requests",
    href: "/dashboard/owner/rent-requests",
    icon: MessageSquare,
  },
  { name: "Payments", href: "/dashboard/payments-history", icon: CreditCard },
];

const tenantNavigation = [
  { name: "Dashboard", href: "/dashboard/tenant", icon: LayoutDashboard },
  { name: "Bookings", href: "/dashboard/tenant/bookings", icon: BookMarked },
  { name: "Payments", href: "/dashboard/payments-history", icon: CreditCard },
];

export function DashboardLinks({ role }: { role: Role }) {
  const pathname = usePathname();

  const navigation = () => {
    switch (role) {
      case Role.ADMIN:
        return adminNavigation;
      case Role.TENANT:
        return tenantNavigation;
      case Role.OWNER:
        return ownerNavigation;
      default:
        return [];
    }
  };
  return (
    <SidebarMenu className="flex flex-col gap-2 mt-6 px-2">
      {navigation().map((item) => {
        const isActive = pathname === item.href;
        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton isActive={isActive} tooltip={item.name} asChild>
              <Link href={item.href} className="flex items-center gap-2 ">
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
