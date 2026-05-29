import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      isBanned: boolean
      isPro: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    isBanned: boolean
    isPro: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isBanned: boolean
    isPro: boolean
  }
}
