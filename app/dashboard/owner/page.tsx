import { getCurrentUser } from "@/lib/get-current-user";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Coins, House, HouseHeart } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function OwnerDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const totalProperties = await prisma.property.count({
    where: { ownerId: currentUser.id },
  });

  const activeRentals = await prisma.property.count({
    where: {
      ownerId: currentUser.id,
      status: "RENTED",
    },
  });

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const monthlyEarnings = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      paid: true,
      rental: {
        property: { ownerId: currentUser.id },
      },
      createdAt: { gte: start, lte: end },
    },
  });

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties,
      change: "Updated in real-time",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
      icon: House,
    },
    {
      title: "Active Rentals",
      value: activeRentals,
      change: `${activeRentals} currently occupied`,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      icon: HouseHeart,
    },
    {
      title: "Monthly Earnings",
      value: monthlyEarnings._sum.amount?.toLocaleString("en-BD") || 0,
      change: "This month",
      color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30",
      icon: Coins,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your properties.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
