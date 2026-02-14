"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getRequiredSession } from "@/lib/session";

export async function requestBooking(propertyId: string) {
  const session = await getRequiredSession();

  if (!session || session.user.role !== "TENANT") {
    return { error: "Unauthorized" };
  }

  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: {
      owner: true,
    },
  });

  if (!property) return { error: "Property not found" };

  const bookingRequestExist = await db.bookingRequest.findFirst({
    where: {
      propertyId,
      tenantId: session.user.id,
    },
  });
  if (bookingRequestExist?.status === "REJECTED") {
    return {
      error: "Your previous booking request was declined by the owner.",
    };
  }

  if (bookingRequestExist) {
    return {
      error:
        "You’ve already sent a booking request for this property. Please wait for the owner’s response.",
    };
  }

  await db.bookingRequest.create({
    data: {
      propertyId,
      tenantId: session.user.id,
      ownerId: property.ownerId,
    },
  });

  //Todo: Send Email
  return { success: "Request sent successfully" };
}

export async function cancelBookingRequest(bookingId: string) {
  const session = await getRequiredSession();

  if (!session || session.user.role !== "TENANT") {
    return { error: "Unauthorized" };
  }

  const booking = await db.bookingRequest.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return { error: "Booking request not found" };
  }

  if (booking.tenantId !== session.user.id) {
    return { error: "You are not allowed to cancel this request" };
  }

  if (booking.status !== "PENDING") {
    return {
      error: "This booking can't be canceled because it's already processed",
    };
  }

  await db.bookingRequest.delete({
    where: { id: bookingId },
  });

  revalidatePath("/dashboard/tenant/bookings");
  return { success: "Booking request canceled successfully" };
}

export async function updateBookingStatus(
  bookingId: string,
  status: "APPROVED" | "REJECTED",
) {
  try {
    const session = await getRequiredSession();

    const booking = await db.bookingRequest.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });

    if (!booking || booking.property.ownerId !== session.user.id) {
      return { error: "Unauthorized or booking not found" };
    }

    await db.bookingRequest.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/dashboard/owner/rent-requests");

    return { success: `Booking ${status.toLowerCase()} successfully!` };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
