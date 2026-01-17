import { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const userId = searchParams.userId as string;

  return <ResetPasswordForm userId={userId} />;
}
