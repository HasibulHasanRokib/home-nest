"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Property } from "@/lib/generated/prisma/client";
import { AlertMessage } from "@/components/alert-message";
import { propertyPaymentAction } from "@/actions/property.payment.action";
import { Wallet } from "lucide-react";

export function ProceedToPayment({ property }: { property: Property }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePayment = () => {
    if (!date) {
      setError("Please select a start date");
      return;
    }

    const selectedDate = new Date(date);
    const availableDate = new Date(property.availableFrom);

    if (selectedDate < availableDate) {
      setError(
        `Selected date must be on or after ${formatDate(property.availableFrom)}`,
      );
      return;
    }

    startTransition(async () => {
      setError(null);
      const res = await propertyPaymentAction({
        propertyId: property.id,
        startDate: selectedDate,
      });

      if (res?.error) {
        toast.error(res.error);
        setError(res.error);
      } else if (res.url) {
        window.location.href = res.url;
      }
    });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(val) => {
        setDialogOpen(val);
        if (!val) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full gap-2 h-9 bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200">
          <Wallet className="w-3.5 h-3.5" />
          Pay Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Rental Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 border border-primary/10 bg-primary/5 rounded-lg p-4">
          <h3 className="font-bold text-lg">{property.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            ৳ {property.price.toLocaleString("en-BD")}{" "}
            <span className="text-xs">/ month</span>
          </p>
          <p className="text-xs w-fit px-2 py-1 ">
            Available From: {formatDate(property.availableFrom)}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date" className="text-sm font-medium">
            When do you want to start?
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            min={new Date(property.availableFrom).toISOString().split("T")[0]}
            onChange={(e) => {
              setDate(e.target.value);
              setError(null);
            }}
            className={error ? "border-destructive" : ""}
          />
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-xs space-y-2">
          <p className="font-semibold text-foreground">
            Rental Terms & Conditions
          </p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
            <li>Payments processed via SSLCommerz are non-refundable.</li>
            <li>Rental cycle starts from your selected date.</li>
            <li>Standard maintenance and damage policies apply.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {error && <AlertMessage title={error} variant="destructive" />}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-2"
              onClick={handlePayment}
              disabled={isPending || !date}
            >
              {isPending ? <Spinner className="mr-2" /> : null}
              Confirm & Pay ৳{property.price.toLocaleString("en-BD")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
