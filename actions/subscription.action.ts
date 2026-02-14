"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/prisma";
import { dataConfig, sslConfig } from "@/lib/ssl-commerz-config";
import { getRequiredSession } from "@/lib/session";

export async function subscriptionPaymentAction({
  amount,
  packageName,
}: {
  amount: number;
  packageName: string;
}) {
  try {
    const session = await getRequiredSession();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const BASE_URL = process.env.BASE_URL!;
    const SUCCESS_URL = `${BASE_URL}/payment/subscription-status?status=valid`;
    const FAIL_URL = `${BASE_URL}/payment/subscription-status?status=failed`;
    const CANCEL_URL = `${BASE_URL}/payment/subscription-status?status=cancelled`;

    const tran_id = `HNS-${randomUUID()}`;

    await db.package.create({
      data: {
        userId: session.user.id,
        transactionId: tran_id,
        packageName: packageName,
        active: false,
      },
    });
    await db.payment.create({
      data: {
        userId: session.user.id,
        transactionId: tran_id,
        amount: amount,
        paid: false,
        description: `Subscription: ${packageName}`,
      },
    });

    const configData = dataConfig({
      total_amount: amount,
      tran_id,
      success_url: SUCCESS_URL,
      fail_url: FAIL_URL,
      cancel_url: CANCEL_URL,
      product_name: packageName,
      product_category: "Subscription",
      cus_name: session.user.name,
      cus_email: session.user.email,
      cus_add1: "Home Nest",
      cus_phone: "",
    });

    const result = await sslConfig.init(configData);

    if (!result.GatewayPageURL) {
      throw new Error("SSLCommerz failed to generate gateway URL.");
    }

    return { url: result.GatewayPageURL };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
}
