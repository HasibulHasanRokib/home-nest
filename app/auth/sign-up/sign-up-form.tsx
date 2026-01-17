"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { ErrorMessage } from "@/components/error-message";
import { signUpFormSchema } from "@/lib/zod-schema/auth-schema";
import { Spinner } from "../../../components/ui/spinner";
import { signUpAction } from "../actions";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { useWatch } from "react-hook-form";

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

export function SignUpForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
    },
  });

  const newPassword = useWatch({
    control: form.control,
    name: "password",
  });
  const confirmPassword = useWatch({
    control: form.control,
    name: "confirmPassword",
  });

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0)
      return { score: 0, feedback: "", color: "bg-gray-200" };

    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;

    if (score < 50) {
      feedback = "Weak password";
      return { score, feedback, color: "bg-red-500" };
    } else if (score < 75) {
      feedback = "Good password";
      return { score, feedback, color: "bg-yellow-500" };
    } else {
      feedback = "Strong password";
      return { score, feedback, color: "bg-green-500" };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid =
    newPassword.length >= 8 && passwordsMatch && passwordStrength.score >= 50;

  const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
    if (!isFormValid) return null;
    setError("");
    startTransition(async () => {
      const response = await signUpAction(data);

      if (response.error) {
        setError(response.error);
      } else {
        form.reset();
        router.push(
          `/auth/input-otp?id=${response.user?.id}&type=account-verify`
        );
      }
    });
  };

  return (
    <Card className="dark:bg-card w-full max-w-xl bg-white/90 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="As per NID/ Passport/ Birth certificate"
                      {...field}
                      className="capitalize"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. example@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. 01XXXXXXXXX"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {newPassword.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.score < 50
                              ? "text-red-600"
                              : passwordStrength.score < 75
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength.score}
                        className="h-1"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {confirmPassword.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {passwordsMatch && (
                        <>
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm text-primary">
                            Passwords match
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert variant="default">
              <AlertDescription>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <p className="font-medium">Password must contain:</p>
                  </div>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li
                      className={
                        newPassword.length >= 8
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      • At least 8 characters
                    </li>
                    <li
                      className={
                        /[a-z]/.test(newPassword)
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      • One lowercase letter
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(newPassword)
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      • One uppercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(newPassword)
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      • One number
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? <Spinner /> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <ErrorMessage error={error} />
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="w-full text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in here
          </Link>
        </div>
        <Separator />
        <Logo />
      </CardFooter>
    </Card>
  );
}
