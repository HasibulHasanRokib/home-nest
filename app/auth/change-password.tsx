"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { ErrorMessage } from "@/components/error-message";
import { Spinner } from "@/components/ui/spinner";
import { updatePasswordAction } from "./actions";
import { changePasswordSchema } from "@/lib/zod-schema/auth-schema";

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

export function ChangePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({
    control: form.control,
    name: "newPassword",
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

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    if (!isFormValid) return null;
    setError("");
    startTransition(async () => {
      const res = await updatePasswordAction(data);
      if (res.error) {
        setError(res.error);
      } else {
        toast("✅ Password updated!", {
          description: "Your password has been successfully updated.",
        });
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="flex items-center gap-2">
          <Settings />
          Change password
        </p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Change Your Password
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            For security reasons, make sure your new password is strong and
            unique.
          </DialogDescription>
        </DialogHeader>

        <ErrorMessage error={error} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="oldPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
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

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
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
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
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
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Passwords match
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-destructive h-4 w-4" />
                          <span className="text-destructive text-sm">
                            Passwords don&apos;t match
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

            <Button type="submit" className="w-full">
              {isPending ? <Spinner /> : "Update password"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
