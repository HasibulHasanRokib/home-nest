"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold">Oops! Something went wrong 😵</h2>

      <p className="mt-3 text-muted-foreground max-w-md">
        Looks like our server had a bad day. Try again or refresh the page.
      </p>

      <div className="mt-6 flex gap-4">
        <Button onClick={reset}>Try Again</Button>

        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
