import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMonths } from "date-fns";

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

      await prisma.payment.update({
        where: { transactionId: tranId },
        data: { paid: true, paymentMethod, rentalId: rental.id },
      });
    } catch (e) {
      console.error("Payment processing error:", e);
      return redirect("/payment/failed");
    }
  }

  redirect(`/payment/${status}`);
}
