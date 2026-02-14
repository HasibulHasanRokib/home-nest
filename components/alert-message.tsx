import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

interface AlertMessageProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function AlertMessage({
  title,
  description,
  variant = "default",
}: AlertMessageProps) {
  return (
    <Alert variant={variant}>
      {variant === "destructive" ? <AlertCircleIcon /> : <CheckCircle2Icon />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
