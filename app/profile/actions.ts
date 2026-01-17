"use server";

import { verificationFields } from "@/components/profile/verification-fields";
import { UserStatus } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReviewAction({
  userId,
  rating,
}: {
  userId: string;
  rating: number;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (!userId || rating === undefined) {
      return { error: "Missing required fields" };
    }

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const existingReview = await prisma.profileReview.findFirst({
      where: {
        userId: userId,
        reviewerId: currentUser.id,
      },
    });

    if (existingReview) {
      return { error: "You have already reviewed this user." };
    } else {
      await prisma.profileReview.create({
        data: {
          userId,
          rating,
          reviewerId: currentUser.id,
        },
      });
    }

    revalidatePath(`/profile/${userId}`);
    return { success: true, message: "Review added successfully" };
  } catch (error) {
    console.log("Error adding review:", error);
    return { error: "Failed to add review" };
  }
}

export async function getVerificationData(userId: string) {
  const validation = await prisma.validation.findUnique({
    where: { userId },
  });

  if (!validation) {
    return Object.entries(verificationFields).map(([id, { label }]) => ({
      id,
      name: label,
      verified: false,
      notes: "",
    }));
  }

  return Object.entries(verificationFields).map(
    ([id, { label, verified, remarks }]) => ({
      id,
      name: label,
      verified: validation[verified as keyof typeof validation] as boolean,
      notes: (validation[remarks as keyof typeof validation] as string) || "",
    })
  );
}

export async function updateVerification(
  userId: string,
  docId: string,
  verified: boolean,
  notes: string
) {
  const fields = verificationFields[docId as keyof typeof verificationFields];
  if (!fields) throw new Error("Invalid document type");

  const validation = await prisma.validation.upsert({
    where: { userId },
    update: {
      [fields.verified]: verified,
      [fields.remarks]: notes,
    },
    create: {
      userId,
      [fields.verified]: verified,
      [fields.remarks]: notes,
    },
  });

  const hasAnyIdentity =
    validation.nidSmartCardVerified ||
    validation.passportVerified ||
    validation.birthCertificateVerified;

  const allOthersVerified =
    validation.personalInfoVerified &&
    validation.presentAddressVerified &&
    validation.permanentAddressVerified &&
    validation.facebookVerified &&
    validation.twitterVerified &&
    validation.linkedinVerified &&
    validation.whatsappVerified &&
    validation.declarationVerified;

  if (hasAnyIdentity && allOthersVerified) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.VERIFIED,
      },
    });
  }

  revalidatePath(`/profile/${userId}`);
}
