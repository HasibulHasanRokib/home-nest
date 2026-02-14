import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@/lib/generated/prisma/client";
import { Eye } from "lucide-react";
import Link from "next/link";

type UserWithRelation = Prisma.UserGetPayload<{
  include: {
    properties: true;
    packages: {
      where: { active: true };
    };
  };
}>;
interface UsersTableProps {
  users: UserWithRelation[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="min-h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={user.image || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium capitalize">
                {user.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge className="capitalize">{user.role.toLowerCase()}</Badge>
              </TableCell>
              <TableCell>
                {user.packages.length > 0 ? (
                  <Badge className="capitalize">
                    {user.packages[0].packageName}
                  </Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </TableCell>
              <TableCell>{user.credits} credits</TableCell>
              <TableCell className="text-muted-foreground text-center">
                {user.properties.length ?? 0}
              </TableCell>
              <TableCell>
                <Badge className="capitalize">
                  {user.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant={"outline"} asChild>
                  <Link href={`/profile/${user.id}`}>
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
