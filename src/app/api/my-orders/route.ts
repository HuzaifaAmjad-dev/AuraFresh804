import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/schema"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { eq } from "drizzle-orm"




export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(null)
    }

    const user = await verifyToken(token)

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }
}