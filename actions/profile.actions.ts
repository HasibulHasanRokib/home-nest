"use server";

import {
  accountTypeSchema,
  tenantInfoFormSchema,
  ownerInfoFormSchema,
  addressInfoFormSchema,
  declarationFormSchema,
} from "@/lib/zod-schemas/profile.schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";
import { db } from "@/lib/prisma";

type FormDataStore = {
  personal?:
    | z.infer<typeof tenantInfoFormSchema>
    | z.infer<typeof ownerInfoFormSchema>;
  address?: z.infer<typeof addressInfoFormSchema>;
  declaration?: z.infer<typeof declarationFormSchema>;
};

export type FormState = {
  step: number;
  role: "OWNER" | "TENANT" | null;
  data: FormDataStore;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createProfileAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ...prevState, message: "Unauthorized" };
  }
  const step = Number(formData.get("step"));

  if (step === 1) {
    const raw = Object.fromEntries(formData);
    const parsed = accountTypeSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        ...prevState,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    return {
      ...prevState,
      step: 2,
      role: parsed.data.role,
      data: {},
      errors: undefined,
    };
  }

  if (step === 2) {
    const raw = Object.fromEntries(formData);

    const schema =
      prevState.role === "TENANT" ? tenantInfoFormSchema : ownerInfoFormSchema;

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      return {
        ...prevState,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    return {
      ...prevState,
      step: 3,
      data: { personal: parsed.data },
      errors: undefined,
    };
  }

  if (step === 3) {
    const raw = Object.fromEntries(formData);
    const parsed = addressInfoFormSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        ...prevState,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    return {
      ...prevState,
      step: 4,
      data: { ...prevState.data, address: parsed.data },
      errors: undefined,
    };
  }

  if (step === 4) {
    const raw = Object.fromEntries(formData);
    const parsed = declarationFormSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        ...prevState,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    try {
      const { personal, address } = prevState.data;
      const role = prevState.role;

      if (!personal || !address || !role) {
        return {
          ...prevState,
          message: "Missing previous step data.",
        };
      }
      await db.$transaction([
        db.user.update({
          where: { id: session.user.id },
          data: {
            role: prevState.role!,
            status: "NOT_VERIFIED",
            image: parsed.data.photo,
          },
        }),

        db.profile.create({
          data: {
            userId: session.user.id,
            gender: personal.gender,
            religion: personal.religion,
            occupation: personal.occupation,
            nidNumber: personal.nidNumber,
            dateOfBirth: new Date(personal.dateOfBirth),
            facebook: personal.facebook,
            whatsapp: personal.whatsapp,
            mobileNumber: personal.mobileNumber,
            familySize:
              role === "TENANT"
                ? Number(
                    (personal as z.infer<typeof tenantInfoFormSchema>)
                      .familySize,
                  )
                : null,
            householdType:
              role === "TENANT"
                ? (personal as z.infer<typeof tenantInfoFormSchema>)
                    .householdType
                : null,
            mobileBanking:
              role === "OWNER"
                ? (personal as z.infer<typeof ownerInfoFormSchema>)
                    .mobileBanking
                : null,
            bankAccount:
              role === "OWNER"
                ? (personal as z.infer<typeof ownerInfoFormSchema>).bankAccount
                : null,
            attachment1: personal.attachment1,
            attachment2: personal.attachment2,
          },
        }),

        db.address.create({
          data: {
            ...address,
            userId: session.user.id,
          },
        }),

        db.declaration.create({
          data: {
            photo: parsed.data.photo,
            signature: parsed.data.signature,
            userId: session.user.id,
          },
        }),
      ]);
    } catch (error) {
      console.error(error);
      return {
        ...prevState,
        message: "Failed to create profile",
      };
    }

    return {
      step: 5,
      role: null,
      data: {},
    };
  }

  return prevState;
}
