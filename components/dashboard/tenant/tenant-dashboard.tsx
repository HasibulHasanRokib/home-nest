import { getTenantStats } from "@/lib/data/tenant-stats";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentedPropertyTable } from "./rented-property-table";

export async function TenantDashboard({ userId }: { userId: string }) {
  const statsData = await getTenantStats(userId);

  const bookingStats = [
    {
      title: "Approved",
      value: statsData.approved,
      icon: CheckCircle,
      description: "Ready to move in",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending",
      value: statsData.pending,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    },

    {
      title: "Rejected",
      value: statsData.rejected,
      icon: XCircle,
      description: "Not approved",
      color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    },
  ];
  return (
    <div>
      <div className=" space-y-6 ">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your rental applications and
            bookings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {bookingStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl"> My Rented Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <RentedPropertyTable properties={statsData.properties} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
