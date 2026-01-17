"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/error-message";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/logo";
import { forgotPasswordFormSchema } from "@/lib/zod-schema/auth-schema";
import { forgotPasswordAction } from "../actions";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (value: z.infer<typeof forgotPasswordFormSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await forgotPasswordAction(value);
      if (res.error) {
        setError(res.error);
      } else {
        toast("OTP Sent", { description: res.success });
        router.push(`/auth/input-otp?id=${res.userId}&type=forgot-password`);
        form.reset();
      }
    });
  };

  return (
    <Card className="dark:bg-card w-full max-w-xl bg-white/90 shadow-xl backdrop-blur-sm">
      <CardHeader className="mb-6 text-center">
        <CardTitle className="text-center text-2xl font-semibold">
          Reset your password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your verified email to receive a reset code
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ErrorMessage error={error} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="e.g. ex@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Spinner /> : "Send Reset Code"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex items-center justify-center border-t">
        <Logo />
      </CardFooter>
    </Card>
  );
}
