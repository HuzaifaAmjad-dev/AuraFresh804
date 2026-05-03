import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session token (NextAuth JWT cookie)
  const token =
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("next-auth.session-token")

  const isLoginPage = pathname === "/admin/login"

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}