import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const result = await db.query.orders.findMany({
      with: { items: { with: { product: true } } },
      orderBy: [desc(orders.createdAt)],
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    let userId = null

    if (token) {
      const user = (await verifyToken(token)) as any
      userId = user.id
    }

    const body = await req.json()
    const orderId = createId()

    // 1. Create order
    await db.insert(orders).values({
      id: orderId,
      orderNumber: `AF-${Date.now()}`,
      userId,

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

      payerName: body.payerName ?? null,
      paymentScreenshot: body.paymentScreenshot ?? null,
      amountSent: body.amountSent ?? null,

      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // 2. Insert items
    await db.insert(orderItems).values(
      body.items.map((item: any) => ({
        id: createId(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }))
    )

    // 3. 🔥 UPDATE STOCK (FIXED)
    for (const item of body.items) {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${item.productId}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: item.quantity,
            action: "decrease",
          }),
        }
      )
    }

    const order = await db.query.orders.findFirst({
      where: (o, { eq }) => eq(o.id, orderId),
      with: { items: { with: { product: true } } },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    )
  }
}

