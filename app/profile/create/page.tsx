import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { getRequiredSession } from "@/lib/session";
import { UserStatus } from "@/lib/generated/prisma/enums";
import { CreateProfileForm } from "@/components/profile/create/create-profile-form";

export const metadata = { title: "Create profile" };

async function PageComponent() {
  const session = await getRequiredSession();
  if (session.user.status !== UserStatus.OPEN) {
    redirect("/dashboard");
  }
  return <CreateProfileForm />;
}

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      }
    >
      <PageComponent />
    </Suspense>
  );
}
