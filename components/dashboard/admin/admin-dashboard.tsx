import { Card, CardContent } from "@/components/ui/card";
import { getAdminStats, getChangeMeta } from "@/lib/data/admin-stats";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Home,
  Users,
  Minus,
} from "lucide-react";

export type ChangeType = "positive" | "neutral" | "warning";

function ChangeIndicator({
  change,
  type,
}: {
  change: string;
  type: ChangeType;
}) {
  const colorMap = {
    positive: "text-green-600 bg-green-50 dark:bg-green-900/20",
    warning: "text-red-600 bg-red-50 dark:bg-red-900/20",
    neutral: "text-muted-foreground bg-slate-50 dark:bg-slate-900/20",
  };

  return (
    <div
      className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[type]}`}
    >
      {type === "positive" && <ArrowUpRight className="h-3.5 w-3.5" />}
      {type === "warning" && <ArrowDownRight className="h-3.5 w-3.5" />}
      {type === "neutral" && <Minus className="h-3.5 w-3.5" />}
      <span>{change}</span>
    </div>
  );
}

export async function AdminDashboard() {
  const { users, properties, todayRevenue } = await getAdminStats();

  const stats = [
    {
      title: "Total Users",
      value: users.total.toLocaleString(),
      icon: Users,
      ...getChangeMeta(users.change),
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Properties",
      value: properties.total.toLocaleString(),
      icon: Home,
      ...getChangeMeta(properties.change),
      color: "text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-900/30",
    },
    {
      title: "Pending Approvals",
      value: properties.pending,
      icon: AlertTriangle,
      change:
        properties.pending > 0
          ? `${properties.pending} need review`
          : "All clear",
      changeType: properties.pending > 0 ? "warning" : "positive",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Today's Revenue",
      value: `৳${todayRevenue.toLocaleString("en-BD")}`,
      icon: CreditCard,
      change: todayRevenue > 0 ? "Daily goal in progress" : "No revenue today",
      changeType: todayRevenue > 0 ? "positive" : "neutral",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <div className="flex items-center justify-between">
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
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 y" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
