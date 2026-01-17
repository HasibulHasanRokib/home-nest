import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropertyStatus, Role, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

import {
  Users,
  Home,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from "lucide-react";

function getWeekRange(offset = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() - offset * 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

function getChangeMeta(diff: number): {
  change: string;
  changeType: ChangeType;
} {
  if (diff > 0) {
    return {
      change: `+${diff} this week`,
      changeType: "positive",
    };
  }

  if (diff === 0) {
    return {
      change: "No change",
      changeType: "neutral",
    };
  }

  return {
    change: "Slower than last week",
    changeType: "warning",
  };
}

type ChangeType = "positive" | "neutral" | "warning";

function ChangeIndicator({
  change,
  type,
}: {
  change: string;
  type: ChangeType;
}) {
  return (
    <div
      className={`flex items-center gap-1 text-xs font-medium ${
        type === "positive"
          ? "text-green-600"
          : type === "warning"
            ? "text-red-600"
            : "text-muted-foreground"
      }`}
    >
      {type === "positive" && <ArrowUpRight className="h-4 w-4" />}
      {type === "warning" && <ArrowDownRight className="h-4 w-4" />}
      {type === "neutral" && <span>→</span>}

      <span>{change}</span>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const thisWeek = getWeekRange(0);
  const lastWeek = getWeekRange(1);

  // USERS
  const usersThisWeek = await prisma.user.count({
    where: {
      role: { not: Role.ADMIN },
      createdAt: { gte: thisWeek.start, lt: thisWeek.end },
    },
  });

  const usersLastWeek = await prisma.user.count({
    where: {
      role: { not: Role.ADMIN },
      createdAt: { gte: lastWeek.start, lt: lastWeek.end },
    },
  });

  const usersDiff = usersThisWeek - usersLastWeek;

  // PROPERTIES
  const propsThisWeek = await prisma.property.count({
    where: {
      status: "AVAILABLE",
      createdAt: { gte: thisWeek.start, lt: thisWeek.end },
    },
  });

  const propsLastWeek = await prisma.property.count({
    where: {
      status: "AVAILABLE",
      createdAt: { gte: lastWeek.start, lt: lastWeek.end },
    },
  });

  const propsDiff = propsThisWeek - propsLastWeek;

  const totalUsers = await prisma.user.count({
    where: {
      role: {
        not: Role.ADMIN,
      },
    },
  });

  const totalProperties = await prisma.property.count({
    where: {
      status: "AVAILABLE",
    },
  });

  const totalPendingProperties = await prisma.property.count({
    where: {
      status: "PENDING",
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayPaymentHistory = await prisma.payment.findMany({
    where: {
      paid: true,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const totalAmount = todayPaymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      ...getChangeMeta(usersDiff),
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Properties",
      value: totalProperties,
      icon: Home,
      ...getChangeMeta(propsDiff),
      color: "text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-900/30",
    },
    {
      title: "Pending Approvals",
      value: totalPendingProperties,
      icon: AlertTriangle,
      change:
        totalPendingProperties > 0
          ? `${totalPendingProperties} need review`
          : "All clear",
      changeType: totalPendingProperties > 0 ? "warning" : "positive",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Payment History",
      value: ` ৳ ${totalAmount.toLocaleString("en-BD")}`,
      icon: CreditCard,
      change:
        todayPaymentHistory.length > 0
          ? `${todayPaymentHistory.length} payments transition`
          : "No payments today",
      changeType: todayPaymentHistory.length > 0 ? "positive" : "neutral",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
  ];

  const users = await prisma.user.findMany({
    where: {
      role: {
        not: Role.ADMIN,
      },
    },
    include: {
      properties: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  const getPropertyStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return (
          <Badge className="bg-green-100 text-green-700 border border-green-200">
            Available
          </Badge>
        );

      case PropertyStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
            Pending
          </Badge>
        );

      case PropertyStatus.REJECTED:
        return (
          <Badge className="bg-red-100 text-red-700 border border-red-200">
            Rejected
          </Badge>
        );

      case PropertyStatus.RENTED:
        return (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
            Rented
          </Badge>
        );

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const properties = await prisma.property.findMany({
    include: {
      owner: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, properties, and platform operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <ChangeIndicator
                    change={stat.change}
                    type={stat.changeType as ChangeType}
                  />
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 y" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Users table  */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor and manage platform users
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell className="text-muted-foreground">
                    {user.properties.length ?? 0}
                  </TableCell>
                  <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Properties table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Property Approvals</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review and approve property listings
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    {property.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {property.owner.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.location}
                  </TableCell>
                  <TableCell className="font-medium">
                    ৳ {property.price.toLocaleString("en-BD")}/mo
                  </TableCell>
                  <TableCell>
                    {getPropertyStatusBadge(property.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
