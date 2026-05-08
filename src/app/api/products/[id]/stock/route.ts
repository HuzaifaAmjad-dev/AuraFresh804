import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

/**
 * PATCH /api/products/[id]/stock
 * body: { quantity: number, action: "increase" | "decrease" }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    const quantity = Number(body.quantity || 0)
    const action = body.action

    // 1. get current product
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // 2. calculate new stock
    let newStock = Number(product.stock)

    if (action === "decrease") {
      newStock = newStock - quantity
    } else if (action === "increase") {
      newStock = newStock + quantity
    }

    if (newStock < 0) newStock = 0

    // 3. update DB
    await db
      .update(products)
      .set({
        stock: newStock,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))

    return NextResponse.json({
      success: true,
      stock: newStock,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Stock update failed", details: error.message },
      { status: 500 }
    )
  }
}