import { Role } from "@/lib/generated/prisma/enums";
import { ProfileDataType } from "@/lib/types/profile-data-type";
import { TenantInfoForm } from "./tenant-info-form";
import { AddressInfoForm } from "./address-info-form";
import { DeclarationForm } from "./declaration-form";
import { ReviewAndSubmit } from "./review-and-submit";
import { OwnerInfoForm } from "./owner-info-form";

export type Step = {
  title: string;
  description: string;
  required: boolean;
  url: string;
  view: React.ComponentType<{
    profileData?: ProfileDataType;
    role: Role;
  }>;
};
export const TENANT_STEPS: Step[] = [
  {
    title: "Personal Information",
    description: "Please enter your personal details.",
    url: "/1",
    view: TenantInfoForm,
    required: true,
  },
  {
    title: "Address Information",
    description: "Please enter your address details.",
    url: "/2",
    view: AddressInfoForm,
    required: true,
  },

  {
    title: "Declaration",
    description: "Please enter your declaration details.",
    view: DeclarationForm,
    url: "/3",
    required: true,
  },
  {
    title: "Review & Submit",
    description: "Please review and submit your details.",
    view: ReviewAndSubmit,
    url: "/4",
    required: true,
  },
];
export const OWNER_STEPS: Step[] = [
  {
    title: "Personal Information",
    description: "Please enter your personal details.",
    url: "/1",
    view: OwnerInfoForm,
    required: true,
  },
  {
    title: "Address Information",
    description: "Please enter your address details.",
    url: "/2",
    view: AddressInfoForm,
    required: true,
  },

  {
    title: "Declaration",
    description: "Please enter your declaration details.",
    view: DeclarationForm,
    url: "/3",
    required: true,
  },
  {
    title: "Review & Submit",
    description: "Please review and submit your details.",
    view: ReviewAndSubmit,
    url: "/4",
    required: true,
  },
];
