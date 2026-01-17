import { CopyButton } from "@/components/copy-btn";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CookingPot } from "lucide-react";

export default async function PaymentsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return notFound();

  let payments_history = [];
  if (currentUser.role === "ADMIN") {
    payments_history = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
  } else {
    payments_history = await prisma.payment.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Payment History</h2>
      {payments_history.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CookingPot />
            </EmptyMedia>
            <EmptyTitle>No Payment History Yet</EmptyTitle>
            <EmptyDescription>
              “No payments recorded yet. All transactions for your profile will
              appear here.”
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {payments_history.map((payment) => (
        <div
          key={payment.id}
          className="bg-card border-border overflow-hidden mb-2 rounded-lg border"
        >
          <div className="border-border flex items-center border-b  p-6 last:border-b-0">
            <div className="flex-1">
              <p className="text-foreground font-semibold capitalize">
                {payment.description}
              </p>
              <p className="text-muted-foreground text-sm">
                Payment date: {formatDate(payment.createdAt)},
                {new Date(payment.createdAt).toLocaleTimeString()}
              </p>

              {payment.paymentMethod && (
                <p className="text-muted-foreground text-sm">
                  Paid with: {payment.paymentMethod}
                </p>
              )}
              <div className="flex gap-2 md:hidden">
                <p className="text-primary text-lg font-semibold">
                  ৳{payment.amount.toLocaleString("en-BD")}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    payment.paid ? "text-success" : "text-warning"
                  }`}
                >
                  {payment.paid ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      Pending
                    </Badge>
                  )}
                </p>
              </div>
              <div className="text-muted-foreground flex flex-col gap-2 text-sm">
                <p>Transaction Id:</p>
                <CopyButton text={payment.transactionId} />
              </div>
            </div>
            <div className="ml-4 hidden gap-2 md:flex">
              <p className="text-primary text-lg font-semibold">
                ৳{payment.amount.toLocaleString("en-BD")}
              </p>
              <p
                className={`mt-1 text-sm ${
                  payment.paid ? "text-success" : "text-warning"
                }`}
              >
                {payment.paid ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Paid
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Cancel
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
