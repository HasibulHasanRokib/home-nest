import { buttonVariants } from "@/components/ui/button";
import { XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SuccessView } from "./success-view";

export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const paymentStatus = (await params).status;
  const renderContent = () => {
    switch (paymentStatus) {
      case "valid":
        return <SuccessView />;
      case "failed":
        return (
          <>
            <XCircle className="text-destructive mx-auto mb-4 h-16 w-16" />
            <h2 className="text-destructive mb-4 text-2xl font-bold">
              Payment Failed
            </h2>
            <p className="mb-6">Sorry, your payment could not be processed.</p>
          </>
        );
      case "cancelled":
        return (
          <>
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h2 className="mb-4 text-2xl font-bold text-yellow-500">
              Payment Cancelled
            </h2>
            <p className="mb-6">Your payment has been cancelled.</p>
          </>
        );
      default:
        return (
          <>
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-500" />
            <h2 className="mb-4 text-2xl font-bold text-gray-500">
              Invalid Status
            </h2>
            <p className="mb-6 text-gray-600">Unknown payment status.</p>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center">
          {renderContent()}
          <Link
            href={"/dashboard"}
            className={buttonVariants({ variant: "default" })}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
