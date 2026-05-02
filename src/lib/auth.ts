import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const runtime = "nodejs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id as string
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials)
      
        if (!parsed.success) return null
      
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, parsed.data.email),
        })
      
        if (!user || !user.password) return null
      
        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.password
        )
      
        if (!passwordMatch) return null
        if (user.role !== "ADMIN") return null
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        } as any
      },
    }),
  ],
})

export const { GET, POST } = handlers