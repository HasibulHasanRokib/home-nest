import { db } from "./prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      credits: {
        type: "number",
        required: false,
        defaultValue: 10,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "OPEN",
      },
    },
  },
  plugins: [nextCookies()],
});
