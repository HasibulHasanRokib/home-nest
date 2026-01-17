import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { Role } from "./generated/prisma/enums";
import { prisma } from "./prisma";
import { signInFormSchema } from "./zod-schema/auth-schema";
import { getUserByEmail, verifyPassword } from "@/app/auth/actions";
import { User } from "./generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validation = signInFormSchema.safeParse(credentials);
          if (!validation.success) return null;

          const { email, password } = validation.data;

          const user = await getUserByEmail(email);

          if (!user || !user.hashedPassword) return null;

          const matchPassword = await verifyPassword(
            password,
            user.hashedPassword
          );

          if (!matchPassword) return null;

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/auth/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
