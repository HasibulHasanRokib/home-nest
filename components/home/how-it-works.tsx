import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Search,
  FileText,
  Key,
  Building2,
  Users,
  CheckCircle2,
  Handshake,
} from "lucide-react";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";

export async function HowItWorks() {
  const currentUser = await getCurrentUser();
  const ownerSteps = [
    {
      icon: Building2,
      title: "List Your Property",
      description:
        "Create a detailed listing with photos and property information in minutes",
    },
    {
      icon: Users,
      title: "Connect with Tenants",
      description:
        "Receive applications from verified tenants and review their profiles",
    },
    {
      icon: CheckCircle2,
      title: "Screen & Approve",
      description:
        "Use our built-in screening tools to find the perfect tenant",
    },
    {
      icon: Handshake,
      title: "Finalize & Earn",
      description: "Sign the lease digitally and start receiving rent payments",
    },
  ];

  const tenantSteps = [
    {
      icon: Search,
      title: "Search Properties",
      description:
        "Browse thousands of verified listings with detailed photos and info",
    },
    {
      icon: Home,
      title: "Schedule Tours",
      description:
        "Book viewings directly with property owners at your convenience",
    },
    {
      icon: FileText,
      title: "Submit Application",
      description:
        "Apply online with your documents and references in one place",
    },
    {
      icon: Key,
      title: "Move In",
      description:
        "Sign your lease digitally and get your keys to your new home",
    },
  ];

  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple steps to find your home or rent out your property
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* For Property Owners */}
          <div className="space-y-4">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-semibold">For Property Owners</span>
            </div>

            <div className="space-y-6">
              {ownerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index}>
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-6 w-6 " />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Link href={currentUser ? "/dashboard" : "/auth/sign-in"}>
              <Button>Post Your Property Now</Button>
            </Link>
          </div>

          {/* For Tenants */}
          <div className="space-y-4">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">For Tenants</span>
            </div>

            <div className="space-y-6">
              {tenantSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index}>
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Link href={currentUser ? "/properties" : "/auth/sign-in"}>
              <Button>Find For Rent Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
