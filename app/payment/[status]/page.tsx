import Link from "next/link";
import { SuccessView } from "./success-view";
import { XCircle, AlertCircle, Home, RefreshCcw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

const statusConfig = {
  failed: {
    icon: <XCircle className="text-destructive h-20 w-20" />,
    title: "Payment Failed",
    description:
      "We couldn't process your transaction. Please check your card details or balance.",
    color: "text-destructive",
    buttonText: "Try Again",
    buttonLink: "/properties",
  },
  cancelled: {
    icon: <AlertCircle className="text-amber-500 h-20 w-20" />,
    title: "Payment Cancelled",
    description:
      "You have cancelled the payment process. No charges were made to your account.",
    color: "text-amber-500",
    buttonText: "Go Back",
    buttonLink: "/dashboard/tenant/bookings",
  },
  default: {
    icon: <AlertCircle className="text-muted-foreground h-20 w-20" />,
    title: "Unknown Status",
    description: "Something went wrong while retrieving your payment status.",
    color: "text-muted-foreground",
    buttonText: "Return Home",
    buttonLink: "/",
  },
};

interface Props {
  params: Promise<{ status: string }>;
}
async function PaymentStatus({ params }: Props) {
  const { status } = await params;

  if (status === "valid") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <SuccessView />
      </div>
    );
  }

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  return (
    <Card className="w-full max-w-md border-none shadow-2xl ring-1 ring-border bg-card/60 backdrop-blur-md">
      <CardContent className="flex flex-col items-center p-10 text-center">
        <div className="mb-6 animate-in zoom-in duration-500">
          {currentStatus.icon}
        </div>

        <h2
          className={`mb-3 text-3xl font-extrabold tracking-tight ${currentStatus.color}`}
        >
          {currentStatus.title}
        </h2>

        <p className="mb-8 text-muted-foreground leading-relaxed">
          {currentStatus.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={currentStatus.buttonLink || "/dashboard"}
            className={`${buttonVariants({ variant: "default" })} flex-1 gap-2 h-11`}
          >
            <RefreshCcw className="h-4 w-4" />
            {currentStatus.buttonText}
          </Link>

          <Link
            href="/dashboard"
            className={`${buttonVariants({ variant: "outline" })} flex-1 gap-2 h-11`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
export default async function PaymentStatusPage({ params }: Props) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <PaymentStatus params={params} />
      </Suspense>
    </div>
  );
}
