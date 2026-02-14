"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Download, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function SuccessView() {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10b981", "#3b82f6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10b981", "#3b82f6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
      <Card className="border-none shadow-2xl ring-1 ring-border bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-2 flex flex-col items-center">
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-center text-emerald-600 dark:text-emerald-400">
            Payment Successful!
          </h2>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Thank you for your payment. Your booking has been confirmed, and a
            digital receipt has been sent to your email.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold text-emerald-600">Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">SSLCommerz</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4">
          <Button
            asChild
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
          >
            <Link href="/dashboard">
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Link
              href="/dashboard/tenant/payments"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Download className="mr-2 h-4 w-4" /> Receipt
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
