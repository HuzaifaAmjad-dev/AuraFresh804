import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

const { prisma } = await import("@/lib/prisma")

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  providers: [
    // keep your providers here (Google, Credentials, etc)
  ],

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
})

export const { GET, POST } = handlers