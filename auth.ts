import NextAuth from "next-auth"
import Passkey from "next-auth/providers/passkey"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Passkey,
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any
        token.id = u.id
        token.role = u.role
        token.isBanned = u.isBanned
        token.isPro = u.isPro
      } else if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPro: true, role: true, isBanned: true }
        });
        if (dbUser) {
          token.isPro = dbUser.isPro;
          token.role = dbUser.role;
          token.isBanned = dbUser.isBanned;
        }
      }
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role
        token.isBanned = session.isBanned ?? token.isBanned
        token.isPro = session.isPro ?? token.isPro
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).isBanned = token.isBanned
        ;(session.user as any).isPro = token.isPro
      }
      return session
    }
  },
  experimental: {
    enableWebAuthn: true,
  },
})
