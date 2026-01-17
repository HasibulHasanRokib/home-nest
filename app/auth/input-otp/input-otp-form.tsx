"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { verifyOtpAction } from "../actions";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function InputOTPForm({
  userId,
  type,
}: {
  userId: string;
  type: "account-verify" | "forgot-password";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const response = await verifyOtpAction(data.otp, userId);
      if (response.error) {
        toast("Failed to verify OTP", {
          description: response.error,
        });
      } else {
        toast("OTP verified successfully", {
          description:
            type === "account-verify"
              ? "You can now proceed to your account."
              : "You can now proceed to reset your password.",
        });

        router.push(
          type === "account-verify"
            ? "/auth/sign-in"
            : `/auth/reset-password?userId=${userId}`
        );

        form.reset();
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-4"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
