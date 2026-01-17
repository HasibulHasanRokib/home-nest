"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Properties page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />

      <h2 className="text-3xl font-bold">Something broke 😬</h2>

      <p className="mt-3 text-muted-foreground max-w-md">
        We couldn’t load the properties right now. Might be a server issue or
        bad filter query.
      </p>

      <div className="mt-6 flex gap-4">
        <Button onClick={reset}>Try Again</Button>

        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
