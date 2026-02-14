"use client";

import { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function RefundRequest({ paymentId }: { paymentId: string }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return toast.error("Please provide a reason for refund");

    setLoading(true);
    // এখানে আপনার Server Action কল হবে
    // const res = await requestRefundAction(paymentId, reason);

    setLoading(false);
    toast.success("Refund request sent to Admin. Please wait 24-48 hours.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <AlertTriangle className="w-4 h-4" /> Request Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Refund</DialogTitle>
          <DialogDescription>
            Are you having trouble with this property? Please explain the issue
            below. Our admin team will investigate and get back to you.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Describe your issue (e.g., Owner didn't provide keys, property doesn't match images...)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-25"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full gap-2"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
