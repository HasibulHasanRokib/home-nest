"use server";

import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPropertyReviewAction({
  propertyId,
  feedback,
  rating,
}: {
  propertyId: string;
  feedback: string;
  rating: number;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (!propertyId || rating === undefined || feedback === "") {
      return { error: "Missing required fields" };
    }

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const propertyExist = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!propertyExist) {
      return { error: "Property not found!" };
    }

    await prisma.propertyReview.create({
      data: {
        propertyId: propertyExist.id,
        feedback,
        rating,
        reviewerId: currentUser.id,
      },
    });

    revalidatePath(`/properties/${propertyExist.slug}`);
    return { success: true, message: "Review added successfully" };
  } catch (error) {
    console.log("Error adding review:", error);
    return { error: "Failed to add review" };
  }
}

export async function unlockProperty(propertyId: string) {
  const user = await getCurrentUser();
  if (!user || user?.role !== "TENANT") return { error: "Unauthorized" };

  if (user.credits < 2) {
    return { error: "Not enough credits" };
  }

  const alreadyUnlocked = await prisma.propertyUnlock.findFirst({
    where: {
      userId: user.id,
      propertyId,
    },
  });

  if (alreadyUnlocked) {
    return { success: "Already unlocked" };
  }

  const result = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 2 } },
    }),
    prisma.propertyUnlock.create({
      data: {
        userId: user.id,
        propertyId,
      },
    }),
  ]);

  return { success: "Property unlocked!", creditsLeft: result[0].credits };
}
