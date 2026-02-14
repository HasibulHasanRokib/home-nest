import { db } from "@/lib/prisma";

export async function getPropertyStats(slug: string) {
  "use cache";
  return await db.property.findFirst({
    where: {
      slug,
    },
    include: {
      propertyUnlocks: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: {
            select: {
              mobileNumber: true,
            },
          },
        },
      },
    },
  });
}
