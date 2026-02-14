"use server";

import { db } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { dataConfig, sslConfig } from "@/lib/ssl-commerz-config";
import { getRequiredSession } from "@/lib/session";

export async function propertyPaymentAction({
  propertyId,
  startDate,
}: {
  propertyId: string;
  startDate: Date;
}) {
  try {
    const session = await getRequiredSession();

    if (!session || session.user.role !== "TENANT") {
      return { error: "Unauthorized" };
    }

    const booking = await db.bookingRequest.findFirst({
      where: {
        propertyId,
        tenantId: session.user.id,
        status: "APPROVED",
      },
    });

    if (!booking) {
      return { error: "Booking not approved yet" };
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: { owner: { include: { address: true } } },
    });

    if (!property) return { error: "Property not found" };

    const BASE_URL = process.env.BASE_URL!;
    const SUCCESS_URL = `${BASE_URL}/payment?status=valid`;
    const FAIL_URL = `${BASE_URL}/payment?status=failed`;
    const CANCEL_URL = `${BASE_URL}/payment?status=cancelled`;

    const tran_id = `HN-${randomUUID()}`;
    const cus_address = `$${property.owner.address?.upazila},${property.owner.address?.district},${property.owner.address?.division}`;

    await db.payment.create({
      data: {
        userId: session.user.id,
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
      cus_name: session.user.name,
      cus_email: session.user.email,
      cus_add1: cus_address,
      cus_phone: "",
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
