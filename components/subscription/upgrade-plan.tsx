"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { subscriptionConfigForUser } from "./subscription";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FaStar } from "react-icons/fa";
import { subscriptionPaymentAction } from "@/app/upgrade-plan/action";

export function UpgradePlan() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPackage, setSelectedPackage] = useState(
    subscriptionConfigForUser.defaultPackage,
  );

  const pkg = subscriptionConfigForUser.packages.find(
    (p) => p.id === selectedPackage,
  );

  if (!pkg?.price) {
    toast.error("Select a package");
    return;
  }

  const createCheckoutSession = async () => {
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
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <h1 className="mb-6 text-2xl font-bold">Choose your subscription</h1>

      <fieldset className="space-y-4">
        <legend className="text-foreground mb-4 text-sm leading-none font-medium">
          Choose package
        </legend>

        <RadioGroup
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          value={selectedPackage}
          onValueChange={setSelectedPackage}
        >
          {subscriptionConfigForUser.packages.map((item) => (
            <label
              key={item.id}
              htmlFor={item.id}
              className={cn(
                "relative flex cursor-pointer flex-col min-h-100 rounded-lg border-2 p-6 transition-all",
                selectedPackage === item.id
                  ? "border-primary/50 bg-muted"
                  : "border-input hover:border-primary/50",
              )}
            >
              <RadioGroupItem
                value={item.id}
                id={item.id}
                className="sr-only"
              />

              {item.isPopular && (
                <Badge className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <FaStar className="text-yellow-400" />
                  Popular
                </Badge>
              )}

              <h5 className="text-xl text-center font-bold">{item.label}</h5>

              <ul className="my-8 flex-1 space-y-2 text-sm px-4">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="text-center text-xl font-bold">
                ৳ {item.price.toLocaleString("en-BD")}
              </div>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="space-y-2 border-t pt-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-medium">Total amount:</span>
          <span className="text-2xl font-bold">
            {pkg?.price.toLocaleString("en-BD")}
          </span>
        </div>

        <Button
          onClick={createCheckoutSession}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <CreditCard />
              Continue to payment
            </>
          )}
        </Button>

        <Button
          onClick={() => router.back()}
          variant={"outline"}
          disabled={isPending}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
