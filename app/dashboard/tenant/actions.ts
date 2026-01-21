"use server";

import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { dataConfig, sslConfig } from "@/lib/ssl-commerz-config";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import BookingEmailTemplate from "./bookings/booking-email-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function propertyPaymentAction({
  propertyId,
  startDate,
}: {
  propertyId: string;
  startDate: Date;
}) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "TENANT") {
      return { error: "Unauthorized" };
    }

    const booking = await prisma.bookingRequest.findFirst({
      where: {
        propertyId,
        tenantId: currentUser.id,
        status: "APPROVED",
      },
    });

    if (!booking) {
      return { error: "Booking not approved yet" };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: { include: { address: true } } },
    });

    if (!property) return { error: "Property not found" };

    const BASE_URL = process.env.BASE_URL!;
    const SUCCESS_URL = `${BASE_URL}/payment?status=valid`;
    const FAIL_URL = `${BASE_URL}/payment?status=failed`;
    const CANCEL_URL = `${BASE_URL}/payment?status=cancelled`;

    const tran_id = `HN-${randomUUID()}`;
    const cus_address = `${property.owner.address?.presentPostOffice},${property.owner.address?.presentUpazila},${property.owner.address?.presentDistrict}`;

    await prisma.payment.create({
      data: {
        userId: currentUser.id,
        transactionId: tran_id,
        bookingId: booking.id,
        amount: property.price,
        startDate,
        paid: false,
        description: `Rent payment for ${property.title}`,
      },
    });

    const configData = dataConfig({
      total_amount: property.price,
      tran_id,
      success_url: SUCCESS_URL,
      fail_url: FAIL_URL,
      cancel_url: CANCEL_URL,
      product_name: property.title,
      product_category: property.propertyType,
      cus_name: currentUser.name,
      cus_email: currentUser.email,
      cus_add1: cus_address,
      cus_phone: currentUser.mobileNumber,
    });

    const result = await sslConfig.init(configData);

    if (!result.GatewayPageURL) {
      throw new Error("SSLCommerz failed to generate gateway URL.");
    }

    return { url: result.GatewayPageURL };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
}

export async function cancelBookingRequest(bookingId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "TENANT") {
    return { error: "Unauthorized" };
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    return { error: "Booking request not found" };
  }

  if (booking.tenantId !== currentUser.id) {
    return { error: "You are not allowed to cancel this request" };
  }

  if (booking.status !== "PENDING") {
    return {
      error: "This booking can't be canceled because it's already processed",
    };
  }

  await prisma.bookingRequest.delete({
    where: { id: bookingId },
  });

  revalidatePath("/dashboard/tenant/bookings");
  return { success: "Booking request canceled successfully" };
}

export async function requestBooking(propertyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "TENANT") {
    return { error: "Unauthorized" };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      owner: true,
    },
  });

  if (!property) return { error: "Property not found" };

  const bookingRequestExist = await prisma.bookingRequest.findFirst({
    where: {
      propertyId,
      tenantId: currentUser.id,
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

  await prisma.bookingRequest.create({
    data: {
      propertyId,
      tenantId: currentUser.id,
      ownerId: property.ownerId,
    },
  });

  const { data, error } = await resend.emails.send({
    from: "HomeNest <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Booking request",
    react: BookingEmailTemplate({
      propertyName: property.title,
      tenantName: currentUser.name,
      ownerName: property.owner.name,
    }),
  });

  console.log({ data, error });

  return { success: "Request sent successfully" };
}
