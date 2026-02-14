import { db } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getOwnerStats(userId: string) {
  "use cache";
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const [totalProperties, activeRentals, monthlyEarnings] = await Promise.all([
    db.property.count({ where: { ownerId: userId } }),
    db.property.count({ where: { ownerId: userId, status: "RENTED" } }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: {
        paid: true,
        rental: { property: { ownerId: userId } },
        createdAt: { gte: start, lte: end },
      },
    }),
  ]);

  return {
    totalProperties,
    activeRentals,
    earnings: monthlyEarnings._sum.amount || 0,
  };
}
