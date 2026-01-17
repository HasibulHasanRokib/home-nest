"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserIcon, House } from "lucide-react";
import { toast } from "sonner";
import { Role } from "@/lib/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { accountRoleAction } from "@/app/profile/create/actions";
import { Spinner } from "@/components/ui/spinner";

function Radio({ checked }: { checked: boolean }) {
  return (
    <div
      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
        checked ? "border-primary" : "border-muted"
      }`}
    >
      {checked && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </div>
  );
}

export function AccountRoleSelector() {
  const [role, setRole] = useState<"OWNER" | "TENANT" | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleContinue = async () => {
    if (!role) {
      toast("Error Message", {
        description: "Please select a role first!",
      });
      return;
    }
    startTransition(async () => {
      const response = await accountRoleAction(role);

      if (response.error) {
        toast("Error Message", {
          description: "Please select a role first!",
        });
      } else {
        router.refresh();
        toast("Success Message", {
          description: "Account role selector successful.",
        });
      }
    });
  };

  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Help us personalize your experience on HomeNest
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            onClick={() => setRole(Role.TENANT)}
            className={`cursor-pointer border-2 p-8 transition-all ${
              role === Role.TENANT
                ? "border-primary bg-secondary/60"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="mb-6 flex items-start justify-between">
              <UserIcon className="h-8 w-8" />
              <Radio checked={role === Role.TENANT} />
            </div>

            <h2 className="text-lg font-bold">
              I am a tenant, looking for property
            </h2>
          </Card>

          <Card
            onClick={() => setRole(Role.OWNER)}
            className={`cursor-pointer border-2 p-8 transition-all ${
              role === Role.OWNER
                ? "border-primary bg-secondary/60"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="mb-6 flex items-start justify-between">
              <House className="h-8 w-8" />
              <Radio checked={role === Role.OWNER} />
            </div>

            <h2 className="text-lg font-bold">
              I own a house, available for rent or sale
            </h2>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            disabled={!role || isPending}
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-2 text-base"
          >
            {isPending ? <Spinner /> : "Create Profile"}
          </Button>
        </div>
      </div>
    </main>
  );
}
