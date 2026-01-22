"use server";

import { getCurrentUser } from "@/lib/get-current-user";
import { PropertyStatus, Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function changePropertyStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== Role.ADMIN) {
      return { error: "Unauthorized" };
    }

    if (
      currentUser &&
      currentUser.role === Role.ADMIN &&
      status === PropertyStatus.RENTED
    ) {
      return { error: "Admin  is not allowed to rent properties!" };
    }

    const propertyExist = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (propertyExist?.status === PropertyStatus.REJECTED) {
      return {
        error: `Cannot update the status of property with ID "${propertyExist.title}" because it is rejected.`,
      };
    }

    if (propertyExist?.status === PropertyStatus.RENTED) {
      return {
        error: `Cannot update the status of property with ID "${propertyExist.title}"  because it is already booked.`,
      };
    }

    const updateProperty = await prisma.property.update({
      where: {
        id,
      },
      data: {
        status: status as PropertyStatus,
      },
    });
    console.log(updateProperty.status);
    revalidatePath("/dashboard/admin/properties");
    return {
      success: `Property with ID "${updateProperty.title}"  successfully updated to status ${status}.`,
    };
  } catch (error) {
    console.log("ChangePropertyStatus", error);
    return { error: "Something went wrong" };
  }
}
