"use client";

import { propertyPaymentAction } from "@/app/dashboard/tenant/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Property } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";
import { ErrorMessage } from "@/components/error-message";

export function ProceedToPayment({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>();

  const handlePayment = () => {
    if (!date) {
      setError("Please select a start date");
      return;
    }

    if (date < new Date(property.availableFrom)) {
      setError(
        `Selected date must be on or after ${formatDate(property.availableFrom)}`,
      );
      return;
    }
    startTransition(async () => {
      const res = await propertyPaymentAction({
        propertyId: property.id,
        startDate: date,
      });
      if (res?.error) {
        toast(res.error);
      } else {
        window.location.href = res.url;
      }
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">Proceed to Payment</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Rental Payment</DialogTitle>
        </DialogHeader>

        {/* Property Info */}
        <div className="space-y-2 border rounded-lg p-3">
          <h3 className="font-semibold">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.location}</p>
          <p className="text-sm">
            Rent: <span className="font-semibold">৳ {property.price}</span> /
            month
          </p>
          <p className="text-sm">
            Available From:{" "}
            <span className="font-semibold">
              {formatDate(property.availableFrom)}
            </span>
          </p>
        </div>

        {/* Date  */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Start from
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {date ? formatDate(date) : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Rules */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 space-y-2 text-sm">
          <p className="font-medium">Rental Rules</p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
            <li>Payment is non-refundable</li>
            <li>Rent must be paid monthly</li>
            <li>Damage cost will be charged</li>
            <li>Follow property rules</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-3">
          {error && <ErrorMessage error={error} />}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setDialogOpen(false);
              setDate(undefined);
              setError("");
            }}
          >
            Cancel
          </Button>

          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Confirm & Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
