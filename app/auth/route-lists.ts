export const publicRoutes = ["/"];

export const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/input-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export const protectedRoutes = ["/dashboard"];

export const DEFAULT_LOGIN_REDIRECT = "/";
export const LOGIN_REDIRECT = "/auth/sign-in";
