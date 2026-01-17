import z from "zod";
import {
  AttachmentType,
  Gender,
  HouseholdType,
  Religion,
} from "../generated/prisma/enums";

export const tenantInfoFormSchema = z
  .object({
    nidNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    birthCertificateNumber: z.string().optional(),

    dateOfBirth: z.date({ error: "Date of birth is required" }),
    gender: z.enum(Gender, { error: "Gender is required" }),
    religion: z.enum(Religion, { error: "Religion is required" }),
    householdType: z.enum(HouseholdType, {
      error: "Household type is required",
    }),
    familySize: z.string(),
    occupation: z.string().min(1, "Occupation is required"),

    attachmentType: z.enum(AttachmentType, {
      error: "AttachmentType is required",
    }),
    attachment1: z.string().min(1, "Front-side attachment is required"),
    attachment2: z.string().min(1, "Back-side attachment is required"),

    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
  })
  .refine(
    (data) =>
      data.nidNumber || data.birthCertificateNumber || data.passportNumber,
    {
      message: "Either NID or Birth Certificate or Passport number is required",
      path: ["nidNumber"],
    }
  )
  .refine((data) => !data.nidNumber || data.nidNumber.length >= 10, {
    message: "NID must be at least 10 digits",
    path: ["nidNumber"],
  })
  .refine(
    (data) =>
      !data.birthCertificateNumber || data.birthCertificateNumber.length >= 10,
    {
      message: "Birth certificate number must be at least 10 digits",
      path: ["birthCertificateNumber"],
    }
  );

export const addressInfoFormSchema = z.object({
  presentDivision: z.string().nonempty("Present division is required."),
  presentDistrict: z.string().nonempty("Present district is required."),
  presentUpazila: z.string().nonempty("Present upazila is required."),
  presentPostOffice: z.string().nonempty("Present post office is required."),
  presentPostCode: z.string().nonempty("Present post code is required."),
  presentDetails: z.string().nonempty("Present address details are required."),

  permanentDivision: z.string().nonempty("Permanent division is required."),
  permanentDistrict: z.string().nonempty("Permanent district is required."),
  permanentUpazila: z.string().nonempty("Permanent upazila is required."),
  permanentPostOffice: z
    .string()
    .nonempty("Permanent post office is required."),
  permanentPostCode: z.string().nonempty("Permanent post code is required."),
  permanentDetails: z
    .string()
    .nonempty("Permanent address details are required."),
});

export const ownerInfoFormSchema = z
  .object({
    nidNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    birthCertificateNumber: z.string().optional(),

    dateOfBirth: z.date({ error: "Date of birth is required" }),
    gender: z.enum(Gender, { error: "Gender is required" }),
    religion: z.enum(Religion, { error: "Religion is required" }),
    occupation: z.string().min(1, "Occupation is required"),

    attachmentType: z.enum(AttachmentType, {
      error: "AttachmentType is required",
    }),
    attachment1: z.string().min(1, "Front-side attachment is required"),
    attachment2: z.string().min(1, "Back-side attachment is required"),

    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
  })
  .refine((data) => data.nidNumber || data.birthCertificateNumber, {
    message: "Either NID or Birth Certificate number is required",
    path: ["nidNumber"],
  })
  .refine((data) => !data.nidNumber || data.nidNumber.length >= 10, {
    message: "NID must be at least 10 digits",
    path: ["nidNumber"],
  })
  .refine(
    (data) =>
      !data.birthCertificateNumber || data.birthCertificateNumber.length >= 10,
    {
      message: "Birth certificate number must be at least 10 digits",
      path: ["birthCertificateNumber"],
    }
  );

export const declarationFormSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  signature: z.string().min(1, "Signature is required"),
});
