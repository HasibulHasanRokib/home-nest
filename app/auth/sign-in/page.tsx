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
import { SigninForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return (
    <Card className="w-full p-4 md:max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <SigninForm />
        </div>
      </CardContent>
      <CardFooter className="mx-auto">
        <Logo />
      </CardFooter>
    </Card>
  );
}
