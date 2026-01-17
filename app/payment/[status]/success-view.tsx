"use client";

import { CheckCircle } from "lucide-react";

export function SuccessView() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden select-none"
      ></div>
      <div>
        <CheckCircle className="text-primary mx-auto mb-4 h-16 w-16" />
        <h2 className="text-primary mb-4 text-center text-2xl font-bold">
          Payment Successful!
        </h2>
        <p className="mb-6 text-center">
          Your transaction has been completed successfully.
        </p>
      </div>
    </>
  );
}
