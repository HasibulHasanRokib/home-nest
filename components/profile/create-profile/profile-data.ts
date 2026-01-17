import { prisma } from "@/lib/prisma";

export async function getProfileData(userId: string) {
  const [profile, address, declaration] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.address.findUnique({ where: { userId } }),
    prisma.declaration.findUnique({ where: { userId } }),
  ]);

  return {
    profile,
    address,
    declaration,
  };
}
