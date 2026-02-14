"use client";

import { useActionState } from "react";
import { createProfileAction } from "@/actions/profile.actions";
import { StepIndicator } from "@/components/profile/create/step-indicator";
import { Button } from "@/components/ui/button";
import { StepForms } from "@/components/profile/create/step-form";
import { AlertMessage } from "@/components/alert-message";

const initialState = {
  step: 1,
  role: null,
  data: {},
};

export function CreateProfileForm() {
  const [state, action, pending] = useActionState(
    createProfileAction,
    initialState,
  );

  return (
    <div className="max-w-4xl mx-auto min-h-screen px-6 py-8 space-y-2">
      <StepIndicator currentStep={state.step} />
      <form action={action}>
        <input type="hidden" id="step" name="step" value={state.step} />
        <StepForms state={state} />

        {state.step < 5 && (
          <Button disabled={pending} className="w-full" size="lg">
            Continue
          </Button>
        )}
      </form>
      {state.message && (
        <AlertMessage title={state.message} variant="destructive" />
      )}
    </div>
  );
}
