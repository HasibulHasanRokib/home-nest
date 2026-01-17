import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
  protectedRoutes,
} from "./app/auth/route-lists";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isPublicRoute) return NextResponse.next();

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL(LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|woff2?|ttf|txt|csv|pdf|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
