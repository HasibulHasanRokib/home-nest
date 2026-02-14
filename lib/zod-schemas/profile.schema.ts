import z from "zod";
import { Gender, HouseholdType, Religion } from "@/lib/generated/prisma/enums";

const mobileRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

export const accountTypeSchema = z.object({
  role: z.enum(["TENANT", "OWNER"], { error: "Account type is required." }),
});

export const tenantInfoFormSchema = z
  .object({
    nidNumber: z.string().min(1, "Nid number is required"),
    mobileNumber: z
      .string()
      .min(11, "Must be 11 digits")
      .max(11, "Must be 11 digits")
      .regex(mobileRegex, "Invalid Bangladeshi mobile number"),
    dateOfBirth: z.coerce.date({ error: "Date of birth is required" }),
    gender: z.enum(Gender, { error: "Gender is required" }),
    religion: z.enum(Religion, { error: "Religion is required" }),
    householdType: z.enum(HouseholdType, {
      error: "Household type is required",
    }),
    familySize: z.string().nonempty("Family size is required"),
    occupation: z.string().min(1, "Occupation is required"),
    attachment1: z.string().min(1, "Front-side attachment is required"),
    attachment2: z.string().min(1, "Back-side attachment is required"),
    facebook: z.string().optional(),
    whatsapp: z.string().optional(),
  })

  .refine((data) => !data.nidNumber || data.nidNumber.length >= 10, {
    message: "NID must be at least 10 digits",
    path: ["nidNumber"],
  });

export const addressInfoFormSchema = z.object({
  division: z.string().nonempty("Division is required."),
  district: z.string().nonempty("District is required."),
  upazila: z.string().nonempty("Upazila is required."),
  postOffice: z.string().nonempty("Post office is required."),
  postCode: z.string().nonempty("Post code is required."),
  details: z.string().nonempty("Address details are required."),
});

export const ownerInfoFormSchema = z
  .object({
    nidNumber: z.string().min(1, "Nid number is required"),
    dateOfBirth: z.coerce.date({ error: "Date of birth is required" }),
    gender: z.enum(Gender, { error: "Gender is required" }),
    religion: z.enum(Religion, { error: "Religion is required" }),
    occupation: z.string().min(1, "Occupation is required"),
    bankAccount: z.string().optional(),
    mobileBanking: z.string().optional(),
    mobileNumber: z
      .string()
      .min(11, "Must be 11 digits")
      .max(11, "Must be 11 digits")
      .regex(mobileRegex, "Invalid Bangladeshi mobile number"),
    attachment1: z.string().min(1, "Front-side attachment is required"),
    attachment2: z.string().min(1, "Back-side attachment is required"),
    facebook: z.string().optional(),
    whatsapp: z.string().optional(),
  })

  .refine((data) => !data.nidNumber || data.nidNumber.length >= 10, {
    message: "NID must be at least 10 digits",
    path: ["nidNumber"],
  })
  .refine((data) => data.bankAccount || data.mobileBanking, {
    message: "Either Bank account or Mobile banking number is required",
    path: ["bankAccount"],
  })
  .refine(
    (data) =>
      !data.mobileBanking ||
      (data.mobileBanking.length === 11 &&
        mobileRegex.test(data.mobileBanking)),
    {
      message:
        "Mobile banking number must be a valid 11-digit Bangladeshi number",
      path: ["mobileBanking"],
    },
  );

export const declarationFormSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  signature: z.string().min(1, "Signature is required"),
});
