import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { prisma } from "@/lib/prisma";
import { UserStatus } from "@/lib/generated/prisma/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CookingPot, Eye } from "lucide-react";

const getUserStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatus.OPEN:
      return (
        <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
          Open
        </Badge>
      );

    case UserStatus.NOT_VERIFIED:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
          Not Verified
        </Badge>
      );

    case UserStatus.VERIFIED:
      return (
        <Badge className="bg-green-100 text-green-700 border border-green-200">
          Verified
        </Badge>
      );

    case UserStatus.SUSPENDED:
      return (
        <Badge className="bg-red-100 text-red-700 border border-red-200">
          Suspended
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
    include: {
      properties: true,
    },
  });
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Management & Approvals
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage platform users
        </p>
      </div>
      <Card>
        <CardContent>
          {users.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CookingPot />
                </EmptyMedia>
                <EmptyTitle>No User create Yet</EmptyTitle>
                <EmptyDescription>
                  You haven’t any user so far. When user create account, you
                  will show up right here for easy tracking.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium capitalize">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.credits} credits</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.properties.length ?? 0}
                    </TableCell>
                    <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/profile/${user.id}`}>
                        <Button variant={"ghost"}>
                          <Eye />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
