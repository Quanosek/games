import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import db from "@/lib/db";

import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: { error: "/", signIn: "/login" },
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!(existingUser && existingUser.password)) return null;

        const passwordMatch = await compare(
          credentials.password as string,
          existingUser.password
        );

        if (!passwordMatch) return null;

        return existingUser;
      },
    }),

    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const { username, password, id, role } = user;
        return {
          ...token,
          username,
          password: Boolean(password),
          id: `${id}`,
          role,
        };
      } else {
        return token;
      }
    },

    session({ session, token }) {
      const { username, password, id, role } = token as any;
      return {
        ...session,
        user: {
          ...session.user,
          username,
          password,
          id,
          role,
        },
      };
    },
  },
});
