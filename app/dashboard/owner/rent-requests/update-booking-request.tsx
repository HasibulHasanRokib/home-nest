"use client";

import { updateBookingStatus } from "@/actions/booking.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Check, X } from "lucide-react";

export function UpdateBookingRequest({ reqId }: { reqId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const res = await updateBookingStatus(reqId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="bg-emerald-600 hover:bg-emerald-700"
        onClick={() => handleAction("APPROVED")}
        disabled={isPending}
      >
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" /> Approve
          </>
        )}
      </Button>

      <Button
        onClick={() => handleAction("REJECTED")}
        disabled={isPending}
        variant="destructive"
        className="w-full"
      >
        <X className="mr-2 h-4 w-4" /> Reject
      </Button>
    </div>
  );
}
