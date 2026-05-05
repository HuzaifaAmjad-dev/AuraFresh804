import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.password!)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // IMPORTANT for localhost
      sameSite: "lax",
      path: "/",
    })

    return res
  } catch (error: any) {
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    )
  }
}