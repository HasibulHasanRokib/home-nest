"use client";

import { cancelBookingRequest } from "@/app/dashboard/tenant/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTransition } from "react";
import { toast } from "sonner";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelBookingRequest(bookingId);

      if (res?.error) {
        toast(res.error);
      } else {
        toast(res.success);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      className="w-full gap-2 "
      onClick={handleCancel}
      disabled={pending}
    >
      {pending ? <Spinner /> : "Cancel Request"}
    </Button>
  );
}
