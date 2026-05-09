import NextAuth from "next-auth"
import Passkey from "next-auth/providers/passkey"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Passkey,
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any
        token.id = u.id
        token.role = u.role
        token.isBanned = u.isBanned
      }
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role
        token.isBanned = session.isBanned ?? token.isBanned
        // Allow updating other fields as needed
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).isBanned = token.isBanned
      }
      return session
    }
  },
  experimental: {
    enableWebAuthn: true,
  },
})
