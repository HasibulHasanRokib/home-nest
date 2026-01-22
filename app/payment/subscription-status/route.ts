import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const tranId = form.get("tran_id") as string;
  const paymentMethod = form.get("card_type") as string;
  if (!status) {
    return NextResponse.json({ message: "Missing status" }, { status: 400 });
  }

  if (!tranId) {
    return NextResponse.json({ message: "Missing tran_id" }, { status: 400 });
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
      if (!payment)
        return NextResponse.json(
          { message: "Payment not found" },
          { status: 404 },
        );

      await prisma.payment.update({
        where: { transactionId: tranId },
        data: { paid: true, paymentMethod },
      });

      const creditMap: Record<string, number> = {
        basic: 10,
        standard: 50,
        premium: 100,
      };

      const p = await prisma.package.update({
        where: { transactionId: tranId },
        data: { active: true },
      });
      const credits = creditMap[p.packageName];
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
      await resend.emails.send({
        from: "HomeNest <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Subscription Payment Successful",
        html: `
         <p>Hi there,</p>
         <p>Your subscription payment has been received successfully.</p>
         <p>You now have full access to your subscription features.</p>
         <p>If you have any questions, feel free to reach out to us anytime.</p>
         <p>Thanks for choosing HomeNest</p>
        `,
      });
    } catch (e) {
      console.error("Payment processing error:", e);
      return redirect("/payment/failed");
    }
  }

  redirect(`/payment/${status}`);
}
