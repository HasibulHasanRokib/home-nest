import { db } from "@/lib/prisma";
import { PaymentReceipt } from "../../../../components/dashboard/payments/payment-receipt";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const paymentDetails = await db.payment.findUnique({
    where: { transactionId: id },
    include: {
      user: {
        include: {
          profile: true,
          declaration: true,
        },
      },
      rental: {
        include: {
          property: {
            include: {
              owner: {
                include: {
                  profile: true,
                  declaration: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!paymentDetails) {
    notFound();
  }

  return <PaymentReceipt data={paymentDetails} />;
}
