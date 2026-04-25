import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Never redirect on login page
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  if (pathname.startsWith("/admin") && (!token || token.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}