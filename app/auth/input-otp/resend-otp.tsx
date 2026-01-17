"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resendOtpAction } from "../actions";
import { Spinner } from "@/components/ui/spinner";

export function ResendOtp({ userId }: { userId: string }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResend = async () => {
    startTransition(async () => {
      const res = await resendOtpAction(userId);
      if (res.error) {
        toast(`❌${res.error}`);
      } else {
        toast(`✅ ${res.success}`);
        setTimeLeft(60);
      }
    });
  };

  return (
    <Button
      onClick={handleResend}
      disabled={timeLeft > 0 || isPending}
      variant="link"
      className="p-0"
    >
      {isPending ? (
        <Spinner />
      ) : timeLeft > 0 ? (
        <p className="text-destructive">{timeLeft}s</p>
      ) : (
        "Resend OTP"
      )}
    </Button>
  );
}
