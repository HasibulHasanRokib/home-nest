import { CopyButton } from "../../../components/dashboard/payments/copy-button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  CookingPot,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRequiredSession } from "@/lib/session";

export default async function Page() {
  const session = await getRequiredSession();
  if (!session) redirect("/auth/sign-in");

  const paymentsHistory = await db.payment.findMany({
    where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
          <p className="text-muted-foreground text-sm">
            Review and download your transaction receipts.
          </p>
        </div>
      </div>

      {paymentsHistory.length === 0 ? (
        <Empty className="border-2 border-dashed rounded-2xl py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted">
              <CookingPot className="h-10 w-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No transactions yet</EmptyTitle>
            <EmptyDescription>
              All your rental payments and booking transactions will appear
              here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {paymentsHistory.map((payment) => (
            <div
              key={payment.id}
              className="group bg-card hover:bg-accent/5 transition-colors border rounded-xl overflow-hidden"
            >
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Info Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg capitalize leading-none mb-1">
                        {payment.description}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(payment.createdAt)} at{" "}
                          {new Date(payment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {payment.paymentMethod && (
                          <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            {payment.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/50 w-fit px-3 py-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                      TXID:
                    </span>
                    <CopyButton text={payment.transactionId} />
                  </div>
                </div>

                {/* Right: Status & Amount Section */}
                <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tight text-foreground">
                      ৳{payment.amount.toLocaleString("en-BD")}
                    </p>
                    <div className="mt-1 flex justify-end">
                      {payment.paid ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50 gap-1 shadow-none">
                          <CheckCircle2 className="h-3 w-3" /> Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200/50 gap-1 shadow-none"
                        >
                          <XCircle className="h-3 w-3" /> Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>

                  {payment.paid && payment.rentalId && (
                    <Button asChild size="sm">
                      <Link
                        href={`/dashboard/payments/${payment.transactionId}`}
                      >
                        View Receipt
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
