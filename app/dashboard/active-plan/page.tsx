import Link from "next/link";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  CookingPot,
  Zap,
  Calendar,
  ArrowUpCircle,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionConfigForUser } from "@/components/subscription/subscription";
import { getRequiredSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function Page() {
  const session = await getRequiredSession();
  if (!session) {
    redirect("/auth/sign-in");
  }

  const pkg = await db.package.findFirst({
    where: { userId: session.user.id, active: true },
  });

  if (!pkg) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Empty className="border-2 border-dashed p-10 rounded-2xl">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-muted">
              <CookingPot className="h-10 w-10 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No Active Plan</EmptyTitle>
            <EmptyDescription>
              You do not have an active subscription plan right now. Please
              choose a plan to unlock premium features.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="mt-4 gap-2">
              <Link href={"/upgrade-plan"}>
                <Zap className="h-4 w-4 fill-current" /> Choose a Plan
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const configPkg = subscriptionConfigForUser.packages.find(
    (p) => p.id === pkg.packageName,
  );

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            View your current plan, billing date, and included features.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={"/upgrade-plan"}>
            <ArrowUpCircle className="h-4 w-4" /> Change Plan
          </Link>
        </Button>
      </div>

      {/* Plan Details Card */}
      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-border">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-linear-to-r from-primary via-blue-500 to-purple-600" />

        <CardHeader className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 transition-colors uppercase text-[10px] font-bold tracking-widest">
                  Current Active Plan
                </Badge>
              </div>
              <CardTitle className="text-4xl font-black capitalize py-2">
                {pkg.packageName} Plan
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Active since {formatDate(pkg.createdAt)}
              </CardDescription>
            </div>

            <div className="text-left sm:text-right bg-muted/50 p-4 rounded-xl border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                Plan Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Active & Verified
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <div className="h-px bg-border mb-8" />

          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            Everything in your {pkg.packageName} package
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {configPkg?.features?.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-primary/20 transition-all group"
              >
                <div className="mt-1 bg-primary/10 rounded-full p-1 group-hover:bg-primary group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium leading-tight text-slate-700 dark:text-slate-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Helper Info */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Need help? Contact our{" "}
        <Link href="/support" className="underline hover:text-primary">
          support team
        </Link>{" "}
        or view{" "}
        <Link href="/faq" className="underline hover:text-primary">
          billing FAQs
        </Link>
        .
      </p>
    </div>
  );
}
