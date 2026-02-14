"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ActionButtonProps = {
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

export function ActionButton({
  text,
  loadingText = "Please wait",
  variant = "default",
  className,
}: ActionButtonProps) {
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
