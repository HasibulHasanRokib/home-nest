"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signinAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertMessage } from "@/components/alert-message";

export function SigninForm() {
  const [state, action, pending] = useActionState(signinAction, {});
  return (
    <div className="space-y-2">
      {state?.message && (
        <AlertMessage title={state.message} variant={"destructive"} />
      )}
      <form action={action}>
        <div className="flex flex-col gap-4">
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
              <p className="text-destructive text-sm">
                {state.errors.password}
              </p>
            )}
          </div>

          <Button disabled={pending} type="submit" className="mt-2 w-full">
            {pending ? <Spinner /> : "Sign in"}
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          className="hover:underline text-primary hover:underline-offset-2 "
          href="/auth/sign-up"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
