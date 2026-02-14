"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/alert-message";

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, {});
  return (
    <div className="space-y-2">
      {state?.message && (
        <AlertMessage title={state.message} variant={"destructive"} />
      )}
      <form action={action}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="As per NID/ Passport/ Birth certificate"
              required
            />
            {state?.errors?.name && (
              <p className="text-destructive text-sm">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="e.g. example@example.com"
              required
            />
            {state?.errors?.email && (
              <p className="text-destructive text-sm">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
            />
            {state?.errors?.password && (
              <div className="text-destructive text-sm">
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              required
            />
            {state?.errors?.confirmPassword && (
              <p className="text-destructive text-sm">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          <Button disabled={pending} type="submit" className="mt-2 w-full">
            {pending ? <Spinner /> : "Sign up"}
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          className="hover:underline hover:underline-offset-2 text-primary"
          href="/auth/sign-in"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
