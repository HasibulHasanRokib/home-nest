"use server";

import { Role } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import {
  addressInfoFormSchema,
  declarationFormSchema,
  ownerInfoFormSchema,
  tenantInfoFormSchema,
} from "@/lib/zod-schema/create-profile-schema";
import z from "zod";

export async function reviewAndSubmitAction() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "No User found!" };
    }

    const userProfile = await prisma.declaration.findUnique({
      where: { userId: currentUser.id },
    });

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        status: "NOT_VERIFIED",
        image: userProfile?.photo,
        currentStep: 1,
      },
    });

    return { success: "Account Created Successful." };
  } catch (error) {
    console.log("Error in reviewAndSubmitAction:", error);
    return {
      error:
        "An error occurred during review and submit action. Please try again.",
    };
  }
}

export async function accountRoleAction(role: Role) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!Object.values(Role).includes(role)) {
      return { error: "Invalid account role" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong! Please try again later." };
  }
}

export async function tenantInfoAction(
  values: z.infer<typeof tenantInfoFormSchema>
) {
  try {
    const validation = tenantInfoFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const currentProfile = await getCurrentUser();

    if (!currentProfile || currentProfile.role !== Role.TENANT) {
      return { error: "Unauthorized" };
    }

    await prisma.profile.upsert({
      where: { userId: currentProfile.id },
      update: {
        ...validation.data,
        familySize: Number(validation.data.familySize),
      },
      create: {
        ...validation.data,
        userId: currentProfile.id,
        familySize: Number(validation.data.familySize),
      },
    });

    await prisma.user.update({
      where: {
        id: currentProfile.id,
      },
      data: {
        currentStep: 2,
      },
    });
    return { success: "Tenant information details created successfully." };
  } catch (error) {
    console.log("Error in TenantInfoAction:", error);
    return {
      error: "An error occurred during Tenant Information. Please try again.",
    };
  }
}

export async function ownerInfoAction(
  values: z.infer<typeof ownerInfoFormSchema>
) {
  try {
    const validation = ownerInfoFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const currentProfile = await getCurrentUser();

    if (!currentProfile || currentProfile.role !== Role.OWNER) {
      return { error: "Unauthorized" };
    }

    await prisma.profile.upsert({
      where: { userId: currentProfile.id },
      update: {
        ...validation.data,
      },
      create: {
        ...validation.data,
        userId: currentProfile.id,
      },
    });

    await prisma.user.update({
      where: {
        id: currentProfile.id,
      },
      data: {
        currentStep: 2,
      },
    });
    return { success: "Owner information details created successfully." };
  } catch (error) {
    console.log("Error in OwnerInfoAction:", error);
    return {
      error: "An error occurred during Owner Information. Please try again.",
    };
  }
}

export async function addressInfoAction(
  values: z.infer<typeof addressInfoFormSchema>
) {
  try {
    const validation = addressInfoFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const currentProfile = await getCurrentUser();

    if (!currentProfile || currentProfile.role === Role.USER) {
      return { error: "Unauthorized" };
    }

    await prisma.address.upsert({
      where: { userId: currentProfile.id },
      update: { ...validation.data },
      create: {
        ...validation.data,
        userId: currentProfile.id,
      },
    });

    await prisma.user.update({
      where: {
        id: currentProfile.id,
      },
      data: {
        currentStep: 3,
      },
    });
    return { success: "Address information details created successfully." };
  } catch (error) {
    console.log("Error in AddressInfoAction:", error);
    return {
      error: "An error occurred during Address Information. Please try again.",
    };
  }
}

export async function declarationInfoAction(
  values: z.infer<typeof declarationFormSchema>
) {
  try {
    const validation = declarationFormSchema.safeParse(values);

    if (!validation.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const currentProfile = await getCurrentUser();

    if (!currentProfile || currentProfile.role === Role.USER) {
      return { error: "Unauthorized" };
    }

    await prisma.declaration.upsert({
      where: { userId: currentProfile.id },
      update: { ...validation.data },
      create: {
        ...validation.data,
        userId: currentProfile.id,
      },
    });

    await prisma.user.update({
      where: {
        id: currentProfile.id,
      },
      data: {
        currentStep: 4,
      },
    });

    return {
      success: "Declaration information details saved successfully.",
    };
  } catch (error) {
    console.log("Error in declarationInfoAction:", error);
    return {
      error:
        "An error occurred during Declaration Information. Please try again.",
    };
  }
}
