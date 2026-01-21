"use server";

import z from "zod";
import bcrypt from "bcryptjs";
import { User } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  changePasswordSchema,
  forgotPasswordFormSchema,
  resetPasswordSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/zod-schema/auth-schema";
import { signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/get-current-user";
import { Resend } from "resend";
import { OtpEmailTemplate } from "./sign-up/otp-email-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

type TResetPasswordAction = {
  userId: string;
  data: z.infer<typeof resetPasswordSchema>;
};

export async function resetPasswordAction({
  userId,
  data,
}: TResetPasswordAction) {
  try {
    const validatedData = resetPasswordSchema.safeParse(data);
    if (!validatedData.success) {
      return { error: "Validation failed. Please check your input." };
    }
    const { newPassword, confirmPassword } = validatedData.data;

    if (newPassword !== confirmPassword) {
      return { error: "Confirm password not match" };
    }

    if (!userId || typeof userId !== "string") {
      return { error: "Invalid user identifier" };
    }

    const hashedNewPassword = await hashPassword(confirmPassword);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });

    return { success: "Password update successfully" };
  } catch (error) {
    console.log("Error in resetPasswordAction:", error);
    return {
      error: "An error occurred during reset password. Please try again.",
    };
  }
}

export async function forgotPasswordAction(
  data: z.infer<typeof forgotPasswordFormSchema>,
) {
  try {
    const validatedData = forgotPasswordFormSchema.safeParse(data);
    if (!validatedData.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const { email } = validatedData.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return { error: "User not found." };
    }
    if (!user.emailVerified) {
      return {
        error: "Mobile number not verified. Please verify your mobile number.",
      };
    }

    const otp = await sendOtp(email);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerifiedOtp: otp.toString(),
      },
    });

    return { success: "Reset password OTP sent successful", userId: user.id };
  } catch (error) {
    console.log("Error in forgetPasswordAction:", error);
    return {
      error: "An error occurred during forgot password. Please try again.",
    };
  }
}

export async function updatePasswordAction(
  data: z.infer<typeof changePasswordSchema>,
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { error: "Unauthorized. Please log in first." };
    }

    const validatedData = changePasswordSchema.safeParse(data);
    if (!validatedData.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const { oldPassword, newPassword, confirmPassword } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { hashedPassword: true },
    });

    if (!user || !(await verifyPassword(oldPassword, user.hashedPassword))) {
      return { error: "Old password is incorrect." };
    }

    if (newPassword === oldPassword) {
      return { error: "New password must be different from old password." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Confirm password does not match." };
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { hashedPassword: hashedNewPassword },
    });

    return { success: "Password updated successfully." };
  } catch (error) {
    console.error("Error in updatePasswordAction:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

//Sign out
export async function signOutAction() {
  await signOut({ redirectTo: "/auth/sign-in" });
}

//Sign in action
export async function signInAction(data: z.infer<typeof signInFormSchema>) {
  try {
    const validatedData = signInFormSchema.safeParse(data);
    if (!validatedData.success) {
      return { error: "Validation failed. Please check your input." };
    }
    const { email, password } = validatedData.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return { error: "User not found." };
    }
    if (!user.emailVerified) {
      const otp = await sendOtp(user.email);

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedOtp: otp.toString() },
      });

      return {
        otpRequired: true,
        userId: user.id,
        error: "Your email is not verified. Please verify your email address.",
      };
    }

    const matchPassword = await verifyPassword(password, user.hashedPassword);
    if (!matchPassword) {
      return { error: "Invalid email or password." };
    }

    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    return { success: "Sign in successful" };
  } catch (error) {
    console.log("Error in signInAction:", error);
    return { error: "An error occurred during sign in. Please try again." };
  }
}

//Resend Opt Action
export async function resendOtpAction(userId: string) {
  try {
    if (!userId) {
      return { error: "Invalid request: User ID is missing." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return { error: "No user account was found with the provided ID." };
    }

    const newOtp = await sendOtp(user.email);

    if (!newOtp) {
      return {
        error:
          "We couldn’t generate a new OTP at the moment. Please try again shortly.",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedOtp: newOtp.toString(),
      },
    });
    revalidatePath(`/auth/input-otp?id=${userId}&type=account-verify`);
    return {
      success:
        "A new one-time password (OTP) has been sent to your registered mobile number.",
    };
  } catch (error) {
    console.error("Error in Resend OTP action:", error);
    return {
      error: "An error occurred during resend OTP . Please try again.",
    };
  }
}

//Verify Otp Action
export async function verifyOtpAction(
  otp: string,
  userId: string,
  type: "account-verify" | "forgot-password" = "account-verify",
) {
  try {
    if (!otp || !userId) {
      return { error: "OTP and user id are required." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.emailVerifiedOtp !== otp) {
      return { error: "Invalid OTP." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedOtp: null,
        ...(type === "account-verify" && { emailVerified: true }),
      },
    });

    return { success: "OTP verified successfully." };
  } catch (error) {
    console.error("Error in verifyOtpAction:", error);
    return {
      error: "An error occurred during OTP verification. Please try again.",
    };
  }
}

// Send Otp
export const sendOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { data, error } = await resend.emails.send({
    from: "HomeNest <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Sending OTP",
    react: OtpEmailTemplate({ otp }),
  });
  console.log({ data, error, email });
  return otp;
};

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

//Sign up action
export async function signUpAction(data: z.infer<typeof signUpFormSchema>) {
  try {
    const validatedData = signUpFormSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: "Validation failed. Please check your input." };
    }

    const { name, email, password, mobileNumber } = validatedData.data;

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobileNumber }],
      },
    });

    if (userExists) {
      return { error: "User with this  info already exists." };
    }

    const otp = await sendOtp(email);

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        mobileNumber,
        emailVerifiedOtp: otp.toString(),
      },
    });

    return { success: "User created successfully", user: newUser };
  } catch (error) {
    console.log("Error in signUpAction:", error);
    return { error: "An error occurred during sign up. Please try again." };
  }
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};
