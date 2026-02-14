"use server";

import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/session";
import { PropertySchema } from "@/lib/zod-schemas/property.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function setSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function propertyAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getRequiredSession();

  if (!session || session.user.role !== "OWNER") {
    return { message: "Unauthorized" };
  }
  const rawData = {
    title: formData.get("title"),
    location: formData.get("location"),
    price: Number(formData.get("price")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    sqft: Number(formData.get("sqft")),
    availableFrom: new Date(formData.get("availableFrom") as string),
    description: formData.get("description"),
    propertyType: formData.get("propertyType"),
    petPolicy: formData.get("petPolicy"),
    leaseTerm: formData.get("leaseTerm"),
    amenities: formData.getAll("amenities"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
  };

  const validatedFields = PropertySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const slug = await setSlug(validatedFields.data.title);

  try {
    const isEdit = formData.get("mode") === "edit";
    const propertyId = formData.get("propertyId") as string;

    if (isEdit) {
      const existingProperty = await db.property.findUnique({
        where: { id: propertyId, ownerId: session.user.id },
      });

      if (!existingProperty) {
        return { message: "Property not found or access denied." };
      }
      await db.property.update({
        where: { id: propertyId },
        data: {
          ...validatedFields.data,
        },
      });
    } else {
      const userCredits = session?.user.credits || 0;
      if (userCredits < 2) {
        return { message: "Insufficient credits" };
      }

      await db.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 2 } },
      });

      await db.property.create({
        data: {
          ...validatedFields.data,
          slug,
          ownerId: session.user.id,
        },
      });
    }
    revalidatePath("/dashboard/owner/my-properties");
  } catch (error) {
    console.log(error);
    return {
      message:
        " An error occurred while saving the property. Please try again.",
    };
  }

  redirect("/dashboard/owner/my-properties");
}

export async function unlockProperty(propertyId: string) {
  const session = await getRequiredSession();
  if (!session.user || session.user.role !== "TENANT")
    return { error: "Unauthorized" };

  if (session.user.credits! < 2) {
    return { error: "Not enough credits" };
  }

  const alreadyUnlocked = await db.propertyUnlock.findFirst({
    where: {
      userId: session.user.id,
      propertyId,
    },
  });

  if (alreadyUnlocked) {
    return { success: "Already unlocked" };
  }

  const result = await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 2 } },
    }),
    db.propertyUnlock.create({
      data: {
        userId: session.user.id,
        propertyId,
      },
    }),
  ]);

  return { success: "Property unlocked!", creditsLeft: result[0].credits };
}

export async function propertyReviewAction({
  propertyId,
  feedback,
  rating,
}: {
  propertyId: string;
  feedback: string;
  rating: number;
}) {
  try {
    const session = await getRequiredSession();

    if (!propertyId || rating === undefined || feedback === "") {
      return { error: "Missing required fields" };
    }

    if (!session) {
      return { error: "Unauthorized" };
    }

    const propertyExist = await db.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!propertyExist) {
      return { error: "Property not found!" };
    }

    await db.propertyReview.create({
      data: {
        propertyId: propertyExist.id,
        feedback,
        rating,
        reviewerId: session.user.id,
      },
    });

    revalidatePath(`/properties/${propertyExist.slug}`);
    return { success: true, message: "Review added successfully" };
  } catch (error) {
    console.log("Error adding review:", error);
    return { error: "Failed to add review" };
  }
}

export async function propertyStatusAction({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  try {
    const session = await getRequiredSession();

    if (!session || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    if (
      session.user &&
      session.user.role === "ADMIN" &&
      status === PropertyStatus.RENTED
    ) {
      return { error: "Admin  is not allowed to rent properties!" };
    }

    const propertyExist = await db.property.findUnique({
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

    const updateProperty = await db.property.update({
      where: {
        id,
      },
      data: {
        status: status as PropertyStatus,
      },
    });
    revalidatePath("/dashboard/admin/properties");
    return {
      success: `Property with ID "${updateProperty.title}"  successfully updated to status ${status}.`,
    };
  } catch (error) {
    console.log("ChangePropertyStatus", error);
    return { error: "Something went wrong" };
  }
}
