"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ConfirmActionButtonProps = {
  text: string;
  loadingText?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export function ConfirmActionButton({
  text,
  loadingText = "Please wait",
  variant = "default",
  className,
}: ConfirmActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={pending}
    >
      {pending ? <Spinner text={loadingText} /> : text}
    </Button>
  );
}
