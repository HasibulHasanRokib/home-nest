"use server";

import z from "zod";
import { getCurrentUser } from "@/lib/get-current-user";
import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/zod-schema/property-schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import BookingStatusEmailTemplate from "./rent-requests/booking-status-email-templete";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function approveBooking(id: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "OWNER") return { error: "Unauthorized" };

  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      owner: true,
      property: true,
      tenant: true,
    },
  });

  if (!booking) return { error: "Booking not found" };

  if (booking.ownerId !== user.id) return { error: "Access denied" };

  if (booking.status !== "PENDING")
    return { error: "Booking already processed" };

  await prisma.bookingRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  const { data, error } = await resend.emails.send({
    from: "HomeNest <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Approved Booking request",
    react: BookingStatusEmailTemplate({
      propertyName: booking.property.title,
      tenantName: booking.tenant.name,
      ownerName: booking.owner.name,
      status: "APPROVED",
    }),
  });

  console.log({ data, error });

  revalidatePath("/dashboard/owner/rent-requests");
  return { success: "Booking approved successfully" };
}

export async function rejectBooking(id: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "OWNER") return { error: "Unauthorized" };

  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      owner: true,
      property: true,
      tenant: true,
    },
  });

  if (!booking) return { error: "Booking not found" };

  if (booking.ownerId !== user.id) return { error: "Access denied" };

  if (booking.status !== "PENDING")
    return { error: "Booking already processed" };

  await prisma.bookingRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  const { data, error } = await resend.emails.send({
    from: "HomeNest <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Rejected Booking request",
    react: BookingStatusEmailTemplate({
      propertyName: booking.property.title,
      tenantName: booking.tenant.name,
      ownerName: booking.owner.name,
      status: "REJECTED",
    }),
  });
  console.log({ data, error });
  revalidatePath("/dashboard/owner/rent-requests");
  return { success: "Booking rejected" };
}

export async function setSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function deletePropertyAction(propertyId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== Role.OWNER) {
    throw new Error("Unauthorized");
  }
  const propertyExists = await prisma.property.findUnique({
    where: { id: propertyId, ownerId: currentUser.id },
  });

  if (!propertyExists) {
    throw new Error(
      "Property not found or you do not have permission to delete it",
    );
  }

  await prisma.property.delete({
    where: { id: propertyExists.id },
  });
  revalidatePath("/dashboard/owner/my-properties");
}

type EditPropertyFormData = {
  propertyId: string;
  values: z.infer<typeof propertySchema>;
};

export async function editPropertyAction({
  propertyId,
  values,
}: EditPropertyFormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.OWNER) {
    return { error: "Unauthorized" };
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      ownerId: currentUser.id,
    },
  });
  if (!property) {
    return {
      error: "Property not found or you do not have permission to edit it",
    };
  }
  const validatedData = propertySchema.safeParse(values);

  if (!validatedData.success) {
    return { error: "Invalid property data" };
  }

  const slug = await setSlug(validatedData.data.title);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: currentUser.id },
      data: { credits: { decrement: 2 } },
    }),
    prisma.property.update({
      where: { id: propertyId },
      data: {
        ...validatedData.data,
        slug,
      },
    }),
  ]);

  revalidatePath("/dashboard/owner/my-properties");
}

type AddPropertyFormData = {
  values: z.infer<typeof propertySchema>;
};

export async function addPropertyAction({ values }: AddPropertyFormData) {
  const currentUser = await getCurrentUser();
  if (
    !currentUser ||
    (currentUser.role !== Role.OWNER && currentUser.role !== Role.ADMIN)
  ) {
    return { error: "Unauthorized" };
  }

  const validatedData = propertySchema.safeParse(values);

  if (!validatedData.success) {
    return { error: "Invalid property data" };
  }

  const slug = await setSlug(validatedData.data.title);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: currentUser.id },
      data: { credits: { decrement: 2 } },
    }),
    prisma.property.create({
      data: {
        ...validatedData.data,
        slug,
        ownerId: currentUser.id,
      },
    }),
  ]);

  revalidatePath("/dashboard/owner/my-properties");
}
