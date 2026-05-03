import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await db.query.orders.findMany({
      with: { items: { with: { product: true } } },
      orderBy: [desc(orders.createdAt)],
    })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const orderNumber = `AF-${Date.now()}`
    const orderId = createId()

    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address,
      city: body.city,
      province: body.province,
      postalCode: body.postalCode || null,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost || 0,
      total: body.total,
      notes: body.notes || null,
      paymentMethod: body.paymentMethod || "COD",
      createdAt: new Date(),  // 👈 add
      updatedAt: new Date(),  // 👈 add
    })

    await db.insert(orderItems).values(
      body.items.map((item: any) => ({
        id: createId(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        createdAt: new Date(),  // 👈 add
        updatedAt: new Date(),  // 👈 add
      }))
    )

    const order = await db.query.orders.findFirst({
      where: (o, { eq }) => eq(o.id, orderId),
      with: { items: { with: { product: true } } },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Orders POST error:", error)
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}