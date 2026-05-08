import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    const body = await req.json()

    const quantity = Number(body.quantity || 0)
    const action = body.action

    // 1. Get product
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // 2. Current stock
    let newStock = Number(product.stock || 0)

    // 3. Apply action
    if (action === "decrease") {
      newStock = newStock - quantity
    } else if (action === "increase") {
      newStock = newStock + quantity
    }

    // 4. Prevent negative stock
    if (newStock < 0) newStock = 0

    // 5. Update DB
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
      {
        error: "Stock update failed",
        details: error.message,
      },
      { status: 500 }
    )
  }
}