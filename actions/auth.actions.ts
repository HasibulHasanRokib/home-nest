"use server";

import { auth } from "@/lib/auth";
import {
  SigninFormSchema,
  SignupFormSchema,
} from "@/lib/zod-schemas/auth.schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
export async function signoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/auth/sign-in");
}

export async function signinAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData);

  const validatedFields = SigninFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: false,
      },
      headers: await headers(),
    });
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return { message: error.message };
    }
    return { message: "An error occurred during sign in." };
  }
  redirect("/dashboard");
}

export async function signupAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData);

  const validatedFields = SignupFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { message: error.message };
    }
    return { message: "An error occurred during sign up." };
  }

  redirect("/dashboard");
}
