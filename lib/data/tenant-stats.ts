import { db } from "@/lib/prisma";

export async function getTenantStats(userId: string) {
  "use cache";

  const [pending, approved, rejected, properties] = await Promise.all([
    db.bookingRequest.count({
      where: {
        tenantId: userId,
        status: "PENDING",
      },
    }),
    db.bookingRequest.count({
      where: {
        tenantId: userId,
        status: "REJECTED",
      },
    }),
    db.bookingRequest.count({
      where: {
        tenantId: userId,
        status: "APPROVED",
        property: {
          status: "AVAILABLE",
        },
      },
    }),
    db.property.findMany({
      where: {
        status: "RENTED",
        rental: {
          tenantId: userId,
        },
      },
      include: {
        owner: true,
        rental: true,
      },
    }),
  ]);
  return { pending, approved, rejected, properties };
}
