import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";

import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
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
});
