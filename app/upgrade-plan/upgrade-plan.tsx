"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Star, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { subscriptionConfigForUser } from "@/components/subscription/subscription";
import { subscriptionPaymentAction } from "@/actions/subscription.action";

export function UpgradePlan() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPackage, setSelectedPackage] = useState(
    subscriptionConfigForUser.defaultPackage,
  );

  const pkg = subscriptionConfigForUser.packages.find(
    (p) => p.id === selectedPackage,
  );

  const createCheckoutSession = async () => {
    if (!pkg?.price) {
      toast.error("Please select a package");
      return;
    }

    startTransition(async () => {
      const res = await subscriptionPaymentAction({
        amount: pkg.price,
        packageName: selectedPackage,
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        window.location.href = res.url;
      }
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight">
          Upgrade Your Plan
        </h2>
        <p className="text-muted-foreground">
          Select the best option for your needs and unlock premium features.
        </p>
      </div>

      <RadioGroup
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        value={selectedPackage}
        onValueChange={setSelectedPackage}
      >
        {subscriptionConfigForUser.packages.map((item) => {
          const isSelected = selectedPackage === item.id;
          return (
            <label
              key={item.id}
              htmlFor={item.id}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all duration-300 shadow-sm hover:shadow-md md:min-h-125",
                isSelected
                  ? "border-primary bg-primary/5  ring-primary"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <RadioGroupItem
                value={item.id}
                id={item.id}
                className="sr-only"
              />

              {item.isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-500 to-orange-600 border-none px-4 py-1 gap-1 shadow-lg">
                  <Star className="h-3 w-3 fill-white" />
                  Most Popular
                </Badge>
              )}

              <div className="mb-4">
                <h5 className="text-lg font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {item.label}
                </h5>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight">
                    ৳{item.price.toLocaleString("en-BD")}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    /total
                  </span>
                </div>
              </div>

              <div className="h-px bg-border my-4" />

              <ul className="flex-1 space-y-3 mb-6">
                {item.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-tight text-slate-600 dark:text-slate-300"
                  >
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </RadioGroup>

      {/* Checkout Section */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm ring-1 ring-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Checkout Summary</h4>
            <p className="text-sm text-muted-foreground">
              You've selected the{" "}
              <span className="font-bold text-foreground capitalize">
                {pkg?.label}
              </span>{" "}
              plan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="text-center md:text-right px-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                Amount to pay
              </p>
              <p className="text-2xl font-black text-primary">
                ৳{pkg?.price.toLocaleString("en-BD")}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-60">
              <Button
                onClick={createCheckoutSession}
                disabled={isPending}
                className="w-full h-11 gap-2 font-bold shadow-lg shadow-primary/20"
              >
                {isPending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.back()}
                variant="ghost"
                disabled={isPending}
                className="w-full h-10 gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel & Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
