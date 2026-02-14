import Link from "next/link";
import { db } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircleUser, Crown, LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signoutAction } from "@/actions/auth.actions";
import { ActionButton } from "@/components/action-button";
import { getRequiredSession } from "@/lib/session";

async function getUserWithPackage(userId: string) {
  "use cache";
  return await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      credits: true,
      packages: {
        where: { active: true },
        take: 1,
      },
    },
  });
}

export async function DashboardUser() {
  const session = await getRequiredSession();
  const user = await getUserWithPackage(session.user.id);
  if (!user) return null;
  const pkg = user.packages?.[0] || null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.image ?? ""}
                    alt={user.name ?? "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.name ?? "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.name ?? "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.credits} credits remaining
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {pkg?.active ? (
                  <DropdownMenuItem className="text-yellow-600 dark:text-yellow-500">
                    <Crown className="mr-2 h-4 w-4 fill-current" />
                    <span className="capitalize">{pkg.packageName} Plan</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/upgrade-plan">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade Plan</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>
                    <CircleUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <LogOut className="mr-1 h-4 w-4 " />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ready to leave?</AlertDialogTitle>
              <AlertDialogDescription>
                You’ll be logged out of your account. You'll need to log back in
                to access your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action={signoutAction}>
                <ActionButton text="Sign out" variant="destructive" />
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
