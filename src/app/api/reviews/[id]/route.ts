import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reviews } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(reviews).where(eq(reviews.id, id))
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    await db
      .update(reviews)
      .set({ rating: body.rating, comment: body.comment })
      .where(eq(reviews.id, id))
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}