"use client";

import { approveBooking, rejectBooking } from "@/app/dashboard/owner/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";

export function RequestStatus({ bookingId }: { bookingId: string }) {
  const [isApprovePending, startApprove] = useTransition();
  const [isRejectPending, startReject] = useTransition();

  const handleApprove = () => {
    startApprove(async () => {
      const res = await approveBooking(bookingId);
      if (res.error) toast(res.error);
      else toast(res.success);
    });
  };

  const handleReject = () => {
    startReject(async () => {
      const res = await rejectBooking(bookingId);
      if (res.error) toast(res.error);
      else toast(res.success);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleApprove}
        disabled={isApprovePending}
        className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2"
      >
        {isApprovePending ? <Spinner /> : "Approve"}
      </Button>

      <Button
        onClick={handleReject}
        disabled={isRejectPending}
        variant="destructive"
        className="w-full gap-2"
      >
        {isRejectPending ? <Spinner /> : "Reject"}
      </Button>
    </div>
  );
}
