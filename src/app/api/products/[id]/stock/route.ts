import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq, sql } from "drizzle-orm"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    const quantity = Number(body.quantity || 0)
    const action = body.action

    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, id),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    let newStock = Number(product.stock)

    if (action === "decrease") {
      newStock = newStock - quantity
    }

    if (action === "increase") {
      newStock = newStock + quantity
    }

    if (newStock < 0) newStock = 0

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