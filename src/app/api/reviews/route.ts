import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reviews } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"

// GET
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 })
    }

    const data = await db.query.reviews.findMany({
      where: (r, { eq }) => eq(r.productId, productId),
      orderBy: [desc(reviews.createdAt)],
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json([])
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, rating, comment, userId } = body

    await db.insert(reviews).values({
      productId,
      rating,
      comment,
      userId,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}