import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Metadata } from "next";
import { SignupForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Page() {
  return (
    <Card className="w-full p-4 md:max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <SignupForm />
        </div>
      </CardContent>
      <CardFooter className="mx-auto">
        <Logo />
      </CardFooter>
    </Card>
  );
}
