"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signInFormSchema } from "@/lib/zod-schema/auth-schema";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/error-message";
import { signInAction } from "../actions";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import { toast } from "sonner";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
    setError("");
    startTransition(async () => {
      const response = await signInAction(data);
      if (response?.otpRequired) {
        setError(response.error);
        router.push(`/auth/input-otp?id=${response.userId}`);
      } else if (response?.error) {
        setError(response.error);
      } else {
        toast("✅ Signed in successfully!");
        router.push("/dashboard");
      }
    });
  };

  return (
    <Card className="dark:bg-card w-full max-w-xl bg-white/90 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="e.g. example@example.com"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Password
                    <Link
                      href={"/auth/forgot-password"}
                      className={buttonVariants({
                        variant: "link",
                        size: "sm",
                      })}
                    >
                      Forgot password?
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} className="w-full" type="submit">
              {isPending ? <Spinner /> : "Sign In"}
            </Button>
            <ErrorMessage error={error} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="w-full text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up here
          </Link>
        </div>

        <Separator />
        <Logo />
      </CardFooter>
    </Card>
  );
}
