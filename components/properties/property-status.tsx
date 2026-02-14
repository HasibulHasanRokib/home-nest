"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PropertyStatus } from "@/lib/generated/prisma/enums";
import { propertyStatusAction } from "@/actions/property.action";

export function StatusDropdown({
  id,
  propertyStatus,
}: {
  id: string;
  propertyStatus: PropertyStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(propertyStatus);

  const handleClick = (status: PropertyStatus) => {
    startTransition(async () => {
      const res = await propertyStatusAction({ id, status });
      if (res.error) {
        toast.error(res.error);
      } else {
        setCurrentStatus(status);
        toast.success(res.success);
        router.refresh();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button
          className=" flex justify-between items-center print:border-none"
          variant={"outline"}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <span className="capitalize">{currentStatus.toLowerCase()}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 print:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(PropertyStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100 capitalize min-w-full",
            )}
            onClick={() => handleClick(status as PropertyStatus)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                currentStatus === status ? "opacity-100" : "opacity-0",
              )}
            />
            {status.toLowerCase() as PropertyStatus}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
