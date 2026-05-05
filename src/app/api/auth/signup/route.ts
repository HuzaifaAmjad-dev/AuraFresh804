import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createId } from "@paralleldrive/cuid2"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, email, phone, password } = body

    if (!email || !password || !phone) {
      return NextResponse.json(
        { error: "Email, phone and password required" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date()

    await db.insert(users).values({
      id: createId(),
      name: name || null,
      email,
      phone,
      password: hashedPassword,
      role: "CUSTOMER",
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error)

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    )
  }
}