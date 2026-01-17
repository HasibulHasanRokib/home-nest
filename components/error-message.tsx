import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export function ErrorMessage({ error }: { error: string | null }) {
  return (
    error && (
      <Alert variant="destructive" className="mt-2">
        <AlertCircleIcon />
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    )
  );
}
