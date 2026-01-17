import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InputOTPForm } from "./input-otp-form";
import { ResendOtp } from "./resend-otp";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Input OTP",
  description:
    "Enter the OTP sent to your mobile number to verify your account.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type VerifyingType = "account-verify" | "forgot-password";

export default async function InputOtpPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const userId = searchParams.id as string;
  const type = searchParams.type as VerifyingType;

  if (!userId || !type) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    notFound();
  }

  return (
    <Card className="dark:bg-card w-full max-w-xl bg-white/90 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center">
        <Alert className="mb-2 bg-primary/10">
          <AlertTitle className="text-center">
            For testing purposes, your OTP is :{" "}
            <span className="text-primary">{user.emailVerifiedOtp}</span>
          </AlertTitle>
        </Alert>
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please enter the OTP sent to your mobile number
        </p>
      </CardHeader>
      <CardContent>
        <InputOTPForm userId={userId} type={type} />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-500">Didn&apos;t receive the OTP?</p>
          <ResendOtp userId={userId} />
        </div>

        <Separator />
        <Logo />
      </CardFooter>
    </Card>
  );
}
