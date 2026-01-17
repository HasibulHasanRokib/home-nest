import { getCurrentUser } from "@/lib/get-current-user";
import { AccountRoleSelector } from "@/components/profile/create-profile/account-role-selector";
import { getProfileData } from "@/components/profile/create-profile/profile-data";
import { Steps } from "@/components/profile/create-profile/steps";
import {
  OWNER_STEPS,
  Step,
  TENANT_STEPS,
} from "@/components/profile/create-profile/steps-data";
import { Role, UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Your Profile",
  description:
    "Complete your profile setup to get started. Follow the guided steps tailored for Individuals, Organizations, or Authorities to unlock all features of your account.",
};

type PageProps = {
  params: Promise<{ step?: string[] }>;
};

export default async function CreateProfileStepPage({ params }: PageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    notFound();
  }

  if (currentUser.role === Role.USER) {
    return <AccountRoleSelector />;
  }
  if (currentUser.status === UserStatus.NOT_VERIFIED) {
    redirect("/dashboard");
  }

  const stepParam = (await params).step;
  const stepNumber = Number(stepParam?.[0] || "1");

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      currentStep: true,
    },
  });

  const allowedStep = user?.currentStep ?? 1;

  if (stepNumber > allowedStep) {
    redirect(`/create-profile/${allowedStep}`);
  }

  let steps: Step[] = [];

  if (currentUser.role === Role.TENANT) {
    steps = TENANT_STEPS;
  } else if (currentUser.role === Role.OWNER) {
    steps = OWNER_STEPS;
  }

  if (stepNumber < 1 || stepNumber > steps.length) {
    notFound();
  }

  const currentStep = steps[stepNumber - 1];

  if (!currentStep) return notFound();

  const StepComponent = currentStep.view;
  const profileData = await getProfileData(currentUser.id);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Steps steps={steps} />
      <StepComponent profileData={profileData} role={currentUser.role} />
    </div>
  );
}
