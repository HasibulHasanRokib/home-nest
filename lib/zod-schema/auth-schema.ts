import { z } from "zod";

const mobileRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "8+ characters required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
    newPassword: z.string().min(8, "8+ characters required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "8+ characters required"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Must be 3 Characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "8+ characters required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    mobileNumber: z
      .string()
      .min(11, "Must be 11 digits")
      .max(11, "Must be 11 digits")
      .regex(mobileRegex, "Invalid Bangladeshi mobile number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
