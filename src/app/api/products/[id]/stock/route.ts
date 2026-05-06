import { db } from "@/lib/db"
import { products } from "../../../../../lib/schema"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { decrement } = await req.json()

  if (!decrement || typeof decrement !== "number" || decrement < 1) {
    return NextResponse.json({ error: "Invalid decrement value" }, { status: 400 })
  }

  await db
    .update(products)
    .set({ stock: sql`GREATEST(${products.stock} - ${decrement}, 0)` })
    .where(eq(products.id, params.id))

  return NextResponse.json({ success: true })
}