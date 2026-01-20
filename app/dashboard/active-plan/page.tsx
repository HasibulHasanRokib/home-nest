import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { subscriptionConfigForUser } from "@/components/subscription/subscription";
import { CheckCircle2, CookingPot } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ActivePlanPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return notFound();
  }

  const pkg = await prisma.package.findFirst({
    where: { userId: currentUser.id, active: true },
  });

  if (!pkg) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CookingPot />
          </EmptyMedia>
          <EmptyDescription>
            You do not have an active subscription plan. Please choose a plan to
            continue.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <Link href={"/upgrade-plan"}>Choose plan</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const configPkg = subscriptionConfigForUser.packages.find(
    (p) => p.id === pkg.packageName,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold  mb-2">Your Current Active Plan</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your subscription plan and features
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground text-3xl font-bold capitalize">
            {pkg.packageName} plan
          </CardTitle>
          <CardAction>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground"
              size="sm"
            >
              <Link href={"/upgrade-plan"}>Upgrade plan</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <h4 className="text-foreground mb-3 font-semibold">
            Package Features
          </h4>
          <ul className="space-y-2">
            {configPkg?.features?.map((feature, i) => (
              <li
                key={i}
                className="text-muted-foreground flex items-center gap-2"
              >
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
