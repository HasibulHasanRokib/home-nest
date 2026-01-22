import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMonths } from "date-fns";
import path from "path";
import { generatePropertyPaymentReceipt } from "@/lib/generate-template";
import { formatDate } from "@/lib/utils";
import { UTApi } from "uploadthing/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const tranId = form.get("tran_id") as string;
  const paymentMethod = form.get("card_type") as string;

  if (!status || !tranId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const allowed = ["valid", "failed", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  if (status === "valid") {
    try {
      const payment = await prisma.payment.findUnique({
        where: { transactionId: tranId },
      });
      if (!payment || !payment.bookingId) {
        return NextResponse.json(
          { message: "Payment not found" },
          { status: 404 },
        );
      }

      const booking = await prisma.bookingRequest.findUnique({
        where: { id: payment.bookingId },
        include: {
          owner: {
            include: {
              profile: true,
              address: true,
              declaration: true,
            },
          },
          property: true,
          tenant: {
            include: {
              profile: true,
              address: true,
              declaration: true,
            },
          },
        },
      });

      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 },
        );
      }
      const start = payment.startDate!;
      const end = addMonths(start, 1);

      const rental = await prisma.rental.create({
        data: {
          tenantId: booking.tenantId,
          propertyId: booking.propertyId,
          startDate: start,
          endDate: end,
        },
      });

      await prisma.property.update({
        where: { id: booking.propertyId },
        data: { status: "RENTED" },
      });

      const templatePath = path.join(
        process.cwd(),
        "public/payment-template.png",
      );

      const paymentTemplate = await generatePropertyPaymentReceipt({
        templatePath,
        paymentId: `Payment Id: ${payment.id}`,
        paymentMethod: `Payment method: ${paymentMethod}`,
        date: `Date: ${formatDate(payment.createdAt)}`,
        tenantName: `Name: ${booking.tenant.name}`,
        tenantNid: `NID/Passport/Birth Certificate no: ${booking.tenant.profile?.nidNumber}`,
        tenantEmail: `Email: ${booking.tenant.email}`,
        tenantPhone: `Phone no: ${booking.tenant.mobileNumber}`,
        tenantAddress: `Address: ${booking.tenant.address?.presentDistrict},${booking.tenant.address?.presentDivision}`,
        ownerName: `Name: ${booking.owner.name}`,
        ownerNid: `NID/Passport/Birth Certificate no: ${booking.owner.profile?.nidNumber}`,
        ownerEmail: `Email: ${booking.owner.email}`,
        ownerPhone: `Phone no: ${booking.owner.mobileNumber}`,
        ownerAddress: `Address: ${booking.owner.address?.presentDistrict},${booking.owner.address?.presentDivision}`,
        propertyTitle: `Property Title: ${booking.property.title}`,
        propertyAddress: `Property Address: ${booking.property.location}`,
        ownerSignaturePath: booking.owner.declaration?.signature ?? "",
        tenantSignaturePath: booking.tenant.declaration?.signature ?? "",
      });

      const blob = new Blob([new Uint8Array(paymentTemplate)], {
        type: "image/png",
      });

      const file = new File([blob], `payment-${payment.id}.png`, {
        type: "image/png",
      });

      const response = await utapi.uploadFiles(file);
      console.log(response.data?.ufsUrl);
      const receiptUrl = response.data?.ufsUrl;

      await prisma.payment.update({
        where: { transactionId: tranId },
        data: {
          paid: true,
          paymentMethod,
          rentalId: rental.id,
          paymentReceiptUrl: receiptUrl,
        },
      });

      await resend.emails.send({
        from: "HomeNest <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Receipt for your payment",
        html: "<p>Thanks for the payment</p>",
        attachments: [
          {
            path: receiptUrl,
            filename: `receipt-${payment.id}.png`,
          },
        ],
      });
    } catch (e) {
      console.error("Payment processing error:", e);
      return redirect("/payment/failed");
    }
  }

  redirect(`/payment/${status}`);
}
