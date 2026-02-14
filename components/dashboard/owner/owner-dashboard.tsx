import { Coins, House, HouseHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOwnerStats } from "@/lib/data/owner-stats";

export async function OwnerDashboard({ userId }: { userId: string }) {
  const statsData = await getOwnerStats(userId);
  const stats = [
    {
      title: "Total Properties",
      value: statsData.totalProperties,
      change: "Updated in real-time",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
      icon: House,
    },
    {
      title: "Active Rentals",
      value: statsData.activeRentals,
      change: `${statsData.activeRentals} currently occupied`,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      icon: HouseHeart,
    },
    {
      title: "Monthly Earnings",
      value: `৳${statsData.earnings.toLocaleString("en-BD")}`,
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
