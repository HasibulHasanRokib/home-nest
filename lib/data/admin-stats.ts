import { Role } from "@/lib/generated/prisma/enums";
import { db } from "@/lib/prisma";

export type ChangeType = "positive" | "neutral" | "warning";

export function getChangeMeta(diff: number): {
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

function getWeekRange(offset = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() - offset * 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

export async function getAdminStats() {
  "use cache";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const thisWeek = getWeekRange(0);
  const lastWeek = getWeekRange(1);

  const [
    usersThisWeek,
    usersLastWeek,
    totalUsers,
    propertiesThisWeek,
    propertiesLastWeek,
    totalProperties,
    totalPendingProperties,
    paymentStats,
  ] = await Promise.all([
    db.user.count({
      where: {
        role: { not: Role.ADMIN },
        createdAt: { gte: thisWeek.start, lt: thisWeek.end },
      },
    }),
    db.user.count({
      where: {
        role: { not: Role.ADMIN },
        createdAt: { gte: lastWeek.start, lt: lastWeek.end },
      },
    }),
    db.user.count({ where: { role: { not: Role.ADMIN } } }),
    db.property.count({
      where: {
        status: "AVAILABLE",
        createdAt: { gte: thisWeek.start, lt: thisWeek.end },
      },
    }),
    db.property.count({
      where: {
        status: "AVAILABLE",
        createdAt: { gte: lastWeek.start, lt: lastWeek.end },
      },
    }),
    db.property.count({ where: { status: "AVAILABLE" } }),
    db.property.count({ where: { status: "PENDING" } }),

    db.payment.aggregate({
      where: {
        paid: true,
        createdAt: { gte: today, lt: tomorrow },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    users: {
      total: totalUsers,
      change: calculateChange(usersThisWeek, usersLastWeek),
    },
    properties: {
      total: totalProperties,
      pending: totalPendingProperties,
      change: calculateChange(propertiesThisWeek, propertiesLastWeek),
    },
    todayRevenue: paymentStats._sum.amount || 0,
  };
}
