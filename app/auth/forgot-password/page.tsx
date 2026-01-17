import { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password ",
  description: "Enter your information to reset password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
