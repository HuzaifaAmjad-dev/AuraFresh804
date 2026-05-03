import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === "/admin/login"

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl))
      }

      if (!isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", nextUrl))
      }

      return true
    },
  },
  providers: [], // providers go in the main auth file, not here
}