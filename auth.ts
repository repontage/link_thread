import NextAuth from "next-auth"
import Passkey from "next-auth/providers/passkey"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"



export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // user object from db
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (dbUser) {
          token.role = dbUser.role
          token.isBanned = dbUser.isBanned
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isBanned = token.isBanned as boolean
      }
      return session
    }
  },
  experimental: {
    enableWebAuthn: true,
  },
})
