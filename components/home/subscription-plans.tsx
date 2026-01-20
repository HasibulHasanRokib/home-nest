import { cn } from "@/lib/utils";
import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { subscriptionConfigForUser } from "@/components/subscription/subscription";

export function SubscriptionPlans() {
  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Subscription Plans
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose a plan that fits your needs and start enjoying our services
            today.
          </p>
        </div>

        <div className="grid  gap-6 px-6 mt-16 md:grid-cols-3">
          {subscriptionConfigForUser.packages.map((item) => (
            <div
              key={item.id}
              className={cn(
                item.isPopular ? "border-primary/50" : "border-input",
                "relative flex min-h-100 flex-col rounded-lg border-2 p-6 ",
              )}
            >
              {item.isPopular && (
                <Badge
                  variant={"outline"}
                  className="absolute   top-1 -right-8 -translate-x-1/2 "
                >
                  <FaStar className="text-yellow-400 " />
                  Popular
                </Badge>
              )}

              <h5 className="text-xl text-center font-bold">{item.label}</h5>

              <ul className="my-10 flex-1 space-y-1 text-sm px-6">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg
                      className="text-primary h-4 w-4 shrink-0"
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
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center text-xl font-bold">
                ৳ {item.price.toLocaleString("en-BD")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
